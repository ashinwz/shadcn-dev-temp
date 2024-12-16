This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## Add user database and schema to prisma
```psql -U postgres -h localhost```

create database
```bash
CREATE DATABASE shadcn;
```
```bash
npx prisma db push
```

create schema
```bash
npx prisma generate
```

### Database migration
```bash
npx prisma migrate dev --name add_reset_token_fields
```

## Forget password
use https://resend.com

```
RESEND_API_KEY=your_resend_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Update this in production
```
