import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://slonik01.github.io/kindergarten-marketing";
  return [
    { url: baseUrl, changeFrequency: "monthly", priority: 1 },
  ];
}
