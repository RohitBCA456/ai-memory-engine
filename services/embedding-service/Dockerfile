# Stage 1: Build stage to install dependencies
FROM node:20-alpine AS builder

# Set working directory to the root of the project
WORKDIR /app

# Copy package files for the root and the specific folders
COPY services/embedding-service/package*.json ./services/embedding-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

# Install dependencies for all relevant folders
RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../embedding-service && npm install

# Copy the actual source code
COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/embedding-service/ ./services/embedding-service/

# Stage 2: Production stage
FROM node:20-alpine
WORKDIR /app

# Copy everything from the builder stage
COPY --from=builder /app ./

# Expose port 10000 for Render's free tier health check
EXPOSE 10000

# Set working directory to the embedding service to run it
WORKDIR /app/services/embedding-service

# Start the service
CMD ["node", "index.js"]