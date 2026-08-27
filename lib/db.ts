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

export type WastePriceRow = {
  category: string;
  label: string;
  price: string; // NUMERIC comes back as a string from the driver
  updated_at: string;
};

export type BlockedDateRow = {
  date: string; // YYYY-MM-DD
  reason: string | null;
  created_at: string;
};

export type BookingStatus = "new" | "confirmed" | "completed" | "cancelled";

export type BookingRow = {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  address: string;
  waste_types: string;    // JSON string[]
  waste_location: string; // JSON string[]
  dismantling: boolean | null;
  floor: string | null;
  access: string | null;  // JSON string[]
  preferred_date: string | null; // YYYY-MM-DD
  additional_info: string | null;
  photo_urls: string | null; // JSON string[]
  estimated_quote: string | null;
  status: BookingStatus;
  created_at: string;
  followup_email_sent_at: string | null;
};