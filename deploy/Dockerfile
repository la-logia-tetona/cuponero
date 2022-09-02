FROM node:18.8
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm ci
COPY --chown=node:node . .
EXPOSE 8080
CMD [ "node", "index.js" ]