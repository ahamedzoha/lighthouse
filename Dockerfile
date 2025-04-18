# # Development Dockerfile for Node.js App with TypeScript, Puppeteer on Node 22 Slim
# # Skip TypeScript build for development

# FROM node:22-slim
# WORKDIR /app

# # Install system dependencies required by Puppeteer/Chromium
# RUN apt-get update && apt-get install -y \
#     ca-certificates \
#     fonts-liberation \
#     libasound2 \
#     libatk-bridge2.0-0 \
#     libatk1.0-0 \
#     libcairo2 \
#     libcups2 \
#     libdbus-1-3 \
#     libexpat1 \
#     libfontconfig1 \
#     libgbm1 \
#     libglib2.0-0 \
#     libgtk-3-0 \
#     libnspr4 \
#     libnss3 \
#     libpango-1.0-0 \
#     libpangocairo-1.0-0 \
#     libx11-6 \
#     libx11-xcb1 \
#     libxcb1 \
#     libxcomposite1 \
#     libxcursor1 \
#     libxdamage1 \
#     libxext6 \
#     libxfixes3 \
#     libxi6 \
#     libxrandr2 \
#     libxrender1 \
#     libxss1 \
#     libxtst6 \
#     lsb-release \
#     wget \
#     xdg-utils \
#     chromium \
#     --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*

# # Install all dependencies
# COPY package.json package-lock.json* ./
# RUN npm install

# # Set environment variables for Puppeteer
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
# ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# # The rest of the code will be mounted from the host in docker-compose
# # for development hot-reloading, so we don't need to copy it here

# # Create a non-root user and switch to it for better security
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nodejs
# # Ensure app files are owned by the new user
# RUN chown -R nodejs:nodejs /app
# USER nodejs

# # No default CMD - this will be provided by docker-compose
# ------------------------------------------------------------
# Dockerfile for Node.js App with TypeScript, Puppeteer on Node 22 Slim (Production Ready)

# ---- Base Stage: Install dependencies and build ----
    FROM node:22-slim AS base
    WORKDIR /app
    COPY package.json package-lock.json* ./
    # Install ALL dependencies needed for build (might include devDeps like typescript)
    RUN npm install
    COPY . .
    # Compile TS to JS in ./dist (ensure tsconfig outputs scripts too)
    RUN npm run build
    
    # ---- Final Stage: Setup runtime environment ----
    FROM node:22-slim AS final
    WORKDIR /app
    
    # Install system dependencies required by Puppeteer/Chromium
    RUN apt-get update && apt-get install -y \
        ca-certificates fonts-liberation libasound2 libatk-bridge2.0-0 libatk1.0-0 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils chromium \
        --no-install-recommends && \
        rm -rf /var/lib/apt/lists/*
    
    # Copy necessary files from the base/build stage
    # Only copy production dependencies if you pruned devDeps in base stage
    COPY --from=base /app/node_modules ./node_modules
    COPY --from=base /app/package.json ./package.json
    # Copy compiled code (including compiled scripts)
    COPY --from=base /app/dist ./dist
    
    # Set environment variables for Puppeteer & Node
    ENV NODE_ENV=production
    ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
    ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
    
    # Create and switch to non-root user
    RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nodejs
    # Ensure files copied above are owned by nodejs user BEFORE switching
    RUN chown -R nodejs:nodejs /app
    USER nodejs
    
    # Default CMD (will be overridden in compose)
    CMD ["node", "dist/worker.js"]