# ?????
FROM node:20-alpine AS builder

WORKDIR /app

# ?? server
COPY server/package*.json ./server/
RUN cd server && npm ci --production

# ?? client
COPY client/package*.json ./client/
RUN cd client && npm ci

# ????
COPY server/tsconfig.json ./server/
COPY server/src ./server/src/
COPY server/database ./server/database/
COPY client/src ./client/src/
COPY client/vite.config.ts ./client/
COPY client/index.html ./client/

# ??
RUN cd server && npm run build
RUN cd client && npm run build

# ????
FROM node:20-alpine AS runner

WORKDIR /app

# ??????
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/package.json ./server/
COPY --from=builder /app/client/dist ./client/dist

WORKDIR /app/server

EXPOSE 3000

CMD ["node", "dist/index.js"]
