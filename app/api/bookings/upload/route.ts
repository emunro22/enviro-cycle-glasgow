import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Public upload endpoint for booking-form photo attachments (the existing
// /api/upload is admin-gated and used for the gallery). Unauthenticated, so
// this is deliberately locked down: images only, size-capped.

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Only image uploads are allowed" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 8MB" }, { status: 400 });
  }

  const blob = await put(`booking-photos/${file.name}`, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json(blob);
}
