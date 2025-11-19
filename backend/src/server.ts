import 'dotenv/config';


// src/server.ts
import fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from './generated/prisma/client';

const prisma = new PrismaClient();
const server = fastify();

// Configurando o CORS
server.register(cors, {
  origin: '*', // Permite todas as origens (para desenvolvimento)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 🔥 adiciona todos os métodos
  allowedHeaders: ['Content-Type', 'Authorization'], // importante para JSON e tokens
});


// Rota inicial
server.get('/', async (request, reply) => {
  return 'Backend do Sistema ProfScore\nUNIFEI\n';
});

/**
 * CRUD USUARIO
 */

server.get('/usuario/all', async (request, reply) => {
  const usuarios = await prisma.usuario.findMany();
  return usuarios;
});

server.get('/usuario/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: Number(id) },
  });

  if (!usuario) {
    reply.status(404).send({ error: 'Usuário não encontrado' });
    return;
  }

  return usuario;
});

server.get('/usuario/email/:email', async (request, reply) => {
  const { email } = request.params as { email?: string };

  if (!email) {
    reply.status(400).send({ error: 'E-mail é obrigatório' });
    return;
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      reply.status(404).send({ error: 'Usuário não encontrado' });
      return;
    }

    reply.status(200).send(usuario);
  } catch (error: any) {
    reply.status(500).send({
      error: 'Erro ao buscar usuário por e-mail',
      details: error.message,
    });
  }
});


server.post('/usuario', async (request, reply) => {
  const { nome, email, senha, perfil, status } = request.body as any;

  if (!nome || !email || !senha) {
    reply
      .status(400)
      .send({ error: 'Campos obrigatórios: nome, email, senha' });
    return;
  }

  try {
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash: senha, 
        perfil: 'ALUNO', 
        status: 'ATIVO',
      },
    });

    reply.status(201).send(novoUsuario);
  } catch (error: any) {
    reply
      .status(500)
      .send({ error: 'Erro ao criar usuário', details: error.message });
  }
});

server.put('/usuario/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };
  const { nome, email, senha, perfil, status } = request.body as any;

  if (!id) {
    reply
      .status(400)
      .send({ error: 'ID é obrigatório para atualizar o usuário' });
    return;
  }

  try {
    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: Number(id) },
      data: {
        nome,
        email,
        senhaHash: senha,
        perfil,
        status,
      },
    });

    reply.status(200).send(usuarioAtualizado);
  } catch (error: any) {
    reply.status(404).send({
      error: 'Usuário não encontrado ou erro ao atualizar',
      details: error.message,
    });
  }
});

server.delete('/usuario/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  try {
    const usuario = await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    reply.status(200).send(usuario);
  } catch (error: any) {
    reply.status(404).send({
      error: 'Usuário não encontrado ou já foi excluído',
      details: error.message,
    });
  }
});

/**
 * CRUD PROFESSOR
 */

server.get('/professor/all', async (request, reply) => {
  const professores = await prisma.professor.findMany({
    include: {
      disciplinas: true,
      avaliacoes: true,
    },
  });
  return professores;
});

server.get('/professor/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  const professor = await prisma.professor.findUnique({
    where: { id: Number(id) },
    include: {
      disciplinas: true,
      avaliacoes: true,
    },
  });

  if (!professor) {
    reply.status(404).send({ error: 'Professor não encontrado' });
    return;
  }

  return professor;
});

server.get('/professor/email/:email', async (request, reply) => {
  const { email } = request.params as { email?: string };

  if (!email) {
    reply.status(400).send({ error: 'E-mail é obrigatório' });
    return;
  }

  try {
    const professor = await prisma.professor.findUnique({
      where: { email },
      include: {
        disciplinas: true,
        avaliacoes: true,
      },
    });

    if (!professor) {
      reply.status(404).send({ error: 'Professor não encontrado' });
      return;
    }

    reply.status(200).send(professor);
  } catch (error: any) {
    reply.status(500).send({
      error: 'Erro ao buscar professor por e-mail',
      details: error.message,
    });
  }
});


