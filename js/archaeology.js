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
    image: '图片/滇王之印.png',
    color: '#FFD700'
  },
  {
    id: 2,
    name: '滇国相印封泥',
    era: '汉代',
    desc: '滇国相印封泥是古滇国行政体系的重要证据，展现了汉代益州郡的官僚制度，是研究古滇国政治制度的重要实物。',
    image: '图片/“滇国相印” 封泥.png',
    color: '#CD7F32'
  },
  {
    id: 3,
    name: '益州铭文瓦当',
    era: '汉代',
    desc: '益州铭文瓦当是汉代建筑构件，刻有"益州"二字，证明了益州郡的存在，展现了汉代在滇池地区的行政建设。',
    image: '图片/“益州” 铭文瓦当.png',
    color: '#8B6914'
  },
  {
    id: 4,
    name: '官印封泥群',
    era: '汉代',
    desc: '官印封泥群展现了益州郡体系的完整官僚架构，包括太守、县令等各级官员的封泥，是研究汉代地方行政制度的珍贵资料。',
    image: '图片/官印封泥群（益州郡体系）.png',
    color: '#708090'
  },
  {
    id: 5,
    name: '汉代简牍',
    era: '汉代',
    desc: '汉代简牍是古代书写载体，记录了当时的行政文书、法律条文等内容，是研究汉代益州郡社会治理的重要文献资料。',
    image: '图片/汉代简牍.png',
    color: '#9B7B3B'
  }
];

let gameState = {
  currentTool: 'detector',
  digSpots: [],
  foundCount: 0,
  selectedSpot: null,
  isInitialized: false,
  discoveredArtifactIds: []
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

function goHome() {
  window.location.href = 'index.html';
}

function initArchaeologyGame() {
  gameState.digSpots = [];
  gameState.foundCount = 0;
  gameState.selectedSpot = null;
  gameState.isInitialized = true;
  gameState.discoveredArtifactIds = [];

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
    showDistanceHint(minDistance, closestSpot, clickX, clickY, event.clientX, event.clientY);
  } else {
    showToolTip('所有文物已发现！', event.clientX, event.clientY);
  }
}

function revealArtifactSpot(spot) {
  spot.state = 'detected';

  const marker = document.getElementById(`spot-${spot.id}`);
  if (marker) {
    marker.style.left = `${spot.x}%`;
    marker.style.top = `${spot.y}%`;
    marker.classList.remove('hidden');
    marker.classList.add('detected');

    marker.onclick = () => handleMarkerClick(spot);
  }

  showToolTip('发现文物信号！切换到挖掘工具', event.clientX, event.clientY);
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
    if (spot.state === 'excavated') {
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

  const digGround = document.getElementById('digGround');
  if (digGround) {
    const hole = document.createElement('div');
    hole.className = 'excavation-hole';
    hole.id = `hole-${spot.id}`;
    hole.style.left = `${spot.x}%`;
    hole.style.top = `${spot.y}%`;
    digGround.appendChild(hole);
  }

  setTimeout(() => {
    spot.state = 'excavated';
    const markerEl = document.getElementById(`spot-${spot.id}`);
    if (markerEl) {
      markerEl.classList.remove('excavating');
      markerEl.classList.add('excavated');
    }
    showToolTip('挖掘完成！切换到刷子清理', event.clientX, event.clientY);
  }, 1500);
}

function cleanArtifact(spot) {
  spot.state = 'revealed';
  gameState.foundCount++;

  if (!gameState.discoveredArtifactIds.includes(spot.artifact.id)) {
    gameState.discoveredArtifactIds.push(spot.artifact.id);
  }

  const marker = document.getElementById(`spot-${spot.id}`);
  if (marker) {
    marker.classList.remove('excavated');
    marker.classList.add('revealed');
  }

  const hole = document.getElementById(`hole-${spot.id}`);
  if (hole) {
    hole.classList.add('cleaned');
    setTimeout(() => hole.remove(), 500);
  }

  showArtifactReveal(spot.artifact);
  saveToCollection(spot.artifact);
  updateUI();
}

function showArtifactReveal(artifact) {
  const overlay = document.getElementById('overlay');
  const reveal = document.getElementById('artifactReveal');

  if (!overlay || !reveal) return;

  document.getElementById('revealName').textContent = artifact.name;
  document.getElementById('revealEra').textContent = artifact.era;
  
  const revealImage = document.getElementById('revealImage');
  revealImage.src = artifact.image;
  revealImage.alt = artifact.name;
  revealImage.onerror = function() {
    this.style.display = 'none';
    this.parentElement.innerHTML = `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="${artifact.color}" stroke-width="4"/><text x="50" y="55" text-anchor="middle" font-size="24" fill="${artifact.color}">滇</text></svg>`;
  };

  overlay.classList.remove('hidden');
  reveal.classList.remove('hidden');
}

function closeReveal() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('artifactReveal').classList.add('hidden');
}

function closeAllModals() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('artifactReveal').classList.add('hidden');
  document.getElementById('artifactGallery').classList.add('hidden');
  document.getElementById('collectionView').classList.add('hidden');
}

