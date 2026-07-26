# --- Estágio 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# --- Estágio 2: Execução em Desenvolvimento/Preview ---
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app /app

EXPOSE 3000

USER node

# O --host 0.0.0.0 é OBRIGATÓRIO no Vite para aceitar conexões vindas de fora do container
CMD ["npx", "vite", "--host", "0.0.0.0", "--port", "3000"]