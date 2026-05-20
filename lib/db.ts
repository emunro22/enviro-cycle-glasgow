import { neon } from '@neondatabase/serverless';

export const sql = neon(process.env.DATABASE_URL!);

export type Project = {
  id: number;
  title: string;
  category: string;
  image_url: string;
  display_order: number;
  created_at: string;
};