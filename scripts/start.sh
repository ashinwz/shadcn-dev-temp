#!/bin/sh
set -e

# Wait for PostgreSQL
echo "Waiting for PostgreSQL to be ready..."
while ! pg_isready -h db -p 5432 -U postgres
do
  echo "Waiting for postgres..."
  sleep 2
done
echo "PostgreSQL is ready!"

# Set NODE_TLS_REJECT_UNAUTHORIZED for Prisma
export NODE_TLS_REJECT_UNAUTHORIZED=0

echo "Generating Prisma Client..."
npx prisma generate

echo "Pushing schema to database..."
npx prisma db push

echo "Starting development server..."
exec pnpm run dev
