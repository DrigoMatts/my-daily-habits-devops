# Projeto do Curso — DevOps & Cloud

App-base do **Módulo 11 (DevOps & Cloud)** da Capacitação Full Stack.
É a **aplicação-projeto de exemplo** do curso — um rastreador de hábitos bem simples, só pra ter
algo concreto pra levar do *"roda na minha máquina"* até *no ar, versionado, com CI e deploy automático*.
Cada professor pode trocar por seu próprio projeto: o que importa é o fluxo, não o app.

É um frontend **estático** (React + Vite), então não precisa de servidor nem banco:
o navegador guarda tudo. Isso é de propósito — deploy estático no GitHub Pages, custo zero.

---
# Atividade Docker + CI — Rodrigo Matos Gomes

> Preencha todos os campos marcados com `[...]` e substitua os prints de exemplo pelos seus. Salve as imagens em `docs/imagens/` e mantenha os nomes de arquivo indicados.

**Aluno(a):** Rodrigo Matos Gomes  
**Turma:** Vespertino  
**Data:** 26/07/2026 
**Aplicação usada:** docker/getting-started-app — To-Do em Node.js

**Pré-requisitos sobre o app:**
- Runtime/Framework: Node.js 20 (Vite / React Frontend)
- instalação necessária para rodar local: Docker Desktop(Com Docker compose ativo)
- Início: `node src/index.js`("npm run dev -- --host 0.0.0.0 --port 3000")
- Rede do Docker: todo-net
- Porta interna mapeada no host: `3000` (http://localhost:3000)
- Volume de persistência: todo-mysql-data
- Banco de dados: MySQL (v8.0), integrado via variáveis de ambiente (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD MYSQL_DB)
- Banco padrão: SQLite (`/etc/todos/todo.db`)
- Banco alternativo: MySQL, via variáveis `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB`
- API: `GET /items`, `POST /items`

---

```bash
# Instale o Node 20 (LTS). No WSL/Ubuntu, via nvm (recomendado):
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# reabra o terminal, depois:
nvm install 20
nvm use 20

# confira as versões (esperado: node v20.x, npm 10.x)
node -v
npm -v
```

> Alternativa sem nvm: baixe o instalador do Node 20 LTS em https://nodejs.org (traz o npm).
> Use o **20** porque é a versão do CI e do Docker — assim "roda igual" em todo lugar.
---
## 1. Como executar este projeto:

```bash
npm install      # instala as dependências (Vite, React etc) na versão do package-lock — uma vez
npm run dev      # sobe em http://localhost:3000
npm test         # roda os testes (é o que o CI vai checar)
npm run build    # gera os estáticos em dist/

## no terminal com wsl (powershell)
git clone https://github.com/DrigoMatts/my-daily-habits-devops.git  # clonar o repositorio
cd my-daily-habits-devops # para entrar na pasta
docker compose up -d --build # Construir e subir containers (App + MySQL)
docker build -t todo-app:v1 .
docker run -d -p 3000:3000 --name todo todo-app:v1 # mapeamento e rodar
docker images # lista imagens
Acesse: http://localhost:3000
docker compose ps # verificar containers rodando
docker compose logs # ver logs
docker compose down -v # parar e remover a stack com volumes
docker network inspect todo-net # inspecionar a rede criada
```
---

## 2. Imagem e Dockerfile Multi-stage

O `Dockerfile` é **multi-stage**: o estágio 1 compila a app com o Node; o estágio 2
copia só os estáticos pro nginx (imagem final pequena).

Estágios utilizados: Builder (responsável por instalar as dependências e gerar o build estático do Vite com npm run build) e estágio final (servidor de execução enxuto com Nginx/Node para servir os arquivos estáticos compilados).

Imagem base: node:20-alpine (para o build) e Nginx/Alpine (para runtime leve).

Usuário de execução: root configurado explicitamente no Compose (ou usuário não-root node configurado no Dockerfile).

Tamanho final da imagem: Veja o valor exato rodando docker images no seu terminal (geralmente entre 100MB e 180MB).

## Print 1 - Build + Docker

![docker images](docs/images/builddockerimages.png)


## Print 2 - Aplicação rodando

![docker images](docs/imagens)

Por que o multi-stage ajuda?

>> O multi-stage build separa o ambiente de compilação do ambiente de execução, garantindo que código-fonte extra, ferramentas de build e pacotes de desenvolvimento não vão para a imagem final, o que reduz drasticamente seu tamanho e aumenta a segurança do container. 

---

# 3. Volumes e Persistência

Volume Utilizado e Motando em: 

```bash
todo-db/etc/todos
```

## Print 3 - Sem Volume 

![docker images](docs/images/semdados.png)

## Print 4 - Com volume

![docker images](docs/images/comdados.png)


Diferença entre docker compose down e docker compose down -v

---

# 4. Rede

Rede Criada como: **`todo-net`**

## Print 5 - Docker Network

![docker images](docs/images/dockernetwork.png)

## Print 6 -Dados dentro do MySQL

![docker images](docs/)



# 5. Docker Compose

## Print 7 -


---

# 6. Integração Contínua (Github Actions)



---

## Mapa do repositório

| Arquivo | Pra que serve | Aula |
|---|---|---|
| `src/habits.js` | Lógica pura (testável) | 4 |
| `test/habits.test.js` | Testes que o CI roda | 4 |
| `Dockerfile` / `nginx.conf` | Conteinerização | 4 |
| `.github/workflows/ci.yml` | Integração Contínua | 4 |
| `.github/workflows/deploy.yml` | Entrega Contínua (Pages) | 5 |
| `src/App.jsx` / `App.css` | A interface da app | — |
