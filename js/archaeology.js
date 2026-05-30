function getUserInfo() {
  try {
    const user = localStorage.getItem('heboUser');
    if (user) {
      const userData = JSON.parse(user);
      if (userData && userData.username) {
        return userData;
      }
    }
  } catch (e) {
    console.error('Failed to parse user info:', e);
  }
  return null;
}

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

const archaeologyState = {
  currentTool: 'detector',
  digSpots: [],
  foundArtifacts: [],
  currentArtifact: null,
  selectedSpot: null,
  gamePhase: 'scan',
  foundCount: 0,
  totalSpots: 3
};

function selectTool(tool) {
  archaeologyState.currentTool = tool;
  document.querySelectorAll('.tool-item').forEach(item => {
    item.classList.toggle('active', item.dataset.tool === tool);
  });

  const statusText = document.querySelector('.status-text');
  const statusIcon = document.querySelector('.status-icon');

  switch(tool) {
    case 'detector':
      statusText.textContent = '选择探测器扫描土地';
      statusIcon.textContent = '🔍';
      break;
    case 'shovel':
      statusText.textContent = '选择铁锹挖掘文物';
      statusIcon.textContent = '⛏️';
      break;
    case 'pickaxe':
      statusText.textContent = '选择锄头挖掘文物';
      statusIcon.textContent = '🔨';
      break;
    case 'brush':
      statusText.textContent = '选择刷子清理文物';
      statusIcon.textContent = '🖌️';
      break;
  }

  const digGround = document.getElementById('digGround');
  if (digGround) {
    if (tool === 'detector') {
      digGround.style.cursor = 'crosshair';
    } else if (archaeologyState.selectedSpot !== null) {
      digGround.style.cursor = 'pointer';
    } else {
      digGround.style.cursor = 'not-allowed';
    }
  }
}

function onDigGroundClick(e) {
  console.log('digGround clicked, tool:', archaeologyState.currentTool);
  if (archaeologyState.currentTool === 'detector') {
    handleScan(e);
  }
}

function initGame() {
  archaeologyState.digSpots = [];
  archaeologyState.foundArtifacts = [];
  archaeologyState.currentArtifact = null;
  archaeologyState.selectedSpot = null;
  archaeologyState.foundCount = 0;
  archaeologyState.gamePhase = 'scan';

  const grid = document.getElementById('artifactMarkers');
  if (grid) grid.innerHTML = '';

  const shuffledArtifacts = [...ARTIFACTS].sort(() => Math.random() - 0.5);
  const selectedArtifacts = shuffledArtifacts.slice(0, archaeologyState.totalSpots);

  for (let i = 0; i < archaeologyState.totalSpots; i++) {
    const spot = {
      id: i,
      x: 15 + Math.random() * 70,
      y: 20 + Math.random() * 50,
      artifact: selectedArtifacts[i],
      state: 'hidden'
    };
    archaeologyState.digSpots.push(spot);

    const marker = document.createElement('div');
    marker.className = 'artifact-marker hidden';
    marker.id = `spot-${i}`;
    marker.style.left = `${spot.x}%`;
    marker.style.top = `${spot.y}%`;
    marker.onclick = (e) => handleSpotClick(i, e);
    grid.appendChild(marker);
  }

  const foundCountEl = document.getElementById('foundCount');
  if (foundCountEl) foundCountEl.textContent = '0';
  selectTool('detector');
  updateCollectionCount();

  const digGround = document.getElementById('digGround');
  if (digGround) {
    digGround.removeEventListener('click', onDigGroundClick);
    digGround.addEventListener('click', onDigGroundClick);
  }
  
  console.log('Game initialized with', archaeologyState.digSpots.length, 'artifact spots');
  archaeologyState.digSpots.forEach((spot, i) => {
    console.log('Spot', i, 'at position:', spot.x + '%', spot.y + '%');
  });
}

