import { NextResponse } from "next/server";
import { downr } from "@/lib/downr";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ Status: false, Error: "URL is required" }, { status: 400 });
    }

    const result = await downr(url);
    const response = NextResponse.json(result);
    
    // Set caching headers for edge network (CDN) if successful
    // Cache for 3 minutes, then serve stale while revalidating in background for 5 mins
    if (result.Status) {
      response.headers.set('Cache-Control', 's-maxage=180, stale-while-revalidate=300');
    }
    
    return response;
  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json({ Status: false, Error: error.message || "Failed to process request" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ Status: false, Error: "URL is required" }, { status: 400 });
    }

    const result = await downr(url);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Download Error:", error);
    return NextResponse.json({ Status: false, Error: error.message || "Failed to process request" }, { status: 500 });
  }
}
