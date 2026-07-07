import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteImageFromCloudinaryServer } from '../../../lib/cloudinaryServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: 'URL is required' });
    }

    await deleteImageFromCloudinaryServer(url);
    return res.status(200).json({ message: 'Image deletion initiated' });
  } catch (error: any) {
    console.error('Cloudinary deletion error:', error);
    return res.status(500).json({ message: 'Failed to delete image', error: error.message });
  }
}
