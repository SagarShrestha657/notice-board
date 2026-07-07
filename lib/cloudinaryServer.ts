import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary securely on the server
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteImageFromCloudinaryServer = async (url: string) => {
  try {
    if (!url) return;
    const publicIdMatch = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    if (!publicIdMatch || !publicIdMatch[1]) return;
    
    const publicId = publicIdMatch[1];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Failed to delete image from Cloudinary server-side:', error);
  }
};
