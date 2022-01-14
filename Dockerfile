FROM node:17-alpine

EXPOSE 5000

ENV NODE_OPTIONS=--openssl-legacy-provider 

RUN mkdir -p /usr/src/app/oauth

WORKDIR /usr/src/app/oauth

COPY package.json package.json 

RUN npm install

COPY . .

CMD ["npm", "start"]

