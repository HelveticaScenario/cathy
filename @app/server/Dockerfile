FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
RUN yarn 

ADD . .

RUN yarn build

ENV NODE_ENV=production
EXPOSE 3000
CMD [ "yarn", "start" ]
