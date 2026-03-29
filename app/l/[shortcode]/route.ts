import { NextRequest, NextResponse } from "next/server";
import { getLinkByShortCode } from "@/data/links";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ shortcode: string }> }
) {
  const { shortcode } = await params;

  const link = await getLinkByShortCode(shortcode);

  if (!link) {
    return NextResponse.json({ error: "Short link not found" }, { status: 404 });
  }

  return NextResponse.redirect(link.url, { status: 301 });
}
