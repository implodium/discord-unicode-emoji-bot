FROM node:16.13.1-alpine3.13 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build \
    && rm -rf node_modules \
    && npm install --production \
    && cp -r node_modules dist \
    && cp -r package*.json dist \
    && cp -r resources dist

FROM node:16.13.1-alpine3.13 as run

WORKDIR /app

COPY --from=build /app/dist /app

ENTRYPOINT ["node", "index.js"]
