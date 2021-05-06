FROM node AS build
WORKDIR /app
COPY ./src ./src
ADD package.json .
ADD tsconfig.json .
RUN npm i
RUN npm run build

FROM node
WORKDIR /app
COPY --from=build /app/build ./build
ADD package.json .
RUN npm install --only=prod
CMD ["npm", "start"]



