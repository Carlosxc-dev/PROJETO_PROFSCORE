// src/test-routes.ts
import 'dotenv/config';

const BASE_URL = 'http://localhost:3000';

async function call(method: string, path: string, body?: any) {
  const url = `${BASE_URL}${path}`;
  const options: any = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };

  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const text = await res.text();

  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  console.log(`\n[${method}] ${path} -> status ${res.status}`);
  console.log('Resposta:', data);

  return { status: res.status, data };
}

async function run() {
  console.log('=== 🧪 Testando rotas do ProfScore ===');

  // ======================================================
  // 1️⃣ Usuário
  // ======================================================
  const emailUsuario = `aluno${Date.now()}@unifei.edu.br`;

  const { data: usuario } = await call('POST', '/usuario', {
    nome: 'Aluno Teste',
    email: emailUsuario,
    senha: '123456',
  });

  await call('GET', '/usuario/all');
  await call('GET', `/usuario/${usuario.id}`);
  await call('GET', `/usuario/email/${encodeURIComponent(emailUsuario)}`);

  // ======================================================
  // 2️⃣ Professor
  // ======================================================
  const emailProfessor = `prof${Date.now()}@unifei.edu.br`;

  const { data: professor } = await call('POST', '/professor', {
    nome: 'Prof. Testador',
    departamento: 'Engenharia de Software',
    email: emailProfessor,
  });

  await call('GET', '/professor/all');
  await call('GET', `/professor/${professor.id}`);
  await call('GET', `/professor/email/${encodeURIComponent(emailProfessor)}`);

  // ======================================================
  // 3️⃣ Disciplina
  // ======================================================
  const sigla = `GES${Math.floor(Math.random() * 1000)}`;
  const { data: disciplina } = await call('POST', '/disciplina', {
    sigla,
    nome: 'Gerência de Software',
    periodo: '2025.2',
    semestre: 'PAR',
    professorId: professor.id,
  });

  await call('GET', '/disciplina/all');
  await call('GET', `/disciplina/${disciplina.id}`);

  // ======================================================
  // 4️⃣ Avaliação
  // ======================================================
  const { data: avaliacao } = await call('POST', '/avaliacao', {
    alunoId: usuario.id,
    professorId: professor.id,
    disciplinaId: disciplina.id,
    metodologia: 5,
    clareza: 4,
    assiduidade: 5,
    didatica: 4,
    comentario: 'Professor muito didático e prestativo.',
  });

  await call('GET', '/avaliacao/all');
  await call('GET', `/avaliacao/${avaliacao.id}`);

  // ======================================================
  // 5️⃣ Relatório
  // ======================================================
  const { data: relatorio } = await call('POST', '/relatorio', {
    arquivoUrl: 'https://meu-storage.com/relatorios/teste.pdf',
    professorId: professor.id,
    disciplinaId: disciplina.id,
  });

  await call('GET', '/relatorio/all');
  await call('GET', `/relatorio/${relatorio.id}`);

  console.log('\n✅ Testes finalizados com sucesso.');
}

run().catch((err) => {
  console.error('❌ Erro durante os testes:', err);
  process.exit(1);
});
