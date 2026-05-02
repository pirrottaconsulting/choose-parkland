#!/usr/bin/env bash
set -euo pipefail

REGION="${AWS_REGION:-$(aws configure get region)}"
REGION="${REGION:-us-east-1}"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
BUCKET_NAME="${BUCKET_NAME:-choose-parkland-${ACCOUNT_ID}-${REGION}}"
OAC_NAME="${OAC_NAME:-choose-parkland-oac}"
FUNCTION_NAME="${FUNCTION_NAME:-choose-parkland-route-rewrite}"
CALLER_REFERENCE="${CALLER_REFERENCE:-choose-parkland-$(date +%s)}"
TMP_DIR="$(mktemp -d)"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

if ! aws s3api head-bucket --bucket "${BUCKET_NAME}" >/dev/null 2>&1; then
  if [[ "${REGION}" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "${BUCKET_NAME}" --region "${REGION}" >/dev/null
  else
    aws s3api create-bucket \
      --bucket "${BUCKET_NAME}" \
      --region "${REGION}" \
      --create-bucket-configuration LocationConstraint="${REGION}" >/dev/null
  fi
fi

aws s3api put-public-access-block \
  --bucket "${BUCKET_NAME}" \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true

aws s3api put-bucket-versioning \
  --bucket "${BUCKET_NAME}" \
  --versioning-configuration Status=Enabled

aws s3api put-bucket-encryption \
  --bucket "${BUCKET_NAME}" \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'

npm run build
aws s3 sync out/ "s3://${BUCKET_NAME}" --delete

OAC_ID="$(aws cloudfront list-origin-access-controls \
  --query "OriginAccessControlList.Items[?Name=='${OAC_NAME}'].Id | [0]" \
  --output text)"

if [[ "${OAC_ID}" == "None" ]]; then
  OAC_ID="$(aws cloudfront create-origin-access-control \
    --origin-access-control-config "Name=${OAC_NAME},Description=Choose Parkland S3 origin access,SigningProtocol=sigv4,SigningBehavior=always,OriginAccessControlOriginType=s3" \
    --query "OriginAccessControl.Id" \
    --output text)"
fi

if ! aws cloudfront describe-function --name "${FUNCTION_NAME}" --stage DEVELOPMENT >/dev/null 2>&1; then
  aws cloudfront create-function \
    --name "${FUNCTION_NAME}" \
    --function-config "Comment=Rewrite extensionless static export routes,Runtime=cloudfront-js-2.0" \
    --function-code "fileb://deploy/cloudfront-route-rewrite.js" >/dev/null
fi

FUNCTION_ETAG="$(aws cloudfront describe-function \
  --name "${FUNCTION_NAME}" \
  --stage DEVELOPMENT \
  --query ETag \
  --output text)"

aws cloudfront publish-function \
  --name "${FUNCTION_NAME}" \
  --if-match "${FUNCTION_ETAG}" >/dev/null

FUNCTION_ARN="$(aws cloudfront describe-function \
  --name "${FUNCTION_NAME}" \
  --stage LIVE \
  --query "FunctionSummary.FunctionMetadata.FunctionARN" \
  --output text)"

cat > "${TMP_DIR}/distribution-config.json" <<JSON
{
  "CallerReference": "${CALLER_REFERENCE}",
  "Comment": "Choose Parkland static site",
  "Enabled": true,
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "choose-parkland-s3",
        "DomainName": "${BUCKET_NAME}.s3.${REGION}.amazonaws.com",
        "OriginAccessControlId": "${OAC_ID}",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "choose-parkland-s3",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "Compress": true,
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "FunctionAssociations": {
      "Quantity": 1,
      "Items": [
        {
          "EventType": "viewer-request",
          "FunctionARN": "${FUNCTION_ARN}"
        }
      ]
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/404.html",
        "ResponseCode": "404",
        "ErrorCachingMinTTL": 60
      }
    ]
  },
  "PriceClass": "PriceClass_100",
  "ViewerCertificate": {
    "CloudFrontDefaultCertificate": true
  },
  "Restrictions": {
    "GeoRestriction": {
      "RestrictionType": "none",
      "Quantity": 0
    }
  }
}
JSON

DISTRIBUTION_OUTPUT="$(aws cloudfront create-distribution \
  --distribution-config "file://${TMP_DIR}/distribution-config.json")"

DISTRIBUTION_ID="$(printf "%s" "${DISTRIBUTION_OUTPUT}" | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>console.log(JSON.parse(s).Distribution.Id))")"
DISTRIBUTION_DOMAIN="$(printf "%s" "${DISTRIBUTION_OUTPUT}" | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>console.log(JSON.parse(s).Distribution.DomainName))")"

cat > "${TMP_DIR}/bucket-policy.json" <<JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::${BUCKET_NAME}/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::${ACCOUNT_ID}:distribution/${DISTRIBUTION_ID}"
        }
      }
    }
  ]
}
JSON

aws s3api put-bucket-policy \
  --bucket "${BUCKET_NAME}" \
  --policy "file://${TMP_DIR}/bucket-policy.json"

printf "Bucket: %s\nDistribution ID: %s\nURL: https://%s\n" \
  "${BUCKET_NAME}" \
  "${DISTRIBUTION_ID}" \
  "${DISTRIBUTION_DOMAIN}"
