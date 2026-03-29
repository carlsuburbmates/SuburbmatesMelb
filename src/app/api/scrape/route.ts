import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Security: Prevent SSRF by validating the URL
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return NextResponse.json({ error: "Invalid URL protocol" }, { status: 400 });
    }

    const hostname = parsedUrl.hostname;
    // Block local, loopback, and cloud metadata IPs
    const isInternalIp = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.|::1)/.test(hostname) || hostname === "localhost";

    if (isInternalIp) {
      return NextResponse.json({ error: "Access to internal networks is not allowed" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
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

