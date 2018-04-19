FROM node:9-alpine

COPY ./ /app

RUN cd /app && npm i

ENTRYPOINT node /app/bot.js          
