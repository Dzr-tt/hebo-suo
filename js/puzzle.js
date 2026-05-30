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

let draggedTile = null;
let dragOverTile = null;

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
  
  puzzleState.tiles.forEach(tile => {
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
      
      tileElement.draggable = true;
      tileElement.addEventListener('dragstart', handleDragStart);
      tileElement.addEventListener('dragover', handleDragOver);
      tileElement.addEventListener('drop', handleDrop);
      tileElement.addEventListener('dragend', handleDragEnd);
      
      tileElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    }
    
    grid.appendChild(tileElement);
  });
}

function handleDragStart(e) {
  draggedTile = e.target;
  draggedTile.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  
  const target = e.target;
  if (target.classList.contains('puzzle-tile') && target.classList.contains('empty')) {
    target.classList.add('drag-over');
    dragOverTile = target;
  }
}

function handleDrop(e) {
  e.preventDefault();
  
  if (dragOverTile && draggedTile) {
    const fromPos = parseInt(draggedTile.dataset.position);
    const toPos = parseInt(dragOverTile.dataset.position);
    
    if (isAdjacent(fromPos, toPos)) {
      moveTile(fromPos, toPos);
    }
  }
  
  clearDragState();
}

function handleDragEnd() {
  clearDragState();
}

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  
  const tile = e.target;
  if (tile.classList.contains('puzzle-tile') && !tile.classList.contains('empty')) {
    draggedTile = tile;
    
    tile.addEventListener('touchmove', handleTouchMove, { passive: true });
    tile.addEventListener('touchend', handleTouchEnd);
  }
}

function handleTouchMove(e) {
  if (!draggedTile) return;
  
  const deltaX = e.touches[0].clientX - touchStartX;
  const deltaY = e.touches[0].clientY - touchStartY;
  
  const threshold = 30;
  
  if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
    const fromPos = parseInt(draggedTile.dataset.position);
    const emptyTile = document.querySelector('.puzzle-tile.empty');
    const toPos = parseInt(emptyTile.dataset.position);
    
    if (isAdjacent(fromPos, toPos)) {
      moveTile(fromPos, toPos);
    }
    
    clearDragState();
  }
}

function handleTouchEnd() {
  clearDragState();
}

function clearDragState() {
  if (draggedTile) {
    draggedTile.classList.remove('dragging');
    draggedTile.removeEventListener('touchmove', handleTouchMove);
    draggedTile.removeEventListener('touchend', handleTouchEnd);
  }
  
  if (dragOverTile) {
    dragOverTile.classList.remove('drag-over');
  }
  
  draggedTile = null;
  dragOverTile = null;
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