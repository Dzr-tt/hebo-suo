const ARTIFACTS = [
  {
    id: 1,
    name: '滇王金印',
    era: '汉代',
    desc: '滇王金印是汉代滇国权力的象征，证明古滇国存在的实物证据。印面刻有"滇王之印"四字，造型精美绝伦。',
    color: '#FFD700'
  },
  {
    id: 2,
    name: '青铜贮贝器',
    era: '战国',
    desc: '贮贝器是古滇国特有的青铜器物，用于储存海贝。器盖上铸有精美的祭祀场面，展现古滇国独特的宗教文化。',
    color: '#CD7F32'
  },
  {
    id: 3,
    name: '玉璧',
    era: '新石器时代',
    desc: '玉璧是古代礼器中的重要器物，象征天圆地方的宇宙观。此玉璧质地温润，雕工精细，体现先民高超的制玉技艺。',
    color: '#90EE90'
  },
  {
    id: 4,
    name: '铜鼓',
    era: '东汉',
    desc: '铜鼓是古代南方少数民族使用的打击乐器和祭祀重器，鼓面常刻有太阳纹、牛纹等图案，反映农耕文化特色。',
    color: '#B87333'
  },
  {
    id: 5,
    name: '牛头铜牌',
    era: '春秋',
    desc: '牛头铜牌是古滇国青铜器中的典型器物，造型写实生动，反映了滇池地区农耕文明对牛的崇拜。',
    color: '#8B4513'
  },
  {
    id: 6,
    name: '孔雀铜灯',
    era: '西汉',
    desc: '孔雀铜灯造型为一只开屏的孔雀，灯座设在孔雀背部，构思巧妙，既是实用器物又是艺术珍品。',
    color: '#228B22'
  },
  {
    id: 7,
    name: '舞蹈铜俑',
    era: '滇国',
    desc: '舞蹈铜俑生动展现古滇国人民的舞蹈场景，人物姿态优美，服饰独特，是研究古滇社会生活的重要资料。',
    color: '#DA70D6'
  },
  {
    id: 8,
    name: '蛙形铜器',
    era: '古滇',
    desc: '蛙形铜器是古滇文化特有的器物，蛙纹可能与古代雨神崇拜和生殖崇拜有关，反映了古滇人独特的宗教信仰。',
    color: '#20B2AA'
  }
];

const TOOLS = {
  detector: {
    name: '探测器',
    desc: '扫描地下文物位置',
    stage: 'scan'
  },
  shovel: {
    name: '铁锹',
    desc: '快速挖掘土层',
    stage: 'dig'
  },
  pickaxe: {
    name: '锄头',
    desc: '强力破碎硬土',
    stage: 'dig'
  },
  brush: {
    name: '刷子',
    desc: '精细清理文物',
    stage: 'reveal'
  }
};

const SPOT_STATES = {
  unexplored: 'unexplored',
  scanned: 'scanned',
  digging: 'digging',
  revealed: 'revealed',
  collected: 'collected'
};

let gameState = {
  artifacts: [],
  foundArtifacts: [],
  currentTool: 'detector',
  cursorX: 0,
  cursorY: 0
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

  const status = document.getElementById('digStatus');
  const statusIcon = status.querySelector('.status-icon');
  const statusText = status.querySelector('.status-text');

  switch(tool) {
    case 'detector':
      statusIcon.textContent = '🔍';
      statusText.textContent = '探测器 - 扫描地下文物';
      break;
    case 'shovel':
    case 'pickaxe':
      statusIcon.textContent = '⛏️';
      statusText.textContent = `${TOOLS[tool].name} - 挖掘土层`;
      break;
    case 'brush':
      statusIcon.textContent = '🖌️';
      statusText.textContent = '刷子 - 清理文物';
      break;
  }

  updateCursor();
}

function updateCursor() {
  const cursor = document.getElementById('digCursor');
  cursor.className = 'dig-cursor cursor-' + gameState.currentTool;
}

function initGame() {
  if (!checkLogin()) return;

  const user = getUserInfo();
  if (user) {
    const userData = localStorage.getItem(`hebo_archaeology_${user.id}`);
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.artifacts && Array.isArray(parsed.artifacts)) {
          gameState = parsed;
        } else {
          resetGameState();
        }
      } catch (e) {
        resetGameState();
      }
    } else {
      resetGameState();
    }
  } else {
    resetGameState();
  }

  renderArtifacts();
  renderCollectionGrid();
  updateStats();
  selectTool(gameState.currentTool || 'detector');
  setupGroundEvents();
}

