FROM node:20-alpine
WORKDIR /app

COPY services/api-gateway/package*.json ./services/api-gateway/
COPY shared/package*.json ./shared/

WORKDIR /app/services/api-gateway
RUN npm install

WORKDIR /app
COPY services/api-gateway/ ./services/api-gateway/
COPY shared/ ./shared/

WORKDIR /app/services/api-gateway

EXPOSE 4000

CMD ["node", "app.js"]