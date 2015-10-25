FROM node:4.2.1
MAINTAINER Alex B <me@alexb.io>

WORKDIR /usr/src/app

RUN npm install -g bower

COPY . /usr/src/app

RUN npm install
RUN bower install --allow-root

RUN npm run prod
RUN npm run compile

ENV PORT 8080
EXPOSE 8080

CMD ["node", "index.js"]
