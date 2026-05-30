const GAME_CONFIG = {
  totalArtifacts: 3,
  scanRadius: 15,
  maxDistance: 100
};

const ARTIFACTS = [
  {
    id: 1,
    name: '滇王之印',
    era: '汉代',
    desc: '滇王金印是汉代滇国权力的象征，证明古滇国存在的实物证据。印面刻有"滇王之印"四字，造型精美绝伦。',
    image: 'images/dianwang_zhiyin.png',
    color: '#FFD700'
  },
  {
    id: 2,
    name: '滇国相印封泥',
    era: '汉代',
    desc: '滇国相印封泥是古滇国行政体系的重要证据，展现了汉代益州郡的官僚制度，是研究古滇国政治制度的重要实物。',
    image: 'images/dianguo_xiangyin.png',
    color: '#CD7F32'
  },
  {
    id: 3,
    name: '益州铭文瓦当',
    era: '汉代',
    desc: '益州铭文瓦当是汉代建筑构件，刻有"益州"二字，证明了益州郡的存在，展现了汉代在滇池地区的行政建设。',
    image: 'images/yizhou_wadang.png',
    color: '#8B6914'
  },
  {
    id: 4,
    name: '官印封泥群',
    era: '汉代',
    desc: '官印封泥群展现了益州郡体系的完整官僚架构，包括太守、县令等各级官员的封泥，是研究汉代地方行政制度的珍贵资料。',
    image: 'images/guanyin_fengni.png',
    color: '#708090'
  },
  {
    id: 5,
    name: '汉代简牍',
    era: '汉代',
    desc: '汉代简牍是古代书写载体，记录了当时的行政文书、法律条文等内容，是研究汉代益州郡社会治理的重要文献资料。',
    image: 'images/handai_jiandu.png',
    color: '#9B7B3B'
  }
];

let gameState = {
  currentTool: 'detector',
  digSpots: [],
  foundCount: 0,
  selectedSpot: null,
  isInitialized: false
};

function getUserInfo() {
  try {
    const user = localStorage.getItem('heboUser');
    if (user) {
      return JSON.parse(user);
    }
  } catch (e) {
    console.error('获取用户信息失败:', e);
  }
  return null;
}

function initArchaeologyGame() {
  gameState.digSpots = [];
  gameState.foundCount = 0;
  gameState.selectedSpot = null;
  gameState.isInitialized = true;

  const shuffled = [...ARTIFACTS].sort(() => Math.random() - 0.5);
  const selectedArtifacts = shuffled.slice(0, GAME_CONFIG.totalArtifacts);

  for (let i = 0; i < GAME_CONFIG.totalArtifacts; i++) {
    gameState.digSpots.push({
      id: i,
      x: 10 + Math.random() * 80,
      y: 15 + Math.random() * 70,
      artifact: selectedArtifacts[i],
      state: 'hidden'
    });
  }

  updateUI();
  bindEvents();
  console.log('考古游戏初始化完成，文物位置:', gameState.digSpots);
}

function updateUI() {
  document.getElementById('foundCount').textContent = gameState.foundCount;
  document.getElementById('totalSpots').textContent = GAME_CONFIG.totalArtifacts;
  updateCollectionCount();
  updateToolStatus();
}

function updateToolStatus() {
  const statusText = document.querySelector('.status-text');
  const statusIcon = document.querySelector('.status-icon');
  
  const toolInfo = {
    detector: { icon: '🔍', text: '选择探测器扫描土地' },
    shovel: { icon: '⛏️', text: '选择铁锹挖掘文物' },
    pickaxe: { icon: '🔨', text: '选择锄头挖掘文物' },
    brush: { icon: '🖌️', text: '选择刷子清理文物' }
  };
  
  const info = toolInfo[gameState.currentTool];
  if (statusIcon) statusIcon.textContent = info.icon;
  if (statusText) statusText.textContent = info.text;
}

function selectTool(tool) {
  gameState.currentTool = tool;
  
  document.querySelectorAll('.tool-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tool === tool);
  });
  
  updateToolStatus();
  
  const digGround = document.getElementById('digGround');
  if (digGround) {
    digGround.style.cursor = tool === 'detector' ? 'crosshair' : 'pointer';
  }
}

function bindEvents() {
  const digGround = document.getElementById('digGround');
  if (digGround) {
    digGround.addEventListener('click', handleGroundClick);
    console.log('事件绑定成功');
  } else {
    console.error('digGround 元素不存在');
  }
}

