/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Force non-www. Fixes the "Duplicate without user-selected canonical"
      // and "Alternative page with proper canonical tag" issues in GSC.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.envirocycleglasgow.com' }],
        destination: 'https://envirocycleglasgow.com/:path*',
        permanent: true,
      },
      // Old URL from a previous site that Google still has indexed.
      {
        source: '/contact-us',
        destination: '/#contact',
        permanent: true,
      },
      {
        source: '/contact-us/',
        destination: '/#contact',
        permanent: true,
      },
      {
        source: '/terms-and-conditions',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/terms-and-conditions/',
        destination: '/terms',
        permanent: true,
      },
      // Old URL Google has indexed for the packages section (it's a
      // homepage anchor, not a standalone page).
      {
        source: '/packages',
        destination: '/#packages',
        permanent: true,
      },
      {
        source: '/packages/',
        destination: '/#packages',
        permanent: true,
      },
      // NOTE: Retired combo URLs (e.g. /office-clearance-paisley) are NOT
      // redirected here â€” they're handled in app/[slug]/page.tsx via
      // permanentRedirect() so we get a 308 to the area landing page.
    ]
  },
}

module.exports = nextConfig
