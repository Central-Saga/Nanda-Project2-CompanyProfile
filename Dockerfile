FROM node:22.23.4-alpine AS dependencies
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm ci

FROM dependencies AS migrator
COPY --chown=node:node prisma ./prisma
COPY --chown=node:node prisma.config.ts ./
USER node
CMD ["npx", "prisma", "migrate", "deploy"]

FROM dependencies AS builder
COPY . .
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV DATABASE_URL=postgresql://build:unused@127.0.0.1/build
RUN npx prisma generate && npm run build

FROM node:22.23.4-alpine AS runner
WORKDIR /app
RUN apk add --no-cache openssl && addgroup -S app && adduser -S app -G app
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
COPY --from=builder --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=20s --timeout=12s --start-period=30s CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
