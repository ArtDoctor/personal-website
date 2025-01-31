# Use Bun official image
FROM oven/bun:alpine

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN bun install --production

# Build project
RUN bun run build

# Expose port 3000 (or the one in your Svelte config)
EXPOSE 3000

# Start the server
CMD ["bun", "./build/index.js"]
