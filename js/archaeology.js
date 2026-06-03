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
    image: '图片/"滇国相印" 封泥.png',
    color: '#CD7F32'
  },
  {
    id: 3,
    name: '益州铭文瓦当',
    era: '汉代',
    desc: '益州铭文瓦当是汉代建筑构件，刻有"益州"二字，证明了益州郡的存在，展现了汉代在滇池地区的行政建设。',
    image: '图片/"益州" 铭文瓦当.png',
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

const SOIL_LAYERS = [
  {
    name: '表土层',
    era: '现代耕土',
    color: '#5D4037',
    texture: '#4E342E',
    desc: '现代耕土层，含有近现代陶瓷碎片和植物根系。这是考古发掘中首先遇到的层次，厚度约20-30厘米。'
  },
  {
    name: '扰乱层',
    era: '近现代扰动',
    color: '#6D4C41',
    texture: '#5D4037',
    desc: '近现代扰动层，土壤混杂，可能含有明清时期的遗物。地层学上称为"扰乱层"，是后期人类活动扰动形成的。'
  },
  {
    name: '汉代文化层',
    era: '汉代 · 益州郡',
    color: '#8D6E63',
    texture: '#795548',
    desc: '汉代文化堆积层，含有大量陶片、瓦当、铁器残片。这是益州郡最繁荣时期留下的文化遗存，见证了古滇国的辉煌。'
  },
  {
    name: '青铜时代层',
    era: '战国-西汉',
    color: '#A1887F',
    texture: '#8D6E63',
    desc: '青铜时代文化层，含有青铜器残片、贝币、石器。古滇国先民在此生活了数百年，创造了灿烂的青铜文明。'
  },
  {
    name: '生土层',
    era: '史前沉积',
    color: '#BCAAA4',
    texture: '#A1887F',
    desc: '原生土层，未经人类扰动的自然沉积。考古发掘到此为止，下方即是基岩，也是埋藏珍贵文物的最后一道屏障。'
  }
];

let gameState = {
  targetArtifact: null,
  discoveredArtifactIds: [],
  startTime: null,
  isCompleted: false
};

let digGame = {
  canvas: null,
  ctx: null,
  layers: SOIL_LAYERS,
  currentLayer: 0,
  isDrawing: false,
  width: 0,
  height: 0,
  lastPos: null
};

function getUserInfo() {
  try {
    const user = localStorage.getItem('heboUser');
    if (user) return JSON.parse(user);
  } catch (e) {}
  return null;
}

function goHome() {
  window.location.href = 'index.html';
}

function initArchaeologyGame() {
  gameState.targetArtifact = ARTIFACTS[Math.floor(Math.random() * ARTIFACTS.length)];
  gameState.startTime = Date.now();
  gameState.isCompleted = false;

  const artifactImg = document.getElementById('targetArtifact');
  if (artifactImg) {
    artifactImg.src = gameState.targetArtifact.image;
    artifactImg.alt = gameState.targetArtifact.name;
  }

  const artifactName = document.getElementById('targetArtifactName');
  if (artifactName) artifactName.textContent = gameState.targetArtifact.name;

  digGame.currentLayer = 0;
  digGame.isDrawing = false;

  initCanvas();
  showLayerInfo(SOIL_LAYERS[0]);
  updateProgress();
}

function initCanvas() {
  digGame.canvas = document.getElementById('digCanvas');
  if (!digGame.canvas) return;

  digGame.ctx = digGame.canvas.getContext('2d');

  requestAnimationFrame(function() {
    resizeCanvas();
    drawCurrentLayer();
    bindDigEvents();
  });
}

function resizeCanvas() {
  var canvas = digGame.canvas;
  var container = document.getElementById('digScene');
  if (!canvas || !container) return;

  var rect = container.getBoundingClientRect();
  var size = Math.max(1, Math.round(rect.width));

  if (size < 10) {
    var parent = container.parentElement;
    if (parent) {
      size = Math.max(300, Math.round(Math.min(parent.getBoundingClientRect().width, 400)));
    } else {
      size = 400;
    }
  }

  container.style.height = size + 'px';
  canvas.width = size;
  canvas.height = size;
  digGame.width = size;
  digGame.height = size;
}

function drawCurrentLayer() {
  var ctx = digGame.ctx;
  if (!ctx) return;
  var layer = digGame.layers[digGame.currentLayer];

  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = layer.color;
  ctx.fillRect(0, 0, digGame.width, digGame.height);

  addSoilTexture(ctx, digGame.width, digGame.height, layer.texture);

  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.font = 'bold 22px "Microsoft YaHei", "Noto Serif SC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(layer.name, digGame.width / 2, digGame.height / 2 - 10);

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.font = '13px "Microsoft YaHei", sans-serif';
  ctx.fillText('第 ' + (digGame.currentLayer + 1) + ' / ' + digGame.layers.length + ' 层', digGame.width / 2, digGame.height / 2 + 20);
}

function addSoilTexture(ctx, w, h, baseColor) {
  for (var i = 0; i < 400; i++) {
    var x = Math.random() * w;
    var y = Math.random() * h;
    var size = Math.random() * 3 + 0.5;
    ctx.fillStyle = 'rgba(0,0,0,' + (Math.random() * 0.12) + ')';
    ctx.fillRect(x, y, size, size);
  }
  for (var i = 0; i < 200; i++) {
    var x = Math.random() * w;
    var y = Math.random() * h;
    var size = Math.random() * 2 + 0.3;
    ctx.fillStyle = 'rgba(255,255,255,' + (Math.random() * 0.06) + ')';
    ctx.fillRect(x, y, size, size);
  }

  for (var i = 0; i < 8; i++) {
    var x = Math.random() * w;
    var y = Math.random() * h;
    var r = Math.random() * 2 + 1;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(139,105,20,' + (Math.random() * 0.15) + ')';
    ctx.fill();
  }
}

function getDigPos(e) {
  const rect = digGame.canvas.getBoundingClientRect();
  const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
  const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function scratch(pos) {
  const ctx = digGame.ctx;

  ctx.globalCompositeOperation = 'destination-out';

  ctx.beginPath();
  ctx.arc(pos.x, pos.y, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(pos.x + (Math.random() - 0.5) * 8, pos.y + (Math.random() - 0.5) * 8, 12, 0, Math.PI * 2);
  ctx.fill();

  if (digGame.lastPos) {
    const dx = pos.x - digGame.lastPos.x;
    const dy = pos.y - digGame.lastPos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const steps = Math.max(1, Math.floor(dist / 8));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const ix = digGame.lastPos.x + dx * t;
      const iy = digGame.lastPos.y + dy * t;
      ctx.beginPath();
      ctx.arc(ix, iy, 24, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  digGame.lastPos = { x: pos.x, y: pos.y };
  ctx.globalCompositeOperation = 'source-over';
}

function checkProgress() {
  if (digGame.currentLayer >= digGame.layers.length) return;

  digGame.lastPos = null;

  const w = digGame.width;
  const h = digGame.height;
  const imageData = digGame.ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  let transparentPixels = 0;

  const sampleStep = 4;
  for (let y = 0; y < h; y += sampleStep) {
    for (let x = 0; x < w; x += sampleStep) {
      const idx = (y * w + x) * 4 + 3;
      if (data[idx] < 100) transparentPixels++;
    }
  }

  const totalSamples = (w / sampleStep) * (h / sampleStep);
  const percent = transparentPixels / totalSamples;

  if (percent > 0.42) {
    nextLayer();
  }
}

function nextLayer() {
  digGame.currentLayer++;

  if (digGame.currentLayer >= digGame.layers.length) {
    digGame.ctx.clearRect(0, 0, digGame.width, digGame.height);
    showArtifactReveal(gameState.targetArtifact);
    showArtifactFound();
  } else {
    drawCurrentLayer();
    showLayerInfo(digGame.layers[digGame.currentLayer]);
    updateProgress();
  }
}

function showLayerInfo(layer) {
  const panel = document.getElementById('layerInfo');
  if (!panel) return;

  panel.innerHTML =
    '<div class="layer-tag">' + layer.name + '</div>' +
    '<div class="layer-era">' + layer.era + '</div>' +
    '<div class="layer-desc">' + layer.desc + '</div>';

  panel.classList.remove('hidden');
  panel.style.animation = 'none';
  panel.offsetHeight;
  panel.style.animation = 'slideUp 0.5s ease';
}

function updateProgress() {
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  if (!bar || !text) return;

  const percent = Math.round((digGame.currentLayer / digGame.layers.length) * 100);
  bar.style.width = percent + '%';
  text.textContent = '发掘进度：' + percent + '%';
}

function showArtifactFound() {
  const panel = document.getElementById('layerInfo');
  if (panel) {
    panel.innerHTML =
      '<div class="layer-tag" style="color:#FFD700;font-size:1.1rem;">🏆 重大发现</div>' +
      '<div class="layer-desc">你在生土层下方发现了 <strong>' + gameState.targetArtifact.name + '</strong>！<br>这是汉代益州郡的重要文物！</div>';
  }

  if (!gameState.discoveredArtifactIds.includes(gameState.targetArtifact.id)) {
    gameState.discoveredArtifactIds.push(gameState.targetArtifact.id);
  }

  saveToCollection(gameState.targetArtifact);

  if (typeof saveLevelResult === 'function' && !gameState.isCompleted) {
    gameState.isCompleted = true;
    var elapsed = gameState.startTime ? (Date.now() - gameState.startTime) : 0;
    saveLevelResult(2, 100, 100, elapsed);
  }

  setTimeout(function() {
    var overlay = document.getElementById('completeOverlay');
    if (overlay) overlay.classList.remove('hidden');
  }, 2000);
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
  revealImage.style.display = 'block';
  revealImage.onerror = function() {
    this.style.display = 'none';
    this.parentElement.innerHTML = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="none" stroke="' + artifact.color + '" stroke-width="4"/><text x="50" y="55" text-anchor="middle" font-size="24" fill="' + artifact.color + '">滇</text></svg>';
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

function bindDigEvents() {
  const canvas = digGame.canvas;
  if (!canvas) return;
  if (digGame._eventsBound) return;
  digGame._eventsBound = true;

  function isInsideCanvas(e) {
    var rect = canvas.getBoundingClientRect();
    var cx = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    var cy = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    return cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
  }

  canvas.addEventListener('mousedown', function(e) {
    e.preventDefault();
    digGame.isDrawing = true;
    digGame.lastPos = getDigPos(e);
    scratch(digGame.lastPos);
  });

  window.addEventListener('mousemove', function(e) {
    if (!digGame.isDrawing) return;
    if (isInsideCanvas(e)) {
      scratch(getDigPos(e));
    }
  });

  window.addEventListener('mouseup', function() {
    if (digGame.isDrawing) {
      digGame.isDrawing = false;
      digGame.lastPos = null;
      checkProgress();
    }
  });

  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    digGame.isDrawing = true;
    digGame.lastPos = getDigPos(e);
    scratch(digGame.lastPos);
  }, { passive: false });

  document.addEventListener('touchmove', function(e) {
    if (!digGame.isDrawing) return;
    e.preventDefault();
    if (isInsideCanvas(e)) {
      scratch(getDigPos(e));
    }
  }, { passive: false });

  document.addEventListener('touchend', function(e) {
    if (!digGame.isDrawing) return;
    e.preventDefault();
    digGame.isDrawing = false;
    digGame.lastPos = null;
    checkProgress();
  }, { passive: false });

  canvas.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });
}

function showToolTip(text, x, y) {
  const tip = document.getElementById('toolTip');
  if (!tip) return;
  tip.textContent = text;
  if (x !== undefined && y !== undefined) {
    tip.style.left = (x + 15) + 'px';
    tip.style.top = (y + 15) + 'px';
    tip.style.transform = 'none';
  } else {
    tip.style.left = '50%';
    tip.style.top = '50%';
    tip.style.transform = 'translate(-50%, -50%)';
  }
  tip.classList.add('show');
  setTimeout(function() { tip.classList.remove('show'); }, 2500);
}

function viewArtifactGallery() {
  const overlay = document.getElementById('overlay');
  const gallery = document.getElementById('artifactGallery');
  const grid = document.getElementById('artifactGalleryGrid');

  if (!overlay || !gallery || !grid) return;

  grid.innerHTML = '';

  ARTIFACTS.forEach(function(artifact) {
    var isDiscovered = gameState.discoveredArtifactIds.includes(artifact.id);
    var card = document.createElement('div');
    card.className = 'artifact-gallery-item ' + (isDiscovered ? 'discovered' : 'undiscovered');

    var iconDiv = document.createElement('div');
    iconDiv.className = 'artifact-gallery-icon';
    iconDiv.style.borderColor = artifact.color;

    if (isDiscovered) {
      var img = document.createElement('img');
      img.src = artifact.image;
      img.alt = artifact.name;
      img.onerror = function() { this.style.display = 'none'; };
      iconDiv.appendChild(img);
    } else {
      iconDiv.innerHTML = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none" stroke="' + artifact.color + '" stroke-width="3"/><text x="50" y="55" text-anchor="middle" font-size="20" fill="' + artifact.color + '">?</text></svg>';
    }

    var nameSpan = document.createElement('span');
    nameSpan.className = 'artifact-gallery-name';
    nameSpan.textContent = artifact.name;

    card.appendChild(iconDiv);
    card.appendChild(nameSpan);
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
  const userIndex = users.findIndex(function(u) { return u.username === user.username; });

  if (userIndex !== -1) {
    if (!users[userIndex].collectedArtifacts) {
      users[userIndex].collectedArtifacts = [];
    }
    var exists = users[userIndex].collectedArtifacts.find(function(a) { return a.id === artifact.id; });
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
  var el = document.getElementById('collectionCount');
  if (el) el.textContent = count;
}

function viewCollection() {
  const overlay = document.getElementById('overlay');
  const grid = document.getElementById('collectionGrid');

  if (!overlay || !grid) return;

  grid.innerHTML = '';

  const user = getUserInfo();
  const artifacts = user && user.collectedArtifacts ? user.collectedArtifacts : [];

  if (artifacts.length === 0) {
    grid.innerHTML = '<p style="text-align:center;color:#999;grid-column:1/-1;">还没有收藏任何文物</p>';
  } else {
    artifacts.forEach(function(artifact) {
      var card = document.createElement('div');
      card.className = 'collection-card';

      var iconDiv = document.createElement('div');
      iconDiv.className = 'artifact-icon';
      iconDiv.style.borderColor = artifact.color;

      var img = document.createElement('img');
      img.src = artifact.image;
      img.alt = artifact.name;
      img.onerror = function() {
        this.style.display = 'none';
        var svgHtml = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="35" fill="none" stroke="' + artifact.color + '" stroke-width="3"/><text x="50" y="55" text-anchor="middle" font-size="20" fill="' + artifact.color + '">滇</text></svg>';
        this.parentElement.innerHTML = svgHtml;
      };
      iconDiv.appendChild(img);

      var nameEl = document.createElement('h4');
      nameEl.className = 'artifact-name';
      nameEl.textContent = artifact.name;

      var eraEl = document.createElement('p');
      eraEl.className = 'artifact-era';
      eraEl.textContent = artifact.era;

      card.appendChild(iconDiv);
      card.appendChild(nameEl);
      card.appendChild(eraEl);
      card.onclick = function() { openImageZoom(artifact); };
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
  zoomImage.style.display = 'block';
  zoomImage.onerror = function() {
    this.style.display = 'none';
    this.parentElement.innerHTML = '<svg viewBox="0 0 100 100" style="width:200px;height:200px;"><circle cx="50" cy="50" r="40" fill="none" stroke="' + artifact.color + '" stroke-width="4"/><text x="50" y="55" text-anchor="middle" font-size="32" fill="' + artifact.color + '">滇</text></svg><p style="color:#C9A227;margin-top:12px;">' + artifact.name + '</p>';
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
  document.getElementById('overlay').classList.add('hidden');
  document.getElementById('artifactReveal').classList.add('hidden');
  document.getElementById('artifactGallery').classList.add('hidden');
  document.getElementById('collectionView').classList.add('hidden');
  document.getElementById('completeOverlay').classList.add('hidden');

  var panel = document.getElementById('layerInfo');
  if (panel) panel.classList.add('hidden');

  initArchaeologyGame();
}

window.addEventListener('resize', function() {
  if (digGame.canvas && digGame.currentLayer < digGame.layers.length) {
    resizeCanvas();
    drawCurrentLayer();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  initArchaeologyGame();
});
