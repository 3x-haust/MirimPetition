FROM node:lts-alpine

WORKDIR /app

COPY package.json yarn.loc*k ./

RUN yarn install --production
RUN yarn global add vite
RUN yarn add @vitejs/plugin-react
RUN yarn add mirim-oauth-react
RUN mv node_modules ../

COPY . .

EXPOSE 2086

CMD ["yarn", "dev"]
