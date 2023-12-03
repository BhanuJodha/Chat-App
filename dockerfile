FROM node:16
WORKDIR /home/node/app
COPY . /home/node/app
RUN npm install
CMD node ./server/index.js