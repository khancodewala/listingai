// scripts/generate-sitemap-dates.js
//
// Runs at build time (before `next build`) to pull each indexable page's
// real last-modified date from git commit history, so app/sitemap.js can
// report accurate lastmod values instead of hardcoded or request-time dates.
//
// Requires VERCEL_DEEP_CLONE=1 to be set in Vercel project env vars,
// otherwise Vercel's shallow clone (last 10 commits) may not contain the
// commit that last touched a given file - this script falls back safely
// to today's date if that happens, so the build never breaks.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Map each indexable sitemap URL to the source file whose git history
// should determine its lastModified date. Update this list if you add
// or remove pages from app/sitemap.js.
const pages = [
  { url: '/', file: 'app/page.js' },
  { url: '/pricing', file: 'app/pricing/page.js' },
  { url: '/signup', file: 'app/signup/page.js' },
];

const FALLBACK_DATE = new Date().toISOString().split('T')[0];

function getLastCommitDate(filePath) {
  try {
    const result = execSync(`git log -1 --format=%aI -- "${filePath}"`, {
      encoding: 'utf-8',
      cwd: process.cwd(),
    }).trim();

    if (!result) {
      console.warn(`[sitemap-dates] No git history found for ${filePath} - using fallback date (${FALLBACK_DATE}).`);
      return FALLBACK_DATE;
    }

    return result.split('T')[0];
  } catch (err) {
    console.warn(`[sitemap-dates] Could not read git date for ${filePath}: ${err.message}. Using fallback date (${FALLBACK_DATE}).`);
    return FALLBACK_DATE;
  }
}

const dates = {};
for (const page of pages) {
  dates[page.url] = getLastCommitDate(page.file);
}

const outputPath = path.join(process.cwd(), 'lib', 'sitemap-dates.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(dates, null, 2) + '\n');

console.log('[sitemap-dates] Generated lib/sitemap-dates.json:');
console.log(dates);