function getUserInfo() {
  const data = localStorage.getItem('heboUser');
  return data ? JSON.parse(data) : null;
}

function updateUserButton() {
  const user = getUserInfo();
  const userBtn = document.getElementById('userBtn');
  if (userBtn) {
    if (user) {
      userBtn.textContent = user.username;
      userBtn.onclick = () => {
        if (confirm('确定要退出登录吗?')) {
          localStorage.removeItem('heboUser');
          updateUserButton();
          showToast('已退出登录');
        }
      };
    } else {
      userBtn.textContent = '登录';
      userBtn.onclick = () => window.location.href = 'auth.html';
    }
  }
}

function handleUserAction() {
  const user = getUserInfo();
  if (user) {
    if (confirm('确定要退出登录吗?')) {
      localStorage.removeItem('heboUser');
      updateUserButton();
      showToast('已退出登录');
    }
  } else {
    window.location.href = 'auth.html';
  }
}

function navigateTo(page) {
  window.location.href = page;
}

function checkLogin() {
  const user = getUserInfo();
  if (!user) {
    showToast('请先登录');
    setTimeout(() => {
      window.location.href = 'auth.html';
    }, 1000);
    return false;
  }
  return true;
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
  updateUserButton();
});
