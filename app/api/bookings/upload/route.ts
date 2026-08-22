import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

// Public upload endpoint for booking-form photo attachments (the existing
// /api/upload is admin-gated and used for the gallery). Unauthenticated, so
// this is deliberately locked down: images only, size-capped.

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]);
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);
// Some mobile browsers (notably Android file-picker flows) report a generic
// or empty MIME type for genuine photos instead of the real image/* type.
const GENERIC_TYPES = new Set(["", "application/octet-stream"]);
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
  const isAllowed =
    ALLOWED_TYPES.has(file.type) || (GENERIC_TYPES.has(file.type) && ALLOWED_EXTENSIONS.has(extension));

  if (!isAllowed) {
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
