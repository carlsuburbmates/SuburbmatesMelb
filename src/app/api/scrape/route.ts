import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "SuburbmatesScraper/1.0 (+https://suburbmates.com.au)",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: 400 }
      );
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      return NextResponse.json(
        { error: "Target URL does not return HTML" },
        { status: 400 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const metadata = {
      title:
        $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $("title").text() ||
        "",
      description:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="twitter:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        "",
      image:
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        "",
    };

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

