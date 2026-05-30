const PUZZLE_IMAGES = [
  {
    name: '滇王之印',
    image: 'images/dianwang_zhiyin.png'
  },
  {
    name: '滇国相印封泥',
    image: 'images/dianguo_xiangyin.png'
  },
  {
    name: '益州铭文瓦当',
    image: 'images/yizhou_wadang.png'
  },
  {
    name: '官印封泥群',
    image: 'images/guanyin_fengni.png'
  },
  {
    name: '汉代简牍',
    image: 'images/handai_jiandu.png'
  }
];

const puzzleState = {
  gridSize: 3,
  tiles: [],
  emptyIndex: 8,
  moves: 0,
  seconds: 0,
  timerInterval: null,
  currentImageIndex: 0,
  isPlaying: false
};

function setDifficulty(size) {
  puzzleState.gridSize = size;
  puzzleState.emptyIndex = size * size - 1;

  document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.size) === size);
  });

  const grid = document.getElementById('puzzleGrid');
  grid.className = `puzzle-grid size-${size}`;

  initPuzzle();
}

function changeImage() {
  puzzleState.currentImageIndex = (puzzleState.currentImageIndex + 1) % PUZZLE_IMAGES.length;
  document.getElementById('currentImageLabel').textContent = PUZZLE_IMAGES[puzzleState.currentImageIndex].name;
  initPuzzle();
}

function initPuzzle() {
  if (puzzleState.timerInterval) {
    clearInterval(puzzleState.timerInterval);
  }

  const size = puzzleState.gridSize;
  const total = size * size;
  puzzleState.tiles = [];
  puzzleState.moves = 0;
  puzzleState.seconds = 0;
  puzzleState.isPlaying = true;

  for (let i = 0; i < total - 1; i++) {
    puzzleState.tiles.push(i + 1);
  }
  puzzleState.tiles.push(0);
  puzzleState.emptyIndex = total - 1;

  shuffleTiles();

  renderPuzzle();
  updateStats();

  puzzleState.timerInterval = setInterval(() => {
    if (puzzleState.isPlaying) {
      puzzleState.seconds++;
      updateTimer();
    }
  }, 1000);
}

function shuffleTiles() {
  const size = puzzleState.gridSize;
  const total = size * size;

  for (let i = 0; i < 100; i++) {
    const neighbors = getMovableTiles();
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    swapTiles(randomNeighbor, false);
  }

  if (!isSolvable()) {
    swapTiles(getMovableTiles()[0], false);
  }
}

function getMovableTiles() {
  const size = puzzleState.gridSize;
  const emptyRow = Math.floor(puzzleState.emptyIndex / size);
  const emptyCol = puzzleState.emptyIndex % size;
  const movable = [];

  if (emptyRow > 0) movable.push(puzzleState.emptyIndex - size);
  if (emptyRow < size - 1) movable.push(puzzleState.emptyIndex + size);
  if (emptyCol > 0) movable.push(puzzleState.emptyIndex - 1);
  if (emptyCol < size - 1) movable.push(puzzleState.emptyIndex + 1);

  return movable;
}

function swapTiles(index, countMove = true) {
  const temp = puzzleState.tiles[index];
  puzzleState.tiles[index] = puzzleState.tiles[puzzleState.emptyIndex];
  puzzleState.tiles[puzzleState.emptyIndex] = temp;
  puzzleState.emptyIndex = index;

  if (countMove) {
    puzzleState.moves++;
    updateStats();
    checkWin();
  }
}

function isSolvable() {
  const size = puzzleState.gridSize;
  let inversions = 0;
  const tilesWithoutEmpty = puzzleState.tiles.filter(t => t !== 0);

  for (let i = 0; i < tilesWithoutEmpty.length; i++) {
    for (let j = i + 1; j < tilesWithoutEmpty.length; j++) {
      if (tilesWithoutEmpty[i] > tilesWithoutEmpty[j]) {
        inversions++;
      }
    }
  }

  if (size % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    const emptyRow = Math.floor(puzzleState.emptyIndex / size);
    return (inversions + emptyRow) % 2 === 1;
  }
}

function renderPuzzle() {
  const grid = document.getElementById('puzzleGrid');
  grid.innerHTML = '';

  const size = puzzleState.gridSize;
  const currentImage = PUZZLE_IMAGES[puzzleState.currentImageIndex];

  puzzleState.tiles.forEach((tile, index) => {
    const tileDiv = document.createElement('div');
    tileDiv.className = 'puzzle-tile';

    if (tile === 0) {
      tileDiv.classList.add('empty');
    } else {
      const originalRow = Math.floor((tile - 1) / size);
      const originalCol = (tile - 1) % size;
      const pieceSize = 100 / size;

      tileDiv.style.backgroundImage = `url(${currentImage.image})`;
      tileDiv.style.backgroundSize = `${size * 100}%`;
      tileDiv.style.backgroundPosition = `${-originalCol * pieceSize}% ${-originalRow * pieceSize}%`;
      tileDiv.style.backgroundRepeat = 'no-repeat';

      tileDiv.onclick = () => handleTileClick(index);
    }

    grid.appendChild(tileDiv);
  });
}

function handleTileClick(index) {
  if (!puzzleState.isPlaying) return;

  const movable = getMovableTiles();
  if (movable.includes(index)) {
    swapTiles(index);
    renderPuzzle();
  }
}

function updateStats() {
  document.getElementById('moveDisplay').textContent = `步数: ${puzzleState.moves}`;
}

function updateTimer() {
  const minutes = Math.floor(puzzleState.seconds / 60);
  const seconds = puzzleState.seconds % 60;
  document.getElementById('timerDisplay').textContent =
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function checkWin() {
  const size = puzzleState.gridSize;
  const total = size * size;

  for (let i = 0; i < total - 1; i++) {
    if (puzzleState.tiles[i] !== i + 1) {
      return false;
    }
  }

  if (puzzleState.tiles[total - 1] !== 0) {
    return false;
  }

  puzzleState.isPlaying = false;
  clearInterval(puzzleState.timerInterval);

  const minutes = Math.floor(puzzleState.seconds / 60);
  const seconds = puzzleState.seconds % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  document.getElementById('winMessage').textContent =
    `用时: ${timeStr} | 步数: ${puzzleState.moves}`;
  document.getElementById('winModal').classList.remove('hidden');

  saveScore();

  return true;
}

function saveScore() {
  const user = localStorage.getItem('heboUser');
  if (user) {
    const userData = JSON.parse(user);
    const users = JSON.parse(localStorage.getItem('heboUsers') || '[]');
    const userIndex = users.findIndex(u => u.username === userData.username);
    if (userIndex !== -1) {
      const score = puzzleState.moves;
      if (!users[userIndex].score) {
        users[userIndex].score = { archaeology: 0, puzzle: 0, quiz: 0 };
      }
      if (!users[userIndex].score.puzzle || users[userIndex].score.puzzle > score) {
        users[userIndex].score.puzzle = score;
      }
      localStorage.setItem('heboUsers', JSON.stringify(users));
      localStorage.setItem('heboUser', JSON.stringify(users[userIndex]));
    }
  }
}

function resetPuzzle() {
  if (puzzleState.timerInterval) {
    clearInterval(puzzleState.timerInterval);
  }
  document.getElementById('winModal').classList.add('hidden');
  initPuzzle();
}

function closeWinModal() {
  document.getElementById('winModal').classList.add('hidden');
  puzzleState.isPlaying = false;
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('puzzleGrid')) {
    document.getElementById('currentImageLabel').textContent = PUZZLE_IMAGES[puzzleState.currentImageIndex].name;
    initPuzzle();
  }
});