const QUIZ_QUESTIONS = [
  {
    question: '河伯所文化遗址位于哪个省份?',
    options: ['云南�?, '贵州�?, '四川�?, '广西�?],
    correct: 0
  },
  {
    question: '古滇国的主要祭祀活动与什么相�?',
    options: ['太阳崇拜', '月亮崇拜', '星辰崇拜', '风崇�?],
    correct: 0
  },
  {
    question: '以下哪个不是河伯所标志性纹�?',
    options: ['太阳�?, '羽人�?, '龙纹', '牛头�?],
    correct: 2
  },
  {
    question: '滇王金印属于哪个朝代的文�?',
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
    question: '玉璧在古代礼器中象征什�?',
    options: ['天地', '君权', '武力', '财富'],
    correct: 0
  },
  {
    question: '河伯所文化属于以下哪种文化类型?',
    options: ['游牧文化', '农耕文�?, '海洋文化', '商业文化'],
    correct: 1
  },
  {
    question: '舞蹈铜俑反映了古滇国人民的什么活�?',
    options: ['战争', '舞蹈娱乐', '农业生产', '宗教祭祀'],
    correct: 1
  },
  {
    question: '牛头铜牌反映的动物崇拜是?',
    options: ['�?, '�?, '�?, '�?],
    correct: 2
  },
  {
    question: '古滇国的海贝主要来自哪里?',
    options: ['本地湖泊', '海洋贸易', '山区河流', '人工养殖'],
    correct: 1
  },
  {
    question: '河伯所遗址出土的文物以什么材质为�?',
    options: ['金器', '银器', '青铜�?, '铁器'],
    correct: 2
  },
  {
    question: '古滇国与中原文化有哪些交�?',
    options: ['无交�?, '单向输出', '双向交流', '完全同化'],
    correct: 2
  },
  {
    question: '贮贝器上的祭祀场面表现了什�?',
    options: ['战争场景', '农耕场�?, '宗教仪式', '狩猎活动'],
    correct: 2
  },
  {
    question: '河伯所文化距今大约多少�?',
    options: ['1000�?, '2000�?, '3000�?, '5000�?],
    correct: 2
  },
  {
    question: '古滇国的都城可能位于现在的哪�?',
    options: ['昆明', '大理', '曲靖', '楚雄'],
    correct: 0
  },
  {
    question: '以下哪种纹饰是古滇文化特有的?',
    options: ['饕餮�?, '云纹', '羽人�?, '几何�?],
    correct: 2
  },
  {
    question: '滇国相印封泥是古滇国什么的重要证据?',
    options: ['军事力量', '行政体系', '宗教信仰', '农业生产'],
    correct: 1
  },
  {
    question: '益州铭文瓦当证明了哪个朝代在滇池地区的行政建�?',
    options: ['秦朝', '汉代', '唐代', '宋代'],
    correct: 1
  },
  {
    question: '汉代简牍是古代的什么载�?',
    options: ['书写载体', '建筑材料', '祭祀用品', '装饰器物'],
    correct: 0
  },
  {
    question: '官印封泥群展现了益州郡的什么架�?',
    options: ['军事架构', '官僚架构', '宗教架构', '商业架构'],
    correct: 1
  },
  {
    question: '古滇国的青铜铸造技术达到了什么水�?',
    options: ['初级水平', '中级水平', '较高水平', '顶尖水平'],
    correct: 2
  },
  {
    question: '河伯所遗址发现于哪一�?',
    options: ['1950�?, '1960�?, '1970�?, '1980�?],
    correct: 1
  },
  {
    question: '以下哪种文物不是河伯所遗址出土�?',
    options: ['青铜贮贝�?, '玉琮', '铜鼓', '铁犁'],
    correct: 3
  },
  {
    question: '古滇国的社会结构以什么为基础?',
    options: ['血缘关�?, '地缘关系', '阶级关系', '宗教关系'],
    correct: 0
  },
  {
    question: '铜棺是古滇国什么人的葬�?',
    options: ['平民', '贵族', '奴隶', '士兵'],
    correct: 1
  },
  {
    question: '古滇文化中的"羽人"形象象征什�?',
    options: ['巫师', '贵族', '神使', '士兵'],
    correct: 2
  },
  {
    question: '滇池地区在汉代属于哪个郡?',
    options: ['蜀�?, '益州�?, '永昌�?, '犍为�?],
    correct: 1
  },
  {
    question: '以下哪种金属是古滇国主要的铸造材�?',
    options: ['�?, '�?, '青铜', '�?],
    correct: 2
  },
  {
    question: '石寨山遗址与河伯所遗址同属于什么文�?',
    options: ['滇文�?, '巴蜀文化', '夜郎文化', '南越文化'],
    correct: 0
  },
  {
    question: '古滇国的主要经济来源是什�?',
    options: ['畜牧�?, '农业', '手工�?, '商业贸易'],
    correct: 1
  },
  {
    question: '铜制葫芦笙是古滇国的什么器�?',
    options: ['农具', '乐器', '兵器', '礼器'],
    correct: 1
  },
  {
    question: '古滇国的陶器以什么为�?',
    options: ['彩陶', '黑陶', '灰陶', '白陶'],
    correct: 2
  },
  {
    question: '以下哪种纹饰属于河伯所文化?',
    options: ['云雷�?, '回纹', '蟠螭�?, '以上都是'],
    correct: 3
  },
  {
    question: '古滇国的兵器主要用什么材质制�?',
    options: ['石器', '青铜�?, '铁器', '木器'],
    correct: 1
  },
  {
    question: '牛虎铜案是古滇国的什么器�?',
    options: ['祭祀礼器', '日常餐具', '兵器', '农具'],
    correct: 0
  },
  {
    question: '河伯所文化的年代跨度大约是多少�?',
    options: ['500�?, '1000�?, '1500�?, '2000�?],
    correct: 1
  },
  {
    question: '古滇国的居民主要是什么民�?',
    options: ['汉族', '彝族', '傣族', '滇族'],
    correct: 3
  },
  {
    question: '青铜鼓在古代常用于什么场�?',
    options: ['婚礼', '葬礼', '祭祀', '宴会'],
    correct: 2
  },
  {
    question: '以下哪种器物是古滇国特有�?',
    options: ['�?, '�?, '贮贝�?, '�?],
    correct: 2
  },
  {
    question: '古滇文化受到了哪些文化的影响?',
    options: ['中原文化', '巴蜀文化', '东南亚文�?, '以上都是'],
    correct: 3
  },
  {
    question: '河伯所遗址的发掘对研究古滇国有什么意�?',
    options: ['证明滇国存在', '了解滇国社会', '研究滇文�?, '以上都是'],
    correct: 3
  },
  {
    question: '青铜俑在古滇文化中主要用�?',
    options: ['陪葬', '祭祀', '装饰', '玩具'],
    correct: 1
  },
  {
    question: '古滇国的货币主要是什�?',
    options: ['铜钱', '海贝', '金锭', '银锭'],
    correct: 1
  },
  {
    question: '玉璋是古代的什么器�?',
    options: ['兵器', '礼器', '乐器', '工具'],
    correct: 1
  },
  {
    question: '以下哪种动物在古滇文化中被崇�?',
    options: ['�?, '�?, '�?, '以上都是'],
    correct: 3
  },
  {
    question: '古滇国的房屋主要是什么结�?',
    options: ['窑洞', '干栏�?, '四合�?, '帐篷'],
    correct: 1
  },
  {
    question: '青铜矛是古滇国的什么武�?',
    options: ['远程武器', '近战武器', '防御武器', '仪式武器'],
    correct: 1
  },
  {
    question: '河伯所遗址的面积大约是多少?',
    options: ['1万平方米', '5万平方米', '10万平方米', '50万平方米'],
    correct: 1
  },
  {
    question: '古滇国的文字主要是什�?',
    options: ['甲骨�?, '金文', '隶书', '尚未发现'],
    correct: 3
  },
  {
    question: '铜制啄锤是古滇国的什么工�?',
    options: ['农具', '兵器', '木工工具', '祭祀用具'],
    correct: 1
  },
  {
    question: '古滇文化中的几何纹主要用于装饰什�?',
    options: ['陶器', '青铜�?, '玉器', '以上都是'],
    correct: 3
  },
  {
    question: '以下哪个不是古滇国的邻国?',
    options: ['夜郎', '南越', '匈奴', '巴蜀'],
    correct: 2
  },
  {
    question: '青铜鱼钩反映了古滇国的什么活�?',
    options: ['农业', '渔业', '畜牧�?, '手工�?],
    correct: 1
  },
  {
    question: '河伯所文化属于哪个历史时期?',
    options: ['新石器时�?, '青铜时代', '铁器时代', '工业时代'],
    correct: 1
  },
  {
    question: '古滇国的手工业以什么为�?',
    options: ['纺织', '制陶', '青铜铸�?, '冶铁'],
    correct: 2
  },
  {
    question: '铜制铠甲是古滇国士兵的什么装�?',
    options: ['进攻武器', '防御装备', '礼仪服饰', '生产工具'],
    correct: 1
  },
  {
    question: '古滇文化中的太阳纹象征什�?',
    options: ['光明', '权力', '生命', '以上都是'],
    correct: 3
  },
  {
    question: '以下哪种器物不是贮贝器的功能?',
    options: ['储存货币', '祭祀礼器', '烹饪器具', '显示财富'],
    correct: 2
  },
  {
    question: '古滇国的婚姻制度是什�?',
    options: ['一夫一�?, '一夫多�?, '一妻多�?, '群婚'],
    correct: 1
  },
  {
    question: '青铜斧是古滇国的什么工�?',
    options: ['农具', '兵器', '木工工具', '礼器'],
    correct: 0
  },
  {
    question: '河伯所遗址出土的青铜器有什么特�?',
    options: ['造型独特', '工艺精湛', '纹饰精美', '以上都是'],
    correct: 3
  },
  {
    question: '古滇国的宗教信仰以什么为�?',
    options: ['佛教', '道教', '原始宗教', '伊斯兰教'],
    correct: 2
  },
  {
    question: '铜制手镯是古滇国的什么饰�?',
    options: ['头饰', '手饰', '脚饰', '腰饰'],
    correct: 1
  },
  {
    question: '以下哪个不是益州郡的属县?',
    options: ['滇池�?, '叶榆�?, '成都�?, '不韦�?],
    correct: 2
  },
  {
    question: '古滇国的农业生产以什么为�?',
    options: ['水稻', '小麦', '玉米', '高粱'],
    correct: 0
  },
  {
    question: '青铜剑是古滇国的什么武�?',
    options: ['长兵�?, '短兵�?, '远程兵器', '防御兵器'],
    correct: 1
  },
  {
    question: '河伯所文化与中原文化交流的主要途径是什�?',
    options: ['战争', '贸易', '移民', '朝贡'],
    correct: 1
  },
  {
    question: '古滇国的音乐以什么乐器为�?',
    options: ['弦乐', '管乐', '打击�?, '弹拨�?],
    correct: 2
  },
  {
    question: '铜制耳环是古滇国的什么饰�?',
    options: ['头饰', '耳饰', '颈饰', '手饰'],
    correct: 1
  },
  {
    question: '以下哪种文物是研究古滇国历史的重要实物证�?',
    options: ['滇王金印', '青铜贮贝�?, '汉代简�?, '以上都是'],
    correct: 3
  },
  {
    question: '古滇国的社会等级制度是怎样�?',
    options: ['平等社会', '奴隶社会', '封建社会', '资本主义社会'],
    correct: 1
  },
  {
    question: '青铜锄是古滇国的什么农�?',
    options: ['收割工具', '挖掘工具', '播种工具', '灌溉工具'],
    correct: 1
  },
  {
    question: '河伯所遗址的发掘者是�?',
    options: ['郭沫�?, '裴文�?, '马曜', '李济'],
    correct: 2
  },
  {
    question: '古滇文化中的动物纹饰主要有哪�?',
    options: ['�?, '�?, '�?, '以上都是'],
    correct: 3
  },
  {
    question: '铜制发簪是古滇国的什么饰�?',
    options: ['头饰', '耳饰', '颈饰', '腰饰'],
    correct: 0
  },
  {
    question: '汉代在云南设立益州郡是在哪一�?',
    options: ['公元�?21�?, '公元�?09�?, '公元25�?, '公元100�?],
    correct: 1
  },
  {
    question: '古滇国的主要农作物是什�?',
    options: ['�?, '�?, '�?, '�?],
    correct: 1
  },
  {
    question: '青铜戈是古滇国的什么武�?',
    options: ['刺杀武器', '砍杀武器', '投掷武器', '防御武器'],
    correct: 0
  },
  {
    question: '河伯所文化遗址的保护现状如�?',
    options: ['已破�?, '部分保护', '完整保护', '未保�?],
    correct: 2
  },
  {
    question: '古滇国的陶器主要用于什�?',
    options: ['烹饪', '储存', '祭祀', '以上都是'],
    correct: 3
  },
  {
    question: '以下哪种器物不属于古滇国的青铜器?',
    options: ['�?, '�?, '�?, '�?],
    correct: 3
  },
  {
    question: '滇王之印是谁赐予滇王�?',
    options: ['秦始�?, '汉武�?, '汉光武帝', '唐太�?],
    correct: 1
  },
  {
    question: '古滇国的灭亡大约在什么时�?',
    options: ['公元�?世纪', '公元1世纪', '公元3世纪', '公元5世纪'],
    correct: 1
  },
  {
    question: '青铜鼓上的纹饰通常描绘什�?',
    options: ['战争场景', '祭祀场景', '生产场景', '以上都是'],
    correct: 3
  },
  {
    question: '河伯所文化遗址位于哪个城市附近?',
    options: ['昆明', '玉溪', '曲靖', '红河'],
    correct: 0
  },
  {
    question: '古滇国的玉器主要是什么材�?',
    options: ['和田�?, '翡翠', '岫玉', '本地�?],
    correct: 3
  },
  {
    question: '铜制车马器是古滇国的什么器�?',
    options: ['交通工具配�?, '兵器', '农具', '礼器'],
    correct: 0
  },
  {
    question: '以下哪个不是古滇文化的特�?',
    options: ['青铜文化', '稻作农业', '游牧生活', '独特艺术'],
    correct: 2
  },
  {
    question: '古滇国的冶铜技术来源于哪里?',
    options: ['中原', '本地发展', '西亚', '东南�?],
    correct: 1
  },
  {
    question: '青铜贮贝器上的人物形象反映了古滇国的什�?',
    options: ['社会生活', '宗教信仰', '战争场景', '以上都是'],
    correct: 3
  }
];

let quizState = {
  currentQuestion: 0,
  score: 0,
  totalQuestions: 0,
  questions: [],
  timer: 10,
  timerInterval: null
};

function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

function checkLogin() {
  const user = localStorage.getItem('heboUser');
  if (user) {
    const userData = JSON.parse(user);
    const userBtn = document.getElementById('userBtn');
    if (userBtn) {
      userBtn.textContent = userData.username;
      userBtn.onclick = () => {
        if (confirm('确定要退出登录吗?')) {
          localStorage.removeItem('heboUser');
          showToast('已退出登�?);
          setTimeout(() => {
            window.location.href = 'auth.html';
          }, 1000);
        }
      };
    }
    return true;
  } else {
    window.location.href = 'auth.html';
    return false;
  }
}

function startQuiz(count) {
  quizState.totalQuestions = count;
  quizState.currentQuestion = 0;
  quizState.score = 0;
  
  const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
  quizState.questions = shuffled.slice(0, count);
  
  document.getElementById('quizContainer').classList.remove('hidden');
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('resultScreen').classList.add('hidden');
  
  showQuestion();
}

function showQuestion() {
  if (quizState.currentQuestion >= quizState.totalQuestions) {
    showResult();
    return;
  }
  
  const question = quizState.questions[quizState.currentQuestion];
  document.getElementById('quizQuestion').textContent = question.question;
  
  const options = document.querySelectorAll('.quiz-option');
  options.forEach((option, index) => {
    option.textContent = question.options[index];
    option.classList.remove('correct', 'wrong', 'selected');
  });
  
  document.getElementById('currentScore').textContent = quizState.score;
  document.getElementById('quizProgress').textContent = `${quizState.currentQuestion + 1}/${quizState.totalQuestions}`;
  
  startTimer();
}

function startTimer() {
  quizState.timer = 10;
  document.getElementById('quizTimer').textContent = quizState.timer;
  
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval);
  }
  
  quizState.timerInterval = setInterval(() => {
    quizState.timer--;
    document.getElementById('quizTimer').textContent = quizState.timer;
    
    if (quizState.timer <= 0) {
      clearInterval(quizState.timerInterval);
      nextQuestion();
    }
  }, 1000);
}

function selectOption(index) {
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval);
  }
  
  const question = quizState.questions[quizState.currentQuestion];
  const options = document.querySelectorAll('.quiz-option');
  
  options.forEach((option, i) => {
    if (i === question.correct) {
      option.classList.add('correct');
    } else if (i === index && i !== question.correct) {
      option.classList.add('wrong');
    }
    option.classList.add('selected');
  });
  
  if (index === question.correct) {
    quizState.score++;
    document.getElementById('currentScore').textContent = quizState.score;
  }
  
  setTimeout(nextQuestion, 1500);
}

function nextQuestion() {
  quizState.currentQuestion++;
  showQuestion();
}

function showResult() {
  document.getElementById('quizContainer').classList.add('hidden');
  document.getElementById('resultScreen').classList.remove('hidden');
  
  const finalScore = quizState.score;
  const total = quizState.totalQuestions;
  const percentage = Math.round((finalScore / total) * 100);
  
  document.getElementById('finalScore').textContent = `${finalScore}/${total}`;
  
  let level = '';
  let message = '';
  
  if (percentage >= 90) {
    level = '🏆 古滇大师';
    message = '你对古滇文化了如指掌，堪称古滇文化大师！';
  } else if (percentage >= 70) {
    level = '📜 古滇学�?;
    message = '你对古滇文化有深入了解，继续努力�?;
  } else if (percentage >= 50) {
    level = '🔍 古滇探索�?;
    message = '你对古滇文化有一定了解，还有更多知识等待探索�?;
  } else {
    level = '🌱 古滇学徒';
    message = '开始你的古滇文化探索之旅吧�?;
  }
  
  document.getElementById('resultLevel').textContent = level;
  document.getElementById('resultMessage').textContent = message;
}

function showStartScreen() {
  if (quizState.timerInterval) {
    clearInterval(quizState.timerInterval);
  }
  
  document.getElementById('quizContainer').classList.add('hidden');
  document.getElementById('resultScreen').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
  
  document.getElementById('currentScore').textContent = '0';
}

document.addEventListener('DOMContentLoaded', () => {
  checkLogin();
  showStartScreen();
});
