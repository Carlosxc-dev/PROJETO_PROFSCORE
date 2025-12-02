// ========================================
// Configuração da API
// ========================================

const API_URL = 'http://localhost:3000';

// ========================================
// Estado da Aplicação
// ========================================

let currentUser = null;
let usuarios = [];
let professores = [];
let disciplinas = [];
let avaliacoes = [];
let relatorios = [];
let faqs = [];
let institutos = [];

// ========================================
// Inicialização
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  // Verificar se há usuário logado no localStorage
  const storedUser = localStorage.getItem('currentUser');
  if (storedUser) {
    currentUser = JSON.parse(storedUser);
  }
  
  // Verificar autenticação
  checkAuth();
  
  // Event Listeners
  setupEventListeners();
}

// ========================================
// Autenticação
// ========================================

function checkAuth() {
  if (currentUser) {
    showDashboard();
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('dashboard').classList.remove('active');
}

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('dashboard').classList.add('active');
  updateUserInfo();
  updateMenuVisibility();
  showSection('home');
}

function updateUserInfo() {
  if (currentUser) {
    document.getElementById('userName').textContent = currentUser.nome;
    document.getElementById('userEmail').textContent = currentUser.email;
    
    const avatar = document.getElementById('userAvatar');
    avatar.textContent = currentUser.nome.charAt(0).toUpperCase();
  }
}

// ========================================
// Controle de Visibilidade do Menu
// ========================================

function updateMenuVisibility() {
  const isAdmin = currentUser && currentUser.perfil === 'ADMINISTRADOR';
  
  // Selecionar os cards de menu
  const usuariosCard = document.querySelector('.menu-card[onclick="showSection(\'usuarios\')"]');
  const professoresCard = document.querySelector('.menu-card[onclick="showSection(\'professores\')"]');
  const relatoriosCard = document.querySelector('.menu-card[onclick="showSection(\'relatorios\')"]');
  
  if (isAdmin) {
    // Administrador vê tudo
    if (usuariosCard) usuariosCard.style.display = 'block';
    if (professoresCard) professoresCard.style.display = 'block';
    if (relatoriosCard) relatoriosCard.style.display = 'block';
  } else {
    // Aluno não vê Usuários, Professores e Relatórios
    if (usuariosCard) usuariosCard.style.display = 'none';
    if (professoresCard) professoresCard.style.display = 'none';
    if (relatoriosCard) relatoriosCard.style.display = 'none';
  }
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
  // Login Form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Usuário Form
  const usuarioForm = document.getElementById('usuarioForm');
  if (usuarioForm) {
    usuarioForm.addEventListener('submit', handleUsuarioSubmit);
  }

  // Professor Form
  const professorForm = document.getElementById('professorForm');
  if (professorForm) {
    professorForm.addEventListener('submit', handleProfessorSubmit);
  }

  // Relatório Form
  const relatorioForm = document.getElementById('relatorioForm');
  if (relatorioForm) {
    relatorioForm.addEventListener('submit', handleRelatorioSubmit);
  }

  // Registro Form
  const registroForm = document.getElementById('registroForm');
  if (registroForm) {
    registroForm.addEventListener('submit', handleRegistroSubmit);
  }
  // faqForm Form
  const faqForm = document.getElementById('faqForm');
  if (faqForm) {
    faqForm.addEventListener('submit', handlefaqSubmit);
  }
  // instituto Form
  const institutoForm = document.getElementById('institutoFormForm');
  if (institutoForm) {
    institutoForm.addEventListener('submit', handleinstitutoSubmit);
  }

  // Fechar modal ao clicar fora
  window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
      closeAllModals();
    }
  });

  // ESC para fechar modals
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });
}

