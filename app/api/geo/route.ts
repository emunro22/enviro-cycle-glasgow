// Reads Vercel's geolocation headers (only populated on Vercel's network, not
// in local dev) so client components can attach visitor city/region to
// custom analytics events without breaking static rendering on the pages
// that use them.
export const runtime = "edge";

export async function GET(request: Request) {
  const headers = request.headers;

  const city = headers.get("x-vercel-ip-city");
  const region = headers.get("x-vercel-ip-country-region");
  const country = headers.get("x-vercel-ip-country");

  return Response.json({
    city: city ? decodeURIComponent(city) : null,
    region,
    country,
  });
}
