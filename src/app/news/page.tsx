import type { Metadata } from 'next';
import { api } from '@/lib/api';
import { serialize } from '@/lib/serialize';
import type { PostType } from '@/lib/api-types';
import NewsClient from '@/app/news/NewsClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'News & Events — MCAAI',
  description: 'Stay updated with the latest news, events, and announcements from the Maseno Centre for Applied Artificial Intelligence.',
};

export default async function NewsPage() {
  const raw   = await api.getPosts();
  const posts = serialize(raw) as PostType[];

  return <NewsClient posts={posts} />;
}