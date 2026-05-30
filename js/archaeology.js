const ARTIFACTS = [
  {
    id: 1,
    name: '滇王之印',
    era: '汉代',
    desc: '滇王金印是汉代滇国权力的象征，证明古滇国存在的实物证据。印面刻有"滇王之印"四字，造型精美绝伦。',
    image: 'images/滇王之印.png',
    color: '#FFD700'
  },
  {
    id: 2,
    name: '滇国相印封泥',
    era: '汉代',
    desc: '滇国相印封泥是古滇国行政体系的重要证据，展现了汉代益州郡的官僚制度，是研究古滇国政治制度的重要实物。',
    image: 'images/“滇国相印” 封泥.png',
    color: '#CD7F32'
  },
  {
    id: 3,
    name: '益州铭文瓦当',
    era: '汉代',
    desc: '益州铭文瓦当是汉代建筑构件，刻有"益州"二字，证明了益州郡的存在，展现了汉代在滇池地区的行政建设。',
    image: 'images/“益州” 铭文瓦当.png',
    color: '#8B6914'
  },
  {
    id: 4,
    name: '官印封泥群',
    era: '汉代',
    desc: '官印封泥群展现了益州郡体系的完整官僚架构，包括太守、县令等各级官员的封泥，是研究汉代地方行政制度的珍贵资料。',
    image: 'images/官印封泥群（益州郡体系）.png',
    color: '#708090'
  },
  {
    id: 5,
    name: '汉代简牍',
    era: '汉代',
    desc: '汉代简牍是古代书写载体，记录了当时的行政文书、法律条文等内容，是研究汉代益州郡社会治理的重要文献资料。',
    image: 'images/汉代简牍.png',
    color: '#9B7B3B'
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
        if (parsed.version && parsed.version === 3) {
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
  gameState.version = 3;
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
      handleDetector(targetArtifact, x, y);
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

function handleDetector(targetArtifact, x, y) {
  const scanEffect = document.getElementById('scanEffect');
  scanEffect.classList.add('scanning');

  const ring = document.createElement('div');
  ring.className = 'scan-ring';
  ring.style.left = x + '%';
  ring.style.top = y + '%';
  scanEffect.appendChild(ring);

  setTimeout(() => ring.remove(), 1000);

  if (targetArtifact) {
    if (targetArtifact.state === SPOT_STATES.unexplored) {
      setTimeout(() => {
        const success = document.createElement('div');
        success.className = 'scan-success';
        success.style.left = targetArtifact.x + '%';
        success.style.top = targetArtifact.y + '%';
        success.innerHTML = '📍';
        success.style.fontSize = '2rem';
        scanEffect.appendChild(success);

        setTimeout(() => success.remove(), 1000);
      }, 300);

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

  setTimeout(() => {
    scanEffect.classList.remove('scanning');
  }, 1000);
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

  const revealContent = document.getElementById('artifactReveal');
  const existingImage = revealContent.querySelector('.artifact-real-image');
  if (existingImage) existingImage.remove();

  const imgElement = document.createElement('img');
  imgElement.className = 'artifact-real-image';
  imgElement.src = artifact.image;
  imgElement.alt = artifact.name;
  imgElement.style.cssText = 'width: 180px; height: 180px; object-fit: contain; border-radius: 12px; border: 3px solid var(--primary-bronze); margin-bottom: 16px; background: rgba(26, 21, 16, 0.6);';
  
  revealContent.insertBefore(imgElement, revealContent.firstChild);

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
          <img src="${data.artifact.image}" alt="${data.artifact.name}" style="width: 48px; height: 48px; object-fit: contain; border-radius: 8px;">
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