FROM node:22-alpine

WORKDIR /app

COPY package*.json .
COPY . .

RUN apk update
RUN apk add python3 py3-pip alpine-sdk openssl-dev build-base python3-dev
RUN python3 -m pip install setuptools --break-system-packages
RUN npm install
RUN npm install --global corepack@latest
RUN corepack enable pnpm
RUN npm run build
VOLUME /app
EXPOSE 8080
ENTRYPOINT ["pnpm"]
CMD ["npm", "run","start"]