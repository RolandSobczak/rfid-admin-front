FROM node:21-alpine3.18 as lint

WORKDIR /src

COPY .eslintrc.cjs .
COPY src/ /src/

RUN npm install eslint --save-dev \
    npm run lint

FROM node:21-alpine3.18 as build

WORKDIR /app

RUN npm install yarn

COPY package.json yarn.lock tsconfig.*.json index.html tsconfig.json  tsconfig.node.json vite.config.mts  ./

RUN yarn install

COPY public /app/public
COPY --from=lint /src/ /app/src/

ARG AUTH_API_URL
ARG AUTH_API_TIMEOUT=0
ARG ADMIN_API_URL
ARG ADMIN_API_TIMEOUT=0
ARG BASE_URL=/

ENV VITE_API_URL=$ADMIN_API_URL
ENV VITE_API_TIMEOUT=$API_TIMEOUT
ENV VITE_AUTH_API_URL=$AUTH_API_URL
ENV VITE_AUTH_API_TIMEOUT=$AUTH_API_TIMEOUT
ENV VITE_BASE_URL=$BASE_URL

RUN yarn run build

FROM nginx:1.25.3 as run

COPY ./config/nginx/default.conf /etc/nginx/conf.d/default.conf

COPY public /usr/share/nginx/public
COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]