function handleGroundClick(event) {
  console.log('点击土地，工具:', gameState.currentTool);
  
  if (gameState.currentTool === 'detector') {
    performScan(event);
  }
}

function performScan(event) {
  const digGround = document.getElementById('digGround');
  if (!digGround) return;
  
  const rect = digGround.getBoundingClientRect();
  const clickX = ((event.clientX - rect.left) / rect.width) * 100;
  const clickY = ((event.clientY - rect.top) / rect.height) * 100;
  
  showScanEffect(event);
  
  let foundSpot = null;
  let closestSpot = null;
  let minDistance = GAME_CONFIG.maxDistance;
  
  gameState.digSpots.forEach(spot => {
    if (spot.state === 'hidden') {
      const distance = Math.sqrt(Math.pow(clickX - spot.x, 2) + Math.pow(clickY - spot.y, 2));
      
      if (distance <= GAME_CONFIG.scanRadius) {
        foundSpot = spot;
      }
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSpot = spot;
      }
    }
  });
  
  if (foundSpot) {
    setTimeout(() => revealArtifactSpot(foundSpot), 500);
  } else if (closestSpot) {
    showDistanceHint(minDistance, closestSpot);
  } else {
    showToolTip('未发现文物，继续探索...');
  }
}

function revealArtifactSpot(spot) {
  spot.state = 'detected';
  
  const marker = document.getElementById(`spot-${spot.id}`);
  if (marker) {
    marker.classList.remove('hidden');
    marker.classList.add('detected');
    
    marker.onclick = () => handleMarkerClick(spot);
  }
  
  showToolTip('发现文物信号！切换到挖掘工具');
}

function handleMarkerClick(spot) {
  if (gameState.currentTool === 'detector') {
    if (spot.state === 'hidden') {
      revealArtifactSpot(spot);
    }
  } else if (gameState.currentTool === 'shovel' || gameState.currentTool === 'pickaxe') {
    if (spot.state === 'detected') {
      startExcavation(spot);
    }
  } else if (gameState.currentTool === 'brush') {
    if (spot.state === 'excavating') {
      cleanArtifact(spot);
    }
  }
}

function startExcavation(spot) {
  spot.state = 'excavating';
  
  const marker = document.getElementById(`spot-${spot.id}`);
  if (marker) {
    marker.classList.remove('detected');
    marker.classList.add('excavating');
  }
  
  showToolTip('正在挖掘...');
  
  setTimeout(() => {
    spot.state = 'excavated';
    const markerEl = document.getElementById(`spot-${spot.id}`);
    if (markerEl) {
      markerEl.classList.remove('excavating');
      markerEl.classList.add('excavated');
    }
    showToolTip('挖掘完成！切换到刷子清理');
  }, 1500);
}

function cleanArtifact(spot) {
  spot.state = 'revealed';
  gameState.foundCount++;
  
  const marker = document.getElementById(`spot-${spot.id}`);
  if (marker) {
    marker.classList.remove('excavated');
    marker.classList.add('revealed');
  }
  
  showArtifactInfo(spot.artifact);
  saveToCollection(spot.artifact);
  updateUI();
}

function showDistanceHint(distance, spot) {
  let direction = '';
  const dx = spot.x - 50;
  const dy = spot.y - 50;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    direction = dx > 0 ? '右' : '左';
  } else {
    direction = dy > 0 ? '下' : '上';
  }
  
  let hint = '';
  if (distance <= 25) {
    hint = `探测器反应强烈！文物在${direction}方，很近了！`;
  } else if (distance <= 45) {
    hint = `探测器有感应！文物在${direction}方`;
  } else {
    hint = `探测器微弱响应，文物在${direction}方，继续搜索`;
  }
  
  showToolTip(hint);
}

function showScanEffect(event) {
  const digGround = document.getElementById('digGround');
  const effect = document.getElementById('scanEffect');
  
  if (!digGround || !effect) return;
  
  const rect = digGround.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  
  effect.style.left = `${x - 50}px`;
  effect.style.top = `${y - 50}px`;
  effect.classList.add('active');
  
  setTimeout(() => effect.classList.remove('active'), 600);
}

function showToolTip(text) {
  const tip = document.getElementById('toolTip');
  if (!tip) return;
  
  tip.textContent = text;
  tip.classList.add('show');
  setTimeout(() => tip.classList.remove('show'), 2500);
}

