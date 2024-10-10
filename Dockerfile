# FROM node:16-alpine AS build
FROM node:21-alpine3.19 AS build
WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install
COPY . .
RUN yarn build

#Production stage
FROM node:21-alpine3.19 AS production
WORKDIR /app
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile
COPY --from=build /app/dist ./dist
CMD ["node", "dist/src/main"]