FROM node:20-alpine AS builder

WORKDIR /app

COPY services/memory-deletion-service/package*.json ./services/memory-deletion-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../memory-deletion-service && npm install

COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/memory-deletion-service/ ./services/memory-deletion-service/

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 10000

WORKDIR /app/services/memory-deletion-service

CMD ["node", "index.js"]