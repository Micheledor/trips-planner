FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN apt-get update && \
    apt-get install -y default-mysql-client curl && \
    rm -rf /var/lib/apt/lists/*

COPY . .

ENV PORT=3000 

EXPOSE 3000

CMD ["npm", "start"]