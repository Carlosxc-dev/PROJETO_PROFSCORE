<h2 align="center">
    PROJETO PILOTO 🚀
</h2>

PROJETO PILOTO é um projeto desenvolvido para empresa POTAMOS

---

## 💻 Pré-requisitos

Antes de começar, certifique-se de que você atendeu aos seguintes requisitos:

- Você possui a versão mais recente do [Docker](https://www.docker.com) instalada na sua máquina.
- Tenha o [Docker Compose](https://docs.docker.com/compose/install/) instalado.

---

## 📦 Instalando PROJETO PILOTO

1. **Abra o terminal e clone o repositório** para uma pasta do seu computador:

   ```bash
   git clone
   ```

2. **Acesse a pasta raiz do projeto:**

   ```bash
   cd example
   ```

3. **Na raiz do projeto renomeie o arquivo `.env.example` para `.env`:**

   ```bash
   mv .env.example .env
   ```

4. **Na raiz do projeto execute o comando do Docker Compose para criar os containers:**

   ```bash
   docker-compose up -d --build
   ```

5. **Verifique se os containers estao rodando:**

   ```bash
   docker-compose ps
   ```

6. **Na raiz do projeto execute os comandos abaixo em outro terminal para rodar o frontend:**

   ```bash
    cd example
    npm install
    npm run dev
   ```

Após esses passos, o projeto estará ativo e rodando 😊

---

## ☕ Utilizando a HANDS-ON FINANCE

Para utilizar a aplicação, basta abrir seu navegador e acessar:

- [http://localhost:4200](http://localhost:4200)

---

### comandos

npx prisma migrate dev --name init npx prisma db pull

docker exec -it nome_do_container psql -U usuario -d nome_do_banco docker-compose up -d

git add . && git commit -m "feat: configurando ambiente" && git push

psql -h 192.168.0.127 -p 5433 -U root -d projeto_piloto_dev

### Testes

npx jest tests npx jest tests/api npx jest tests/core npx jest tests/infra

### atualizar migration

npx prisma migrate dev --name (nome)


### comandos git 
git config --global core.editor "code --wait"
git config --global commit.template .gitmessage.txt
git commit -a
git push origin ...



#### atualizar o container de IA sem derrubar todos os outros
docker compose stop api
docker compose rm -f api
docker compose build api
docker compose up -d api
