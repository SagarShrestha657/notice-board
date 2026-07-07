export type Category = 'Exam' | 'Event' | 'General';
export type Priority = 'Normal' | 'Urgent';

export interface Notice {
  id: string;
  title: string;
  body: string;
  category: Category;
  priority: Priority;
  publishDate: Date;
  image: string | null;
  createdAt: Date;
}

export interface NoticeInput {
  title: string;
  body: string;
  category: Category;
  priority: Priority;
  publishDate: string;
  image?: string;
}
