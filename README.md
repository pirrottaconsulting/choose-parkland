# Choose Parkland

Choose Parkland is a public, data-driven comparison site for families evaluating Parkland School District alongside charter, cyber charter, private, and alternative education options.

The site downloads official public files, parses them into normalized JSON, generates parent-friendly comparison content, and ships that data inside the static build.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Static export for S3 + CloudFront
- XLSX parsing for official Excel workbooks
- Weekly GitHub Actions source monitoring

## Local Setup

```bash
npm install
npm run data:update
npm run dev
```

Open `http://localhost:3000`.

## Data Pipeline

Required pipeline commands:

```bash
npm run data:download
npm run data:parse
npm run data:generate
npm run data:update
```

`npm run data:update` downloads official source files, parses them, and writes normalized JSON to `src/data/generated`.

Generated static data:

- `src/data/generated/source-manifest.json`
- `src/data/generated/entities.json`
- `src/data/generated/pssa-metrics.json`
- `src/data/generated/keystone-metrics.json`
- `src/data/generated/graduation-metrics.json`
- `src/data/generated/future-ready-metrics.json`
- `src/data/generated/all-metrics.json`
- `src/data/generated/comparison-content.json`
- `src/data/generated/comparison-matrix.json`

Each generated metric includes:

- source URL
- source name
- source id
- retrieval date through the manifest
- school year
- entity id/name
- metric category and value

## Official Sources

Current source targets:

- PDE Assessment Reporting: `https://www.pa.gov/agencies/education/data-and-reporting/assessment-reporting`
- 2025 PDE PSSA school, district, and state Excel files
- 2025 PDE Keystone school and district Excel files
- 2024 PDE Keystone grade 11 files supplied locally from PDE downloads
- 2024-2025 Pennsylvania 4-year cohort graduation rates supplied locally from PDE downloads
- Future Ready PA Data Files: `https://futurereadypa.org/Home/DataFiles`
- Future Ready Performance Data for SY 2024-2025
- Future Ready School Fast Facts for SY 2024-2025
- Future Ready District Fast Facts for SY 2024-2025
- Parkland Virtual Academy public program page

## Pages

- `/`
- `/compare`
- `/alternatives-to-parkland-school-district`
- `/parkland-vs-charter-schools`
- `/parkland-vs-cyber-charter`
- `/parkland-virtual-academy`
- `/circle-of-seasons-vs-parkland`

## Quality Checks

```bash
npm run lint
npm run test
npm run build
```

The test suite checks generated data presence, citations, required entities, page content, and weak-language guardrails.

## Weekly Monitoring

`.github/workflows/check-official-data.yml` checks official source pages weekly for changed Excel links or file names. If the source inventory changes, it opens a GitHub issue with a deterministic summary. If `OPENAI_API_KEY` exists, the workflow can run the summarizer step, but no data is inferred or published from AI output.

New data should be published only after:

```bash
npm run data:update
npm run test
npm run build
```

## AWS Static Hosting

Build and deploy to the existing private S3 bucket and CloudFront distribution:

```bash
./scripts/deploy-aws-static.sh
```

Existing AWS resources:

- Bucket: `choose-parkland-796973506838-us-east-1`
- CloudFront distribution: `EBZD2LFK239KT`

Manual deploy:

```bash
npm run build
aws s3 sync out/ s3://choose-parkland-796973506838-us-east-1 --delete
aws cloudfront create-invalidation --distribution-id EBZD2LFK239KT --paths "/*"
```

## Content Rules

- Do not say charter schools are bad.
- Do not shame parents.
- Do not make unsupported factual claims.
- Use latest official data available.
- Say when data is not available in the current official file.
- Say when data is not directly comparable based on public data.
