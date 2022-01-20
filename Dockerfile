FROM node:lts

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 1337

CMD ["npm", "start:watch"]