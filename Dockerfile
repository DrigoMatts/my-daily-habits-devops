# ---- Estágio 1: BUILD (compila a app React com o Vite) ----
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build            # gera os arquivos estáticos em /app/dist

# ---- Estágio 2: SERVE (só o nginx + os estáticos, imagem final pequena) ----
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
