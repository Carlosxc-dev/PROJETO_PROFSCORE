# ProfScore – Backend (como rodar)

Backend em **Node + Fastify + Prisma + PostgreSQL**.

## 1. Pré-requisitos

* Node.js instalado
* PostgreSQL rodando em `localhost:5432`
* Banco criado com nome: **`profscore`**

No PostgreSQL, crie o banco (se ainda não existir):

```sql
CREATE DATABASE profscore;
```

---

## 2. Clonar o projeto e entrar no backend

```bash
git clone 
cd backend2
```

---

## 3. Configurar o `.env`

Na pasta `backend2`, criar um arquivo chamado **`.env`** com:

```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/profscore?schema=public"
```


---

## 4. Instalar as dependências

Ainda dentro de `backend2`:

```bash
npm install
```

---

## 5. Rodar migrações e gerar Prisma Client

Criar/atualizar as tabelas no banco e gerar o client do Prisma:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Se não der erro aqui, o banco já está pronto.

---

## 6. Rodar o backend

Subir o servidor Fastify:

```bash
npx tsx src/server.ts
```

Se tudo der certo, vai aparecer algo como:

```text
Servidor ProfScore escutando em http://localhost:3000
```

Backend rodando em:
👉 `http://localhost:3000`

---

## 7. Testar rapidamente as rotas

Você pode testar de duas formas:

### 7.1. Via navegador / browser (somente GET)

Abrir no navegador:

* `http://localhost:3000/` – mensagem inicial
* `http://localhost:3000/usuario/all` – lista de usuários
* `http://localhost:3000/professor/all` – lista de professores
* `http://localhost:3000/disciplina/all` – lista de disciplinas
* `http://localhost:3000/avaliacao/all` – lista de avaliações
* `http://localhost:3000/relatorio/all` – lista de relatórios

### 7.2. Via Insomnia / Postman (GET/POST)

Exemplos de requisições:

**Criar usuário (POST)**
`POST http://localhost:3000/usuario`
Body (JSON):

```json
{
  "nome": "Aluno Teste",
  "email": "aluno.teste@unifei.edu.br",
  "senha": "123456"
}
```

**Criar professor (POST)**
`POST http://localhost:3000/professor`
Body:

```json
{
  "nome": "Prof. Teste",
  "departamento": "Computação",
  "email": "prof.teste@unifei.edu.br"
}
```

---

## 8. Script automático de teste (opcional)

Se quiser rodar um script que chama várias rotas de uma vez, usar:

```bash
npx tsx src/test-routes.ts
```

