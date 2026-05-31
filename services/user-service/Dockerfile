FROM node:20-alpine AS builder

WORKDIR /app

COPY services/user-service/package*.json ./services/user-service/
COPY services/event-bus/package*.json ./services/event-bus/
COPY shared/package*.json ./shared/

RUN cd shared && npm install && cd ../services/event-bus && npm install && cd ../user-service && npm install

COPY shared/ ./shared/
COPY services/event-bus/ ./services/event-bus/
COPY services/user-service/ ./services/user-service/

FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app ./

EXPOSE 10000

WORKDIR /app/services/user-service

CMD ["node", "index.js"]