# --- 1) Base deps layer: install node_modules with a clean, reproducible lockfile
FROM node:20-alpine AS deps
WORKDIR /app
# Copy only manifest files first to leverage Docker layer cache
COPY package*.json ./
RUN npm ci --no-audit --no-fund

# --- 2) Builder: compile Next.js
FROM node:20-alpine AS builder
WORKDIR /app

# Reuse node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the rest of your app (config + src)
COPY . .

# Pass public build-time envs through ARG/ENV (safe for browser exposure)
# Example: docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com .
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Build Next.js (generates .next, including standalone server files)
RUN npm run build

# Optionally trim dev deps after build
RUN npm prune --omit=dev

# --- 3) Runtime: minimal image running Next.js standalone server
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Create non-root user
RUN addgroup -S app && adduser -S app -G app
USER app

# Use Next.js "standalone" output -> includes server.js and the minimal node_modules
#  - .next/standalone has server.js and the required server code
#  - .next/static contains the client assets
# COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# If you reference runtime env on the server (NOT exposed to browser), set them at run:
# e.g. `-e INTERNAL_API_KEY=...` or via your orchestrator. They are read by server code.
# Do NOT expect non-NEXT_PUBLIC vars to affect already-built client bundles.

EXPOSE 3000
# Next standalone ships a server.js at project root in the standalone dir
CMD ["node", "server.js"]
