import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { NoticeInput } from '../../../lib/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const [notices, totalCount] = await Promise.all([
        prisma.notice.findMany({
          skip,
          take: limit,
          orderBy: [
            { priority: 'desc' },
            { publishDate: 'desc' }
          ]
        }),
        prisma.notice.count()
      ]);

      return res.status(200).json({
        notices,
        hasMore: skip + notices.length < totalCount
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  if (req.method === 'POST') {
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

      const notice = await prisma.notice.create({
        data: {
          title: title.trim(),
          body: body.trim(),
          category,
          priority,
          publishDate: new Date(publishDate),
          image: image || null
        }
      });

      return res.status(201).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}
