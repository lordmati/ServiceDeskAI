FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install nodemailer

COPY . .

# Crear carpeta uploads
RUN mkdir -p uploads

EXPOSE 5000

CMD ["npm", "run", "dev"]