server.post('/professor', async (request, reply) => {
  const { nome, departamento, email } = request.body as any;

  if (!nome || !departamento) {
    reply
      .status(400)
      .send({ error: 'Campos obrigatórios: nome, departamento' });
    return;
  }

  try {
    const novoProfessor = await prisma.professor.create({
      data: {
        nome,
        departamento,
        email,
      },
    });

    reply.status(201).send(novoProfessor);
  } catch (error: any) {
    reply
      .status(500)
      .send({ error: 'Erro ao criar professor', details: error.message });
  }
});

server.put('/professor/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };
  const { nome, departamento, email } = request.body as any;

  if (!id) {
    reply
      .status(400)
      .send({ error: 'ID é obrigatório para atualizar professor' });
    return;
  }

  try {
    const professorAtualizado = await prisma.professor.update({
      where: { id: Number(id) },
      data: {
        nome,
        departamento,
        email,
      },
    });

    reply.status(200).send(professorAtualizado);
  } catch (error: any) {
    reply.status(404).send({
      error: 'Professor não encontrado ou erro ao atualizar',
      details: error.message,
    });
  }
});

server.delete('/professor/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  try {
    const professorDeletado = await prisma.professor.delete({
      where: { id: Number(id) },
    });

    reply.status(200).send(professorDeletado);
  } catch (error: any) {
    reply.status(404).send({
      error: 'Professor não encontrado ou já foi excluído',
      details: error.message,
    });
  }
});

/**
 * CRUD DISCIPLINA
 */

server.get('/disciplina/all', async (request, reply) => {
  const disciplinas = await prisma.disciplina.findMany({
    include: {
      professor: true,
    },
  });
  return disciplinas;
});

server.get('/disciplina/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  const disciplina = await prisma.disciplina.findUnique({
    where: { id: Number(id) },
    include: {
      professor: true,
    },
  });

  if (!disciplina) {
    reply.status(404).send({ error: 'Disciplina não encontrada' });
    return;
  }

  return disciplina;
});

server.post('/disciplina', async (request, reply) => {
  const { sigla, nome, periodo, semestre, professorId } = request.body as any;

  if (!sigla || !nome || !periodo || !semestre || !professorId) {
    reply.status(400).send({
      error:
        'Campos obrigatórios: sigla, nome, periodo, semestre, professorId',
    });
    return;
  }

  try {
    const novaDisciplina = await prisma.disciplina.create({
      data: {
        sigla,
        nome,
        periodo,
        semestre, // 'IMPAR' ou 'PAR'
        professorId,
      },
    });

    reply.status(201).send(novaDisciplina);
  } catch (error: any) {
    reply
      .status(500)
      .send({ error: 'Erro ao criar disciplina', details: error.message });
  }
});

server.put('/disciplina/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };
  const { sigla, nome, periodo, semestre, professorId } = request.body as any;

  if (!id) {
    reply
      .status(400)
      .send({ error: 'ID é obrigatório para atualizar disciplina' });
    return;
  }

  try {
    const disciplinaAtualizada = await prisma.disciplina.update({
      where: { id: Number(id) },
      data: {
        sigla,
        nome,
        periodo,
        semestre,
        professorId,
      },
    });

    reply.status(200).send(disciplinaAtualizada);
  } catch (error: any) {
    reply.status(404).send({
      error: 'Disciplina não encontrada ou erro ao atualizar',
      details: error.message,
    });
  }
});

server.delete('/disciplina/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  try {
    const disciplinaDeletada = await prisma.disciplina.delete({
      where: { id: Number(id) },
    });

    reply.status(200).send(disciplinaDeletada);
  } catch (error: any) {
    reply.status(404).send({
      error: 'Disciplina não encontrada ou já foi excluída',
      details: error.message,
    });
  }
});

/**
 * CRUD AVALIACAO
 */

server.get('/avaliacao/all', async (request, reply) => {
  const avaliacoes = await prisma.avaliacao.findMany({
    include: {
      aluno: true,
      professor: true,
      disciplina: true,
    },
  });
  return avaliacoes;
});

