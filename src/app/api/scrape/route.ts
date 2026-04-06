import { NextRequest, NextResponse } from "next/server";
import { scrapeOpenGraph } from "@/lib/scraper";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const metadata = await scrapeOpenGraph(url);
    return NextResponse.json(metadata);
  } catch (error: unknown) {
    const err = error as { name?: string; code?: string; message?: string };
    if (err.name === "AbortError" || err.code === "UND_ERR_ABORTED") {
      return NextResponse.json(
        { error: "Request timed out after 5 seconds" },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: "Failed to scrape metadata", details: error instanceof Error ? error.message : String(error) },
      { status: 400 }
    );
  }
}

