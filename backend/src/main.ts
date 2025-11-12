import 'dotenv/config';

import {
  PrismaClient,
  PerfilUsuario,
  StatusUsuario,
  Semestre,
} from './generated/prisma/client';


const prisma = new PrismaClient();

async function main() {
  // 1) Criar usuário administrador
  const admin = await prisma.usuario.create({
    data: {
      nome: 'Admin ProfScore',
      email: 'admin@profsocre.com',
      senhaHash: 'senhaAdmin123', // em produção: hash (bcrypt, etc.)
      perfil: PerfilUsuario.ADMINISTRADOR,
      status: StatusUsuario.ATIVO,
    },
  });

  console.log('Usuário Admin criado:', admin);

  // 2) Criar primeiro aluno
  const aluno1 = await prisma.usuario.create({
    data: {
      nome: 'Carlos',
      email: 'Carlos@unifei.edu.br',
      senhaHash: 'senhaAluno1',
      perfil: PerfilUsuario.ALUNO,
      status: StatusUsuario.ATIVO,
    },
  });

  console.log('Aluno 1 criado:', aluno1);

  // 3) Criar segundo aluno
  const aluno2 = await prisma.usuario.create({
    data: {
      nome: 'Thiago',
      email: 'thiago@unifei.edu.br',
      senhaHash: 'senhaAluno2',
      perfil: PerfilUsuario.ALUNO,
      status: StatusUsuario.ATIVO,
    },
  });

  console.log('Aluno 2 criado:', aluno2);

  // 4) Criar professor
  const professor = await prisma.professor.create({
    data: {
      nome: 'Adler Diniz',
      departamento: 'IMC - INSTITUTO DE MATEMÁTICA E COMPUTACÃO',
      email: 'adlerdiniz@unifei.edu.br',
    },
  });

  console.log('Professor criado:', professor);

  // 5) Criar disciplina associada ao professor
  const disciplina = await prisma.disciplina.create({
    data: {
      sigla: 'SDES06',
      nome: 'Gerência de Software',
      periodo: '8',
      semestre: Semestre.PAR,
      professorId: professor.id,
    },
  });

  console.log('Disciplina criada:', disciplina);

  // 6) Criar avaliações (uma por aluno para o mesmo professor e disciplina)

  const avaliacaoAluno1 = await prisma.avaliacao.create({
    data: {
      alunoId: aluno1.id,
      professorId: professor.id,
      disciplinaId: disciplina.id,
      metodologia: 4,
      clareza: 5,
      assiduidade: 5,
      didatica: 4,
      comentario: 'Aulas bem organizadas e claras.',
    },
  });

  console.log('Avaliação do aluno 1 criada:', avaliacaoAluno1);

  const avaliacaoAluno2 = await prisma.avaliacao.create({
    data: {
      alunoId: aluno2.id,
      professorId: professor.id,
      disciplinaId: disciplina.id,
      metodologia: 5,
      clareza: 4,
      assiduidade: 4,
      didatica: 5,
      comentario:
        'Explica muito bem, mas poderia disponibilizar mais exercícios.',
    },
  });

  console.log('Avaliação do aluno 2 criada:', avaliacaoAluno2);

  // 7) Buscar todas as avaliações do professor para calcular o "relatório" em memória
  const avaliacoesProfessor = await prisma.avaliacao.findMany({
    where: { professorId: professor.id, disciplinaId: disciplina.id },
  });

  const totalAvaliacoes = avaliacoesProfessor.length;

  const mediaGeral =
    totalAvaliacoes === 0
      ? 0
      : avaliacoesProfessor.reduce((acc, a) => {
          const mediaAvaliacao =
            (a.metodologia + a.clareza + a.assiduidade + a.didatica) / 4;
          return acc + mediaAvaliacao;
        }, 0) / totalAvaliacoes;

  console.log(
    `Média geral calculada para o professor na disciplina ${disciplina.sigla}: ${mediaGeral}`,
  );

  // 8) Criar registro de relatório apenas para salvar o PDF no banco
  const relatorio = await prisma.relatorio.create({
    data: {
      arquivoUrl:
        'https://meu-servidor.com/relatorios/profscore-prof-carlos-ges101-2025-2.pdf',
      professorId: professor.id,
      disciplinaId: disciplina.id,
    },
  });

  console.log('Relatório registrado no banco:', relatorio);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
