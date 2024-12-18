FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 3000

CMD sh -c "npx prisma migrate dev --name init && npx prisma generate && npm run seed && npx ts-node index.ts"