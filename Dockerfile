FROM node:4.2.1
MAINTAINER Alex B <me@alexb.io>

WORKDIR /usr/src/app

RUN npm install -g bower

COPY . /usr/src/app

RUN npm install
RUN bower install --allow-root

RUN npm run prod
RUN npm run compile

EXPOSE 4000

CMD ["node", "index.js"]