function showDistanceHint(distance, spot, clickX, clickY, clientX, clientY) {
  let direction = '';
  const dx = spot.x - clickX;
  const dy = spot.y - clickY;

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  if (angle >= -22.5 && angle < 22.5) {
    direction = '右';
  } else if (angle >= 22.5 && angle < 67.5) {
    direction = '右下';
  } else if (angle >= 67.5 && angle < 112.5) {
    direction = '下';
  } else if (angle >= 112.5 && angle < 157.5) {
    direction = '左下';
  } else if (angle >= 157.5 || angle < -157.5) {
    direction = '左';
  } else if (angle >= -157.5 && angle < -112.5) {
    direction = '左上';
  } else if (angle >= -112.5 && angle < -67.5) {
    direction = '上';
  } else {
    direction = '右上';
  }

  let hint = '';
  if (distance <= 25) {
    hint = `探测器反应强烈！文物在${direction}方，很近了！`;
  } else if (distance <= 45) {
    hint = `探测器有感应！文物在${direction}方`;
  } else {
    hint = `探测器微弱响应，文物在${direction}方，继续搜索`;
  }

  showToolTip(hint, clientX, clientY);
}

function showScanEffect(event) {
  const digGround = document.getElementById('digGround');
  const effect = document.getElementById('scanEffect');

  if (!digGround || !effect) return;

  const rect = digGround.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  effect.innerHTML = `
    <div class="scan-ring" style="left: ${x}px; top: ${y}px;"></div>
    <div class="scan-ring" style="left: ${x}px; top: ${y}px; animation-delay: 0.2s;"></div>
    <div class="scan-ring" style="left: ${x}px; top: ${y}px; animation-delay: 0.4s;"></div>
  `;
}

function showToolTip(text, x, y) {
  const tip = document.getElementById('toolTip');
  if (!tip) return;

  tip.textContent = text;
  if (x !== undefined && y !== undefined) {
    tip.style.left = `${x + 15}px`;
    tip.style.top = `${y + 15}px`;
  } else {
    tip.style.left = '50%';
    tip.style.top = '50%';
    tip.style.transform = 'translate(-50%, -50%)';
  }
  tip.classList.add('show');
  setTimeout(() => tip.classList.remove('show'), 2500);
}

function viewArtifactGallery() {
  const overlay = document.getElementById('overlay');
  const gallery = document.getElementById('artifactGallery');
  const grid = document.getElementById('artifactGalleryGrid');

  if (!overlay || !gallery || !grid) return;

  grid.innerHTML = '';

  ARTIFACTS.forEach(artifact => {
    const isDiscovered = gameState.discoveredArtifactIds.includes(artifact.id);
    const card = document.createElement('div');
    card.className = `artifact-gallery-item ${isDiscovered ? 'discovered' : 'undiscovered'}`;
    card.innerHTML = `
      <div class="artifact-gallery-icon" style="border-color: ${artifact.color}">
        ${isDiscovered
          ? `<img src="${artifact.image}" alt="${artifact.name}" onerror="this.style.display='none'">`
          : `<svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="35" fill="none" stroke="${artifact.color}" stroke-width="3"/>
              <text x="50" y="55" text-anchor="middle" font-size="20" fill="${artifact.color}">?</text>
            </svg>`
        }
      </div>
      <span class="artifact-gallery-name">${artifact.name}</span>
    `;
    grid.appendChild(card);
  });

  overlay.classList.remove('hidden');
  gallery.classList.remove('hidden');
}

function closeArtifactGallery() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('artifactGallery').classList.add('hidden');
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
  const artifacts = user && user.collectedArtifacts ? user.collectedArtifacts : [];

  if (artifacts.length === 0) {
    grid.innerHTML = '<p style="text-align: center; color: #999; grid-column: 1/-1;">还没有收藏任何文物</p>';
  } else {
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
      card.onclick = function() {
        openImageZoom(artifact);
      };
      grid.appendChild(card);
    });
  }

  overlay.classList.remove('hidden');
  document.getElementById('collectionView').classList.remove('hidden');
}

function openImageZoom(artifact) {
  const overlay = document.getElementById('overlay');
  const zoomModal = document.getElementById('imageZoomModal');
  
  if (!overlay || !zoomModal) return;
  
  document.getElementById('zoomTitle').textContent = artifact.name;
  document.getElementById('zoomName').textContent = artifact.name;
  
  const zoomImage = document.getElementById('zoomImage');
  zoomImage.src = artifact.image;
  zoomImage.alt = artifact.name;
  zoomImage.onerror = function() {
    this.style.display = 'none';
    this.parentElement.innerHTML = `<svg viewBox="0 0 100 100" style="width: 200px; height: 200px;"><circle cx="50" cy="50" r="40" fill="none" stroke="${artifact.color}" stroke-width="4"/><text x="50" y="55" text-anchor="middle" font-size="32" fill="${artifact.color}">滇</text></svg><p style="color: #C9A227; margin-top: 12px;">${artifact.name}</p>`;
  };
  
  document.getElementById('collectionView').classList.add('hidden');
  zoomModal.classList.remove('hidden');
}

function closeImageZoom() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('imageZoomModal').classList.add('hidden');
}

function closeOverlay() {
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('collectionView').classList.add('hidden');
}

function resetGame() {
  document.querySelectorAll('.artifact-marker').forEach(marker => {
    marker.remove();
  });

  document.querySelectorAll('.excavation-hole').forEach(hole => {
    hole.remove();
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
  document.getElementById('artifactGallery').classList.add('hidden');
  document.getElementById('collectionView').classList.add('hidden');

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