const PUZZLE_IMAGES = [
  {
    name: '滇王之印',
    image: 'images/滇王之印.png'
  },
  {
    name: '滇国相印封泥',
    image: 'images/“滇国相印” 封泥.png'
  },
  {
    name: '益州铭文瓦当',
    image: 'images/“益州” 铭文瓦当.png'
  },
  {
    name: '官印封泥群',
    image: 'images/官印封泥群（益州郡体系）.png'
  },
  {
    name: '汉代简牍',
    image: 'images/汉代简牍.png'
  }
];

let puzzleState = {
  size: 3,
  grid: [],
  emptyIndex: 8,
  moves: 0,
  startTime: null,
  timerInterval: null,
  isPlaying: false,
  currentImageIndex: 0
};

function generateNumberGrid(size) {
  const total = size * size;
  const numbers = Array.from({ length: total - 1 }, (_, i) => i + 1);
  return [...numbers, 0];
}

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

function initPuzzle() {
  if (!checkLogin()) return;

  loadSettings();
  initGame();
}

function loadSettings() {
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');
  difficultyBtns.forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.dataset.size) === puzzleState.size) {
      btn.classList.add('active');
    }
  });

  updateImageSelector();
}

function updateImageSelector() {
  const imageLabel = document.getElementById('currentImageLabel');
  if (imageLabel) {
    imageLabel.textContent = PUZZLE_IMAGES[puzzleState.currentImageIndex].name;
  }
}

function setDifficulty(size) {
  if (puzzleState.isPlaying) {
    if (!confirm('当前游戏进行中，确定要切换难度吗?')) {
      return;
    }
  }

  puzzleState.size = size;
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');
  difficultyBtns.forEach(btn => {
    btn.classList.remove('active');
    if (parseInt(btn.dataset.size) === size) {
      btn.classList.add('active');
    }
  });

  initGame();
}

function initGame() {
  stopTimer();

  const total = puzzleState.size * puzzleState.size;
  puzzleState.grid = generateNumberGrid(puzzleState.size);
  puzzleState.emptyIndex = total - 1;
  puzzleState.moves = 0;
  puzzleState.startTime = null;
  puzzleState.isPlaying = false;

  shuffleGrid();

  renderPuzzleGrid();
  updateStats();
  updateGridSizeClass();
}

function shuffleGrid() {
  const total = puzzleState.size * puzzleState.size;
  let shuffleMoves = total * 20;

  for (let i = 0; i < shuffleMoves; i++) {
    const neighbors = getNeighbors(puzzleState.emptyIndex);
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    swapTiles(randomNeighbor, puzzleState.emptyIndex, false);
  }

  if (!isSolvable()) {
    const corners = [0, puzzleState.size - 1, puzzleState.size * (puzzleState.size - 1), puzzleState.size * puzzleState.size - 1];
    const firstCorner = corners.find(c => c !== puzzleState.emptyIndex && puzzleState.grid[c] !== 0);
    if (firstCorner !== undefined) {
      swapTiles(firstCorner, puzzleState.emptyIndex, false);
    }
  }
}

function getNeighbors(index) {
  const neighbors = [];
  const row = Math.floor(index / puzzleState.size);
  const col = index % puzzleState.size;

  if (row > 0) neighbors.push(index - puzzleState.size);
  if (row < puzzleState.size - 1) neighbors.push(index + puzzleState.size);
  if (col > 0) neighbors.push(index - 1);
  if (col < puzzleState.size - 1) neighbors.push(index + 1);

  return neighbors;
}

function swapTiles(fromIndex, toIndex, countMove = true) {
  const temp = puzzleState.grid[fromIndex];
  puzzleState.grid[fromIndex] = puzzleState.grid[toIndex];
  puzzleState.grid[toIndex] = temp;

  if (countMove && fromIndex !== toIndex) {
    puzzleState.emptyIndex = fromIndex;
  } else {
    puzzleState.emptyIndex = toIndex;
  }
}

function isSolvable() {
  let inversions = 0;
  const flat = puzzleState.grid.filter(n => n !== 0);

  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }

  if (puzzleState.size % 2 === 1) {
    return inversions % 2 === 0;
  } else {
    const emptyRow = Math.floor(puzzleState.emptyIndex / puzzleState.size);
    const emptyFromBottom = puzzleState.size - emptyRow;
    return (inversions + emptyFromBottom) % 2 === 1;
  }
}

