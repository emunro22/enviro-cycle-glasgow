import { NextResponse } from "next/server";
import { getReviewsForDisplay } from "@/lib/google-places-sync";

export const dynamic = "force-dynamic";

// The pages that show reviews now fetch them server-side, so this route
// exists for the client-side consumers: the floating rating badge, and
// GoogleReviews when it is rendered without server-provided data.
export async function GET() {
  return NextResponse.json(await getReviewsForDisplay());
}
