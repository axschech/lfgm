FROM node:12.2.0-alpine as dependencies
RUN apk update
RUN apk add --virtual native-deps \
  ca-certificates g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install node-gyp -g

ARG PORT
ARG MYSQL_ROOT_PASSWORD
ARG MYSQL_DATABASE
ARG DB_HOST

COPY package*.json ./
RUN npm install

FROM node:12.2.0-alpine as builder
COPY . .
RUN npm run build

FROM node:12.2.0-alpine

COPY --from=builder dist dist
COPY --from=builder public public
COPY --from=builder node_modules node_modules
EXPOSE 9001

ENTRYPOINT node dist/index.js