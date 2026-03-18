# 1. Builder Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for caching
COPY services/RAG-service/package*.json ./services/RAG-service/
COPY shared/package*.json ./shared/

# Install dependencies
# We move into the service folder to install its specific needs
RUN cd services/RAG-service && npm install

# Now copy the actual source code
COPY services/RAG-service/ ./services/RAG-service/
COPY shared/ ./shared/

# 2. Final Runtime Stage
FROM node:20-alpine

WORKDIR /app

# Copy everything from the builder stage
COPY --from=builder /app ./

# Set the port for Render (Render usually uses 10000 by default)
EXPOSE 10000

# CRITICAL: Set the workdir to the service folder so relative paths (../../) work
WORKDIR /app/services/RAG-service

# Ensure you are calling the correct entry file (your error said server.js, your CMD says index.js)
CMD [ "node", "server.js" ]