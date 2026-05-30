const STORAGE_KEYS = {
  USERS: 'heboUsers',
  CURRENT_USER: 'heboUser'
};

function showTab(tab) {
  const tabs = document.querySelectorAll('.tab');
  const loginForm = document.getElementById('formLogin');
  const registerForm = document.getElementById('formRegister');

  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'login') {
    document.getElementById('tabLogin').classList.add('active');
    loginForm.classList.add('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.remove('active');
    registerForm.classList.add('hidden');
  } else {
    document.getElementById('tabRegister').classList.add('active');
    registerForm.classList.add('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.remove('active');
    loginForm.classList.add('hidden');
  }
}

function getUsers() {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function togglePassword(fieldId) {
  const field = document.getElementById(fieldId);
  const type = field.type === 'password' ? 'text' : 'password';
  field.type = type;
}

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value;

  if (!username || !password) {
    showToast('请填写用户名和密码', 'error');
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    showToast('登录成功!', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } else {
    showToast('用户名或密码错误', 'error');
  }
}

function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById('regUser').value.trim();
  const password = document.getElementById('regPass').value;
  const province = document.getElementById('regProvince').value;

  if (!username || !password || !province) {
    showToast('请填写所有字段', 'error');
    return;
  }

  if (username.length < 4 || username.length > 20) {
    showToast('用户名需要4-20个字符', 'error');
    return;
  }

  const users = getUsers();

  if (users.find(u => u.username === username)) {
    showToast('用户名已存在', 'error');
    return;
  }

  const newUser = {
    id: Date.now(),
    username,
    password,
    province,
    createdAt: new Date().toISOString(),
    score: {
      archaeology: 0,
      puzzle: 0,
      quiz: 0
    },
    collectedArtifacts: []
  };

  users.push(newUser);
  saveUsers(users);

  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));

  showToast('注册成功!', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1500);
}

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  if (user) {
    window.location.href = 'index.html';
    return;
  }
});