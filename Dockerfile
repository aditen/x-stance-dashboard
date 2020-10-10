FROM node:10.14

RUN mkdir /mp

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

COPY package.json package.json
RUN npm install
COPY . .
RUN npx next telemetry disable
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