function resetGameState() {
  const numArtifacts = 3 + Math.floor(Math.random() * 2);
  gameState.artifacts = [];

  for (let i = 0; i < numArtifacts; i++) {
    gameState.artifacts.push({
      id: Date.now() + i,
      artifact: ARTIFACTS[i % ARTIFACTS.length],
      x: 10 + Math.random() * 80,
      y: 20 + Math.random() * 60,
      state: SPOT_STATES.unexplored,
      digProgress: 0
    });
  }

  gameState.foundArtifacts = [];
  gameState.currentTool = 'detector';
  saveGame();
}

function saveGame() {
  const user = getUserInfo();
  if (user) {
    localStorage.setItem(`hebo_archaeology_${user.id}`, JSON.stringify(gameState));
  }
}

function setupGroundEvents() {
  const ground = document.getElementById('digGround');

  ground.addEventListener('mousemove', (e) => {
    const rect = ground.getBoundingClientRect();
    gameState.cursorX = ((e.clientX - rect.left) / rect.width) * 100;
    gameState.cursorY = ((e.clientY - rect.top) / rect.height) * 100;
    updateCursorPosition();
  });

  ground.addEventListener('click', (e) => {
    const rect = ground.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    handleDig(x, y);
  });

  ground.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = ground.getBoundingClientRect();
    const x = ((touch.clientX - rect.left) / rect.width) * 100;
    const y = ((touch.clientY - rect.top) / rect.height) * 100;
    handleDig(x, y);
  });
}

function updateCursorPosition() {
  const cursor = document.getElementById('digCursor');
  cursor.style.left = gameState.cursorX + '%';
  cursor.style.top = gameState.cursorY + '%';
}

function handleDig(x, y) {
  const tool = gameState.currentTool;
  const toolInfo = TOOLS[tool];

  let targetArtifact = null;
  let minDist = Infinity;

  for (const art of gameState.artifacts) {
    if (art.state === SPOT_STATES.collected) continue;

    const dist = Math.sqrt(Math.pow(art.x - x, 2) + Math.pow(art.y - y, 2));
    if (dist < 15 && dist < minDist) {
      minDist = dist;
      targetArtifact = art;
    }
  }

  switch(tool) {
    case 'detector':
      handleDetector(targetArtifact);
      break;
    case 'shovel':
    case 'pickaxe':
      handleDigging(targetArtifact, tool);
      break;
    case 'brush':
      handleReveal(targetArtifact);
      break;
  }
}

function handleDetector(targetArtifact) {
  if (targetArtifact) {
    if (targetArtifact.state === SPOT_STATES.unexplored) {
      targetArtifact.state = SPOT_STATES.scanned;
      saveGame();
      renderArtifacts();
      showToast('📍 发现文物信号！');
    } else {
      showToast('这里已经扫描过了');
    }
  } else {
    showToast('此处没有文物');
  }
}

function handleDigging(targetArtifact, tool) {
  if (!targetArtifact) {
    showToast('请先使用探测器找到文物位置');
    return;
  }

  if (targetArtifact.state === SPOT_STATES.unexplored) {
    showToast('请先用探测器扫描该位置');
    return;
  }

  if (targetArtifact.state === SPOT_STATES.revealed || targetArtifact.state === SPOT_STATES.collected) {
    showToast('这里已经挖完了');
    return;
  }

  const digSpeed = tool === 'shovel' ? 15 : 10;
  targetArtifact.digProgress = Math.min(targetArtifact.digProgress + digSpeed, 100);
  targetArtifact.state = SPOT_STATES.digging;
  saveGame();
  renderArtifacts();

  if (targetArtifact.digProgress >= 100) {
    showToast('土层已松动，请用刷子清理');
  } else if (targetArtifact.digProgress >= 50) {
    showToast('正在挖掘...');
  }
}

function handleReveal(targetArtifact) {
  if (!targetArtifact) {
    showToast('请先找到文物位置');
    return;
  }

  if (targetArtifact.state !== SPOT_STATES.digging) {
    if (targetArtifact.state === SPOT_STATES.unexplored) {
      showToast('请先用探测器定位');
    } else if (targetArtifact.state === SPOT_STATES.scanned) {
      showToast('请先用铁锹或锄头挖掘');
    } else if (targetArtifact.state === SPOT_STATES.revealed || targetArtifact.state === SPOT_STATES.collected) {
      showToast('文物已经清理出来了');
    }
    return;
  }

  targetArtifact.state = SPOT_STATES.revealed;
  targetArtifact.digProgress = 100;
  saveGame();
  renderArtifacts();
  showArtifactReveal(targetArtifact.artifact);
}

