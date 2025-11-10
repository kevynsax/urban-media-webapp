# Video Kiosk App - Sistema de Propaganda para Tablets

Aplicativo para rodar em modo kiosk em tablets Android, exibindo vídeos de propaganda em loop.

## 🎯 Funcionalidades

- ✅ Download e cache automático de vídeos
- ✅ Modo kiosk (sem controles de usuário)
- ✅ Reprodução em loop contínuo
- ✅ Interface de carregamento com progresso
- ✅ Armazenamento local usando IndexedDB
- ✅ Sem dependências externas pesadas
- ✅ Tela de início para garantir autoplay (requerido pelos navegadores)

## 🚀 Como Rodar o Projeto

### Desenvolvimento

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm start
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Testar build localmente
npm run preview
```

### 🐳 Deploy com Docker

O projeto está configurado para rodar em `https://kevyn.com.br/urban-media`

**Opção 1: Docker Compose (Recomendado)**

```bash
# Build e iniciar container
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar container
docker-compose down
```

O aplicativo estará disponível em `http://localhost:8080`

**Opção 2: Docker manual**

```bash
# Build da imagem
docker build -t urban-media-kiosk:latest .

# Rodar container
docker run -d \
  --name urban-media-kiosk \
  -p 8080:80 \
  --restart unless-stopped \
  urban-media-kiosk:latest

# Ver logs
docker logs -f urban-media-kiosk

# Parar container
docker stop urban-media-kiosk
docker rm urban-media-kiosk
```

**Configuração no Servidor de Produção:**

Se você estiver usando nginx como proxy reverso no servidor principal:

```nginx
# /etc/nginx/sites-available/kiosk.kevyn.com.br
server {
    listen 80;
    server_name kiosk.kevyn.com.br;

    location / {
        proxy_pass http://localhost:8080/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📱 Configuração para Tablets Android

### Passos para Deploy:

1. **Build do Projeto**
   ```bash
   npm run build
   ```

2. **Deploy dos Arquivos**
   - Faça upload da pasta `dist` para um servidor web (ex: AWS S3, Netlify, Vercel)
   - Anote a URL pública do aplicativo

3. **Configurar Tablet em Modo Kiosk**
   - Instale um navegador moderno (Chrome, Edge)
   - Instale um aplicativo de kiosk mode:
     - **Kiosk Browser Lockdown** (gratuito)
     - **Fully Kiosk Browser** (pago, mais recursos)
   - Configure o aplicativo para abrir a URL do seu aplicativo
   - Ative o modo tela cheia
   - Desative botões de navegação
   - **IMPORTANTE**: Na primeira vez, toque no botão "Iniciar Vídeos" para começar

### Nota sobre Autoplay:

Navegadores modernos bloqueiam autoplay de vídeos por política de segurança. Por isso, o app mostra uma tela inicial que requer um toque do usuário. Após esse toque inicial:
- Os vídeos reproduzem automaticamente em loop
- O modo kiosk é ativado
- A tela cheia é ativada
- Nenhuma interação adicional é necessária
   - Configure auto-start ao ligar o tablet

### Recomendações para Tablets:

- **Resolução**: O app adapta-se automaticamente
- **Orientação**: Funciona em portrait e landscape
- **Conexão**: Wi-Fi estável recomendada (apenas na primeira execução)
- **Armazenamento**: Mínimo 500MB livre para cache dos vídeos

## 🎬 Vídeos Configurados

Os seguintes vídeos são baixados e exibidos em loop:

1. Santo Beef
2. Renner
3. Pizza Hut
4. McDonald's
5. Fast Escova
6. Espaço Laser
7. Coco Bambu

## 🔧 Como Adicionar/Remover Vídeos

Edite o arquivo `src/App.tsx` e modifique o array `VIDEO_URLS`:

```typescript
const VIDEO_URLS = [
  'https://seu-url.com/video1.mp4',
  'https://seu-url.com/video2.mp4',
  // adicione mais URLs aqui
];
```

## 💾 Sistema de Cache

O aplicativo usa **IndexedDB** para armazenar os vídeos localmente:

- Os vídeos são baixados apenas uma vez
- Nas próximas execuções, são carregados do cache
- Cache persiste mesmo após fechar o navegador
- Para limpar o cache, limpe os dados do navegador

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **IndexedDB** - Armazenamento local
- **APIs Nativas do Browser** - Sem bibliotecas externas pesadas

