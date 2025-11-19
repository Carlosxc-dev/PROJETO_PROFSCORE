# 🧪 Testes Automatizados com Selenium – ProfScore

Este documento explica **como preparar o ambiente**, **como executar** e **como resolver problemas comuns** ao rodar os testes automatizados Selenium do projeto **ProfScore**.
O objetivo é permitir que qualquer membro da equipe consiga executar os testes sem dificuldade.

---

# 📌 1. Requisitos Obrigatórios

Antes de rodar os testes, instale:

### ✔ Python 3.10+
https://www.python.org/downloads/

### ✔ Google Chrome (atualizado)

### ✔ Selenium 4.25+
(que já inclui ChromeDriver automaticamente)

### ✔ Node.js + NPM
https://nodejs.org/

### ✔ PostgreSQL
Com o banco do ProfScore configurado.

---

# 📌 2. Instalar Dependências do Python

Entre na pasta dos testes:

```bash
cd selenium-tests/
```


```



Instale dependências:

```bash
pip install selenium
```

---

# 📌 3. Preparar o Backend

Na pasta do backend:

```bash
npx npx tsx src/server.ts
```

O servidor deve rodar em:

```
http://localhost:3000
```

---

# 📌 4. Preparar o Frontend

Entre na pasta:

```bash
cd frontend/
```

Abra com Live Server (VSCode) ou similar.

O Selenium espera que o frontend rode em:

```
http://127.0.0.1:5500/frontend/index.html
```

---

# 📌 5. Usuário de Login Necessário

Certifique-se de que existe este usuário ADMIN:

| Campo | Valor |
|-------|-------|
| **E-mail** | admin@admin.com |
| **Senha**  | 1234567 |
| **Perfil** | ADMINISTRADOR |

Criar no Postgres, se necessário:

```sql
INSERT INTO "Usuario" (nome, email, senha, perfil, status)
VALUES ('Administrador', 'admin@admin.com', '1234567', 'ADMINISTRADOR', 'ATIVO');
```

---

# 📌 6. Rodar os Testes

Para rodar apenas o teste de usuários:

```bash
python test_usuarios.py
```

Para rodar todos os testes:

```bash
python -m unittest discover
```

---

# 📌 7. O que os Testes Fazem

### ✔ **test_usuarios.py**
- Cria um novo usuário
- Localiza o usuário criado pelo e-mail
- Edita somente esse usuário
- Exclui somente esse usuário
- Verifica se ele foi removido da tabela

### ✔ **test_professores.py**
- Cria, edita e exclui professores
- Sempre atua sobre o professor recém-criado

### ✔ **test_disciplinas.py**
- Cria disciplinas
- Edita disciplina selecionando professor corretamente
- Exclui a disciplina criada

### ✔ **test_avaliacoes.py**
- Cria avaliação
- Edita comentário
- Exclui somente a avaliação criada

---

# 📌 8. Erros Comuns e Soluções

### ❗ 1. *ElementClickInterceptedException*
O modal não fechou.

**Solução:**  
Os testes usam fechamento forçado via:

```python
driver.execute_script("closeUsuarioModal()")
```

---

### ❗ 2. *TimeoutException* esperando elemento sumir  
Frontend não atualizou.

**Solução:**  
Verifique se o backend está realmente rodando e se o Live Server não recarregou errado.

---

### ❗ 3. Erro de chave estrangeira ao excluir usuário  
O teste estava excluindo outro usuário com avaliações.

**Solução:**  
A versão atual **só exclui o usuário criado no teste**, eliminando o problema.

---

### ❗ 4. ChromeDriver incompatível
Se aparecer:

```
SessionNotCreatedException
```

Atualize Selenium:

```bash
pip install --upgrade selenium
```

---

# 📌 9. Checklist Antes de Rodar os Testes

| Item | ✔ |
|------|---|
| Backend rodando em http://localhost:3000 | ☐ |
| Frontend rodando via Live Server | ☐ |
| URL acessível em http://127.0.0.1:5500/frontend/index.html | ☐ |
| Usuário admin existe no banco | ☐ |
| Python + Selenium instalados | ☐ |
| Postgres funcionando | ☐ |

---




