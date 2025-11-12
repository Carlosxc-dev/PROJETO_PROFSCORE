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
    showNotification('Seção de Disciplinas em desenvolvimento', 'warning');
    showSection('home');
  } else if (section === 'avaliacoes') {
    showNotification('Seção de Avaliações em desenvolvimento', 'warning');
    showSection('home');
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