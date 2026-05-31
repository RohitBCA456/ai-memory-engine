FROM node:20-alpine AS builder

WORKDIR /app

COPY services/memory-retrieval-service/package*.json ./services/memory-retrieval-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../memory-retrieval-service && npm install

COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/memory-retrieval-service/ ./services/memory-retrieval-service/

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 10000

WORKDIR /app/services/memory-retrieval-service

CMD ["node", "index.js"]