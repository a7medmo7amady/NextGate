# if not working i should try the Exact Version of nodeJS
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]