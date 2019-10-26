FROM node:12.2.0-alpine
RUN apk --no-cache add --virtual native-deps \
  g++ gcc libgcc libstdc++ linux-headers autoconf automake make nasm python git && \
  npm install --quiet node-gyp -g

ARG PORT
ARG MYSQL_ROOT_PASSWORD
ARG MYSQL_DATABASE
ARG DB_HOST

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 9001

ENTRYPOINT npm run serve