function showArtifactInfo(artifact) {
  const overlay = document.getElementById('overlay');
  const reveal = document.getElementById('artifactReveal');
  
  if (!overlay || !reveal) return;
  
  document.getElementById('revealName').textContent = artifact.name;
  document.getElementById('revealEra').textContent = artifact.era;
  document.getElementById('revealDesc').textContent = artifact.desc;
  
  document.getElementById('revealIcon').innerHTML = `
    <defs>
      <linearGradient id="grad-${artifact.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${artifact.color}"/>
        <stop offset="100%" stop-color="#8B6914"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad-${artifact.id})" stroke-width="4"/>
    <circle cx="50" cy="50" r="30" fill="none" stroke="url(#grad-${artifact.id})" stroke-width="2"/>
    <text x="50" y="55" text-anchor="middle" font-size="24" fill="${artifact.color}">滇</text>
  `;
  
  overlay.classList.remove('hidden');
  reveal.classList.remove('hidden');
}

function closeReveal() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('artifactReveal').classList.add('hidden');
}

function saveToCollection(artifact) {
  const user = getUserInfo();
  if (!user) return;
  
  const users = JSON.parse(localStorage.getItem('heboUsers') || '[]');
  const userIndex = users.findIndex(u => u.username === user.username);
  
  if (userIndex !== -1) {
    if (!users[userIndex].collectedArtifacts) {
      users[userIndex].collectedArtifacts = [];
    }
    
    const exists = users[userIndex].collectedArtifacts.find(a => a.id === artifact.id);
    if (!exists) {
      users[userIndex].collectedArtifacts.push(artifact);
      localStorage.setItem('heboUsers', JSON.stringify(users));
      localStorage.setItem('heboUser', JSON.stringify(users[userIndex]));
    }
  }
}

function updateCollectionCount() {
  const user = getUserInfo();
  const count = user && user.collectedArtifacts ? user.collectedArtifacts.length : 0;
  document.getElementById('collectionCount').textContent = count;
}

function viewCollection() {
  const overlay = document.getElementById('overlay');
  const grid = document.getElementById('collectionGrid');
  
  if (!overlay || !grid) return;
  
  grid.innerHTML = '';
  
  const user = getUserInfo();
  const artifacts = user && user.collectedArtifacts ? user.collectedArtifacts : ARTIFACTS;
  
  artifacts.forEach(artifact => {
    const card = document.createElement('div');
    card.className = 'collection-card';
    card.innerHTML = `
      <div class="artifact-icon" style="border-color: ${artifact.color}">
        <img src="${artifact.image}" alt="${artifact.name}" 
          onerror="this.style.display='none'; this.parentElement.innerHTML='<svg viewBox=&quot;0 0 100 100&quot;><circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;35&quot; fill=&quot;none&quot; stroke=&quot;${artifact.color}&quot; stroke-width=&quot;3&quot;/><text x=&quot;50&quot; y=&quot;55&quot; text-anchor=&quot;middle&quot; font-size=&quot;20&quot; fill=&quot;${artifact.color}&quot;>滇</text></svg>';">
      </div>
      <h4 class="artifact-name">${artifact.name}</h4>
      <p class="artifact-era">${artifact.era}</p>
    `;
    grid.appendChild(card);
  });
  
  overlay.classList.remove('hidden');
  overlay.onclick = () => overlay.classList.add('hidden');
}

function resetGame() {
  document.querySelectorAll('.artifact-marker').forEach(marker => {
    marker.remove();
  });
  
  const markersContainer = document.getElementById('artifactMarkers');
  if (markersContainer) {
    for (let i = 0; i < GAME_CONFIG.totalArtifacts; i++) {
      const marker = document.createElement('div');
      marker.className = 'artifact-marker hidden';
      marker.id = `spot-${i}`;
      markersContainer.appendChild(marker);
    }
  }
  
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('artifactReveal').classList.add('hidden');
  
  initArchaeologyGame();
}

document.addEventListener('DOMContentLoaded', () => {
  const markersContainer = document.getElementById('artifactMarkers');
  if (markersContainer) {
    for (let i = 0; i < GAME_CONFIG.totalArtifacts; i++) {
      const marker = document.createElement('div');
      marker.className = 'artifact-marker hidden';
      marker.id = `spot-${i}`;
      markersContainer.appendChild(marker);
    }
  }
  
  initArchaeologyGame();
});