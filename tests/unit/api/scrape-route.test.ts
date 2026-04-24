import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { scrapeOpenGraphMock } = vi.hoisted(() => ({
  scrapeOpenGraphMock: vi.fn(),
}));

vi.mock("@/lib/scraper", () => ({
  scrapeOpenGraph: scrapeOpenGraphMock,
}));

import { GET } from "@/app/api/scrape/route";

describe("GET /api/scrape", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns metadata for valid url", async () => {
    scrapeOpenGraphMock.mockResolvedValue({
      title: "Example",
      description: "Example description",
      image: "https://img.example.com/a.png",
    });

    const req = new NextRequest(
      "http://localhost:3000/api/scrape?url=https://example.com"
    );
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.title).toBe("Example");
    expect(scrapeOpenGraphMock).toHaveBeenCalledWith("https://example.com");
  });

  it("returns 408 for timeout errors", async () => {
    scrapeOpenGraphMock.mockRejectedValue({ name: "AbortError" });
    const req = new NextRequest(
      "http://localhost:3000/api/scrape?url=https://example.com"
    );

    const res = await GET(req);
    expect(res.status).toBe(408);
  });
});
