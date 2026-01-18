import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';

class MpesaService {
  static const String _baseUrl = 'https://sandbox.safaricom.co.ke';
  static const String _consumerKey = 'YOUR_CONSUMER_KEY';
  static const String _consumerSecret = 'YOUR_CONSUMER_SECRET';
  static const String _shortCode = '174379'; // Sandbox shortcode
  static const String _passKey =
      'bfb279f9aa9bdbcf158e97dd1a503b30015eee520bd5d0925ba8d7d13b0afdbf';

  // Get OAuth token
  static Future<String?> _getAccessToken() async {
    try {
      final auth =
          'Basic ${base64Encode(utf8.encode('$_consumerKey:$_consumerSecret'))}';
      final response = await http.get(
        Uri.parse('$_baseUrl/oauth/v1/generate?grant_type=client_credentials'),
        headers: {'Authorization': auth},
      );

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        return body['access_token'];
      }
      return null;
    } catch (e) {
      print('Token error: $e');
      return null;
    }
  }

  // Initiate STK Push
  static Future<Map<String, dynamic>?> initiateSTKPush({
    required String phoneNumber,
    required double amount,
    required String accountRef,
  }) async {
    try {
      final token = await _getAccessToken();
      if (token == null) return null;

      final timestamp =
          DateTime.now().toString().replaceAll(RegExp(r'[^\d]'), '').substring(0, 14);

      final password = base64Encode(utf8.encode(
          '$_shortCode$_passKey$timestamp'));

      final body = {
        'BusinessShortCode': _shortCode,
        'Password': password,
        'Timestamp': timestamp,
        'TransactionType': 'CustomerPayBillOnline',
        'Amount': amount.toInt(),
        'PartyA': phoneNumber,
        'PartyB': _shortCode,
        'PhoneNumber': phoneNumber,
        'CallBackURL':
            'https://your-backend.com/api/payments/mpesa-callback',
        'AccountReference': accountRef,
        'TransactionDesc': 'Chuka Hostels Subscription',
      };

      final response = await http.post(
        Uri.parse('$_baseUrl/mpesa/stkpush/v1/processrequest'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('STK Push error: $e');
      return null;
    }
  }

  // Check transaction status
  static Future<Map<String, dynamic>?> checkTransactionStatus({
    required String checkoutRequestId,
  }) async {
    try {
      final token = await _getAccessToken();
      if (token == null) return null;

      final timestamp =
          DateTime.now().toString().replaceAll(RegExp(r'[^\d]'), '').substring(0, 14);

      final password = base64Encode(utf8.encode(
          '$_shortCode$_passKey$timestamp'));

      final body = {
        'BusinessShortCode': _shortCode,
        'Password': password,
        'Timestamp': timestamp,
        'CheckoutRequestID': checkoutRequestId,
      };

      final response = await http.post(
        Uri.parse(
            '$_baseUrl/mpesa/stkpushquery/v1/query'),
        headers: {
          'Authorization': 'Bearer $token',
          'Content-Type': 'application/json',
        },
        body: jsonEncode(body),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
      return null;
    } catch (e) {
      print('Status check error: $e');
      return null;
    }
  }
}
