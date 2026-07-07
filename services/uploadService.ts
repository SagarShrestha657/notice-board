import axios from 'axios';
import imageCompression from 'browser-image-compression';

const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

export async function uploadImage(file: File): Promise<string> {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error('Cloudinary environment variables are missing');
  }

  // Check file size limit (5MB)
  const isLessThan5MB = file.size / 1024 / 1024 < 5;
  if (!isLessThan5MB) {
    throw new Error('Image must be less than 5MB');
  }

  // Compress image
  const options = {
    maxSizeMB: 1, // Compress to max 1MB
    maxWidthOrHeight: 1920, // Max dimension
    useWebWorker: true
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    
    // Upload to Cloudinary directly
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );

    return data.secure_url;
  } catch (error: any) {
    console.error('Upload failed:', error);
    throw new Error(error.response?.data?.error?.message || 'Failed to upload image');
  }
}
