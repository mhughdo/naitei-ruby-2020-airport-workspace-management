FROM node:12-alpine as builder
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM node:12-alpine
WORKDIR /usr/src/app
ENV NODE_ENV production
RUN mkdir .next
COPY --from=builder /usr/src/app/package.json  .
COPY --from=builder /usr/src/app/yarn.lock  .
RUN yarn install --prod
COPY --from=builder /usr/src/app/.next ./.next
EXPOSE 3000
USER node
CMD yarn start
