# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Build React application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 3: Generate self-signed SSL certificate
FROM alpine:latest AS certgen
RUN apk add --no-cache openssl
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=CRM/OU=IT/CN=localhost"

# Stage 4: Production Nginx image with SSL
FROM nginx:alpine

# Копируем собранные файлы React
COPY --from=builder /app/build /usr/share/nginx/html

# Копируем SSL сертификаты из certgen
COPY --from=certgen /etc/ssl/certs/nginx-selfsigned.crt /etc/ssl/certs/
COPY --from=certgen /etc/ssl/private/nginx-selfsigned.key /etc/ssl/private/

# Копируем кастомный конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /usr/share/nginx/html /etc/nginx/conf.d /etc/ssl/certs /etc/ssl/private

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]