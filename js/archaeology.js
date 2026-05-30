const ARTIFACTS = [
  {
    id: 1,
    name: '滇王金印',
    era: '汉代',
    desc: '滇王金印是汉代滇国权力的象征，证明古滇国存在的实物证据。印面刻有"滇王之印"四字，造型精美绝伦。',
    icon: '<circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="4"/><text x="50" y="60" text-anchor="middle" font-size="24" fill="currentColor">王</text>'
  },
  {
    id: 2,
    name: '青铜贮贝器',
    era: '战国',
    desc: '贮贝器是古滇国特有的青铜器物，用于储存海贝。器盖上铸有精美的祭祀场面，展现古滇国独特的宗教文化。',
    icon: '<ellipse cx="50" cy="60" rx="35" ry="25" fill="none" stroke="currentColor" stroke-width="3"/><ellipse cx="50" cy="35" rx="25" ry="15" fill="none" stroke="currentColor" stroke-width="3"/><line x1="50" y1="20" x2="50" y2="35" stroke="currentColor" stroke-width="3"/>'
  },
  {
    id: 3,
    name: '玉璧',
    era: '新石器时代',
    desc: '玉璧是古代礼器中的重要器物，象征天圆地方的宇宙观。此玉璧质地温润，雕工精细，体现先民高超的制玉技艺。',
    icon: '<circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="6"/><circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="3"/>'
  },
  {
    id: 4,
    name: '铜鼓',
    era: '东汉',
    desc: '铜鼓是古代南方少数民族使用的打击乐器和祭祀重器，鼓面常刻有太阳纹、牛纹等图案，反映农耕文化特色。',
    icon: '<ellipse cx="50" cy="50" rx="35" ry="20" fill="none" stroke="currentColor" stroke-width="3"/><ellipse cx="50" cy="50" rx="25" ry="12" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="50" cy="50" rx="10" ry="5" fill="currentColor"/>'
  },
  {
    id: 5,
    name: '牛头铜牌',
    era: '春秋',
    desc: '牛头铜牌是古滇国青铜器中的典型器物，造型写实生动，反映了滇池地区农耕文明对牛的崇拜。',
    icon: '<path d="M20 60 Q50 20 80 60 L75 70 L50 65 L25 70 Z" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="35" cy="50" r="5" fill="currentColor"/><circle cx="65" cy="50" r="5" fill="currentColor"/>'
  },
  {
    id: 6,
    name: '孔雀铜灯',
    era: '西汉',
    desc: '孔雀铜灯造型为一只开屏的孔雀，灯座设在孔雀背部，构思巧妙，既是实用器物又是艺术珍品。',
    icon: '<ellipse cx="50" cy="70" rx="20" ry="10" fill="none" stroke="currentColor" stroke-width="3"/><path d="M50 60 L50 40 M30 50 L50 40 L70 50 M25 55 L35 45 M65 55 L55 45" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="35" r="8" fill="currentColor"/>'
  },
  {
    id: 7,
    name: '舞蹈铜俑',
    era: '滇国',
    desc: '舞蹈铜俑生动展现古滇国人民的舞蹈场景，人物姿态优美，服饰独特，是研究古滇社会生活的重要资料。',
    icon: '<circle cx="50" cy="25" r="12" fill="none" stroke="currentColor" stroke-width="3"/><path d="M50 37 L50 60 M50 45 L30 55 M50 45 L70 55 M50 60 L35 80 M50 60 L65 80" stroke="currentColor" stroke-width="3"/>'
  },
  {
    id: 8,
    name: '蛙形铜器',
    era: '古滇',
    desc: '蛙形铜器是古滇文化特有的器物，蛙纹可能与古代雨神崇拜和生殖崇拜有关，反映了古滇人独特的宗教信仰。',
    icon: '<ellipse cx="50" cy="55" rx="30" ry="20" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="35" cy="45" r="6" fill="currentColor"/><circle cx="65" cy="45" r="6" fill="currentColor"/><path d="M25 65 L15 75 M75 65 L85 75" stroke="currentColor" stroke-width="3"/>'
  }
];

let gameState = {
  totalSpots: 16,
  artifactSpots: [],
  foundArtifacts: [],
  collectedArtifacts: []
};

function getUserInfo() {
  const data = localStorage.getItem('heboUser');
  return data ? JSON.parse(data) : null;
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
  updateUserButton();
  return true;
}

function updateUserButton() {
  const user = getUserInfo();
  const userBtn = document.getElementById('userBtn');
  if (userBtn && user) {
    userBtn.textContent = user.username;
  }
}

