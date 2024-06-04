FROM node:21.6.0-alpine as development

WORKDIR '/app'

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]


FROM node:21.6.0-alpine as production

WORKDIR '/app'

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]