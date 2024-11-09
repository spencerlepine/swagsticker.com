FROM node:20.16-alpine3.19 AS base

# enable pnpm - https://pnpm.io/docker
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# source: https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

# 1. Install dependencies and build
FROM --platform=$BUILDPLATFORM base AS builder

WORKDIR /app

# Copy lockfile and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
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

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone /app

# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "./server.js"]