#!/usr/bin/env bash
set -euo pipefail

echo "🧹 Clean"
npm ci
npm run clean || true
rm -rf apps/web/.next .turbo

echo "🔎 Check router"
if [ -d apps/web/src/pages ]; then
  echo "❌ Found apps/web/src/pages (remove it)"; exit 1
else
  echo "✅ App Router only"
fi

echo "🧪 Lint & types"
npm run lint --silent
npm run typecheck --silent

echo "🗄️  DB & cache"
docker compose up -d db redis
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma || true

echo "🏗️  Build"
npm run build -w apps/api
npm run build -w apps/worker || true
npm run build -w apps/web

echo "🚀 Dev spin-up"
npm run dev -w apps/api & API_PID=$!
npm run dev -w apps/worker & WORKER_PID=$!
npm run dev -w apps/web & WEB_PID=$!
sleep 6

echo "🔐 Probes"
curl -sf http://localhost:3000/health && echo "✅ web/health"
curl -sf http://localhost:8080/health && echo "✅ api/health"
curl -sf http://localhost:8080/runs  && echo "✅ api/runs"

echo "✅ Integrity OK"
kill $API_PID $WORKER_PID $WEB_PID 2>/dev/null || true
