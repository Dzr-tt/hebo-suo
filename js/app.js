function getUserInfo() {
  try {
    const data = localStorage.getItem('heboUser');
    if (!data) return null;
    const user = JSON.parse(data);
    return user && user.username ? user : null;
  } catch (e) {
    console.error('获取用户信息失败:', e);
    return null;
  }
}

function updateUserButton() {
  const user = getUserInfo();
  const userBtn = document.getElementById('userBtn');
  const userInfo = document.getElementById('userInfo');
  
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
      // 添加用户信息显示
      if (userInfo) {
        const existingDetails = userInfo.querySelector('.user-details');
        if (existingDetails) existingDetails.remove();
        const userDetails = document.createElement('div');
        userDetails.className = 'user-details';
        userDetails.innerHTML = `
          <span class="user-province">${user.province}</span>
          <div class="user-score">
            <span>考古: ${user.score.archaeology}</span>
            <span>拼图: ${user.score.puzzle}</span>
            <span>问答: ${user.score.quiz}</span>
          </div>
        `;
        userInfo.appendChild(userDetails);
      }
    } else {
      userBtn.textContent = '登录';
      userBtn.onclick = () => window.location.href = 'auth.html';
      // 移除用户信息
      const userDetails = document.querySelector('.user-details');
      if (userDetails) userDetails.remove();
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
  const user = getUserInfo();
  if (!user) {
    showToast('请先登录');
    setTimeout(() => {
      window.location.href = 'auth.html';
    }, 1500);
    return;
  }
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
  updateUserButton();
});