# Stage 1: Build and Install Dependencies
FROM node:20-alpine AS builder

# Set the working directory to the root of the project
WORKDIR /app

# Copy package files for the root and the specific folders
COPY services/memory-deletion-service/package*.json ./services/memory-deletion-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

# Install all dependencies
RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../memory-deletion-service && npm install

# Copy source code for shared logic and the specific service
COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/memory-deletion-service/ ./services/memory-deletion-service/

# Stage 2: Production Image
FROM node:20-alpine
WORKDIR /app

# Copy from builder stage
COPY --from=builder /app ./

# Expose port for Render's health check
EXPOSE 10000

# Set working directory to the deletion service
WORKDIR /app/services/memory-deletion-service

# Start the service
CMD ["node", "index.js"]