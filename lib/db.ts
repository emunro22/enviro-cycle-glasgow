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

export type ContactEnquiry = {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  created_at: string;
  review_email_sent_at: string | null;
};