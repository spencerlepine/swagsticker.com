FROM node:20.16-alpine3.19 AS base

# 1. Install dependencies and build
FROM --platform=$BUILDPLATFORM base AS builder

# source: https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install dependencies based on the preferred package manager
# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
#   else echo "Lockfile not found." && exit 1; \
#   fi

# Install dependencies with pnpm (with cache)
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Copy source code and environment files
COPY . .
COPY .env.production .env.development ./

RUN pnpm build

# 2. Production image, copy all the files and run
FROM base AS runner
WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME="0.0.0.0"

COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", ".next/standalone/server.js"]