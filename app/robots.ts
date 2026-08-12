import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://slonik01.github.io/kindergarten-marketing";
  return {
    rules: { userAgent: "*", disallow: "/" },
    host: baseUrl,
  };
}
