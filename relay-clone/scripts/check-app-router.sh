#!/usr/bin/env bash
set -euo pipefail

echo "🔍 Checking for App Router compliance..."

# Check if any pages directory exists in the web app
if find apps/web/src -type d -name pages 2>/dev/null | grep -q pages; then
  echo "❌ ERROR: Pages Router detected!"
  echo "   Found: $(find apps/web/src -type d -name pages 2>/dev/null)"
  echo "   Do not use Pages Router. Remove apps/web/src/**/pages/**"
  echo "   All routes must use App Router under apps/web/src/app/**"
  exit 1
fi

# Check if required App Router files exist
required_files=(
  "apps/web/src/app/layout.tsx"
  "apps/web/src/app/page.tsx"
  "apps/web/src/app/runs/page.tsx"
  "apps/web/src/app/runs/[id]/page.tsx"
  "apps/web/src/app/workflows/[id]/edit/page.tsx"
)

for file in "${required_files[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "❌ ERROR: Missing required App Router file: $file"
    exit 1
  fi
done

echo "✅ App Router compliance check passed!"
echo "   - No Pages Router files found"
echo "   - All required App Router files present"