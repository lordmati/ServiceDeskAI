# Imagen base de Node
FROM node:20-alpine

# Crear directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Instalar Tailwind + PostCSS + Autoprefixer + Vite React plugin
RUN npm install -D tailwindcss postcss autoprefixer @vitejs/plugin-react
RUN npx tailwindcss init -p

# Copiar el resto del código fuente
COPY . .

# Exponer puerto del frontend
EXPOSE 3000

# Comando por defecto para desarrollo
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
