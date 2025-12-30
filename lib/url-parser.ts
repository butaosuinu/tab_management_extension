import type { ParsedURL } from "@/types";

/**
 * Parse a URL string into its components
 */
export function parseURL(urlString: string): ParsedURL | undefined {
  if (!URL.canParse(urlString)) {
    return undefined;
  }

  const url = new URL(urlString);

  // Skip non-http(s) URLs
  if (!url.protocol.startsWith("http")) {
    return undefined;
  }

  const { hostname, pathname, protocol } = url;
  const domain = extractDomain(hostname);
  const subdomain = extractSubdomain(hostname, domain);
  const firstPathSegment = extractFirstPathSegment(pathname);

  return {
    protocol,
    hostname,
    domain,
    subdomain,
    pathname,
    firstPathSegment,
  };
}

/**
 * Extract the root domain from a hostname
 * e.g., "sub.example.com" -> "example.com"
 * Handles common TLDs like .co.uk, .com.au, etc.
 */
export function extractDomain(hostname: string): string {
  const parts = hostname.split(".");

  if (parts.length <= 2) {
    return hostname;
  }

  // Common second-level TLDs
  const secondLevelTLDs = new Set([
    "co.uk",
    "co.jp",
    "co.kr",
    "co.nz",
    "co.za",
    "co.in",
    "com.au",
    "com.br",
    "com.cn",
    "com.hk",
    "com.mx",
    "com.sg",
    "com.tw",
    "ne.jp",
    "or.jp",
    "ac.jp",
    "go.jp",
    "org.uk",
    "org.au",
    "net.au",
    "net.nz",
  ]);

  // Check if the last two parts form a second-level TLD
  const lastTwo = `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
  if (secondLevelTLDs.has(lastTwo)) {
    // Domain is last 3 parts
    return parts.slice(-3).join(".");
  }

  // Domain is last 2 parts
  return parts.slice(-2).join(".");
}

/**
 * Extract the subdomain from a hostname given the root domain
 * e.g., ("sub.example.com", "example.com") -> "sub"
 */
export function extractSubdomain(hostname: string, domain: string): string {
  if (hostname === domain) {
    return "";
  }

  const suffix = `.${domain}`;
  if (hostname.endsWith(suffix)) {
    return hostname.slice(0, -suffix.length);
  }

  return "";
}

/**
 * Extract the first path segment from a pathname
 * e.g., "/docs/guide/intro" -> "docs"
 */
export function extractFirstPathSegment(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  return segments[0] ?? "";
}

/**
 * Check if two URLs have the same domain
 */
export function matchesDomain(url1: string, url2: string): boolean {
  const parsed1 = parseURL(url1);
  const parsed2 = parseURL(url2);

  if (parsed1 === undefined || parsed2 === undefined) {
    return false;
  }

  return parsed1.domain === parsed2.domain;
}

/**
 * Check if two URLs have the same hostname (domain + subdomain)
 */
export function matchesSubdomain(url1: string, url2: string): boolean {
  const parsed1 = parseURL(url1);
  const parsed2 = parseURL(url2);

  if (parsed1 === undefined || parsed2 === undefined) {
    return false;
  }

  return parsed1.hostname === parsed2.hostname;
}

/**
 * Check if two URLs have the same hostname and first path segment
 */
export function matchesSubdirectory(url1: string, url2: string): boolean {
  const parsed1 = parseURL(url1);
  const parsed2 = parseURL(url2);

  if (parsed1 === undefined || parsed2 === undefined) {
    return false;
  }

  return (
    parsed1.hostname === parsed2.hostname && parsed1.firstPathSegment === parsed2.firstPathSegment
  );
}
