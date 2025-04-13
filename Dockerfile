# Development Dockerfile for Node.js App with TypeScript, Puppeteer on Node 22 Slim
# Skip TypeScript build for development

FROM node:22-slim
WORKDIR /app

# Install system dependencies required by Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    chromium \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install all dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Set environment variables for Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# The rest of the code will be mounted from the host in docker-compose
# for development hot-reloading, so we don't need to copy it here

# Create a non-root user and switch to it for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
# Ensure app files are owned by the new user
RUN chown -R nodejs:nodejs /app
USER nodejs

# No default CMD - this will be provided by docker-compose