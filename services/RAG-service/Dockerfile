FROM node:20-alpine AS builder

WORKDIR /app

COPY services/RAG-service/package*.json ./services/RAG-service/

RUN cd services/RAG-service && npm install

COPY services/RAG-service ./services/RAG-service

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 10000

WORKDIR /app/services/RAG-service

CMD [ "node", "index.js" ]