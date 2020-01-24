FROM node:12.14.1-alpine3.11

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=8080

CMD [ "npm", "run", "publish" ]
