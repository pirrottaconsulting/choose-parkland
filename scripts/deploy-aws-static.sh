#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-$(aws configure get region)}"
REGION="${REGION:-us-east-1}"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
BUCKET_NAME="${BUCKET_NAME:-choose-parkland-${ACCOUNT_ID}-${REGION}}"
DISTRIBUTION_ID="${DISTRIBUTION_ID:-EBZD2LFK239KT}"

npm run build
aws s3 sync out/ "s3://${BUCKET_NAME}" --delete

INVALIDATION_ID="$(aws cloudfront create-invalidation \
  --distribution-id "${DISTRIBUTION_ID}" \
  --paths "/*" \
  --query "Invalidation.Id" \
  --output text)"

aws cloudfront wait invalidation-completed \
  --distribution-id "${DISTRIBUTION_ID}" \
  --id "${INVALIDATION_ID}"

printf "Bucket: %s\nDistribution ID: %s\nInvalidation ID: %s\nURL: https://d14v1gk73nujde.cloudfront.net\n" \
  "${BUCKET_NAME}" \
  "${DISTRIBUTION_ID}" \
  "${INVALIDATION_ID}"
