const PROVINCE_DATA = {
  '中国': { id: 'mainland-path', count: 0 },
  '台湾': { id: 'taiwan', count: 0 },
  '海南': { id: 'hainan', count: 0 }
};

const SIMULATED_DATA = {
  '中国': 2856,
  '台湾': 52,
  '海南': 43
};

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

function initHeatmap() {
  updateUserButton();
  loadProvinceData();
  renderHeatmap();
  renderRanking();
  setupProvinceInteractions();
}

function loadProvinceData() {
  const storedData = localStorage.getItem('heboProvinces');

  if (storedData) {
    const userData = JSON.parse(storedData);
    Object.keys(PROVINCE_DATA).forEach(province => {
      if (userData[province]) {
        PROVINCE_DATA[province].count = SIMULATED_DATA[province] + userData[province];
      } else {
        PROVINCE_DATA[province].count = SIMULATED_DATA[province] || 0;
      }
    });
  } else {
    Object.keys(PROVINCE_DATA).forEach(province => {
      PROVINCE_DATA[province].count = SIMULATED_DATA[province] || 0;
    });
  }
}

function getHeatLevel(count, max, min) {
  if (count === 0) return 0;
  const range = max - min;
  if (range === 0) return 1;
  const level = Math.floor(((count - min) / range) * 4);
  return Math.min(4, Math.max(1, level));
}

function renderHeatmap() {
  const counts = Object.values(PROVINCE_DATA).map(p => p.count);
  const max = Math.max(...counts);
  const min = Math.min(...counts);

  Object.values(PROVINCE_DATA).forEach(province => {
    const element = document.getElementById(province.id);
    if (element) {
      element.classList.remove('level-1', 'level-2', 'level-3', 'level-4', 'level-5');
      if (province.count > 0) {
        const level = getHeatLevel(province.count, max, min);
        element.classList.add(`level-${level}`);
      }
      element.dataset.province = Object.keys(PROVINCE_DATA).find(k => PROVINCE_DATA[k].id === province.id);
      element.dataset.count = province.count;
    }
  });

  const total = counts.reduce((sum, c) => sum + c, 0);
  document.getElementById('totalVisitors').textContent = total.toLocaleString();
}

function renderRanking() {
  const sorted = Object.entries(PROVINCE_DATA)
    .filter(([_, data]) => data.count > 0)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 10);

  const list = document.getElementById('rankingList');

  if (sorted.length === 0) {
    list.innerHTML = '<li class="ranking-item"><span class="ranking-province">暂无数据</span></li>';
    return;
  }

  list.innerHTML = sorted.map(([name, data], index) => `
    <li class="ranking-item">
      <span class="ranking-rank">${index + 1}</span>
      <span class="ranking-province">${name}</span>
      <span class="ranking-count">${data.count}</span>
    </li>
  `).join('');
}

function setupProvinceInteractions() {
  Object.values(PROVINCE_DATA).forEach(province => {
    const element = document.getElementById(province.id);
    if (element) {
      element.addEventListener('click', () => showProvinceInfo(province));
      element.addEventListener('mouseenter', () => {
        element.style.cursor = 'pointer';
      });
    }
  });
}

function showProvinceInfo(province) {
  const user = getUserInfo();
  if (!user) {
    showToast('登录后查看更多信息');
    return;
  }

  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('provinceInfo').classList.remove('hidden');

  document.getElementById('infoProvinceName').textContent = province.id === 'mainland-path' ? '中国大陆' :
    Object.keys(PROVINCE_DATA).find(k => PROVINCE_DATA[k].id === province.id);
  document.getElementById('infoProvinceCount').textContent = province.count;
}

function closeProvinceInfo() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('provinceInfo').classList.add('hidden');
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

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

document.addEventListener('DOMContentLoaded', initHeatmap);