# syntax=docker/dockerfile:1

# ---- deps: install dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: build the Next.js app ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1

# Some pages query the DB at build time via generateStaticParams, so a
# genuinely reachable (if disposable) MongoDB is needed during the build -
# not used at runtime, the real MONGODB_URI is supplied via docker-compose's
# env_file instead.
ARG MONGODB_URI
ARG ADMIN_SESSION_SECRET
ARG ADMIN_USERS
ENV MONGODB_URI=${MONGODB_URI}
ENV ADMIN_SESSION_SECRET=${ADMIN_SESSION_SECRET}
ENV ADMIN_USERS=${ADMIN_USERS}

RUN npm run build

# ---- runner: minimal production image ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
