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

export type CustomAreaRow = {
  slug: string;
  name: string;
  postcodes: string;   // JSON-encoded string array
  council: string;
  travel_minutes: number;
  local_hook: string;
  landmarks: string;   // JSON-encoded string array
  services: string;    // JSON-encoded string array
  created_at: string;
};