FROM node:16-alpine3.11

WORKDIR . /build

COPY package*.json ./

USER root

RUN npm ci --production

RUN npm i pino-pretty

COPY --chown=node:node . .

EXPOSE 1379

CMD ["node", "server.js"]
