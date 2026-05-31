FROM node:20-alpine AS builder

WORKDIR /app

COPY services/storage-service/package*.json ./services/storage-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../storage-service && npm install

COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/storage-service/ ./services/storage-service/

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 10000

WORKDIR /app/services/storage-service

CMD ["node", "index.js"]