function handleScan(e) {
  const rect = e.target.getBoundingClientRect();
  const clickX = ((e.clientX - rect.left) / rect.width) * 100;
  const clickY = ((e.clientY - rect.top) / rect.height) * 100;

  showScanEffect(e);

  const scanRadius = 12;
  let foundSpot = null;
  let closestSpot = null;
  let minDistance = Infinity;
  let closestDirection = '';

  archaeologyState.digSpots.forEach((spot) => {
    if (spot.state === 'hidden') {
      const distance = Math.sqrt(Math.pow(clickX - spot.x, 2) + Math.pow(clickY - spot.y, 2));
      
      if (distance <= scanRadius) {
        foundSpot = spot;
      }
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSpot = spot;
        
        const dx = spot.x - clickX;
        const dy = spot.y - clickY;
        
        if (Math.abs(dx) > Math.abs(dy)) {
          closestDirection = dx > 0 ? '右' : '左';
        } else {
          closestDirection = dy > 0 ? '下' : '上';
        }
        
        if (Math.abs(dx) > 30 && Math.abs(dy) > 30) {
          if (dx > 0 && dy > 0) closestDirection = '右下';
          else if (dx > 0 && dy < 0) closestDirection = '右上';
          else if (dx < 0 && dy > 0) closestDirection = '左下';
          else closestDirection = '左上';
        }
      }
    }
  });

  if (foundSpot) {
    setTimeout(() => {
      foundSpot.state = 'detected';
      const marker = document.getElementById(`spot-${foundSpot.id}`);
      if (marker) {
        marker.classList.remove('hidden');
        marker.classList.add('detected');
        showToolTip('发现文物信号！切换到挖掘工具');
      }
    }, 600);
  } else if (closestSpot) {
    setTimeout(() => {
      let hintText = '';
      if (minDistance <= 20) {
        hintText = `探测器有微弱反应！文物在${closestDirection}方，很近了~`;
      } else if (minDistance <= 35) {
        hintText = `探测器有感应！文物在${closestDirection}方，距离适中`;
      } else if (minDistance <= 50) {
        hintText = `探测器轻微响应，文物在${closestDirection}方，还有段距离`;
      } else {
        hintText = `探测器无响应，文物在${closestDirection}方，较远`;
      }
      showToolTip(hintText);
    }, 600);
  } else {
    setTimeout(() => {
      showToolTip('未发现文物，继续探索...');
    }, 600);
  }
}

function handleSpotClick(spotIndex, event) {
  event.stopPropagation();
  const spot = archaeologyState.digSpots[spotIndex];

  if (archaeologyState.currentTool === 'detector') {
    if (spot.state === 'hidden') {
      spot.state = 'detected';
      const marker = document.getElementById(`spot-${spotIndex}`);
      if (marker) {
        marker.classList.remove('hidden');
        marker.classList.add('detected');
        showToolTip('发现文物信号！切换到挖掘工具');
      }
    }
  } else if (archaeologyState.currentTool === 'shovel' || archaeologyState.currentTool === 'pickaxe') {
    if (spot.state === 'detected') {
      spot.state = 'excavating';
      archaeologyState.selectedSpot = spotIndex;
      archaeologyState.currentArtifact = spot.artifact;

      const marker = document.getElementById(`spot-${spotIndex}`);
      if (marker) {
        marker.classList.add('excavating');
      }

      setTimeout(() => {
        spot.state = 'brushing';
        const markerEl = document.getElementById(`spot-${spotIndex}`);
        if (markerEl) {
          markerEl.classList.remove('excavating');
          markerEl.classList.add('brushing');
        }
        showToolTip('发现文物！切换到刷子清理');
      }, 1200);
    }
  } else if (archaeologyState.currentTool === 'brush') {
    if (spot.state === 'brushing') {
      spot.state = 'revealed';
      archaeologyState.selectedSpot = spotIndex;
      archaeologyState.currentArtifact = spot.artifact;

      const marker = document.getElementById(`spot-${spotIndex}`);
      if (marker) {
        marker.classList.add('revealed');
      }

      showArtifactReveal(spot.artifact);
    }
  }
}

function showScanEffect(e) {
  const rect = e.target.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const effect = document.getElementById('scanEffect');
  if (effect) {
    effect.style.left = `${x - 50}px`;
    effect.style.top = `${y - 50}px`;
    effect.classList.add('active');

    setTimeout(() => {
      effect.classList.remove('active');
    }, 600);
  }
}

function showToolTip(text) {
  const tip = document.getElementById('toolTip');
  if (tip) {
    tip.textContent = text;
    tip.classList.add('show');
    setTimeout(() => {
      tip.classList.remove('show');
    }, 2000);
  }
}

