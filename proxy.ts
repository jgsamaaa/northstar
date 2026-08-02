import { NextRequest, NextResponse } from "next/server";
import { publicSiteUrl } from "./app/site-config";

function contentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "object-src 'none'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    // Intentional React style attributes still require this; script execution is nonce-restricted.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "media-src 'self'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "upgrade-insecure-requests",
  ].join("; ");
}

export function proxy(request: NextRequest) {
  const canonicalHostname = new URL(publicSiteUrl).hostname;
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0].trim();
  const hostname = (forwardedHost || request.nextUrl.hostname).toLowerCase().replace(/:\d+$/, "");
  const protocol = request.headers.get("x-forwarded-proto")?.split(",")[0].trim() || request.nextUrl.protocol.replace(":", "");
  const shouldRedirect = hostname.endsWith(".vercel.app")
    || hostname === `www.${canonicalHostname}`
    || (hostname === canonicalHostname && protocol === "http");

  if (shouldRedirect) {
    return NextResponse.redirect(new URL(`${request.nextUrl.pathname}${request.nextUrl.search}`, publicSiteUrl), 308);
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const policy = contentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", policy);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", policy);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.svg|apple-touch-icon.png|icon-192.png|icon-512.png).*)"],
};
