const axios = require('axios');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortCode = process.env.MPESA_SHORTCODE;
    this.passKey = process.env.MPESA_PASSKEY;
    this.baseUrl = 'https://sandbox.safaricom.co.ke';
  }

  async generateAccessToken() {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    try {
      const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error generating M-Pesa access token:', error);
      throw error;
    }
  }

  async initiateSTKPush(phoneNumber, amount, accountReference) {
    try {
      const accessToken = await this.generateAccessToken();
      const timestamp = new Date().toISOString().replace(/[:-]/g, '').split('.')[0];
      const password = Buffer.from(`${this.shortCode}${this.passKey}${timestamp}`).toString('base64');

      const payload = {
        BusinessShortCode: this.shortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: this.shortCode,
        PhoneNumber: phoneNumber,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: 'SMARTSTAY CHUKA Subscription Payment'
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error initiating M-Pesa STK push:', error);
      throw error;
    }
  }

  async validateCallback(data) {
    try {
      if (data.Body.stkCallback.ResultCode === 0) {
        return {
          success: true,
          data: data.Body.stkCallback.CallbackMetadata.Item
        };
      } else {
        return {
          success: false,
          message: 'Payment failed'
        };
      }
    } catch (error) {
      console.error('Error validating M-Pesa callback:', error);
      throw error;
    }
  }
}

module.exports = new MpesaService();
