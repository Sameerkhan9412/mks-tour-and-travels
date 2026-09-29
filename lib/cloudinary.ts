import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'djavjspex',
  api_key: process.env.CLOUDINARY_API_KEY || '142159779513321',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'n7ITeGKpJ1foa2CXLm5i5BMPV9I',
  secure: true,
});

export default cloudinary;
