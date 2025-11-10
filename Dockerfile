# Estágio 1: Build da aplicação
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar todas as dependências (incluindo dev para o build)
RUN npm ci && npm cache clean --force

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio 2: Servidor Nginx
FROM nginx:alpine

# Copiar build para o Nginx
COPY --from=builder /app/dist /usr/share/nginx/html/urban-media

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/urban-media/ || exit 1

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

