#!/bin/sh
set -e

echo "Generating Prisma Client..."
npx prisma generate

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Seeding database..."
npx prisma db seed || echo "Seed skipped or already applied."

echo "Starting backend..."
exec "$@"
