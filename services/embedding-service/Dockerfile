FROM node:20-alpine AS builder

WORKDIR /app

COPY services/embedding-service/package*.json ./services/embedding-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../embedding-service && npm install

COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/embedding-service/ ./services/embedding-service/

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 10000

WORKDIR /app/services/embedding-service

CMD ["node", "index.js"]