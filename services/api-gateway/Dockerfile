FROM node:20-alpine
WORKDIR /app

# 1. Copy package files from both locations
COPY services/api-gateway/package*.json ./services/api-gateway/
COPY shared/package*.json ./shared/

# 2. Install dependencies in the service folder
WORKDIR /app/services/api-gateway
RUN npm install

# 3. Copy the actual source code
WORKDIR /app
COPY services/api-gateway/ ./services/api-gateway/
COPY shared/ ./shared/

# 4. Set the final working directory to the service
WORKDIR /app/services/api-gateway

EXPOSE 4000

CMD ["node", "app.js"]