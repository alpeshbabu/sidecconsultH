# syntax=docker/dockerfile:1
#
# Multi-stage image for the SIDEC Consulting site (Next.js 16 + Prisma 7).
#
# Targets:
#   migrate  - full node_modules + prisma CLI; runs `prisma migrate deploy` / seeds.
#   runner   - minimal standalone Next.js server (default).
#
# `next build` prerenders the home/resources pages and the sitemap, which query
# the database. The build therefore needs a reachable DATABASE_URL, passed as a
# BuildKit secret (never baked into a layer). See deploy/deploy.sh.

ARG NODE_VERSION=22

# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------------------------------------------------------------------------
# Migration / seed runner: source + full deps, no Next build.
FROM deps AS migrate
COPY . .
RUN npx prisma generate
CMD ["npx", "prisma", "migrate", "deploy"]

# ---------------------------------------------------------------------------
FROM deps AS builder
COPY . .
# DATABASE_URL is mounted only for the duration of this RUN step.
RUN --mount=type=secret,id=database_url,env=DATABASE_URL \
    npm run build

# ---------------------------------------------------------------------------
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Standalone server + static assets. public/uploads is a mounted volume.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public/uploads

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/robots.txt >/dev/null 2>&1 || exit 1

CMD ["node", "server.js"]
