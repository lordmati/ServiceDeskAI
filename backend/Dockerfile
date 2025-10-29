FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Crear carpeta uploads
RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "run", "dev"]