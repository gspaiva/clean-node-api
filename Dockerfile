FROM node:14.11.0

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install
COPY . .
RUN npm run build

EXPOSE 5050

CMD ["npm", "run", "start"]