const PUZZLE_IMAGES = [
  { id: 1, name: '滇王之印', path: '图片/滇王之印.png' },
  { id: 2, name: '滇国相印封泥', path: '图片/"滇国相印" 封泥.png' },
  { id: 3, name: '益州铭文瓦当', path: '图片/"益州" 铭文瓦当.png' },
  { id: 4, name: '官印封泥群', path: '图片/官印封泥群（益州郡体系）.png' },
  { id: 5, name: '汉代简牍', path: '图片/汉代简牍.png' }
];

let puzzleState = {
  size: 3,
  tiles: [],
  moves: 0,
  startTime: null,
  timer: null,
  currentImageIndex: 0,
  isCompleted: false,
  selectedPosition: null
};

function initPuzzle() {
  puzzleState.isCompleted = false;
  puzzleState.moves = 0;
  puzzleState.startTime = Date.now();
  puzzleState.selectedPosition = null;

  const totalTiles = puzzleState.size * puzzleState.size;
  puzzleState.tiles = [];

  for (let i = 0; i < totalTiles; i++) {
    puzzleState.tiles.push({
      id: i,
      currentPosition: i,
      correctPosition: i
    });
  }

  shuffleTiles();
  renderPuzzle();
  startTimer();
  updateStats();
}

function shuffleTiles() {
  const positions = puzzleState.tiles.map(function(t) { return t.currentPosition; });
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    var temp = positions[i];
    positions[i] = positions[j];
    positions[j] = temp;
  }
  puzzleState.tiles.forEach(function(tile, i) {
    tile.currentPosition = positions[i];
  });
}

function swapTiles(pos1, pos2) {
  const tile1 = puzzleState.tiles.find(function(t) { return t.currentPosition === pos1; });
  const tile2 = puzzleState.tiles.find(function(t) { return t.currentPosition === pos2; });

  if (tile1 && tile2) {
    var temp = tile1.currentPosition;
    tile1.currentPosition = tile2.currentPosition;
    tile2.currentPosition = temp;
  }
}

function renderPuzzle() {
  const grid = document.getElementById('puzzleGrid');
  if (!grid) return;

  grid.className = 'puzzle-grid size-' + puzzleState.size;
  grid.innerHTML = '';

  const image = PUZZLE_IMAGES[puzzleState.currentImageIndex];

  // 按 currentPosition 排序后渲染
  const sortedTiles = puzzleState.tiles.slice().sort(function(a, b) {
    return a.currentPosition - b.currentPosition;
  });

  sortedTiles.forEach(function(tile) {
    var tileElement = document.createElement('div');
    tileElement.className = 'puzzle-tile';
    if (puzzleState.selectedPosition !== null && puzzleState.selectedPosition === tile.currentPosition) {
      tileElement.classList.add('selected');
    }
    tileElement.dataset.position = tile.currentPosition;

    var row = Math.floor(tile.correctPosition / puzzleState.size);
    var col = tile.correctPosition % puzzleState.size;

    // 使用 img 标签裁剪，避免 background 边界重复
    tileElement.style.overflow = 'hidden';
    tileElement.style.position = 'relative';

    var img = document.createElement('img');
    img.src = image.path;
    img.alt = '';
    img.style.position = 'absolute';
    img.style.width = (puzzleState.size * 100) + '%';
    img.style.height = (puzzleState.size * 100) + '%';
    img.style.left = (-col * 100) + '%';
    img.style.top = (-row * 100) + '%';
    img.style.objectFit = 'fill';
    img.style.pointerEvents = 'none';
    img.draggable = false;

    tileElement.appendChild(img);
    tileElement.addEventListener('click', handleTileClick);
    grid.appendChild(tileElement);
  });
}

function handleTileClick(e) {
  if (puzzleState.isCompleted) return;

  var clickedPos = parseInt(e.currentTarget.dataset.position);

  if (puzzleState.selectedPosition === null) {
    puzzleState.selectedPosition = clickedPos;
    renderPuzzle();
  } else if (puzzleState.selectedPosition === clickedPos) {
    puzzleState.selectedPosition = null;
    renderPuzzle();
  } else {
    swapTiles(puzzleState.selectedPosition, clickedPos);
    puzzleState.moves++;
    puzzleState.selectedPosition = null;
    renderPuzzle();
    updateStats();
    checkWin();
  }
}

function checkWin() {
  var allCorrect = puzzleState.tiles.every(function(tile) {
    return tile.currentPosition === tile.correctPosition;
  });

  if (allCorrect && !puzzleState.isCompleted) {
    puzzleState.isCompleted = true;
    stopTimer();
    showWinModal();
  }
}

function showWinModal() {
  var modal = document.getElementById('winModal');

  var elapsed = Date.now() - puzzleState.startTime;
  var time = formatTime(elapsed);

  var winTime = document.getElementById('winTime');
  var winMoves = document.getElementById('winMoves');
  if (winTime) winTime.textContent = time;
  if (winMoves) winMoves.textContent = puzzleState.moves;

  if (typeof saveLevelResult === 'function') {
    var maxScore = puzzleState.size === 3 ? 100 : 200;
    var timeBonus = Math.max(0, maxScore - Math.floor(puzzleState.moves / 2));
    var score = Math.max(Math.floor(maxScore * 0.5), timeBonus);
    saveLevelResult(3, score, maxScore, elapsed);
  }

  modal.classList.remove('hidden');
}

function closeWinModal() {
  document.getElementById('winModal').classList.add('hidden');
}

function startTimer() {
  stopTimer();

  puzzleState.timer = setInterval(function() {
    var elapsed = Date.now() - puzzleState.startTime;
    document.getElementById('timerDisplay').textContent = formatTime(elapsed);
  }, 1000);
}

function stopTimer() {
  if (puzzleState.timer) {
    clearInterval(puzzleState.timer);
    puzzleState.timer = null;
  }
}

function formatTime(ms) {
  var seconds = Math.floor(ms / 1000);
  var minutes = Math.floor(seconds / 60);
  var remainingSeconds = seconds % 60;
  return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
}

function updateStats() {
  document.getElementById('moveDisplay').textContent = '步数: ' + puzzleState.moves;
  document.getElementById('gameScore').textContent = '用时: ' + document.getElementById('timerDisplay').textContent + ' | 步数: ' + puzzleState.moves;
}

function setDifficulty(size) {
  puzzleState.size = size;
  document.querySelectorAll('.difficulty-btn').forEach(function(btn) {
    btn.classList.toggle('active', parseInt(btn.dataset.size) === size);
  });
  initPuzzle();
}

function changeImage() {
  puzzleState.currentImageIndex = (puzzleState.currentImageIndex + 1) % PUZZLE_IMAGES.length;
  document.getElementById('currentImageLabel').textContent = PUZZLE_IMAGES[puzzleState.currentImageIndex].name;
  initPuzzle();
}

function resetPuzzle() {
  initPuzzle();
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('currentImageLabel').textContent = PUZZLE_IMAGES[0].name;
  initPuzzle();
});
