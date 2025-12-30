import { describe, it, expect } from "vitest";
import {
  parseURL,
  extractDomain,
  extractSubdomain,
  extractFirstPathSegment,
  matchesDomain,
  matchesSubdomain,
  matchesSubdirectory,
} from "@/lib/url-parser";

describe("parseURL", () => {
  it("should parse a simple URL", () => {
    const result = parseURL("https://example.com/path/to/page");
    expect(result).toEqual({
      protocol: "https:",
      hostname: "example.com",
      domain: "example.com",
      subdomain: "",
      pathname: "/path/to/page",
      firstPathSegment: "path",
    });
  });

  it("should parse a URL with subdomain", () => {
    const result = parseURL("https://sub.example.com/docs");
    expect(result).toEqual({
      protocol: "https:",
      hostname: "sub.example.com",
      domain: "example.com",
      subdomain: "sub",
      pathname: "/docs",
      firstPathSegment: "docs",
    });
  });

  it("should return undefined for non-http URLs", () => {
    expect(parseURL("chrome://extensions")).toBeUndefined();
    expect(parseURL("file:///path/to/file")).toBeUndefined();
    expect(parseURL("about:blank")).toBeUndefined();
  });

  it("should return undefined for invalid URLs", () => {
    expect(parseURL("not a url")).toBeUndefined();
    expect(parseURL("")).toBeUndefined();
  });
});

describe("extractDomain", () => {
  it("should extract domain from simple hostname", () => {
    expect(extractDomain("example.com")).toBe("example.com");
  });

  it("should extract domain from hostname with subdomain", () => {
    expect(extractDomain("sub.example.com")).toBe("example.com");
    expect(extractDomain("deep.sub.example.com")).toBe("example.com");
  });

  it("should handle second-level TLDs", () => {
    expect(extractDomain("example.co.uk")).toBe("example.co.uk");
    expect(extractDomain("sub.example.co.uk")).toBe("example.co.uk");
    expect(extractDomain("example.co.jp")).toBe("example.co.jp");
    expect(extractDomain("sub.example.com.au")).toBe("example.com.au");
  });
});

describe("extractSubdomain", () => {
  it("should return empty string when no subdomain", () => {
    expect(extractSubdomain("example.com", "example.com")).toBe("");
  });

  it("should extract subdomain", () => {
    expect(extractSubdomain("sub.example.com", "example.com")).toBe("sub");
    expect(extractSubdomain("deep.sub.example.com", "example.com")).toBe("deep.sub");
  });
});

describe("extractFirstPathSegment", () => {
  it("should extract first path segment", () => {
    expect(extractFirstPathSegment("/docs/guide/intro")).toBe("docs");
    expect(extractFirstPathSegment("/api")).toBe("api");
  });

  it("should return empty string for root path", () => {
    expect(extractFirstPathSegment("/")).toBe("");
    expect(extractFirstPathSegment("")).toBe("");
  });
});

describe("matchesDomain", () => {
  it("should return true for same domain", () => {
    expect(matchesDomain("https://example.com/a", "https://example.com/b")).toBe(true);
    expect(matchesDomain("https://sub.example.com", "https://other.example.com")).toBe(true);
  });

  it("should return false for different domains", () => {
    expect(matchesDomain("https://example.com", "https://other.com")).toBe(false);
  });

  it("should return false for invalid URLs", () => {
    expect(matchesDomain("invalid", "https://example.com")).toBe(false);
    expect(matchesDomain("chrome://settings", "https://example.com")).toBe(false);
  });
});

describe("matchesSubdomain", () => {
  it("should return true for same hostname", () => {
    expect(matchesSubdomain("https://sub.example.com/a", "https://sub.example.com/b")).toBe(true);
  });

  it("should return false for different subdomains", () => {
    expect(matchesSubdomain("https://sub1.example.com", "https://sub2.example.com")).toBe(false);
  });
});

describe("matchesSubdirectory", () => {
  it("should return true for same hostname and first path segment", () => {
    expect(matchesSubdirectory("https://example.com/docs/a", "https://example.com/docs/b")).toBe(
      true,
    );
  });

  it("should return false for different first path segments", () => {
    expect(matchesSubdirectory("https://example.com/docs", "https://example.com/api")).toBe(false);
  });

  it("should return false for different hostnames", () => {
    expect(matchesSubdirectory("https://a.example.com/docs", "https://b.example.com/docs")).toBe(
      false,
    );
  });
});
