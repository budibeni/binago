FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat

FROM base AS builder
WORKDIR /app
COPY . .
# We use pnpm lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Define which app to build. Default is 'business'.
ARG APP_NAME=business
RUN pnpm --filter @adatrack/${APP_NAME} run build

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

ARG APP_NAME=business
ENV APP_NAME=${APP_NAME}
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# The standalone build output maintains the monorepo structure
# Copy the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public

# The server.js is located inside the app directory within the standalone output
CMD node apps/${APP_NAME}/server.js
