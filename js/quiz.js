const QUIZ_QUESTIONS = [
  {
    question: '河伯所文化遗址位于哪个省份?',
    options: ['云南省', '贵州省', '四川省', '广西省'],
    correct: 0
  },
  {
    question: '古滇国的主要祭祀活动与什么相关?',
    options: ['太阳崇拜', '月亮崇拜', '星辰崇拜', '风崇拜'],
    correct: 0
  },
  {
    question: '以下哪个不是河伯所标志性纹饰?',
    options: ['太阳纹', '羽人纹', '龙纹', '牛头纹'],
    correct: 2
  },
  {
    question: '滇王金印属于哪个朝代的文物?',
    options: ['战国', '秦代', '汉代', '唐代'],
    correct: 2
  },
  {
    question: '青铜贮贝器是古滇国特有的青铜器物,主要用于?',
    options: ['烹饪', '储存海贝', '灌溉', '运输'],
    correct: 1
  },
  {
    question: '古滇国位于现在的哪个地区?',
    options: ['中原地区', '西北地区', '滇池地区', '北方草原'],
    correct: 2
  },
  {
    question: '铜鼓在古滇文化中的主要用途是?',
    options: ['打击乐器和祭祀重器', '日常餐具', '建筑材料', '武器'],
    correct: 0
  },
  {
    question: '蛙形铜器在古滇文化中可能代表?',
    options: ['雨神崇拜', '火神崇拜', '山神崇拜', '风神崇拜'],
    correct: 0
  },
  {
    question: '孔雀铜灯是哪个朝代的文物?',
    options: ['战国', '西汉', '东汉', '三国'],
    correct: 1
  },
  {
    question: '玉璧在古代礼器中象征什么?',
    options: ['天地', '君权', '武力', '财富'],
    correct: 0
  },
  {
    question: '河伯所文化属于以下哪种文化类型?',
    options: ['游牧文化', '农耕文化', '海洋文化', '商业文化'],
    correct: 1
  },
  {
    question: '舞蹈铜俑反映了古滇国人民的什么活动?',
    options: ['战争', '舞蹈娱乐', '农业生产', '宗教祭祀'],
    correct: 1
  },
  {
    question: '牛头铜牌反映的动物崇拜是?',
    options: ['马', '羊', '牛', '猪'],
    correct: 2
  },
  {
    question: '古滇国的海贝主要来自哪里?',
    options: ['本地湖泊', '海洋贸易', '山区河流', '人工养殖'],
    correct: 1
  },
  {
    question: '河伯所遗址出土的文物以什么材质为主?',
    options: ['金器', '银器', '青铜器', '铁器'],
    correct: 2
  },
  {
    question: '古滇国与中原文化有哪些交流?',
    options: ['无交流', '单向输出', '双向交流', '完全同化'],
    correct: 2
  },
  {
    question: '贮贝器上的祭祀场面表现了什么?',
    options: ['战争场景', '农耕场景', '宗教仪式', '狩猎活动'],
    correct: 2
  },
  {
    question: '河伯所文化距今大约多少年?',
    options: ['1000年', '2000年', '3000年', '5000年'],
    correct: 2
  },
  {
    question: '古滇国的都城可能位于现在的哪里?',
    options: ['昆明', '大理', '曲靖', '楚雄'],
    correct: 0
  },
  {
    question: '以下哪种纹饰是古滇文化特有的?',
    options: ['饕餮纹', '云纹', '羽人纹', '几何纹'],
    correct: 2
  }
];

let quizState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  timer: 10,
  timerInterval: null,
  answered: false,
  results: []
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

function initQuiz() {
  if (!checkLogin()) return;
  showStartScreen();
}

function showStartScreen() {
  stopTimer();
  document.getElementById('quizContainer').classList.add('hidden');
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
}

function startQuiz(count) {
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  quizState.questions = shuffled.slice(0, Math.min(count, QUIZ_QUESTIONS.length));
  quizState.currentIndex = 0;
  quizState.score = 0;
  quizState.answered = false;
  quizState.results = [];

  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('quizContainer').classList.remove('hidden');

  renderProgress();
  loadQuestion();
}

function renderProgress() {
  const container = document.getElementById('quizProgress');
  container.innerHTML = '';

  quizState.questions.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'quiz-dot';
    if (i < quizState.currentIndex) {
      dot.classList.add(quizState.results[i] ? 'correct' : 'wrong');
    } else if (i === quizState.currentIndex) {
      dot.classList.add('current');
    }
    container.appendChild(dot);
  });
}

function loadQuestion() {
  const question = quizState.questions[quizState.currentIndex];

  document.getElementById('quizQuestion').textContent = question.question;
  document.getElementById('currentScore').textContent = quizState.score;

  const optionsContainer = document.getElementById('quizOptions');
  optionsContainer.innerHTML = '';

  question.options.forEach((option, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option';
    btn.textContent = option;
    btn.onclick = () => selectOption(i);
    optionsContainer.appendChild(btn);
  });

  quizState.answered = false;
  quizState.timer = 10;
  document.getElementById('quizTimer').textContent = quizState.timer;

  startTimer();
  renderProgress();
}

function startTimer() {
  stopTimer();
  quizState.timerInterval = setInterval(() => {
    quizState.timer--;
    document.getElementById('quizTimer').textContent = quizState.timer;

    if (quizState.timer <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval);
    quizState.timerInterval = null;
  }
}

function handleTimeout() {
  stopTimer();
  if (quizState.answered) return;

  quizState.answered = true;
  quizState.results.push(false);

  const options = document.querySelectorAll('.quiz-option');
  options.forEach((opt, i) => {
    opt.classList.add('disabled');
    if (i === quizState.questions[quizState.currentIndex].correct) {
      opt.classList.add('correct');
    }
  });

  setTimeout(nextQuestion, 1500);
}

function selectOption(index) {
  if (quizState.answered) return;

  stopTimer();
  quizState.answered = true;

  const question = quizState.questions[quizState.currentIndex];
  const isCorrect = index === question.correct;

  if (isCorrect) {
    quizState.score += 10;
    document.getElementById('currentScore').textContent = quizState.score;
  }

  quizState.results.push(isCorrect);

  const options = document.querySelectorAll('.quiz-option');
  options.forEach((opt, i) => {
    opt.classList.add('disabled');
    if (i === question.correct) {
      opt.classList.add('correct');
    } else if (i === index && !isCorrect) {
      opt.classList.add('wrong');
    }
  });

  setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
  quizState.currentIndex++;

  if (quizState.currentIndex >= quizState.questions.length) {
    showResults();
  } else {
    loadQuestion();
  }
}

function showResults() {
  stopTimer();
  document.getElementById('quizContainer').classList.add('hidden');
  document.getElementById('resultScreen').classList.remove('hidden');

  const totalQuestions = quizState.questions.length;
  const correctCount = quizState.results.filter(r => r).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);

  document.getElementById('finalScore').textContent = `${quizState.score}分`;
  document.getElementById('resultMessage').textContent =
    `正确率: ${correctCount}/${totalQuestions} (${percentage}%)`;

  let level = '古滇学徒';
  if (percentage >= 90) level = '古滇大师';
  else if (percentage >= 70) level = '古滇学者';
  else if (percentage >= 50) level = '古滇探索者';

  document.getElementById('resultLevel').textContent = level;
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

document.addEventListener('DOMContentLoaded', initQuiz);
