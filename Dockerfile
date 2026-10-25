# Use Bun official image; 1.4.4 is the first release with the Brotli fix for CVE-2026-111497
FROM oven/bun:1.4.4-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build project
RUN bun run build

# ---- Production Image ----
FROM oven/bun:1.4.4-alpine AS runner

WORKDIR /app

# Copy only the necessary files
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose the port
EXPOSE 3000

# Start the server directly by running the entry point
CMD ["bun", "./build/index.js"]
