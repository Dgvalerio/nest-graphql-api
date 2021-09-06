FROM node:14.17.0-alpine

WORKDIR /home/api

COPY package.json .
COPY yarn.lock .

RUN yarn

CMD yarn start:dev