server.get('/avaliacao/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id: Number(id) },
    include: {
      aluno: true,
      professor: true,
      disciplina: true,
    },
  });

  if (!avaliacao) {
    reply.status(404).send({ error: 'Avaliação não encontrada' });
    return;
  }

  return avaliacao;
});

server.post('/avaliacao', async (request, reply) => {
  const {
    alunoId,
    professorId,
    disciplinaId,
    metodologia,
    clareza,
    assiduidade,
    didatica,
    comentario,
  } = request.body as any;

  if (!alunoId || !professorId || !disciplinaId) {
    reply.status(400).send({
      error: 'Campos obrigatórios: alunoId, professorId, disciplinaId',
    });
    return;
  }

  try {
    const novaAvaliacao = await prisma.avaliacao.create({
      data: {
        alunoId,
        professorId,
        disciplinaId,
        metodologia,
        clareza,
        assiduidade,
        didatica,
        comentario,
      },
    });

    reply.status(201).send(novaAvaliacao);
  } catch (error: any) {
    reply
      .status(500)
      .send({ error: 'Erro ao criar avaliação', details: error.message });
  }
});

server.put('/avaliacao/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };
  const {
    metodologia,
    clareza,
    assiduidade,
    didatica,
    comentario,
  } = request.body as any;

  if (!id) {
    reply
      .status(400)
      .send({ error: 'ID é obrigatório para atualizar avaliação' });
    return;
  }

  try {
    const avaliacaoAtualizada = await prisma.avaliacao.update({
      where: { id: Number(id) },
      data: {
        metodologia,
        clareza,
        assiduidade,
        didatica,
        comentario,
      },
    });

    reply.status(200).send(avaliacaoAtualizada);
  } catch (error: any) {
    reply.status(404).send({
      error: 'Avaliação não encontrada ou erro ao atualizar',
      details: error.message,
    });
  }
});

server.delete('/avaliacao/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  try {
    const avaliacaoDeletada = await prisma.avaliacao.delete({
      where: { id: Number(id) },
    });

    reply.status(200).send(avaliacaoDeletada);
  } catch (error: any) {
    reply.status(404).send({
      error: 'Avaliação não encontrada ou já foi excluída',
      details: error.message,
    });
  }
});

/**
 * CRUD RELATORIO (registro do PDF)
 */

server.get('/relatorio/all', async (request, reply) => {
  const relatorios = await prisma.relatorio.findMany();
  return relatorios;
});

server.get('/relatorio/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  const relatorio = await prisma.relatorio.findUnique({
    where: { id: Number(id) },
  });

  if (!relatorio) {
    reply.status(404).send({ error: 'Relatório não encontrado' });
    return;
  }

  return relatorio;
});

server.post('/relatorio', async (request, reply) => {
  const { arquivoUrl, professorId, disciplinaId } = request.body as any;

  if (!arquivoUrl) {
    reply.status(400).send({ error: 'Campo obrigatório: arquivoUrl' });
    return;
  }

  try {
    const novoRelatorio = await prisma.relatorio.create({
      data: {
        arquivoUrl,
        professorId,
        disciplinaId,
      },
    });

    reply.status(201).send(novoRelatorio);
  } catch (error: any) {
    reply
      .status(500)
      .send({ error: 'Erro ao criar relatório', details: error.message });
  }
});

server.delete('/relatorio/:id', async (request, reply) => {
  const { id } = request.params as { id?: string };

  if (!id) {
    reply.status(400).send({ error: 'ID é obrigatório' });
    return;
  }

  try {
    const relatorioDeletado = await prisma.relatorio.delete({
      where: { id: Number(id) },
    });

    reply.status(200).send(relatorioDeletado);
  } catch (error: any) {
    reply.status(404).send({
      error: 'Relatório não encontrado ou já foi excluído',
      details: error.message,
    });
  }
});

/**
 * Iniciar servidor
 */

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Servidor ProfScore escutando em ${address}`);
});
