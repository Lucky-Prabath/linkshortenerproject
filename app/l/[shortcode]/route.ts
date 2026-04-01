import { NextRequest, NextResponse } from 'next/server';
import { getLinkByShortCode } from '@/data/links';

/**
 * Validate that URL is safe to redirect to.
 * Prevents open redirect vulnerabilities by blocking javascript:, data:, etc.
 */
function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    // If URL parsing fails, it's not safe
    return false;
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> },
) {
  const { shortcode } = await params;

  const link = await getLinkByShortCode(shortcode);

  if (!link) {
    return NextResponse.json(
      { error: 'Short link not found' },
      { status: 404 },
    );
  }

  // Security: Validate URL before redirecting to prevent open redirect attacks
  if (!isSafeRedirectUrl(link.url)) {
    return NextResponse.json(
      { error: 'Invalid redirect destination' },
      { status: 400 },
    );
  }

  return NextResponse.redirect(link.url, { status: 301 });
}
