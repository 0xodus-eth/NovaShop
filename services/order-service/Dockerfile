# Dockerfile for Order Service
FROM node:lts-alpine3.21

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install ALL dependencies (including dev dependencies needed for TypeScript build)
RUN npm ci

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Clean up dev dependencies after build to reduce image size
RUN npm prune --production

# Expose port
EXPOSE 3001

# Health check using Node.js built-in modules (no curl needed)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

# Start the application
CMD ["npm", "start"]
