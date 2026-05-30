function switchTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  tabs.forEach(t => t.classList.remove('active'));

  if (tab === 'login') {
    document.querySelector('[data-tab="login"]').classList.add('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    document.querySelector('[data-tab="register"]').classList.add('active');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
}

function getUsers() {
  const data = localStorage.getItem('heboUsers');
  return data ? JSON.parse(data) : [];
}

function saveUsers(users) {
  localStorage.setItem('heboUsers', JSON.stringify(users));
}

function getProvincesData() {
  const data = localStorage.getItem('heboProvinces');
  return data ? JSON.parse(data) : {};
}

function saveProvincesData(data) {
  localStorage.setItem('heboProvinces', JSON.stringify(data));
}

function handleLogin(event) {
  event.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!username || !password) {
    showToast('请填写所有字段');
    return;
  }

  const users = getUsers();
  const user = users.find(u =>
    (u.username === username || u.email === username) && u.password === password
  );

  if (user) {
    localStorage.setItem('heboUser', JSON.stringify(user));
    showToast('登录成功!');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  } else {
    showToast('用户名或密码错误');
  }
}

function handleRegister(event) {
  event.preventDefault();

  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const province = document.getElementById('regProvince').value;

  if (!username || !email || !password || !confirmPassword || !province) {
    showToast('请填写所有字段');
    return;
  }

  if (username.length < 4 || username.length > 20) {
    showToast('用户名需要4-20个字符');
    return;
  }

  if (password.length < 6) {
    showToast('密码至少需要6位');
    return;
  }

  if (password !== confirmPassword) {
    showToast('两次密码输入不一致');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('请输入有效的邮箱地址');
    return;
  }

  const users = getUsers();

  if (users.find(u => u.username === username)) {
    showToast('用户名已存在');
    return;
  }

  if (users.find(u => u.email === email)) {
    showToast('邮箱已被注册');
    return;
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    province,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  let provincesData = getProvincesData();
  provincesData[province] = (provincesData[province] || 0) + 1;
  saveProvincesData(provincesData);

  localStorage.setItem('heboUser', JSON.stringify(newUser));

  showToast('注册成功!');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
}

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('heboUser');
  if (user) {
    window.location.href = 'index.html';
  }
});