function initGame() {
  if (!checkLogin()) return;

  const user = getUserInfo();
  if (user) {
    const userData = localStorage.getItem(`hebo_archaeology_${user.id}`);
    if (userData) {
      gameState = JSON.parse(userData);
    } else {
      resetGameState();
    }
  } else {
    resetGameState();
  }

  renderDigGrid();
  renderCollectionGrid();
  updateStats();
}

function resetGameState() {
  const numArtifacts = 3 + Math.floor(Math.random() * 3);
  const spots = Array.from({ length: 16 }, (_, i) => i);
  const shuffled = spots.sort(() => Math.random() - 0.5);
  gameState.artifactSpots = shuffled.slice(0, numArtifacts).map((spotIndex, i) => ({
    spotIndex,
    artifact: ARTIFACTS[i % ARTIFACTS.length]
  }));
  gameState.foundArtifacts = [];
  gameState.collectedArtifacts = [];
  saveGame();
}

function saveGame() {
  const user = getUserInfo();
  if (user) {
    localStorage.setItem(`hebo_archaeology_${user.id}`, JSON.stringify(gameState));
  }
}

function renderDigGrid() {
  const grid = document.getElementById('digGrid');
  grid.innerHTML = '';

  for (let i = 0; i < 16; i++) {
    const spot = document.createElement('div');
    spot.className = 'dig-spot';
    spot.dataset.index = i;

    const artifactData = gameState.artifactSpots.find(a => a.spotIndex === i);

    if (gameState.foundArtifacts.includes(i)) {
      spot.classList.add('dug');
      if (artifactData) {
        spot.innerHTML = `<svg viewBox="0 0 24 24" style="width:60%;height:60%;fill:var(--accent-gold);"><circle cx="12" cy="12" r="10"/></svg>`;
      }
      spot.onclick = () => showArtifactPreview(artifactData);
    } else {
      spot.onclick = () => digSpot(i);
    }

    grid.appendChild(spot);
  }
}

function digSpot(index) {
  const artifactData = gameState.artifactSpots.find(a => a.spotIndex === index);

  if (artifactData && !gameState.foundArtifacts.includes(index)) {
    gameState.foundArtifacts.push(index);
    saveGame();
    renderDigGrid();
    showArtifactReveal(artifactData.artifact);
  } else {
    const spot = document.querySelector(`[data-index="${index}"]`);
    spot.style.transform = 'scale(0.95)';
    setTimeout(() => spot.style.transform = '', 150);
  }
}

function showArtifactReveal(artifact) {
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('artifactReveal').classList.remove('hidden');
  document.getElementById('revealIcon').innerHTML = artifact.icon;
  document.getElementById('revealName').textContent = artifact.name;
  document.getElementById('revealEra').textContent = artifact.era;
  document.getElementById('revealDesc').textContent = artifact.desc;
}

function closeReveal() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('artifactReveal').classList.add('hidden');
  renderCollectionGrid();
  updateStats();
}

function showArtifactPreview(artifactData) {
  if (!artifactData) return;
  showArtifactReveal(artifactData.artifact);
}

function renderCollectionGrid() {
  const grid = document.getElementById('collectionGrid');
  grid.innerHTML = '';

  gameState.artifactSpots.forEach((data, i) => {
    const item = document.createElement('div');
    const isFound = gameState.foundArtifacts.includes(data.spotIndex);
    item.className = `collection-item ${isFound ? 'collected' : 'empty'}`;

    if (isFound) {
      item.innerHTML = `<svg class="collection-icon" viewBox="0 0 100 100">${data.artifact.icon}</svg>`;
      item.onclick = () => showArtifactReveal(data.artifact);
    } else {
      item.innerHTML = `<svg class="collection-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4"/></svg>`;
    }

    grid.appendChild(item);
  });

  for (let i = gameState.artifactSpots.length; i < 8; i++) {
    const item = document.createElement('div');
    item.className = 'collection-item empty';
    item.innerHTML = `<svg class="collection-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4"/></svg>`;
    grid.appendChild(item);
  }

  document.getElementById('collectionCount').textContent = gameState.foundArtifacts.length;
}

function updateStats() {
  document.getElementById('foundCount').textContent = gameState.foundArtifacts.length;
  document.getElementById('totalSpots').textContent = gameState.artifactSpots.length;
}

function resetGame() {
  resetGameState();
  renderDigGrid();
  renderCollectionGrid();
  updateStats();
  showToast('游戏已重置!');
}

function viewCollection() {
  if (gameState.foundArtifacts.length === 0) {
    showToast('还没有发现任何文物!');
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

document.addEventListener('DOMContentLoaded', initGame);
