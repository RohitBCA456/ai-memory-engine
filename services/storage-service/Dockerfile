# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory to the project root
WORKDIR /app

# Copy package files for root and required folders
COPY services/storage-service/package*.json ./services/storage-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

# Install all dependencies
RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../storage-service && npm install

# Copy source code for shared folders and storage service
COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/storage-service/ ./services/storage-service/

# Stage 2: Production stage
FROM node:20-alpine
WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app ./

# Expose port for Render's free tier health check
EXPOSE 10000

# Set working directory to the storage service
WORKDIR /app/services/storage-service

# Start the service
CMD ["node", "index.js"]