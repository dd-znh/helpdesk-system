# Estágio 1: Build da aplicação
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servidor Web Nginx
FROM nginx:alpine
# Copia os arquivos estáticos
COPY --from=build /app/dist /usr/share/nginx/html

# Configuração crucial para SPAs (React Router) funcionar no Nginx
RUN echo "server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files \$uri \$uri/ /index.html; \
    } \
}" > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]