function renderPuzzleGrid() {
  const grid = document.getElementById('puzzleGrid');
  grid.innerHTML = '';

  const currentImage = PUZZLE_IMAGES[puzzleState.currentImageIndex];

  puzzleState.grid.forEach((num, index) => {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';

    if (num === 0) {
      piece.classList.add('empty');
    } else {
      const row = Math.floor((num - 1) / puzzleState.size);
      const col = (num - 1) % puzzleState.size;

      piece.style.backgroundImage = `url('${currentImage.image}')`;
      piece.style.backgroundSize = `${puzzleState.size * 100}% ${puzzleState.size * 100}%`;
      piece.style.backgroundPosition = `${col * (100 / (puzzleState.size - 1))}% ${row * (100 / (puzzleState.size - 1))}%`;

      piece.onclick = () => handlePieceClick(index);
    }

    grid.appendChild(piece);
  });
}

function updateGridSizeClass() {
  const grid = document.getElementById('puzzleGrid');
  grid.classList.remove('size-3', 'size-4');
  grid.classList.add(`size-${puzzleState.size}`);
}

function handlePieceClick(index) {
  if (!puzzleState.isPlaying) {
    startTimer();
    puzzleState.isPlaying = true;
  }

  const neighbors = getNeighbors(puzzleState.emptyIndex);

  if (neighbors.includes(index)) {
    swapTiles(index, puzzleState.emptyIndex);
    puzzleState.moves++;
    renderPuzzleGrid();
    updateStats();

    if (checkWin()) {
      stopTimer();
      puzzleState.isPlaying = false;
      showWinModal();
    }
  }
}

function checkWin() {
  const total = puzzleState.size * puzzleState.size;
  for (let i = 0; i < total - 1; i++) {
    if (puzzleState.grid[i] !== i + 1) return false;
  }
  return puzzleState.grid[total - 1] === 0;
}

function startTimer() {
  puzzleState.startTime = Date.now();
  puzzleState.timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  if (puzzleState.timerInterval) {
    clearInterval(puzzleState.timerInterval);
    puzzleState.timerInterval = null;
  }
}

function updateTimer() {
  if (!puzzleState.startTime) return;

  const elapsed = Math.floor((Date.now() - puzzleState.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');

  document.getElementById('timerDisplay').textContent = `${minutes}:${seconds}`;
}

function updateStats() {
  document.getElementById('moveDisplay').textContent = `步数: ${puzzleState.moves}`;
  updateTimer();
}

function resetPuzzle() {
  stopTimer();
  initGame();
  showToast('拼图已重置!');
}

function changeImage() {
  puzzleState.currentImageIndex = (puzzleState.currentImageIndex + 1) % PUZZLE_IMAGES.length;
  updateImageSelector();
  resetPuzzle();
  showToast(`已切换到: ${PUZZLE_IMAGES[puzzleState.currentImageIndex].name}`);
}

function showWinModal() {
  const elapsed = Math.floor((Date.now() - puzzleState.startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  const currentImage = PUZZLE_IMAGES[puzzleState.currentImageIndex];

  const winModal = document.getElementById('winModal');
  const existingImage = winModal.querySelector('.win-image');
  if (existingImage) existingImage.remove();

  const imgElement = document.createElement('img');
  imgElement.className = 'win-image';
  imgElement.src = currentImage.image;
  imgElement.alt = currentImage.name;
  imgElement.style.cssText = 'width: 200px; height: 200px; object-fit: contain; border-radius: 12px; border: 3px solid var(--primary-bronze); margin-bottom: 16px; background: rgba(26, 21, 16, 0.6);';

  winModal.insertBefore(imgElement, winModal.firstChild);

  document.getElementById('winMessage').textContent =
    `${currentImage.name} | 用时: ${minutes}分${seconds}秒 | 步数: ${puzzleState.moves}`;
  winModal.classList.remove('hidden');
}

function closeWinModal() {
  document.getElementById('winModal').classList.add('hidden');
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

document.addEventListener('DOMContentLoaded', initPuzzle);