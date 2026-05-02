# Choose Parkland

Choose Parkland is a modern, public-facing comparison site for families evaluating Parkland School District alongside charter, cyber charter, private, and alternative education options.

The editorial stance is calm and factual: compare the options, understand the tradeoffs, and see what Parkland offers before deciding. It is not an attack site.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Static export ready for S3 + CloudFront
- Weekly GitHub Actions source monitor

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production build:

```bash
npm run build
```

Static files are emitted to `out/` because `next.config.ts` uses `output: "export"`.

## Pages

- `/`
- `/compare`
- `/alternatives-to-parkland-school-district`
- `/parkland-vs-charter-schools`
- `/parkland-vs-cyber-charter`
- `/parkland-virtual-academy`
- `/circle-of-seasons-vs-parkland`

## Data Architecture

Typed data lives in `src/data`:

- `schools.ts`
- `districts.ts`
- `comparisonCriteria.ts`
- `sourceDocuments.ts`
- `pssaResults.ts`
- `futureReadyMetrics.ts`
- `lastUpdated.ts`
- `claims.ts`

Every claim and comparison module carries `sourceIds`. Pages render source labels and links from `sourceDocuments.ts`. Placeholder records are marked as placeholder or needs-verification so unsupported claims do not appear as established facts.

Current official source targets:

- Pennsylvania Department of Education Assessment Reporting page for PSSA and Keystone files
- Future Ready PA Index Data Files page
- Data.gov PSSA and Keystone Performance dataset

## Data Update Workflow

Weekly monitoring is defined in `.github/workflows/check-official-data.yml`.

Run locally:

```bash
npm run data:check
```

The script:

- Checks official data source URLs with polite single HEAD requests.
- Writes `reports/official-data-check.json`.
- Flags a potential update when response headers appear newer than the current site content date.
- Leaves parsing and ingestion as a future human-reviewed step.

Future ingestion should download only changed official files, parse workbook rows, validate entity matches, and update typed data records after review.

## Future AI Monitoring

Scaffolds are included:

- `scripts/monitor-official-sources.ts`
- `scripts/summarize-data-changes.ts`

`npm run data:summarize` checks for `OPENAI_API_KEY`. If no key exists, it gracefully skips AI summarization. API integration is intentionally not connected yet.

Future behavior: summarize official source diffs, identify affected pages, and flag claims or comparison modules that need updates.

## AWS Static Hosting

Build the static site:

```bash
npm run build
```

Deploy `out/` to S3:

```bash
aws s3 sync out/ s3://YOUR_BUCKET_NAME --delete
```

Recommended CloudFront setup:

- S3 bucket with static website hosting or private bucket behind Origin Access Control.
- CloudFront distribution pointing to the bucket origin.
- Default root object: `index.html`.
- Error response mapping for static routes if needed: 403/404 to `/404.html`.
- Cache invalidation after deploy:

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

No custom domain is required for the initial deployment.

## Content Rules

- Do not say charter schools are bad.
- Do not shame parents.
- Do not make unsupported factual claims.
- Use source labels and latest-available-data language.
- Verify program-specific information with each school before publishing definitive comparisons.