// ========================================
// Login
// ========================================

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginPassword').value;
  
  try {
    // Buscar usuário por e-mail
    const response = await fetch(`${API_URL}/usuario/email/${encodeURIComponent(email)}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        showAlert('loginAlert', 'E-mail ou senha incorretos.', 'danger');
        return;
      }
      throw new Error('Erro ao buscar usuário');
    }
    
    const usuario = await response.json();
    
    // Verificar senha (nota: em produção, isso deve ser feito no backend)
    if (usuario.senhaHash !== senha) {
      showAlert('loginAlert', 'E-mail ou senha incorretos.', 'danger');
      return;
    }
    
    // Verificar status
    if (usuario.status === 'INATIVO') {
      showAlert('loginAlert', 'Usuário inativo. Entre em contato com o administrador.', 'danger');
      return;
    }
    
    // Login bem-sucedido
    currentUser = usuario;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    showDashboard();
    
    // Limpar formulário
    document.getElementById('loginForm').reset();
    showNotification('Login realizado com sucesso!', 'success');
    
  } catch (error) {
    console.error('Erro no login:', error);
    showAlert('loginAlert', 'Erro ao realizar login. Verifique se o servidor está rodando.', 'danger');
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('currentUser');
  showLogin();
  showSection('home');
  showNotification('Logout realizado com sucesso!', 'success');
}

// ========================================
// Registro de Novo Usuário
// ========================================

function showRegistroModal() {
  const modal = document.getElementById('registroModal');
  const form = document.getElementById('registroForm');
  
  form.reset();
  document.getElementById('registroAlert').innerHTML = '';
  modal.classList.add('active');
}

function closeRegistroModal() {
  document.getElementById('registroModal').classList.remove('active');
}

async function handleRegistroSubmit(event) {
  event.preventDefault();
  
  const nome = document.getElementById('registroNome').value.trim();
  const email = document.getElementById('registroEmail').value.trim();
  const senha = document.getElementById('registroSenha').value;
  const confirmarSenha = document.getElementById('registroConfirmarSenha').value;
  
  // Limpar alertas anteriores
  document.getElementById('registroAlert').innerHTML = '';
  
  // Validações
  if (senha !== confirmarSenha) {
    showAlert('registroAlert', 'As senhas não coincidem!', 'danger');
    return;
  }
  
  if (senha.length < 6) {
    showAlert('registroAlert', 'A senha deve ter no mínimo 6 caracteres!', 'danger');
    return;
  }
  
  try {
    // Criar novo usuário (sempre como ALUNO)
    await apiRequest('/usuario', {
      method: 'POST',
      body: JSON.stringify({ 
        nome, 
        email, 
        senha,
        perfil: 'ALUNO',
        status: 'ATIVO'
      }),
    });
    
    closeRegistroModal();
    showNotification('Conta criada com sucesso! Faça login para continuar.', 'success');
    
    // Preencher email no formulário de login
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').focus();
    
  } catch (error) {
    showAlert('registroAlert', `Erro ao criar conta: ${error.message}`, 'danger');
  }
}

// ========================================
// Navegação entre Seções
// ========================================

function showSection(section) {
  // Verificar permissões
  const isAdmin = currentUser && currentUser.perfil === 'ADMINISTRADOR';
  
  // Bloquear acesso de não-administradores às seções restritas
  if (!isAdmin && (section === 'usuarios' || section === 'professores' || section === 'relatorios')) {
    showNotification('Acesso negado! Apenas administradores podem acessar esta seção.', 'danger');
    return;
  }
  
  // Esconder todas as seções
  document.getElementById('homeMenu').style.display = 'none';
  document.querySelectorAll('.crud-section').forEach(s => {
    s.classList.remove('active');
  });

  // Mostrar seção selecionada
  if (section === 'home') {
    document.getElementById('homeMenu').style.display = 'block';
  } else if (section === 'usuarios') {
    document.getElementById('usuariosSection').classList.add('active');
    loadUsuarios();
  } else if (section === 'professores') {
    document.getElementById('professoresSection').classList.add('active');
    loadProfessores();
  } else if (section === 'relatorios') {
    document.getElementById('relatoriosSection').classList.add('active');
    loadRelatorios();
} else if (section === 'disciplinas') {
	  document.getElementById('disciplinasSection').classList.add('active');
	  loadDisciplinas();
	} else if (section === 'avaliacoes') {
	  document.getElementById('avaliacoesSection').classList.add('active');
    loadAvaliacoes();
	} else if (section === 'faq') {
	  document.getElementById('faqSection').classList.add('active');
    loadFaqs();
  
	} else if (section === 'instituto') {
	  document.getElementById('institutoSection').classList.add('active');
    loadInstitutos();
  } else if (section === 'periodo') {
    document.getElementById('periodoSection').classList.add('active');
    loadPeriodos();
  } else if (section === 'feedback') {
    document.getElementById('feedbackSection').classList.add('active');
    loadFeedbacks();
  }

}

// ========================================
// API Helper Functions
// ========================================

async function apiRequest(endpoint, options = {}) {
  try {
    const headers = options.body
      ? { 'Content-Type': 'application/json', ...options.headers }
      : { ...options.headers }; // 🔥 Só envia Content-Type se houver body

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Erro na requisição');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// ========================================
// CRUD Usuários
// ========================================

async function loadUsuarios() {
  const tbody = document.getElementById('usuariosTable');
  
  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="empty-state">
        <div class="empty-state-icon">⏳</div>
        <div>Carregando usuários...</div>
      </td>
    </tr>
  `;

  try {
    usuarios = await apiRequest('/usuario/all');
    
    if (usuarios.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div>Nenhum usuário cadastrado</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = usuarios.map(usuario => `
      <tr>
        <td>${usuario.nome}</td>
        <td>${usuario.email}</td>
        <td>
          <span class="badge ${usuario.perfil === 'ADMINISTRADOR' ? 'badge-primary' : 'badge-success'}">
            ${usuario.perfil}
          </span>
        </td>
        <td>
          <span class="badge ${usuario.status === 'ATIVO' ? 'badge-success' : 'badge-danger'}">
            ${usuario.status}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-small" onclick="editUsuario(${usuario.id})">
            ✏️ Editar
          </button>
          <button class="btn btn-danger btn-small" onclick="deleteUsuario(${usuario.id})">
            🗑️ Excluir
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <div class="empty-state-icon">❌</div>
          <div>Erro ao carregar usuários: ${error.message}</div>
        </td>
      </tr>
    `;
    showNotification('Erro ao carregar usuários', 'danger');
  }
}

function openUsuarioModal(usuarioId = null) {
  const modal = document.getElementById('usuarioModal');
  const form = document.getElementById('usuarioForm');
  const title = document.getElementById('usuarioModalTitle');
  
  form.reset();
  
  if (usuarioId) {
    const usuario = usuarios.find(u => u.id === usuarioId);
    if (usuario) {
      title.textContent = 'Editar Usuário';
      document.getElementById('usuarioId').value = usuario.id;
      document.getElementById('usuarioNome').value = usuario.nome;
      document.getElementById('usuarioEmail').value = usuario.email;
      document.getElementById('usuarioPerfil').value = usuario.perfil;
      document.getElementById('usuarioStatus').value = usuario.status;
    }
  } else {
    title.textContent = 'Novo Usuário';
    document.getElementById('usuarioId').value = '';
  }
  
  modal.classList.add('active');
}

function closeUsuarioModal() {
  document.getElementById('usuarioModal').classList.remove('active');
}

async function handleUsuarioSubmit(event) {
  event.preventDefault();
  
  const id = document.getElementById('usuarioId').value;
  const nome = document.getElementById('usuarioNome').value.trim();
  const email = document.getElementById('usuarioEmail').value.trim();
  const senha = document.getElementById('usuarioSenha').value;
  const perfil = document.getElementById('usuarioPerfil').value;
  const status = document.getElementById('usuarioStatus').value;
  
  try {
    if (id) {
      // Editar usuário existente
      const data = { nome, email, perfil, status };
      
      // Só incluir senha se foi fornecida
      if (senha) {
        data.senha = senha;
      }
      
      await apiRequest(`/usuario/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      
      showNotification('Usuário atualizado com sucesso!', 'success');
    } else {
      // Criar novo usuário
      if (!senha) {
        showNotification('Senha é obrigatória para novo usuário', 'danger');
        return;
      }
      
      await apiRequest('/usuario', {
        method: 'POST',
        body: JSON.stringify({ nome, email, senha, perfil, status }),
      });
      
      showNotification('Usuário criado com sucesso!', 'success');
    }
    
    loadUsuarios();
    closeUsuarioModal();
  } catch (error) {
    showNotification(`Erro: ${error.message}`, 'danger');
  }
}

function editUsuario(id) {
  openUsuarioModal(id);
}

async function deleteUsuario(id) {
  // Não permitir excluir o próprio usuário
  if (currentUser && currentUser.id === id) {
    showNotification('Você não pode excluir seu próprio usuário!', 'danger');
    return;
  }
  
  if (confirm('Tem certeza que deseja excluir este usuário?')) {
    try {
      await apiRequest(`/usuario/${id}`, {
        method: 'DELETE',
      });
      
      showNotification('Usuário excluído com sucesso!', 'success');
      loadUsuarios();
    } catch (error) {
      showNotification(`Erro ao excluir: ${error.message}`, 'danger');
    }
  }
}

// ========================================
// CRUD Professores
// ========================================

async function loadProfessores() {
  const tbody = document.getElementById('professoresTable');
  
  tbody.innerHTML = `
    <tr>
      <td colspan="4" class="empty-state">
        <div class="empty-state-icon">⏳</div>
        <div>Carregando professores...</div>
      </td>
    </tr>
  `;

  try {
    professores = await apiRequest('/professor/all');
    
    if (professores.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div>Nenhum professor cadastrado</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = professores.map(professor => `
      <tr>
        <td>${professor.nome}</td>
        <td>
          <span class="badge badge-primary">${professor.departamento}</span>
        </td>
        <td>${professor.email || '-'}</td>
        <td>
          <button class="btn btn-secondary btn-small" onclick="editProfessor(${professor.id})">
            ✏️ Editar
          </button>
          <button class="btn btn-danger btn-small" onclick="deleteProfessor(${professor.id})">
            🗑️ Excluir
          </button>
        </td>
      </tr>
    `).join('');
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          <div class="empty-state-icon">❌</div>
          <div>Erro ao carregar professores: ${error.message}</div>
        </td>
      </tr>
    `;
    showNotification('Erro ao carregar professores', 'danger');
  }
}

function openProfessorModal(professorId = null) {
  const modal = document.getElementById('professorModal');
  const form = document.getElementById('professorForm');
  const title = document.getElementById('professorModalTitle');
  
  form.reset();
  
  if (professorId) {
    const professor = professores.find(p => p.id === professorId);
    if (professor) {
      title.textContent = 'Editar Professor';
      document.getElementById('professorId').value = professor.id;
      document.getElementById('professorNome').value = professor.nome;
      document.getElementById('professorDepartamento').value = professor.departamento;
      document.getElementById('professorEmail').value = professor.email || '';
    }
  } else {
    title.textContent = 'Novo Professor';
    document.getElementById('professorId').value = '';
  }
  
  modal.classList.add('active');
}

function closeProfessorModal() {
  document.getElementById('professorModal').classList.remove('active');
}

async function handleProfessorSubmit(event) {
  event.preventDefault();
  
  const id = document.getElementById('professorId').value;
  const nome = document.getElementById('professorNome').value.trim();
  const departamento = document.getElementById('professorDepartamento').value.trim();
  const email = document.getElementById('professorEmail').value.trim();
  
  try {
    if (id) {
      // Editar professor existente
      await apiRequest(`/professor/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nome, departamento, email }),
      });
      
      showNotification('Professor atualizado com sucesso!', 'success');
    } else {
      // Criar novo professor
      await apiRequest('/professor', {
        method: 'POST',
        body: JSON.stringify({ nome, departamento, email }),
      });
      
      showNotification('Professor criado com sucesso!', 'success');
    }
    
    loadProfessores();
    closeProfessorModal();
  } catch (error) {
    showNotification(`Erro: ${error.message}`, 'danger');
  }
}

function editProfessor(id) {
  openProfessorModal(id);
}

async function deleteProfessor(id) {
  if (confirm('Tem certeza que deseja excluir este professor?')) {
    try {
      await apiRequest(`/professor/${id}`, {
        method: 'DELETE',
      });
      
      showNotification('Professor excluído com sucesso!', 'success');
      loadProfessores();
    } catch (error) {
      showNotification(`Erro ao excluir: ${error.message}`, 'danger');
    }
  }
}


    // ============ FAQ ============
    async function loadFaqs() {
      try {
        const response = await fetch(`${API_URL}/faq/all`);
        faqs = await response.json();
        applyFaqFilters();
      } catch (error) {
        console.error('Erro ao carregar FAQs:', error);
        showFaqTable([]);
      }
    }

    function applyFaqFilters() {
      const filtro = document.getElementById('filtroFaq').value.toLowerCase();
      const filtered = faqs.filter(f => 
        f.pergunta.toLowerCase().includes(filtro) || 
        f.resposta.toLowerCase().includes(filtro)
      );
      showFaqTable(filtered);
    }

    function limparFiltrosFaq() {
      document.getElementById('filtroFaq').value = '';
      applyFaqFilters();
    }

    function showFaqTable(data) {
      const tbody = document.getElementById('faqTable');
      
      if (data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="3" class="empty-state">
              <div class="empty-state-icon">📭</div>
              <div>Nenhuma FAQ encontrada</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = data.map(faq => `
        <tr>
          <td>${faq.pergunta}</td>
          <td>${faq.resposta}</td>
          <td>
            <button class="btn btn-primary btn-small" onclick="editFaq(${faq.id})">
              ✏️ Editar
            </button>
            <button class="btn btn-danger btn-small" onclick="deleteFaq(${faq.id})">
              🗑️ Excluir
            </button>
          </td>
        </tr>
      `).join('');
    }

    function openFaqModal(id = null) {
      document.getElementById('faqModal').classList.add('active');
      document.getElementById('faqModalTitle').textContent = id ? 'Editar FAQ' : 'Nova Pergunta';
      document.getElementById('faqForm').reset();
      document.getElementById('faqId').value = id || '';
      document.getElementById('faqAlert').innerHTML = '';

      if (id) {
        const faq = faqs.find(f => f.id === id);
        if (faq) {
          document.getElementById('faqPergunta').value = faq.pergunta;
          document.getElementById('faqResposta').value = faq.resposta;
        }
      }
    }

    function closeFaqModal() {
      document.getElementById('faqModal').classList.remove('active');
    }

    function editFaq(id) {
      openFaqModal(id);
    }

    async function deleteFaq(id) {
      if (!confirm('Deseja realmente excluir esta FAQ?')) return;

      try {
        const response = await fetch(`${API_URL}/faq/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('FAQ excluída com sucesso!');
          loadFaqs();
        } else {
          const error = await response.json();
          alert('Erro ao excluir FAQ: ' + error.error);
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir FAQ');
      }
    }

    document.getElementById('faqForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('faqId').value;
      const data = {
        pergunta: document.getElementById('faqPergunta').value,
        resposta: document.getElementById('faqResposta').value
      };

      try {
        const url = id ? `${API_URL}/faq/${id}` : `${API_URL}/faq`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          document.getElementById('faqAlert').innerHTML = 
            '<div class="alert alert-success">FAQ salva com sucesso!</div>';
          setTimeout(() => {
            closeFaqModal();
            loadFaqs();
          }, 1500);
        } else {
          const error = await response.json();
          document.getElementById('faqAlert').innerHTML = 
            `<div class="alert alert-error">Erro: ${error.error}</div>`;
        }
      } catch (error) {
        console.error('Erro:', error);
        document.getElementById('faqAlert').innerHTML = 
          '<div class="alert alert-error">Erro ao salvar FAQ</div>';
      }
    });

    // ============ INSTITUTO ============
    async function loadInstitutos() {
      try {
        const response = await fetch(`${API_URL}/instituto/all`);
        institutos = await response.json();
        applyInstitutoFilters();
      } catch (error) {
        console.error('Erro ao carregar institutos:', error);
        showInstitutoTable([]);
      }
    }

    function applyInstitutoFilters() {
      const filtroNome = document.getElementById('filtroInstituto').value.toLowerCase();
      const filtroSigla = document.getElementById('filtroSigla').value.toLowerCase();
      
      const filtered = institutos.filter(i => 
        i.nome.toLowerCase().includes(filtroNome) && 
        i.sigla.toLowerCase().includes(filtroSigla)
      );
      showInstitutoTable(filtered);
    }

    function limparFiltrosInstituto() {
      document.getElementById('filtroInstituto').value = '';
      document.getElementById('filtroSigla').value = '';
      applyInstitutoFilters();
    }

    function showInstitutoTable(data) {
      const tbody = document.getElementById('institutoTable');
      
      if (data.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="3" class="empty-state">
              <div class="empty-state-icon">📭</div>
              <div>Nenhum instituto encontrado</div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = data.map(inst => `
        <tr>
          <td>${inst.nome}</td>
          <td><span class="badge badge-success">${inst.sigla}</span></td>
          <td>
            <button class="btn btn-primary btn-small" onclick="editInstituto(${inst.id})">
              ✏️ Editar
            </button>
            <button class="btn btn-danger btn-small" onclick="deleteInstituto(${inst.id})">
              🗑️ Excluir
            </button>
          </td>
        </tr>
      `).join('');
    }

    function openInstitutoModal(id = null) {
      document.getElementById('institutoModal').classList.add('active');
      document.getElementById('institutoModalTitle').textContent = id ? 'Editar Instituto' : 'Novo Instituto';
      document.getElementById('institutoForm').reset();
      document.getElementById('institutoId').value = id || '';
      document.getElementById('institutoAlert').innerHTML = '';

      if (id) {
        const inst = institutos.find(i => i.id === id);
        if (inst) {
          document.getElementById('institutoNome').value = inst.nome;
          document.getElementById('institutoSigla').value = inst.sigla;
        }
      }
    }

    function closeInstitutoModal() {
      document.getElementById('institutoModal').classList.remove('active');
    }

    function editInstituto(id) {
      openInstitutoModal(id);
    }

    async function deleteInstituto(id) {
      if (!confirm('Deseja realmente excluir este instituto?')) return;

      try {
        const response = await fetch(`${API_URL}/instituto/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          alert('Instituto excluído com sucesso!');
          loadInstitutos();
        } else {
          const error = await response.json();
          alert('Erro ao excluir instituto: ' + error.error);
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao excluir instituto');
      }
    }

    document.getElementById('institutoForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('institutoId').value;
      const data = {
        nome: document.getElementById('institutoNome').value,
        sigla: document.getElementById('institutoSigla').value
      };

      try {
        const url = id ? `${API_URL}/instituto/${id}` : `${API_URL}/instituto`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          document.getElementById('institutoAlert').innerHTML = 
            '<div class="alert alert-success">Instituto salvo com sucesso!</div>';
          setTimeout(() => {
            closeInstitutoModal();
            loadInstitutos();
          }, 1500);
        } else {
          const error = await response.json();
          document.getElementById('institutoAlert').innerHTML = 
            `<div class="alert alert-error">Erro: ${error.error}</div>`;
        }
      } catch (error) {
        console.error('Erro:', error);
        document.getElementById('institutoAlert').innerHTML = 
          '<div class="alert alert-error">Erro ao salvar instituto</div>';
      }
    });

// ========================================
// CRUD Relatórios
// ========================================

async function loadRelatorios() {
  const tbody = document.getElementById('relatoriosTable');
  
  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="empty-state">
        <div class="empty-state-icon">⏳</div>
        <div>Carregando relatórios...</div>
      </td>
    </tr>
  `;

  try {
    relatorios = await apiRequest('/relatorio/all');
    
    if (relatorios.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div>Nenhum relatório cadastrado</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = relatorios.map(relatorio => {
      const dataFormatada = new Date(relatorio.createdAt).toLocaleDateString('pt-BR');
      const horaFormatada = new Date(relatorio.createdAt).toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      return `
        <tr>
          <td>${relatorio.id}</td>
          <td>
            <a href="${relatorio.arquivoUrl}" target="_blank" style="color: var(--primary); text-decoration: none;">
              📄 ${relatorio.arquivoUrl.split('/').pop() || 'relatorio.pdf'}
            </a>
          </td>
          <td>${relatorio.professorId || '-'}</td>
          <td>${relatorio.disciplinaId || '-'}</td>
          <td>
            <span class="badge badge-primary">${dataFormatada} às ${horaFormatada}</span>
          </td>
          <td>
            <button class="btn btn-danger btn-small" onclick="deleteRelatorio(${relatorio.id})">
              🗑️ Excluir
            </button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <div class="empty-state-icon">❌</div>
          <div>Erro ao carregar relatórios: ${error.message}</div>
        </td>
      </tr>
    `;
    showNotification('Erro ao carregar relatórios', 'danger');
  }
}

function openRelatorioModal() {
  const modal = document.getElementById('relatorioModal');
  const form = document.getElementById('relatorioForm');
  
  form.reset();
  modal.classList.add('active');
}

function closeRelatorioModal() {
  document.getElementById('relatorioModal').classList.remove('active');
}

async function handleRelatorioSubmit(event) {
  event.preventDefault();
  
  const arquivoUrl = document.getElementById('relatorioArquivoUrl').value.trim();
  const professorId = document.getElementById('relatorioProfessorId').value;
  const disciplinaId = document.getElementById('relatorioDisciplinaId').value;
  
  try {
    const data = { arquivoUrl };
    
    // Adicionar IDs opcionais apenas se fornecidos
    if (professorId) data.professorId = parseInt(professorId);
    if (disciplinaId) data.disciplinaId = parseInt(disciplinaId);
    
    await apiRequest('/relatorio', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    
    showNotification('Relatório cadastrado com sucesso!', 'success');
    loadRelatorios();
    closeRelatorioModal();
  } catch (error) {
    showNotification(`Erro: ${error.message}`, 'danger');
  }
}

async function deleteRelatorio(id) {
  if (confirm('Tem certeza que deseja excluir este relatório?')) {
    try {
      await apiRequest(`/relatorio/${id}`, {
        method: 'DELETE',
      });
      
      showNotification('Relatório excluído com sucesso!', 'success');
      loadRelatorios();
    } catch (error) {
      showNotification(`Erro ao excluir: ${error.message}`, 'danger');
    }
  }
}

// ========================================
// Utilitários
// ========================================

function showAlert(elementId, message, type = 'info') {
  const alertElement = document.getElementById(elementId);
  const bgColor = type === 'danger' ? '#fee2e2' : type === 'success' ? '#dcfce7' : '#dbeafe';
  const textColor = type === 'danger' ? '#dc2626' : type === 'success' ? '#16a34a' : '#2563eb';
  
  alertElement.innerHTML = `
    <div style="
      padding: 1rem;
      border-radius: 8px;
      background: ${bgColor};
      color: ${textColor};
      font-size: 0.95rem;
      animation: slideDown 0.3s ease-out;
    ">
      ${message}
    </div>
  `;
  
  setTimeout(() => {
    alertElement.innerHTML = '';
  }, 5000);
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  const bgColor = type === 'danger' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6';
  
  notification.style.cssText = `
    position: fixed;
    top: 2rem;
    right: 2rem;
    background: ${bgColor};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    animation: slideInRight 0.3s ease-out;
    font-weight: 600;
    max-width: 400px;
  `;
  
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
  });
}

// Adicionar animações CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideOutRight {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);



// ========================================
// CRUD Usuários
// ========================================

async function loadUsuarios() {
  const tbody = document.getElementById('usuariosTable');
  
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="empty-state">
        <div class="empty-state-icon">⏳</div>
        <div>Carregando usuários...</div>
      </td>
    </tr>
  `;

  try {
    usuarios = await apiRequest('/usuario/all');
    
    if (usuarios.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div>Nenhum usuário cadastrado</div>
          </td>
        </tr>
      `;
      return;
    }

    applyUsuarioFilters();
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-state-icon">❌</div>
          <div>Erro ao carregar usuários: ${error.message}</div>
        </td>
      </tr>
    `;
    showNotification('Erro ao carregar usuários', 'danger');
  }
}

function applyUsuarioFilters() {
  const tbody = document.getElementById('usuariosTable');
  
  // Obter valores dos filtros
  const filtroNome = document.getElementById('filtroNome')?.value.toLowerCase().trim() || '';
  const filtroEmail = document.getElementById('filtroEmail')?.value.toLowerCase().trim() || '';
  const filtroPerfil = document.getElementById('filtroPerfil')?.value || '';
  const filtroStatus = document.getElementById('filtroStatus')?.value || '';
  const ordenacao = document.getElementById('ordenacao')?.value || 'criacao_desc';
  const agrupamento = document.getElementById('agrupamento')?.value || '';
  
  // Aplicar filtros
  let usuariosFiltrados = usuarios.filter(usuario => {
    const matchNome = !filtroNome || usuario.nome.toLowerCase().includes(filtroNome);
    const matchEmail = !filtroEmail || usuario.email.toLowerCase().includes(filtroEmail);
    const matchPerfil = !filtroPerfil || usuario.perfil === filtroPerfil;
    const matchStatus = !filtroStatus || usuario.status === filtroStatus;
    
    return matchNome && matchEmail && matchPerfil && matchStatus;
  });
  
  // Aplicar ordenação
  usuariosFiltrados.sort((a, b) => {
    switch (ordenacao) {
      case 'criacao_desc':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'criacao_asc':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'nome_asc':
        return a.nome.localeCompare(b.nome);
      case 'nome_desc':
        return b.nome.localeCompare(a.nome);
      default:
        return 0;
    }
  });
  
  // Verificar se há resultados
  if (usuariosFiltrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div>Nenhum usuário encontrado com os filtros aplicados</div>
        </td>
      </tr>
    `;
    return;
  }
  
  // Aplicar agrupamento
  if (agrupamento) {
    renderUsuariosAgrupados(usuariosFiltrados, agrupamento);
  } else {
    renderUsuarios(usuariosFiltrados);
  }
}

function renderUsuarios(usuarios) {
  const tbody = document.getElementById('usuariosTable');
  
  tbody.innerHTML = usuarios.map(usuario => {
    const dataCriacao = usuario.createdAt 
      ? new Date(usuario.createdAt).toLocaleDateString('pt-BR') + ' às ' + 
        new Date(usuario.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '-';
    
    return `
      <tr>
        <td>${usuario.nome}</td>
        <td>${usuario.email}</td>
        <td>
          <span class="badge ${usuario.perfil === 'ADMINISTRADOR' ? 'badge-primary' : 'badge-success'}">
            ${usuario.perfil}
          </span>
        </td>
        <td>
          <span class="badge ${usuario.status === 'ATIVO' ? 'badge-success' : 'badge-danger'}">
            ${usuario.status}
          </span>
        </td>
        <td>
          <span style="font-size: 0.85rem; color: var(--text-light);">
            ${dataCriacao}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-small" onclick="editUsuario(${usuario.id})">
            ✏️ Editar
          </button>
          <button class="btn btn-danger btn-small" onclick="deleteUsuario(${usuario.id})">
            🗑️ Excluir
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderUsuariosAgrupados(usuarios, tipoAgrupamento) {
  const tbody = document.getElementById('usuariosTable');
  
  // Agrupar usuários
  const grupos = {};
  usuarios.forEach(usuario => {
    const chave = usuario[tipoAgrupamento];
    if (!grupos[chave]) {
      grupos[chave] = [];
    }
    grupos[chave].push(usuario);
  });
  
  // Ordenar grupos alfabeticamente
  const chavesOrdenadas = Object.keys(grupos).sort();
  
  // Renderizar com separadores de grupo
  let html = '';
  chavesOrdenadas.forEach(chave => {
    // Cabeçalho do grupo
    const labelGrupo = tipoAgrupamento === 'perfil' 
      ? (chave === 'ADMINISTRADOR' ? '👑 Administradores' : '👨‍🎓 Alunos')
      : (chave === 'ATIVO' ? '✅ Ativos' : '❌ Inativos');
    
    html += `
      <tr style="background: var(--surface); font-weight: 600;">
        <td colspan="6" style="padding: 1rem; border-left: 4px solid var(--primary);">
          ${labelGrupo} (${grupos[chave].length})
        </td>
      </tr>
    `;
    
    // Usuários do grupo
    grupos[chave].forEach(usuario => {
      const dataCriacao = usuario.createdAt 
        ? new Date(usuario.createdAt).toLocaleDateString('pt-BR') + ' às ' + 
          new Date(usuario.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : '-';
      
      html += `
        <tr>
          <td>${usuario.nome}</td>
          <td>${usuario.email}</td>
          <td>
            <span class="badge ${usuario.perfil === 'ADMINISTRADOR' ? 'badge-primary' : 'badge-success'}">
              ${usuario.perfil}
            </span>
          </td>
          <td>
            <span class="badge ${usuario.status === 'ATIVO' ? 'badge-success' : 'badge-danger'}">
              ${usuario.status}
            </span>
          </td>
          <td>
            <span style="font-size: 0.85rem; color: var(--text-light);">
              ${dataCriacao}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-small" onclick="editUsuario(${usuario.id})">
              ✏️ Editar
            </button>
            <button class="btn btn-danger btn-small" onclick="deleteUsuario(${usuario.id})">
              🗑️ Excluir
            </button>
          </td>
        </tr>
      `;
    });
  });
  
  tbody.innerHTML = html;
}

function limparFiltros() {
  document.getElementById('filtroNome').value = '';
  document.getElementById('filtroEmail').value = '';
  document.getElementById('filtroPerfil').value = '';
  document.getElementById('filtroStatus').value = '';
  document.getElementById('ordenacao').value = 'criacao_desc';
  document.getElementById('agrupamento').value = '';
  applyUsuarioFilters();
}

// ========================================
// CRUD Professores
// ========================================

async function loadProfessores() {
  const tbody = document.getElementById('professoresTable');
  
  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="empty-state">
        <div class="empty-state-icon">⏳</div>
        <div>Carregando professores...</div>
      </td>
    </tr>
  `;

  try {
    professores = await apiRequest('/professor/all');
    
    if (professores.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div>Nenhum professor cadastrado</div>
          </td>
        </tr>
      `;
      return;
    }

    applyProfessorFilters();
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <div class="empty-state-icon">❌</div>
          <div>Erro ao carregar professores: ${error.message}</div>
        </td>
      </tr>
    `;
    showNotification('Erro ao carregar professores', 'danger');
  }
}

function applyProfessorFilters() {
  const tbody = document.getElementById('professoresTable');
  
  // Obter valores dos filtros
  const filtroNomeProfessor = document.getElementById('filtroNomeProfessor')?.value.toLowerCase().trim() || '';
  const filtroEmailProfessor = document.getElementById('filtroEmailProfessor')?.value.toLowerCase().trim() || '';
  const filtroDepartamento = document.getElementById('filtroDepartamento')?.value.toLowerCase().trim() || '';
  const ordenacaoProfessor = document.getElementById('ordenacaoProfessor')?.value || 'criacao_desc';
  const agrupamentoProfessor = document.getElementById('agrupamentoProfessor')?.value || '';
  
  // Aplicar filtros
  let professoresFiltrados = professores.filter(professor => {
    const matchNome = !filtroNomeProfessor || professor.nome.toLowerCase().includes(filtroNomeProfessor);
    const matchEmail = !filtroEmailProfessor || (professor.email && professor.email.toLowerCase().includes(filtroEmailProfessor));
    const matchDepartamento = !filtroDepartamento || professor.departamento.toLowerCase().includes(filtroDepartamento);
    
    return matchNome && matchEmail && matchDepartamento;
  });
  
  // Aplicar ordenação
  professoresFiltrados.sort((a, b) => {
    switch (ordenacaoProfessor) {
      case 'criacao_desc':
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      case 'criacao_asc':
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      case 'nome_asc':
        return a.nome.localeCompare(b.nome);
      case 'nome_desc':
        return b.nome.localeCompare(a.nome);
      default:
        return 0;
    }
  });
  
  // Verificar se há resultados
  if (professoresFiltrados.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <div>Nenhum professor encontrado com os filtros aplicados</div>
        </td>
      </tr>
    `;
    return;
  }
  
  // Aplicar agrupamento
  if (agrupamentoProfessor === 'departamento') {
    renderProfessoresAgrupados(professoresFiltrados);
  } else {
    renderProfessores(professoresFiltrados);
  }
}

function renderProfessores(professores) {
  const tbody = document.getElementById('professoresTable');
  
  tbody.innerHTML = professores.map(professor => {
    const dataCriacao = professor.createdAt 
      ? new Date(professor.createdAt).toLocaleDateString('pt-BR') + ' às ' + 
        new Date(professor.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      : '-';
    
    return `
      <tr>
        <td>${professor.nome}</td>
        <td>${professor.email || '-'}</td>
        <td>
          <span class="badge badge-primary">${professor.departamento}</span>
        </td>
        <td>
          <span style="font-size: 0.85rem; color: var(--text-light);">
            ${dataCriacao}
          </span>
        </td>
        <td>
          <button class="btn btn-secondary btn-small" onclick="editProfessor(${professor.id})">
            ✏️ Editar
          </button>
          <button class="btn btn-danger btn-small" onclick="deleteProfessor(${professor.id})">
            🗑️ Excluir
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderProfessoresAgrupados(professores) {
  const tbody = document.getElementById('professoresTable');
  
  // Agrupar professores por departamento
  const grupos = {};
  professores.forEach(professor => {
    const dept = professor.departamento;
    if (!grupos[dept]) {
      grupos[dept] = [];
    }
    grupos[dept].push(professor);
  });
  
  // Ordenar departamentos alfabeticamente
  const departamentosOrdenados = Object.keys(grupos).sort();
  
  // Renderizar com separadores de grupo
  let html = '';
  departamentosOrdenados.forEach(departamento => {
    // Cabeçalho do grupo
    html += `
      <tr style="background: var(--surface); font-weight: 600;">
        <td colspan="5" style="padding: 1rem; border-left: 4px solid var(--primary);">
          🏛️ ${departamento} (${grupos[departamento].length})
        </td>
      </tr>
    `;
    
    // Professores do grupo
    grupos[departamento].forEach(professor => {
      const dataCriacao = professor.createdAt 
        ? new Date(professor.createdAt).toLocaleDateString('pt-BR') + ' às ' + 
          new Date(professor.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        : '-';
      
      html += `
        <tr>
          <td>${professor.nome}</td>
          <td>${professor.email || '-'}</td>
          <td>
            <span class="badge badge-primary">${professor.departamento}</span>
          </td>
          <td>
            <span style="font-size: 0.85rem; color: var(--text-light);">
              ${dataCriacao}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-small" onclick="editProfessor(${professor.id})">
              ✏️ Editar
            </button>
            <button class="btn btn-danger btn-small" onclick="deleteProfessor(${professor.id})">
              🗑️ Excluir
            </button>
          </td>
        </tr>
      `;
    });
  });
  
  tbody.innerHTML = html;
}

function limparFiltrosProfessores() {
  document.getElementById('filtroNomeProfessor').value = '';
  document.getElementById('filtroEmailProfessor').value = '';
  document.getElementById('filtroDepartamento').value = '';
  document.getElementById('ordenacaoProfessor').value = 'criacao_desc';
  document.getElementById('agrupamentoProfessor').value = '';
  applyProfessorFilters();
}

// Disciplinas
    async function loadDisciplinas() {
      try {
        const response = await fetch(`${API_URL}/disciplina/all`);
        const disciplinas = await response.json();
        
        const tbody = document.getElementById('disciplinasTable');
        
        if (disciplinas.length === 0) {
          tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><div class="empty-state-icon">📭</div><div>Nenhuma disciplina cadastrada</div></td></tr>';
          return;
        }
        
        tbody.innerHTML = disciplinas.map(d => `
          <tr>
            <td><strong>${d.sigla}</strong></td>
            <td>${d.nome}</td>
            <td>${d.periodo}</td>
            <td><span class="badge badge-info">${d.semestre}</span></td>
            <td>${d.professor?.nome || 'N/A'}</td>
            <td class="action-buttons">
              <button class="btn btn-secondary btn-small" onclick="editDisciplina(${d.id})">Editar</button>
              <button class="btn btn-danger btn-small" onclick="deleteDisciplina(${d.id})">Excluir</button>
            </td>
          </tr>
        `).join('');
      } catch (error) {
        console.error('Erro ao carregar disciplinas:', error);
      }
    }

    async function loadProfessoresSelect() {
      try {
        const response = await fetch(`${API_URL}/professor/all`);
        const professores = await response.json();
        
        const select = document.getElementById('disciplinaProfessorId');
        select.innerHTML = '<option value="">Selecione um professor</option>' +
          professores.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
      } catch (error) {
        console.error('Erro ao carregar professores:', error);
      }
    }

    function openDisciplinaModal(id = null) {
      document.getElementById('disciplinaModalTitle').textContent = id ? 'Editar Disciplina' : 'Nova Disciplina';
      document.getElementById('disciplinaForm').reset();
      document.getElementById('disciplinaId').value = id || '';
      
      loadProfessoresSelect();
      
      if (id) {
        fetch(`${API_URL}/disciplina/${id}`)
          .then(r => r.json())
          .then(d => {
            document.getElementById('disciplinaSigla').value = d.sigla;
            document.getElementById('disciplinaNome').value = d.nome;
            document.getElementById('disciplinaPeriodo').value = d.periodo;
            document.getElementById('disciplinaSemestre').value = d.semestre;
            document.getElementById('disciplinaProfessorId').value = d.professorId;
          });
      }
      
      document.getElementById('disciplinaModal').style.display = 'flex';
    }

    function closeDisciplinaModal() {
      document.getElementById('disciplinaModal').style.display = 'none';
    }

    document.getElementById('disciplinaForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const id = document.getElementById('disciplinaId').value;
      const data = {
        sigla: document.getElementById('disciplinaSigla').value,
        nome: document.getElementById('disciplinaNome').value,
        periodo: document.getElementById('disciplinaPeriodo').value,
        semestre: document.getElementById('disciplinaSemestre').value,
        professorId: parseInt(document.getElementById('disciplinaProfessorId').value)
      };
      
      try {
        const url = id ? `${API_URL}/disciplina/${id}` : `${API_URL}/disciplina`;
        const method = id ? 'PUT' : 'POST';
        
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        closeDisciplinaModal();
        loadDisciplinas();
      } catch (error) {
        console.error('Erro ao salvar disciplina:', error);
        alert('Erro ao salvar disciplina');
      }
    });

    function editDisciplina(id) {
      openDisciplinaModal(id);
    }

    async function deleteDisciplina(id) {
      if (!confirm('Deseja realmente excluir esta disciplina?')) return;
      
      try {
        await fetch(`${API_URL}/disciplina/${id}`, { method: 'DELETE' });
        loadDisciplinas();
      } catch (error) {
        console.error('Erro ao excluir disciplina:', error);
        alert('Erro ao excluir disciplina');
      }
    }

	// Avaliações
async function loadAvaliacoes() {
  try {
    const response = await fetch(`${API_URL}/avaliacao/all`);
    const avaliacoes = await response.json();
    
    const tbody = document.getElementById('avaliacoesTable');
    
    if (avaliacoes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-state"><div class="empty-state-icon">📭</div><div>Nenhuma avaliação cadastrada</div></td></tr>';
      return;
    }
    
    tbody.innerHTML = avaliacoes.map(a => {
      const dataFormatada = new Date(a.dataRegistro).toLocaleDateString('pt-BR');
      return `
        <tr>
          <td>${a.aluno?.nome || 'N/A'}</td>
          <td>${a.professor?.nome || 'N/A'}</td>
          <td>${a.disciplina?.nome || 'N/A'}</td>
          <td><span class="rating-display">${'★'.repeat(a.metodologia)}</span></td>
          <td><span class="rating-display">${'★'.repeat(a.clareza)}</span></td>
          <td><span class="rating-display">${'★'.repeat(a.assiduidade)}</span></td>
          <td><span class="rating-display">${'★'.repeat(a.didatica)}</span></td>
          <td>${dataFormatada}</td>
          <td class="action-buttons">
            <button class="btn btn-secondary btn-small" onclick="editAvaliacao(${a.id})">Editar</button>
            <button class="btn btn-danger btn-small" onclick="deleteAvaliacao(${a.id})">Excluir</button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error);
  }
}
// Avaliações
async function loadAvaliacoes() {
  try {
    const response = await fetch(`${API_URL}/avaliacao/all`);
    const avaliacoes = await response.json();
    
    const tbody = document.getElementById('avaliacoesTable');
    
    if (avaliacoes.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="empty-state"><div class="empty-state-icon">📭</div><div>Nenhuma avaliação cadastrada</div></td></tr>';
      return;
    }
    
    tbody.innerHTML = avaliacoes.map(a => {
      const dataFormatada = new Date(a.dataRegistro).toLocaleDateString('pt-BR');
      return `
        <tr>
          <td>${a.aluno?.nome || 'N/A'}</td>
          <td>${a.professor?.nome || 'N/A'}</td>
          <td>${a.disciplina?.nome || 'N/A'}</td>
          <td><span class="rating-display">${'★'.repeat(a.metodologia)}</span></td>
          <td><span class="rating-display">${'★'.repeat(a.clareza)}</span></td>
          <td><span class="rating-display">${'★'.repeat(a.assiduidade)}</span></td>
          <td><span class="rating-display">${'★'.repeat(a.didatica)}</span></td>
          <td>${dataFormatada}</td>
          <td class="action-buttons">
            <button class="btn btn-secondary btn-small" onclick="editAvaliacao(${a.id})">Editar</button>
            <button class="btn btn-danger btn-small" onclick="deleteAvaliacao(${a.id})">Excluir</button>
          </td>
        </tr>
      `;
    }).join('');
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error);
  }
}

async function loadAlunosSelect() {
  try {
    const response = await fetch(`${API_URL}/usuario/all`);
    const usuarios = await response.json();
    
    // Filtrar apenas alunos
    const alunos = usuarios.filter(u => u.perfil === 'ALUNO');
    
    const select = document.getElementById('avaliacaoAlunoId');
    select.innerHTML = '<option value="">Selecione um aluno</option>' +
      alunos.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
  } catch (error) {
    console.error('Erro ao carregar alunos:', error);
  }
}

async function loadProfessoresForAvaliacao() {
  try {
    const response = await fetch(`${API_URL}/professor/all`);
    const professores = await response.json();
    
    const select = document.getElementById('avaliacaoProfessorId');
    select.innerHTML = '<option value="">Selecione um professor</option>' +
      professores.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
  } catch (error) {
    console.error('Erro ao carregar professores:', error);
  }
}

async function loadDisciplinasForAvaliacao() {
  try {
    const response = await fetch(`${API_URL}/disciplina/all`);
    const disciplinas = await response.json();
    
    const select = document.getElementById('avaliacaoDisciplinaId');
    select.innerHTML = '<option value="">Selecione uma disciplina</option>' +
      disciplinas.map(d => `<option value="${d.id}">${d.sigla} - ${d.nome}</option>`).join('');
  } catch (error) {
    console.error('Erro ao carregar disciplinas:', error);
  }
}

function openAvaliacaoModal(id = null) {
  document.getElementById('avaliacaoModalTitle').textContent = id ? 'Editar Avaliação' : 'Nova Avaliação';
  document.getElementById('avaliacaoForm').reset();
  document.getElementById('avaliacaoId').value = id || '';
  
  loadAlunosSelect();
  loadProfessoresForAvaliacao();
  loadDisciplinasForAvaliacao();
  
  if (id) {
    fetch(`${API_URL}/avaliacao/${id}`)
      .then(r => r.json())
      .then(a => {
        document.getElementById('avaliacaoAlunoId').value = a.alunoId;
        document.getElementById('avaliacaoProfessorId').value = a.professorId;
        document.getElementById('avaliacaoDisciplinaId').value = a.disciplinaId;
        document.getElementById('avaliacaoMetodologia').value = a.metodologia;
        document.getElementById('avaliacaoClareza').value = a.clareza;
        document.getElementById('avaliacaoAssiduidade').value = a.assiduidade;
        document.getElementById('avaliacaoDidatica').value = a.didatica;
        document.getElementById('avaliacaoComentario').value = a.comentario || '';
      });
  }
  
  document.getElementById('avaliacaoModal').classList.add('active');
}

function closeAvaliacaoModal() {
  document.getElementById('avaliacaoModal').classList.remove('active');
}

document.getElementById('avaliacaoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('avaliacaoId').value;
  const data = {
    alunoId: parseInt(document.getElementById('avaliacaoAlunoId').value),
    professorId: parseInt(document.getElementById('avaliacaoProfessorId').value),
    disciplinaId: parseInt(document.getElementById('avaliacaoDisciplinaId').value),
    metodologia: parseInt(document.getElementById('avaliacaoMetodologia').value),
    clareza: parseInt(document.getElementById('avaliacaoClareza').value),
    assiduidade: parseInt(document.getElementById('avaliacaoAssiduidade').value),
    didatica: parseInt(document.getElementById('avaliacaoDidatica').value),
    comentario: document.getElementById('avaliacaoComentario').value || null
  };
  
  try {
    const url = id ? `${API_URL}/avaliacao/${id}` : `${API_URL}/avaliacao`;
    const method = id ? 'PUT' : 'POST';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    closeAvaliacaoModal();
    loadAvaliacoes();
    showNotification(id ? 'Avaliação atualizada!' : 'Avaliação criada!', 'success');
  } catch (error) {
    console.error('Erro ao salvar avaliação:', error);
    showNotification('Erro ao salvar avaliação', 'danger');
  }
});

function editAvaliacao(id) {
  openAvaliacaoModal(id);
}

async function deleteAvaliacao(id) {
  if (!confirm('Deseja realmente excluir esta avaliação?')) return;
  
  try {
    await fetch(`${API_URL}/avaliacao/${id}`, { method: 'DELETE' });
    loadAvaliacoes();
    showNotification('Avaliação excluída!', 'success');
  } catch (error) {
    console.error('Erro ao excluir avaliação:', error);
    showNotification('Erro ao excluir avaliação', 'danger');
  }
}

// Estado dos filtros
let filtroAtual = 'melhores'; // 'melhores', 'recentes', 'maior-numero', 'todos'

// Função para calcular média de avaliações
function calcularMediaAvaliacoes(professor) {
  const avaliacoes = window.avaliacoes?.filter(a => a.professorId === professor.id) || [];
  if (avaliacoes.length === 0) return 0;
  
  const soma = avaliacoes.reduce((acc, av) => acc + av.notaGeral, 0);
  return (soma / avaliacoes.length).toFixed(1);
}

// Função para contar avaliações
function contarAvaliacoes(professorId) {
  return window.avaliacoes?.filter(a => a.professorId === professorId).length || 0;
}

// Função para obter data da avaliação mais recente
function getUltimaAvaliacao(professorId) {
  const avaliacoesDoProfessor = window.avaliacoes?.filter(a => a.professorId === professorId) || [];
  if (avaliacoesDoProfessor.length === 0) return null;
  
  return avaliacoesDoProfessor.sort((a, b) => new Date(b.data) - new Date(a.data))[0].data;
}

// Função para filtrar e ordenar professores
function filtrarProfessores(filtro) {
  filtroAtual = filtro;
  
  let professoresFiltrados = [...window.professores];
  
  switch(filtro) {
    case 'melhores':
      // Ordenar por média de avaliações (decrescente)
      professoresFiltrados.sort((a, b) => {
        const mediaA = parseFloat(calcularMediaAvaliacoes(a));
        const mediaB = parseFloat(calcularMediaAvaliacoes(b));
        return mediaB - mediaA;
      });
      break;
      
    case 'recentes':
      // Ordenar por data da avaliação mais recente
      professoresFiltrados.sort((a, b) => {
        const dataA = getUltimaAvaliacao(a.id);
        const dataB = getUltimaAvaliacao(b.id);
        if (!dataA) return 1;
        if (!dataB) return -1;
        return new Date(dataB) - new Date(dataA);
      });
      break;
      
    case 'maior-numero':
      // Ordenar por número de avaliações (decrescente)
      professoresFiltrados.sort((a, b) => {
        return contarAvaliacoes(b.id) - contarAvaliacoes(a.id);
      });
      break;
      
    case 'todos':
    default:
      // Ordem alfabética
      professoresFiltrados.sort((a, b) => a.nome.localeCompare(b.nome));
      break;
  }
  
  // Atualizar botões ativos
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-filtro="${filtro}"]`)?.classList.add('active');
  
  return professoresFiltrados;
}

// Função para renderizar estrelas
function renderizarEstrelas(nota) {
  const estrelas = [];
  const notaArredondada = Math.round(nota * 2) / 2; // Arredonda para 0.5
  
  for (let i = 1; i <= 5; i++) {
    if (i <= notaArredondada) {
      estrelas.push('★');
    } else if (i - 0.5 === notaArredondada) {
      estrelas.push('⯨');
    } else {
      estrelas.push('☆');
    }
  }
  
  return estrelas.join('');
}

// Função para renderizar card do professor
function renderizarProfessorCard(professor) {
  const media = calcularMediaAvaliacoes(professor);
  const numAvaliacoes = contarAvaliacoes(professor.id);
  const estrelas = renderizarEstrelas(parseFloat(media));
  
  return `
    <div class="professor-card" onclick="verDetalhesProfessor(${professor.id})">
      <div class="professor-avatar">
        <div class="avatar-circle">
          ${professor.nome.charAt(0).toUpperCase()}
        </div>
      </div>
      <div class="professor-info">
        <h3>${professor.nome}</h3>
        <p class="professor-departamento">${professor.departamento || 'Departamento não informado'}</p>
      </div>
      <div class="professor-rating">
        <div class="rating-numero">${media > 0 ? media : '-'}</div>
        <div class="rating-estrelas">${media > 0 ? estrelas : '☆☆☆☆☆'}</div>
        <div class="rating-count">${numAvaliacoes} avaliação${numAvaliacoes !== 1 ? 'ões' : ''}</div>
      </div>
      <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); verDetalhesProfessor(${professor.id})">
        Ver Perfil
      </button>
    </div>
  `;
}

// Função para renderizar seção de professores em destaque
function renderizarProfessoresDestaque() {
  const container = document.getElementById('professoresDestaque');
  if (!container) return;
  
  if (!window.professores || window.professores.length === 0) {
    container.innerHTML = `
      <div class="professor-card">
        <div style="text-align: center; padding: 2rem">
          <div class="empty-state-icon">👨‍🏫</div>
          <div>Nenhum professor cadastrado ainda</div>
        </div>
      </div>
    `;
    return;
  }
  
  // Pegar os 3 melhores professores
  const melhoresProfessores = filtrarProfessores('melhores').slice(0, 3);
  
  container.innerHTML = melhoresProfessores
    .map(professor => renderizarProfessorCard(professor))
    .join('');
}

// Função para renderizar lista completa de professores (na seção)
function renderizarListaProfessores() {
  const container = document.getElementById('listaProfessores');
  if (!container) return;
  
  if (!window.professores || window.professores.length === 0) {
    container.innerHTML = `
      <div class="professor-card">
        <div style="text-align: center; padding: 2rem">
          <div class="empty-state-icon">👨‍🏫</div>
          <div>Nenhum professor cadastrado ainda</div>
        </div>
      </div>
    `;
    return;
  }
  
  const professoresFiltrados = filtrarProfessores(filtroAtual);
  
  container.innerHTML = professoresFiltrados
    .map(professor => renderizarProfessorCard(professor))
    .join('');
}

// Função para ver detalhes do professor
function verDetalhesProfessor(professorId) {
  const professor = window.professores.find(p => p.id === professorId);
  if (!professor) return;
  
  const avaliacoesDoProfessor = window.avaliacoes?.filter(a => a.professorId === professorId) || [];
  const media = calcularMediaAvaliacoes(professor);
  const estrelas = renderizarEstrelas(parseFloat(media));
  
  const modalContent = `
    <div style="text-align: center; margin-bottom: 2rem">
      <div class="professor-avatar" style="margin: 0 auto 1rem auto">
        <div class="avatar-circle" style="width: 100px; height: 100px; font-size: 2.5rem">
          ${professor.nome.charAt(0).toUpperCase()}
        </div>
      </div>
      <h2 style="margin: 0">${professor.nome}</h2>
      <p style="color: var(--text-light); margin: 0.5rem 0">${professor.departamento || 'Departamento não informado'}</p>
      
      <div style="margin-top: 1rem">
        <div class="rating-numero" style="font-size: 2rem">${media > 0 ? media : '-'}</div>
        <div class="rating-estrelas" style="font-size: 1.5rem">${media > 0 ? estrelas : '☆☆☆☆☆'}</div>
        <div class="rating-count">${avaliacoesDoProfessor.length} avaliação${avaliacoesDoProfessor.length !== 1 ? 'ões' : ''}</div>
      </div>
    </div>
    
    ${avaliacoesDoProfessor.length > 0 ? `
      <h3 style="margin-top: 2rem; margin-bottom: 1rem">Avaliações</h3>
      <div style="max-height: 400px; overflow-y: auto">
        ${avaliacoesDoProfessor.map(av => `
          <div class="avaliacao-card" style="margin-bottom: 1rem; padding: 1rem; background: var(--surface); border-radius: 8px">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem">
              <div class="rating-estrelas">${renderizarEstrelas(av.notaGeral)}</div>
              <div style="color: var(--text-light); font-size: 0.875rem">${new Date(av.data).toLocaleDateString('pt-BR')}</div>
            </div>
            <p style="margin: 0">${av.comentario}</p>
            <div style="display: flex; gap: 1rem; margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-light)">
              <span>Didática: ${av.didatica}/5</span>
              <span>Clareza: ${av.clareza}/5</span>
              <span>Disponibilidade: ${av.disponibilidade}/5</span>
            </div>
          </div>
        `).join('')}
      </div>
    ` : `
      <div style="text-align: center; padding: 2rem; color: var(--text-light)">
        <p>Nenhuma avaliação ainda</p>
      </div>
    `}
  `;
  
  showModal('Perfil do Professor', modalContent);
}

// Atualizar quando os dados mudarem
if (typeof window.addEventListener !== 'undefined') {
  window.addEventListener('dadosAtualizados', () => {
    renderizarProfessoresDestaque();
    if (document.getElementById('listaProfessores')) {
      renderizarListaProfessores();
    }
  });
}


// =============== PERÍODOS DE AVALIAÇÃO =======================
let periodos = [];

async function loadPeriodos() {
  const tbody = document.getElementById("periodoTable");
  tbody.innerHTML = `
    <tr>
      <td colspan="5" class="empty-state">
        <div class="empty-state-icon">⏳</div>
        <div>Carregando períodos...</div>
      </td>
    </tr>
  `;

  try {
    periodos = await apiRequest("/periodo/all");

    if (!periodos.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="empty-state">
            <div class="empty-state-icon">📭</div>
            <div>Nenhum período cadastrado</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = periodos
      .map(
        (p) => `
        <tr>
          <td>${p.descricao ?? "-"}</td>
          <td>${new Date(p.inicio).toLocaleString("pt-BR")}</td>
          <td>${new Date(p.fim).toLocaleString("pt-BR")}</td>
          <td>${new Date(p.createdAt).toLocaleString("pt-BR")}</td>
          <td>
            <button class="btn btn-secondary btn-small" onclick="editPeriodo(${p.id})">✏️ Editar</button>
            <button class="btn btn-danger btn-small" onclick="deletePeriodo(${p.id})">🗑️ Excluir</button>
          </td>
        </tr>
      `
      )
      .join("");
  } catch (err) {
    showNotification("Erro ao carregar períodos", "danger");
  }
}

function openPeriodoModal(id = null) {
  document.getElementById("periodoModal").classList.add("active");
  document.getElementById("periodoModalTitle").textContent = id
    ? "Editar Período"
    : "Novo Período";

  document.getElementById("periodoForm").reset();
  document.getElementById("periodoId").value = id || "";

  if (id) {
    const p = periodos.find((x) => x.id === id);
    if (p) {
      document.getElementById("periodoDescricao").value = p.descricao ?? "";
      document.getElementById("periodoInicio").value = p.inicio.slice(0, 16);
      document.getElementById("periodoFim").value = p.fim.slice(0, 16);
    }
  }
}

function closePeriodoModal() {
  document.getElementById("periodoModal").classList.remove("active");
}

document.getElementById("periodoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("periodoId").value;
  const data = {
    descricao: document.getElementById("periodoDescricao").value || null,
    inicio: new Date(document.getElementById("periodoInicio").value).toISOString(),
    fim: new Date(document.getElementById("periodoFim").value).toISOString(),
  };

  try {
    const url = id ? `/periodo/${id}` : "/periodo";
    const method = id ? "PUT" : "POST";

    await apiRequest(url, { method, body: JSON.stringify(data) });

    showNotification("Período salvo com sucesso!", "success");
    closePeriodoModal();
    loadPeriodos();
  } catch (err) {
    document.getElementById("periodoAlert").innerHTML = `
      <div class="alert alert-error">Erro: ${err.message}</div>
    `;
  }
});

async function deletePeriodo(id) {
  if (!confirm("Deseja realmente excluir este período?")) return;

  try {
    await apiRequest(`/periodo/${id}`, { method: "DELETE" });
    showNotification("Período excluído!", "success");
    loadPeriodos();
  } catch (err) {
    showNotification("Erro ao excluir período", "danger");
  }
}

function editPeriodo(id) {
  openPeriodoModal(id);
}

// ===================== FEEDBACK =============================
let feedbacks = [];

async function loadFeedbacks() {
  const tbody = document.getElementById("feedbackTable");
  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="empty-state">
        <div class="empty-state-icon">⏳</div>
        <div>Carregando feedbacks...</div>
      </td>
    </tr>
  `;

  try {
    feedbacks = await apiRequest("/feedback/all");

    if (!feedbacks.length) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">Nenhum feedback encontrado</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = feedbacks
      .map((f) => {
        const aluno = f.aluno?.nome ?? f.alunoId;
        const professor = f.professor?.nome ?? f.professorId;
        const disciplina =
          f.disciplina?.sigla
            ? `${f.disciplina.sigla} - ${f.disciplina.nome}`
            : f.disciplinaId;

        return `
        <tr>
          <td>${aluno}</td>
          <td>${professor}</td>
          <td>${disciplina}</td>
          <td title="${f.texto}">${
          f.texto.length > 120 ? f.texto.slice(0, 120) + "…" : f.texto
        }</td>
          <td>${new Date(f.dataRegistro).toLocaleString("pt-BR")}</td>
          <td>
            <button class="btn btn-secondary btn-small" onclick="editFeedback(${f.id})">✏️ Editar</button>
            <button class="btn btn-danger btn-small" onclick="deleteFeedback(${f.id})">🗑️ Excluir</button>
          </td>
        </tr>
      `;
      })
      .join("");
  } catch {
    showNotification("Erro ao carregar feedbacks", "danger");
  }
}

// ===================== FUNÇÕES AUXILIARES PARA FEEDBACK ======================

// Carregar alunos
async function loadAlunosSelectFeedback() {
  try {
    const response = await fetch(`${API_URL}/usuario/all`);
    const usuarios = await response.json();
    const alunos = usuarios.filter(u => u.perfil === "ALUNO");

    const select = document.getElementById("feedbackAlunoId");
    select.innerHTML =
      '<option value="">Selecione um aluno</option>' +
      alunos.map(a => `<option value="${a.id}">${a.nome}</option>`).join('');
  } catch (err) {
    console.error("Erro ao carregar alunos:", err);
  }
}

// Carregar professores
async function loadProfessoresForFeedback() {
  try {
    const response = await fetch(`${API_URL}/professor/all`);
    const professores = await response.json();

    const select = document.getElementById("feedbackProfessorId");
    select.innerHTML =
      '<option value="">Selecione um professor</option>' +
      professores.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
  } catch (err) {
    console.error("Erro ao carregar professores:", err);
  }
}

// Carregar disciplinas
async function loadDisciplinasForFeedback() {
  try {
    const response = await fetch(`${API_URL}/disciplina/all`);
    const disciplinas = await response.json();

    const select = document.getElementById("feedbackDisciplinaId");
    select.innerHTML =
      '<option value="">Selecione uma disciplina</option>' +
      disciplinas
        .map(d => `<option value="${d.id}">${d.sigla} - ${d.nome}</option>`)
        .join('');
  } catch (err) {
    console.error("Erro ao carregar disciplinas:", err);
  }
}


function openFeedbackModal(id = null) {
  document.getElementById("feedbackModal").classList.add("active");
  document.getElementById("feedbackModalTitle").textContent = id
    ? "Editar Feedback"
    : "Novo Feedback";
  document.getElementById("feedbackForm").reset();
  document.getElementById("feedbackId").value = id || "";

  loadAlunosSelectFeedback();
  loadProfessoresForFeedback();
  loadDisciplinasForFeedback();

  if (id) {
    apiRequest(`/feedback/${id}`).then((f) => {
      document.getElementById("feedbackAlunoId").value = f.alunoId;
      document.getElementById("feedbackProfessorId").value = f.professorId;
      document.getElementById("feedbackDisciplinaId").value = f.disciplinaId;
      document.getElementById("feedbackTexto").value = f.texto;
    });
  }
}

function closeFeedbackModal() {
  document.getElementById("feedbackModal").classList.remove("active");
}

document.getElementById("feedbackForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("feedbackId").value;

  const data = {
    texto: document.getElementById("feedbackTexto").value.trim(),
    alunoId: Number(document.getElementById("feedbackAlunoId").value),
    professorId: Number(document.getElementById("feedbackProfessorId").value),
    disciplinaId: Number(document.getElementById("feedbackDisciplinaId").value),
  };

  try {
    const url = id ? `/feedback/${id}` : "/feedback";
    const method = id ? "PUT" : "POST";

    await apiRequest(url, { method, body: JSON.stringify(data) });

    showNotification("Feedback salvo!", "success");
    closeFeedbackModal();
    loadFeedbacks();
  } catch (err) {
    document.getElementById("feedbackAlert").innerHTML = `
      <div class="alert alert-error">Erro: ${err.message}</div>
    `;
  }
});

async function deleteFeedback(id) {
  if (!confirm("Excluir este feedback?")) return;

  try {
    await apiRequest(`/feedback/${id}`, { method: "DELETE" });
    showNotification("Feedback excluído!", "success");
    loadFeedbacks();
  } catch {
    showNotification("Erro ao excluir feedback", "danger");
  }
}

function editFeedback(id) {
  openFeedbackModal(id);
}

function applyFeedbackFilters() {
  const q = document.getElementById("filtroFeedback").value.toLowerCase().trim();

  const filtered = feedbacks.filter((f) => {
    return (
      f.texto.toLowerCase().includes(q) ||
      f.aluno?.nome?.toLowerCase().includes(q) ||
      f.professor?.nome?.toLowerCase().includes(q) ||
      (f.disciplina?.nome + " " + f.disciplina?.sigla)
        ?.toLowerCase()
        .includes(q)
    );
  });

  const tbody = document.getElementById("feedbackTable");

  if (!filtered.length) {
    tbody.innerHTML = `
      <tr><td colspan="6" class="empty-state">Nenhum resultado</td></tr>
    `;
    return;
  }

  tbody.innerHTML = filtered
    .map(
      (f) => `
      <tr>
        <td>${f.aluno?.nome}</td>
        <td>${f.professor?.nome}</td>
        <td>${f.disciplina?.sigla} - ${f.disciplina?.nome}</td>
        <td>${f.texto}</td>
        <td>${new Date(f.dataRegistro).toLocaleString("pt-BR")}</td>
        <td>
          <button class="btn btn-secondary btn-small" onclick="editFeedback(${f.id})">✏️ Editar</button>
          <button class="btn btn-danger btn-small" onclick="deleteFeedback(${f.id})">🗑️ Excluir</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function limparFiltrosFeedback() {
  document.getElementById("filtroFeedback").value = "";
  applyFeedbackFilters();
}


// Inicializar
renderizarProfessoresDestaque();