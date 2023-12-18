FROM node:18 

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

WORKDIR /app/src

ENV PORT=8000

EXPOSE 8000

CMD ["npm", "start"]
