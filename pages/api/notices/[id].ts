import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { NoticeInput } from '../../../lib/types';
import { deleteImageFromCloudinaryServer } from '../../../lib/cloudinaryServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  if (req.method === 'GET') {
    try {
      const notice = await prisma.notice.findUnique({
        where: { id }
      });
      
      if (!notice) {
        return res.status(404).json({ message: 'Notice not found' });
      }
      
      return res.status(200).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const { title, body, category, priority, publishDate, image } = req.body as NoticeInput;
      
      if (!title || title.trim() === '') {
        return res.status(400).json({ message: 'Title is required' });
      }
      if (!body || body.trim() === '') {
        return res.status(400).json({ message: 'Description is required' });
      }
      if (!publishDate || isNaN(Date.parse(publishDate))) {
        return res.status(400).json({ message: 'Valid publish date is required' });
      }

      // Check if we need to delete an old image
      const existingNotice = await prisma.notice.findUnique({ where: { id } });
      if (existingNotice?.image && existingNotice.image !== image) {
        await deleteImageFromCloudinaryServer(existingNotice.image);
      }

      const notice = await prisma.notice.update({
        where: { id },
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image || null
        }
      });

      return res.status(200).json(notice);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Notice not found' });
      }
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const existingNotice = await prisma.notice.findUnique({ where: { id } });
      
      await prisma.notice.delete({
        where: { id }
      });
      
      if (existingNotice?.image) {
        await deleteImageFromCloudinaryServer(existingNotice.image);
      }

      return res.status(200).json({ message: 'Notice deleted successfully' });
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'Notice not found' });
      }
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
