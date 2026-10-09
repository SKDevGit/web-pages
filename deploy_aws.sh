#!/usr/bin/env bash
# Upload the site to S3 and clear the CloudFront cache.
#
# Usage:
#   ./deploy.sh            upload for real, then clear the cache
#   ./deploy.sh --dry-run  only list what would change; nothing is uploaded
#
# Before first use, set DISTRIBUTION_ID below (CloudFront > your distribution > ID).
# Optional: export AWS_PROFILE=<name> or AWS_REGION=<region> before running.

set -euo pipefail

BUCKET="learning-library-307466833238-us-east-1-an"
DISTRIBUTION_ID="E3IPDZNPUSP7BJ"

# Always run from the folder this script lives in, wherever it is called from.
cd "$(dirname "$0")"

DRY=""
if [[ "${1:-}" == "--dry-run" ]]; then DRY="--dryrun"; fi

if ! command -v aws >/dev/null 2>&1; then
  echo "The AWS CLI is not installed or not on your PATH." >&2
  exit 1
fi

echo "Uploading to s3://${BUCKET} ${DRY:+(dry run)}"
aws s3 sync . "s3://${BUCKET}" \
  --exclude ".git/*" \
  --exclude "*.DS_Store" \
  --exclude ".gitignore" \
  --exclude ".nojekyll" \
  --exclude "*.md" \
  --exclude "*.sh" \
  --exclude "Claude outputs/*" \
  --delete \
  ${DRY}

if [[ -n "$DRY" ]]; then
  echo "Dry run finished. Nothing was uploaded and the cache was not cleared."
  exit 0
fi

if [[ "$DISTRIBUTION_ID" == "PASTE_YOUR_DISTRIBUTION_ID_HERE" ]]; then
  echo "Upload done, but DISTRIBUTION_ID is not set in deploy.sh, so the cache was not cleared." >&2
  exit 1
fi

echo "Clearing the CloudFront cache"
aws cloudfront create-invalidation --distribution-id "$DISTRIBUTION_ID" --paths "/*" \
  --query "Invalidation.{Id:Id,Status:Status}" --output table

echo "Done. The new version is live in a minute or two."
