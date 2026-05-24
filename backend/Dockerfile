# Stage 1: Build dependencies
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /app

# Создаём непривилегированного пользователя (уже есть node в образе)
# Копируем только production-зависимости и код
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Даем права пользователю node
RUN chown -R node:node /app

USER node

EXPOSE 3001
CMD ["node", "server.js"]