function renderArtifacts() {
  const container = document.getElementById('artifactMarkers');
  container.innerHTML = '';

  for (const art of gameState.artifacts) {
    const marker = document.createElement('div');
    marker.className = 'artifact-marker state-' + art.state;
    marker.style.left = art.x + '%';
    marker.style.top = art.y + '%';

    if (art.state === SPOT_STATES.unexplored) {
      marker.innerHTML = '<div class="marker-question">?</div>';
    } else if (art.state === SPOT_STATES.scanned) {
      marker.innerHTML = '<div class="marker-scan">📍</div>';
    } else if (art.state === SPOT_STATES.digging) {
      const progress = art.digProgress || 0;
      marker.innerHTML = `
        <div class="marker-dig">
          <div class="dig-progress-ring">
            <svg viewBox="0 0 36 36">
              <circle class="progress-bg" cx="18" cy="18" r="15"/>
              <circle class="progress-fill" cx="18" cy="18" r="15"
                stroke-dasharray="${progress} ${100 - progress}"
                stroke-dashoffset="25"/>
            </svg>
          </div>
        </div>
      `;
    } else if (art.state === SPOT_STATES.revealed) {
      marker.innerHTML = `
        <div class="marker-revealed" style="border-color: ${art.artifact.color}">
          <div class="artifact-icon" style="background: ${art.artifact.color}20; border-color: ${art.artifact.color}">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <circle cx="12" cy="12" r="8" fill="${art.artifact.color}"/>
            </svg>
          </div>
        </div>
      `;
      marker.onclick = () => showArtifactReveal(art.artifact);
    } else if (art.state === SPOT_STATES.collected) {
      marker.innerHTML = `<div class="marker-collected">✓</div>`;
    }

    container.appendChild(marker);
  }
}

function showArtifactReveal(artifact) {
  document.getElementById('overlay').classList.remove('hidden');
  document.getElementById('artifactReveal').classList.remove('hidden');

  const iconEl = document.getElementById('revealIcon');
  iconEl.innerHTML = `
    <circle cx="50" cy="50" r="40" fill="none" stroke="${artifact.color}" stroke-width="4"/>
    <circle cx="50" cy="50" r="25" fill="${artifact.color}" opacity="0.3"/>
    <circle cx="50" cy="50" r="12" fill="${artifact.color}"/>
  `;

  document.getElementById('revealName').textContent = artifact.name;
  document.getElementById('revealEra').textContent = artifact.era;
  document.getElementById('revealDesc').textContent = artifact.desc;
}

function closeReveal() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('artifactReveal').classList.add('hidden');

  const lastRevealed = gameState.artifacts.find(a => a.state === SPOT_STATES.revealed);
  if (lastRevealed) {
    lastRevealed.state = SPOT_STATES.collected;
    if (!gameState.foundArtifacts.find(f => f.id === lastRevealed.artifact.id)) {
      gameState.foundArtifacts.push(lastRevealed.artifact);
    }
    saveGame();
    renderArtifacts();
    renderCollectionGrid();
    updateStats();
  }
}

function renderCollectionGrid() {
  const grid = document.getElementById('collectionGrid');
  grid.innerHTML = '';

  gameState.artifacts.forEach((data) => {
    const item = document.createElement('div');
    const isFound = gameState.foundArtifacts.find(f => f.id === data.artifact.id);
    item.className = `collection-item ${isFound ? 'collected' : 'empty'}`;

    if (isFound) {
      item.innerHTML = `
        <div class="collection-icon-wrapper" style="border-color: ${data.artifact.color}">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <circle cx="12" cy="12" r="8" fill="${data.artifact.color}"/>
          </svg>
        </div>
        <span class="collection-name">${data.artifact.name}</span>
      `;
      item.onclick = () => showArtifactReveal(data.artifact);
    } else {
      item.innerHTML = `
        <div class="collection-icon-wrapper empty">
          <svg viewBox="0 0 24 24" width="32" height="32">
            <circle cx="12" cy="12" r="8" fill="none" stroke="var(--primary-bronze)" stroke-width="2" stroke-dasharray="4"/>
          </svg>
        </div>
        <span class="collection-name">???</span>
      `;
    }

    grid.appendChild(item);
  });
}

function updateStats() {
  document.getElementById('foundCount').textContent = gameState.foundArtifacts.length;
  document.getElementById('totalSpots').textContent = gameState.artifacts.length;
  document.getElementById('collectionCount').textContent = gameState.foundArtifacts.length;
}

function resetGame() {
  resetGameState();
  renderArtifacts();
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