function showArtifactReveal(artifact) {
  const overlay = document.getElementById('overlay');
  const reveal = document.getElementById('artifactReveal');
  const icon = document.getElementById('revealIcon');
  const name = document.getElementById('revealName');
  const era = document.getElementById('revealEra');
  const desc = document.getElementById('revealDesc');

  if (!overlay || !reveal || !icon || !name || !era || !desc) return;

  icon.innerHTML = `
    <defs>
      <linearGradient id="artifactGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${artifact.color};stop-opacity:1"/>
        <stop offset="100%" style="stop-color:#8B6914;stop-opacity:1"/>
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="40" fill="none" stroke="url(#artifactGrad)" stroke-width="4"/>
    <circle cx="50" cy="50" r="30" fill="none" stroke="url(#artifactGrad)" stroke-width="2"/>
    <text x="50" y="45" text-anchor="middle" font-size="12" fill="${artifact.color}">滇</text>
    <text x="50" y="60" text-anchor="middle" font-size="8" fill="${artifact.color}">滇</text>
  `;

  name.textContent = artifact.name;
  era.textContent = artifact.era;
  desc.textContent = artifact.desc;

  overlay.classList.remove('hidden');
  reveal.classList.remove('hidden');
}

function closeReveal() {
  const overlay = document.getElementById('overlay');
  const reveal = document.getElementById('artifactReveal');

  if (overlay) overlay.classList.add('hidden');
  if (reveal) reveal.classList.add('hidden');

  if (archaeologyState.currentArtifact) {
    archaeologyState.foundArtifacts.push(archaeologyState.currentArtifact);
    archaeologyState.foundCount++;
    const foundCountEl = document.getElementById('foundCount');
    if (foundCountEl) foundCountEl.textContent = archaeologyState.foundCount;
    updateCollectionCount();

    saveCollection();
  }

  archaeologyState.selectedSpot = null;
  archaeologyState.currentArtifact = null;
}

function saveCollection() {
  const user = getUserInfo();
  if (user) {
    const users = JSON.parse(localStorage.getItem('heboUsers') || '[]');
    const userIndex = users.findIndex(u => u.username === user.username);
    if (userIndex !== -1) {
      if (!users[userIndex].collectedArtifacts) {
        users[userIndex].collectedArtifacts = [];
      }
      archaeologyState.foundArtifacts.forEach(artifact => {
        const exists = users[userIndex].collectedArtifacts.find(a => a.id === artifact.id);
        if (!exists) {
          users[userIndex].collectedArtifacts.push(artifact);
        }
      });
      localStorage.setItem('heboUsers', JSON.stringify(users));
      localStorage.setItem('heboUser', JSON.stringify(users[userIndex]));
    }
  }
}

function updateCollectionCount() {
  const user = getUserInfo();
  let count = 0;
  if (user && user.collectedArtifacts) {
    count = user.collectedArtifacts.length;
  }
  const collectionCountEl = document.getElementById('collectionCount');
  if (collectionCountEl) collectionCountEl.textContent = count;
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
        <img src="${artifact.image}" alt="${artifact.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<svg viewBox=&quot;0 0 100 100&quot;><circle cx=&quot;50&quot; cy=&quot;50&quot; r=&quot;35&quot; fill=&quot;none&quot; stroke=&quot;${artifact.color}&quot; stroke-width=&quot;3&quot;/><text x=&quot;50&quot; y=&quot;55&quot; text-anchor=&quot;middle&quot; font-size=&quot;20&quot; fill=&quot;${artifact.color}&quot;>滇</text></svg>';">
      </div>
      <h4 class="artifact-name">${artifact.name}</h4>
      <p class="artifact-era">${artifact.era}</p>
    `;
    grid.appendChild(card);
  });

  overlay.classList.remove('hidden');
  overlay.onclick = () => {
    overlay.classList.add('hidden');
  };
}

function resetGame() {
  document.querySelectorAll('.artifact-marker').forEach(marker => {
    marker.classList.remove('detected', 'excavating', 'brushing', 'revealed');
    marker.classList.add('hidden');
  });

  archaeologyState.digSpots.forEach(spot => {
    spot.state = 'hidden';
  });

  archaeologyState.foundCount = 0;
  archaeologyState.selectedSpot = null;
  archaeologyState.currentArtifact = null;

  const foundCountEl = document.getElementById('foundCount');
  if (foundCountEl) foundCountEl.textContent = '0';

  const overlay = document.getElementById('overlay');
  const reveal = document.getElementById('artifactReveal');
  if (overlay) overlay.classList.add('hidden');
  if (reveal) reveal.classList.add('hidden');

  initGame();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('digGround')) {
    initGame();
  }
});