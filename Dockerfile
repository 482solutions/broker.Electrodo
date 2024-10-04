# FROM node:16-alpine AS build
FROM node:21-alpine3.19 AS build
WORKDIR /app
# COPY package*.json .
COPY yarn.lock package.json ./
RUN yarn install
# RUN npm install
COPY . .
RUN yarn build

#Production stage
# FROM node:16-alpine AS production
FROM node:21-alpine3.19 AS production
WORKDIR /app
# COPY package*.json .
COPY yarn.lock package.json ./
RUN yarn install --frozen-lockfile
# RUN npm ci --only=production
COPY --from=build /app/dist ./dist
CMD ["node", "dist/main"]