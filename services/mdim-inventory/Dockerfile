FROM node:alpine-18
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
EXPOSE 4001
CMD ["node","src/index.js"]