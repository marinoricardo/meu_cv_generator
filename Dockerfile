# Usa Node LTS
FROM node:20-alpine

# Define diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install --production

# Copia o restante do código
COPY . .

# Define porta que o container vai expor
EXPOSE 3000

# Comando para iniciar a API
CMD ["node", "app.js"]
