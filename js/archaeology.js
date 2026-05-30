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

const TOOLS = {
  shovel: {
    name: '铁锹',
    desc: '快速挖掘，适合深埋的文物',
    digSpeed: 3,
    depth: 'deep'
  },
  pickaxe: {
    name: '锄头',
    desc: '强力破碎土层，适合硬土',
    digSpeed: 2,
    depth: 'medium'
  },
  brush: {
    name: '刷子',
    desc: '精细清理，适合文物周围',
    digSpeed: 1,
    depth: 'surface'
  },
  detector: {
    name: '探测器',
    desc: '探测地下文物位置',
    digSpeed: 0,
    depth: 'all'
  }
};

let gameState = {
  totalSpots: 9,
  artifactSpots: [],
  foundArtifacts: [],
  collectedArtifacts: [],
  currentTool: 'shovel',
  digProgress: {}
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

function selectTool(tool) {
  gameState.currentTool = tool;
  document.querySelectorAll('.tool-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tool === tool);
  });
  showToolTip(tool);
}

function showToolTip(tool) {
  const tip = document.getElementById('toolTip');
  const toolInfo = TOOLS[tool];
  tip.innerHTML = `<strong>${toolInfo.name}</strong><br>${toolInfo.desc}`;
  tip.style.display = 'block';
  setTimeout(() => {
    tip.style.display = 'none';
  }, 2000);
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

  renderDigSpots();
  renderCollectionGrid();
  updateStats();
  selectTool(gameState.currentTool);
}

function resetGameState() {
  const numArtifacts = 3 + Math.floor(Math.random() * 2);
  const spots = Array.from({ length: 9 }, (_, i) => i);
  const shuffled = spots.sort(() => Math.random() - 0.5);
  gameState.artifactSpots = shuffled.slice(0, numArtifacts).map((spotIndex, i) => ({
    spotIndex,
    artifact: ARTIFACTS[i % ARTIFACTS.length],
    depth: ['deep', 'medium', 'surface'][Math.floor(Math.random() * 3)]
  }));
  gameState.foundArtifacts = [];
  gameState.collectedArtifacts = [];
  gameState.digProgress = {};
  gameState.currentTool = 'shovel';
  saveGame();
}

function saveGame() {
  const user = getUserInfo();
  if (user) {
    localStorage.setItem(`hebo_archaeology_${user.id}`, JSON.stringify(gameState));
  }
}

function renderDigSpots() {
  const container = document.getElementById('digSpots');
  container.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    const spot = document.createElement('div');
    spot.className = 'dig-spot';
    spot.dataset.index = i;

    const artifactData = gameState.artifactSpots.find(a => a.spotIndex === i);
    const progress = gameState.digProgress[i] || 0;

    if (gameState.foundArtifacts.includes(i)) {
      spot.classList.add('dug', 'found');
      if (artifactData) {
        spot.innerHTML = `
          <div class="artifact-glow"></div>
          <svg class="spot-artifact" viewBox="0 0 100 100">${artifactData.artifact.icon}</svg>
        `;
      }
      spot.onclick = () => showArtifactPreview(artifactData);
    } else {
      const depthClass = artifactData ? `depth-${artifactData.depth}` : '';
      spot.className = `dig-spot ${depthClass}`;
      spot.innerHTML = `
        <div class="dig-progress" style="height: ${progress}%"></div>
        <div class="spot-marker">?</div>
      `;
      spot.onclick = () => handleDig(i, artifactData);
    }

    container.appendChild(spot);
  }
}

function getDepthValue(depth) {
  switch(depth) {
    case 'deep': return 3;
    case 'medium': return 2;
    case 'surface': return 1;
    default: return 0;
  }
}

function handleDig(index, artifactData) {
  const tool = gameState.currentTool;

  if (tool === 'detector') {
    if (artifactData) {
      showToast('检测到文物信号！');
    } else {
      showToast('此处无文物');
    }
    return;
  }

  const toolInfo = TOOLS[tool];
  let progress = gameState.digProgress[index] || 0;
  const artifactDepth = artifactData ? getDepthValue(artifactData.depth) : 0;
  const toolPower = toolInfo.digSpeed;

  if (artifactData) {
    const requiredDepth = getDepthValue(artifactData.depth);
    if (toolPower < requiredDepth) {
      progress = Math.min(progress + toolPower * 8, 60);
      showToast('这个工具不太合适...');
    } else {
      progress = Math.min(progress + toolPower * 15, 100);
    }
  } else {
    progress = Math.min(progress + toolPower * 5, 40);
  }

  gameState.digProgress[index] = progress;
  saveGame();
  renderDigSpots();

  if (progress >= 100 && artifactData) {
    gameState.foundArtifacts.push(index);
    saveGame();
    renderDigSpots();
    showArtifactReveal(artifactData.artifact);
  } else if (progress >= 100 && !artifactData) {
    showToast('这里只有泥土...');
  } else if (progress >= 80 && artifactData) {
    showToast('快要挖到了！');
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
  renderDigSpots();
  renderCollectionGrid();
  updateStats();
  showToast('已重新开始挖掘！');
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