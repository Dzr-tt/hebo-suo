const PUZZLE_IMAGES = [
  { id: 1, name: '滇王之印', path: '图片/滇王之印.png' },
  { id: 2, name: '滇国相印封泥', path: '图片/“滇国相印” 封泥.png' },
  { id: 3, name: '益州铭文瓦当', path: '图片/“益州” 铭文瓦当.png' },
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
  isCompleted: false
};

function initPuzzle() {
  puzzleState.isCompleted = false;
  puzzleState.moves = 0;
  puzzleState.startTime = Date.now();
  puzzleState.tiles = [];
  
  const totalTiles = puzzleState.size * puzzleState.size;
  
  for (let i = 0; i < totalTiles; i++) {
    puzzleState.tiles.push({
      id: i,
      currentPosition: i,
      correctPosition: i,
      isEmpty: i === totalTiles - 1
    });
  }
  
  shuffleTiles();
  renderPuzzle();
  startTimer();
  updateStats();
}

function shuffleTiles() {
  const totalTiles = puzzleState.tiles.length;
  const emptyIndex = totalTiles - 1;
  
  let shuffleCount = 0;
  const maxShuffles = 1000;
  
  while (shuffleCount < maxShuffles) {
    const possibleMoves = [];
    const emptyPos = puzzleState.tiles.find(t => t.isEmpty).currentPosition;
    const row = Math.floor(emptyPos / puzzleState.size);
    const col = emptyPos % puzzleState.size;
    
    if (row > 0) possibleMoves.push(emptyPos - puzzleState.size);
    if (row < puzzleState.size - 1) possibleMoves.push(emptyPos + puzzleState.size);
    if (col > 0) possibleMoves.push(emptyPos - 1);
    if (col < puzzleState.size - 1) possibleMoves.push(emptyPos + 1);
    
    const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    
    swapTiles(emptyPos, randomMove);
    shuffleCount++;
  }
  
  if (!isSolvable()) {
    swapTiles(0, 1);
  }
}

function isSolvable() {
  let inversions = 0;
  const tilesWithoutEmpty = puzzleState.tiles.filter(t => !t.isEmpty);
  
  for (let i = 0; i < tilesWithoutEmpty.length; i++) {
    for (let j = i + 1; j < tilesWithoutEmpty.length; j++) {
      if (tilesWithoutEmpty[i].correctPosition > tilesWithoutEmpty[j].correctPosition) {
        inversions++;
      }
    }
  }
  
  if (puzzleState.size % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    const emptyRowFromBottom = puzzleState.size - Math.floor(puzzleState.tiles.find(t => t.isEmpty).currentPosition / puzzleState.size);
    return (inversions + emptyRowFromBottom) % 2 === 1;
  }
}

function swapTiles(pos1, pos2) {
  const tile1 = puzzleState.tiles.find(t => t.currentPosition === pos1);
  const tile2 = puzzleState.tiles.find(t => t.currentPosition === pos2);
  
  if (tile1 && tile2) {
    const temp = tile1.currentPosition;
    tile1.currentPosition = tile2.currentPosition;
    tile2.currentPosition = temp;
  }
}

function renderPuzzle() {
  const grid = document.getElementById('puzzleGrid');
  if (!grid) return;
  
  grid.className = `puzzle-grid size-${puzzleState.size}`;
  grid.innerHTML = '';
  
  const image = PUZZLE_IMAGES[puzzleState.currentImageIndex];
  const pieceSize = 100 / puzzleState.size;
  
  // 按照 currentPosition 排序后再渲染，这样打乱才能生效
  const sortedTiles = [...puzzleState.tiles].sort((a, b) => a.currentPosition - b.currentPosition);
  
  sortedTiles.forEach(tile => {
    const tileElement = document.createElement('div');
    tileElement.className = `puzzle-tile ${tile.isEmpty ? 'empty' : ''}`;
    tileElement.dataset.id = tile.id;
    tileElement.dataset.position = tile.currentPosition;
    
    if (!tile.isEmpty) {
      const row = Math.floor(tile.correctPosition / puzzleState.size);
      const col = tile.correctPosition % puzzleState.size;
      
      tileElement.style.backgroundImage = `url('${image.path}')`;
      tileElement.style.backgroundPosition = `${col * pieceSize}% ${row * pieceSize}%`;
      tileElement.style.backgroundSize = `${puzzleState.size * 100}%`;
      
      // 点击交换逻辑
      tileElement.addEventListener('click', handleTileClick);
    }
    
    grid.appendChild(tileElement);
  });
}

function handleTileClick(e) {
  if (puzzleState.isCompleted) return;
  
  const clickedTile = e.target;
  const clickedPos = parseInt(clickedTile.dataset.position);
  
  // 找到空白位置
  const emptyTile = puzzleState.tiles.find(t => t.isEmpty);
  const emptyPos = emptyTile.currentPosition;
  
  // 检查是否相邻
  if (isAdjacent(clickedPos, emptyPos)) {
    moveTile(clickedPos, emptyPos);
  }
}

function isAdjacent(pos1, pos2) {
  const row1 = Math.floor(pos1 / puzzleState.size);
  const col1 = pos1 % puzzleState.size;
  const row2 = Math.floor(pos2 / puzzleState.size);
  const col2 = pos2 % puzzleState.size;
  
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  
  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

function moveTile(fromPos, toPos) {
  if (puzzleState.isCompleted) return;
  
  swapTiles(fromPos, toPos);
  puzzleState.moves++;
  
  renderPuzzle();
  updateStats();
  
  checkWin();
}

function checkWin() {
  const allCorrect = puzzleState.tiles.every(tile => tile.currentPosition === tile.correctPosition);
  
  if (allCorrect && !puzzleState.isCompleted) {
    puzzleState.isCompleted = true;
    stopTimer();
    showWinModal();
  }
}

function showWinModal() {
  const modal = document.getElementById('winModal');
  const message = document.getElementById('winMessage');
  
  const time = formatTime(Date.now() - puzzleState.startTime);
  message.textContent = `用时 ${time}，共 ${puzzleState.moves} 步完成！`;
  
  modal.classList.remove('hidden');
}

function closeWinModal() {
  document.getElementById('winModal').classList.add('hidden');
}

function startTimer() {
  stopTimer();
  
  puzzleState.timer = setInterval(() => {
    const elapsed = Date.now() - puzzleState.startTime;
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
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateStats() {
  document.getElementById('moveDisplay').textContent = `步数: ${puzzleState.moves}`;
  document.getElementById('gameScore').textContent = `用时: ${document.getElementById('timerDisplay').textContent} | 步数: ${puzzleState.moves}`;
}

function setDifficulty(size) {
  puzzleState.size = size;
  document.querySelectorAll('.difficulty-btn').forEach(btn => {
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

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('currentImageLabel').textContent = PUZZLE_IMAGES[0].name;
  initPuzzle();
});