const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'smartstay-chuka',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo_secret'
});

// Upload function for image files
const uploadImage = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        public_id: `smartstay-chuka/${Date.now()}-${fileName}`,
        folder: 'smartstay-chuka/hostels',
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// Upload from URL
const uploadFromUrl = async (imageUrl, hostelName) => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      resource_type: 'auto',
      public_id: `smartstay-chuka/${Date.now()}-${hostelName}`,
      folder: 'smartstay-chuka/hostels',
      quality: 'auto',
      fetch_format: 'auto'
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
  uploadFromUrl
};
