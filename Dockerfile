FROM node:18-alpine

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat bash postgresql-client
RUN apk add --no-cache openssl

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install
RUN pnpm add @auth/prisma-adapter

# Copy application code
COPY . .

# Make start script executable
RUN chmod +x ./scripts/start.sh

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV development
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

EXPOSE 3000

CMD ["/bin/sh", "./scripts/start.sh"]
