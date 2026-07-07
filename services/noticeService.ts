import axios from 'axios';
import { Notice, NoticeInput } from '../lib/types';

export interface PaginatedNotices {
  notices: Notice[];
  hasMore: boolean;
}

/**
 * Fetch a paginated list of notices from the API.
 */
export async function getNotices(page = 1, limit = 10): Promise<PaginatedNotices> {
  const { data } = await axios.get<PaginatedNotices>(
    `/api/notices?page=${page}&limit=${limit}`
  );
  return data;
}

/**
 * Create a new notice.
 */
export async function createNotice(payload: NoticeInput): Promise<Notice> {
  const { data } = await axios.post<Notice>('/api/notices', payload);
  return data;
}

/**
 * Update an existing notice by ID.
 */
export async function updateNotice(id: string, payload: NoticeInput): Promise<Notice> {
  const { data } = await axios.put<Notice>(`/api/notices/${id}`, payload);
  return data;
}

/**
 * Delete a notice by ID.
 */
export async function deleteNotice(id: string): Promise<void> {
  await axios.delete(`/api/notices/${id}`);
}
