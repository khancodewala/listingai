export default function sitemap() {
  const baseUrl = "https://listingai-rose.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date("2026-06-15"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date("2026-06-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date("2026-07-04"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}