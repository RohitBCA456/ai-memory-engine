FROM node:20-alpine AS builder

WORKDIR /app

COPY services/scoring-service/package*.json ./services/scoring-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../scoring-service && npm install

COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/scoring-service/ ./services/scoring-service/

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 10000

WORKDIR /app/services/scoring-service

CMD ["node", "index.js"]