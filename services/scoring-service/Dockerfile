# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory to the project root to access shared/event-bus
WORKDIR /app

# Copy package files for root and required folders
COPY services/scoring-service/package*.json ./services/scoring-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

# Install all dependencies
RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../scoring-service && npm install

# Copy source code for shared folders and scoring service
COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/scoring-service/ ./services/scoring-service/

# Stage 2: Production stage
FROM node:20-alpine
WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app ./

# Expose port 10000 for Render's free tier health check
EXPOSE 10000

# Set working directory to the scoring service
WORKDIR /app/services/scoring-service

# Start the service
CMD ["node", "index.js"]