<h2 align="center">
    PROJETO PROFSCORE 🚀
</h2>

---

## 💻 Pré-requisitos

Antes de começar, certifique-se de que você atendeu aos seguintes requisitos:

- Você possui a versão mais recente do [Docker](https://www.docker.com) instalada na sua máquina.
- Tenha o [Docker Compose](https://docs.docker.com/compose/install/) instalado.

---

## 📦 Instalando PROJETO PROFSCORE

1. **Abra o terminal e clone o repositório** para uma pasta do seu computador:

   ```bash
   git clone
   ```

2. **Acesse a pasta raiz do projeto:**

   ```bash
   cd PROJETO_PROFSCORE
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

Após esses passos, o projeto estará ativo e rodando 😊

---

## ☕ Utilizando a PROJETO PROFSCORE

Para utilizar a aplicação, basta abrir seu navegador e acessar:

- [http://localhost:4200](http://localhost:4200)
