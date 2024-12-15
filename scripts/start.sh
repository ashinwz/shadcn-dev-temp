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

echo "Generating Prisma Client..."
npx prisma generate

echo "Pushing schema to database..."
npx prisma db push

echo "Starting development server..."
exec pnpm run dev
