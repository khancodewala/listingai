// app/sitemap.js
//
// lastModified values come from lib/sitemap-dates.json, which is generated
// at build time by scripts/generate-sitemap-dates.js from real git commit
// history. Do NOT hardcode dates here and do NOT use `new Date()` — both
// were tried previously and either go stale or falsely signal "changed
// today" on every crawl, which trains Google to distrust the lastmod field.
//
// Indexable pages: home, pricing, signup, privacy, terms, contact, about.
// login, forgot-password, reset-password, dashboard, and generate are all
// noindexed via robots.txt and page-level metadata, so they're intentionally
// excluded here.

import sitemapDates from '@/lib/sitemap-dates.json';

const BASE_URL = 'https://listingai-rose.vercel.app';

export default function sitemap() {
  return [
    {
      url: BASE_URL,
      lastModified: sitemapDates['/'],
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: sitemapDates['/pricing'],
    },
    {
      url: `${BASE_URL}/signup`,
      lastModified: sitemapDates['/signup'],
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: sitemapDates['/privacy'],
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: sitemapDates['/terms'],
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: sitemapDates['/contact'],
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: sitemapDates['/about'],
    },
  ];
}