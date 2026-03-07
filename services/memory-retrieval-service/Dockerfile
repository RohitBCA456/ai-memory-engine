# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory to the project root
WORKDIR /app

# Copy package files for root and required folders
COPY services/memory-retrieval-service/package*.json ./services/memory-retrieval-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

# Install all dependencies
RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../memory-retrieval-service && npm install

# Copy source code for shared folders and retrieval service
COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/memory-retrieval-service/ ./services/memory-retrieval-service/

# Stage 2: Production stage
FROM node:20-alpine
WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app ./

# Expose port for Render's free tier health check
EXPOSE 10000

# Set working directory to the retrieval service
WORKDIR /app/services/memory-retrieval-service

# Start the service
CMD ["node", "index.js"]