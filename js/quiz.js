const QUIZ_QUESTIONS = [
  {
    question: '河伯所文化遗址位于哪个省份?',
    options: ['云南省', '贵州省', '四川省', '广西壮族自治区'],
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
  },
  {
    question: '滇国相印封泥是古滇国什么的重要证据?',
    options: ['军事力量', '行政体系', '宗教信仰', '农业生产'],
    correct: 1
  },
  {
    question: '益州铭文瓦当证明了哪个朝代在滇池地区的行政建设?',
    options: ['秦朝', '汉代', '唐代', '宋代'],
    correct: 1
  },
  {
    question: '汉代简牍是古代的什么载体?',
    options: ['书写载体', '建筑材料', '祭祀用品', '装饰器物'],
    correct: 0
  },
  {
    question: '官印封泥群展现了益州郡的什么架构?',
    options: ['军事架构', '官僚架构', '宗教架构', '商业架构'],
    correct: 1
  },
  {
    question: '古滇国的青铜铸造技术达到了什么水平?',
    options: ['初级水平', '中级水平', '较高水平', '顶尖水平'],
    correct: 2
  },
  {
    question: '河伯所遗址发现于哪一年?',
    options: ['1950年', '1960年', '1970年', '1980年'],
    correct: 1
  },
  {
    question: '以下哪种文物不是河伯所遗址出土的?',
    options: ['青铜贮贝器', '玉琮', '铜鼓', '铁犁'],
    correct: 3
  },
  {
    question: '古滇国的社会结构以什么为基础?',
    options: ['血缘关系', '地缘关系', '阶级关系', '宗教关系'],
    correct: 0
  },
  {
    question: '铜棺是古滇国什么人的葬具?',
    options: ['平民', '贵族', '奴隶', '士兵'],
    correct: 1
  },
  {
    question: '古滇文化中的"羽人"形象象征什么?',
    options: ['巫师', '贵族', '神使', '士兵'],
    correct: 2
  },
  {
    question: '滇池地区在汉代属于哪个郡?',
    options: ['蜀郡', '益州郡', '永昌郡', '犍为郡'],
    correct: 1
  },
  {
    question: '以下哪种金属是古滇国主要的铸造材料?',
    options: ['金', '银', '青铜', '铁'],
    correct: 2
  },
  {
    question: '石寨山遗址与河伯所遗址同属于什么文化?',
    options: ['滇文化', '巴蜀文化', '夜郎文化', '南越文化'],
    correct: 0
  },
  {
    question: '古滇国的主要经济来源是什么?',
    options: ['畜牧业', '农业', '手工业', '商业贸易'],
    correct: 1
  },
  {
    question: '铜制葫芦笙是古滇国的什么器具?',
    options: ['农具', '乐器', '兵器', '礼器'],
    correct: 1
  },
  {
    question: '古滇国的陶器以什么为主?',
    options: ['彩陶', '黑陶', '灰陶', '白陶'],
    correct: 2
  },
  {
    question: '以下哪种纹饰属于河伯所文化?',
    options: ['云雷纹', '回纹', '蟠螭纹', '以上都是'],
    correct: 3
  },
  {
    question: '古滇国的兵器主要用什么材质制作?',
    options: ['石器', '青铜器', '铁器', '木器'],
    correct: 1
  },
  {
    question: '牛虎铜案是古滇国的什么器物?',
    options: ['祭祀礼器', '日常餐具', '兵器', '农具'],
    correct: 0
  },
  {
    question: '河伯所文化的年代跨度大约是多少年?',
    options: ['500年', '1000年', '1500年', '2000年'],
    correct: 1
  },
  {
    question: '古滇国的居民主要是什么民族?',
    options: ['汉族', '彝族', '傣族', '滇族'],
    correct: 3
  },
  {
    question: '青铜鼓在古代常用于什么场合?',
    options: ['婚礼', '葬礼', '祭祀', '宴会'],
    correct: 2
  },
  {
    question: '以下哪种器物是古滇国特有的?',
    options: ['鼎', '钟', '贮贝器', '壶'],
    correct: 2
  },
  {
    question: '古滇文化受到了哪些文化的影响?',
    options: ['中原文化', '巴蜀文化', '东南亚文化', '以上都是'],
    correct: 3
  },
  {
    question: '河伯所遗址的发掘对研究古滇国有什么意义?',
    options: ['证明滇国存在', '了解滇国社会', '研究滇文化', '以上都是'],
    correct: 3
  },
  {
    question: '青铜俑在古滇文化中主要用途?',
    options: ['陪葬', '祭祀', '装饰', '玩具'],
    correct: 1
  },
  {
    question: '古滇国的货币主要是什么?',
    options: ['铜钱', '海贝', '金锭', '银锭'],
    correct: 1
  },
  {
    question: '玉璋是古代的什么器物?',
    options: ['兵器', '礼器', '乐器', '工具'],
    correct: 1
  },
  {
    question: '以下哪种动物在古滇文化中被崇拜?',
    options: ['牛', '虎', '蛙', '以上都是'],
    correct: 3
  },
  {
    question: '古滇国的房屋主要是什么结构?',
    options: ['窑洞', '干栏式', '四合院', '帐篷'],
    correct: 1
  },
  {
    question: '青铜矛是古滇国的什么武器?',
    options: ['远程武器', '近战武器', '防御武器', '仪式武器'],
    correct: 1
  },
  {
    question: '河伯所遗址的面积大约是多少?',
    options: ['1万平方米', '5万平方米', '10万平方米', '50万平方米'],
    correct: 1
  },
  {
    question: '古滇国的文字主要是什么?',
    options: ['甲骨文', '金文', '隶书', '尚未发现'],
    correct: 3
  },
  {
    question: '铜制啄锤是古滇国的什么工具?',
    options: ['农具', '兵器', '木工工具', '祭祀用具'],
    correct: 1
  },
  {
    question: '古滇文化中的几何纹主要用于装饰什么?',
    options: ['陶器', '青铜器', '玉器', '以上都是'],
    correct: 3
  },
  {
    question: '以下哪个不是古滇国的邻国?',
    options: ['夜郎', '南越', '匈奴', '巴蜀'],
    correct: 2
  },
  {
    question: '青铜鱼钩反映了古滇国的什么活动?',
    options: ['农业', '渔业', '畜牧业', '手工业'],
    correct: 1
  },
  {
    question: '河伯所文化属于哪个历史时期?',
    options: ['新石器时代', '青铜时代', '铁器时代', '工业时代'],
    correct: 1
  },
  {
    question: '古滇国的手工业以什么为主?',
    options: ['纺织', '制陶', '青铜铸造', '冶铁'],
    correct: 2
  },
  {
    question: '铜制铠甲是古滇国士兵的什么装备?',
    options: ['进攻武器', '防御装备', '礼仪服饰', '生产工具'],
    correct: 1
  },
  {
    question: '古滇文化中的太阳纹象征什么?',
    options: ['光明', '权力', '生命', '以上都是'],
    correct: 3
  },
  {
    question: '以下哪种器物不是贮贝器的功能?',
    options: ['储存货币', '祭祀礼器', '烹饪器具', '显示财富'],
    correct: 2
  },
  {
    question: '古滇国的婚姻制度是什么?',
    options: ['一夫一妻', '一夫多妻', '一妻多夫', '群婚'],
    correct: 1
  },
  {
    question: '青铜斧是古滇国的什么工具?',
    options: ['农具', '兵器', '木工工具', '礼器'],
    correct: 0
  },
  {
    question: '河伯所遗址出土的青铜器有什么特点?',
    options: ['造型独特', '工艺精湛', '纹饰精美', '以上都是'],
    correct: 3
  },
  {
    question: '古滇国的宗教信仰以什么为主?',
    options: ['佛教', '道教', '原始宗教', '伊斯兰教'],
    correct: 2
  },
  {
    question: '铜制手镯是古滇国的什么饰品?',
    options: ['头饰', '手饰', '脚饰', '腰饰'],
    correct: 1
  },
  {
    question: '以下哪个不是益州郡的属县?',
    options: ['滇池县', '叶榆县', '成都县', '不韦县'],
    correct: 2
  },
  {
    question: '古滇国的农业生产以什么为主?',
    options: ['水稻', '小麦', '玉米', '高粱'],
    correct: 0
  },
  {
    question: '青铜剑是古滇国的什么武器?',
    options: ['长兵器', '短兵器', '远程兵器', '防御兵器'],
    correct: 1
  },
  {
    question: '河伯所文化与中原文化交流的主要途径是什么?',
    options: ['战争', '贸易', '移民', '朝贡'],
    correct: 1
  },
  {
    question: '古滇国的音乐以什么乐器为主?',
    options: ['弦乐', '管乐', '打击乐', '弹拨乐'],
    correct: 2
  },
  {
    question: '铜制耳环是古滇国的什么饰品?',
    options: ['头饰', '耳饰', '颈饰', '手饰'],
    correct: 1
  },
  {
    question: '以下哪种文物是研究古滇国历史的重要实物证据?',
    options: ['滇王金印', '青铜贮贝器', '汉代简牍', '以上都是'],
    correct: 3
  },
  {
    question: '古滇国的社会等级制度是怎样的?',
    options: ['平等社会', '奴隶社会', '封建社会', '资本主义社会'],
    correct: 1
  },
  {
    question: '青铜锄是古滇国的什么农具?',
    options: ['收割工具', '挖掘工具', '播种工具', '灌溉工具'],
    correct: 1
  },
  {
    question: '河伯所遗址的发掘者是谁?',
    options: ['郭沫若', '裴文忠', '马曜', '李济'],
    correct: 2
  },
  {
    question: '古滇文化中的动物纹饰主要有哪些?',
    options: ['牛', '虎', '蛙', '以上都是'],
    correct: 3
  },
  {
    question: '铜制发簪是古滇国的什么饰品?',
    options: ['头饰', '耳饰', '颈饰', '腰饰'],
    correct: 0
  },
  {
    question: '汉代在云南设立益州郡是在哪一年?',
    options: ['公元前121年', '公元前109年', '公元25年', '公元100年'],
    correct: 1
  },
  {
    question: '古滇国的主要农作物是什么?',
    options: ['小米', '水稻', '小麦', '玉米'],
    correct: 1
  },
  {
    question: '青铜戈是古滇国的什么武器?',
    options: ['刺杀武器', '砍杀武器', '投掷武器', '防御武器'],
    correct: 0
  },
  {
    question: '河伯所文化遗址的保护现状如何?',
    options: ['已破坏', '部分保护', '完整保护', '未保护'],
    correct: 2
  },
  {
    question: '古滇国的陶器主要用于什么?',
    options: ['烹饪', '储存', '祭祀', '以上都是'],
    correct: 3
  },
  {
    question: '以下哪种器物不属于古滇国的青铜器?',
    options: ['鼎', '钟', '镜', '瓷碗'],
    correct: 3
  },
  {
    question: '滇王之印是谁赐予滇王的?',
    options: ['秦始皇', '汉武帝', '汉光武帝', '唐太宗'],
    correct: 1
  },
  {
    question: '古滇国的灭亡大约在什么时间?',
    options: ['公元前1世纪', '公元1世纪', '公元3世纪', '公元5世纪'],
    correct: 1
  },
  {
    question: '青铜鼓上的纹饰通常描绘什么?',
    options: ['战争场景', '祭祀场景', '生产场景', '以上都是'],
    correct: 3
  },
  {
    question: '河伯所文化遗址位于哪个城市附近?',
    options: ['昆明', '玉溪', '曲靖', '红河'],
    correct: 0
  },
  {
    question: '古滇国的玉器主要是什么材质?',
    options: ['和田玉', '翡翠', '岫玉', '本地玉'],
    correct: 3
  },
  {
    question: '铜制车马器是古滇国的什么器物?',
    options: ['交通工具配件', '兵器', '农具', '礼器'],
    correct: 0
  },
  {
    question: '以下哪个不是古滇文化的特点?',
    options: ['青铜文化', '稻作农业', '游牧生活', '独特艺术'],
    correct: 2
  },
  {
    question: '古滇国的冶铜技术来源于哪里?',
    options: ['中原', '本地发展', '西亚', '东南亚'],
    correct: 1
  },
  {
    question: '青铜贮贝器上的人物形象反映了古滇国的什么?',
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
          showToast('已退出登录');
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
    level = '📜 古滇学者';
    message = '你对古滇文化有深入了解，继续努力！';
  } else if (percentage >= 50) {
    level = '🔍 古滇探索者';
    message = '你对古滇文化有一定了解，还有更多知识等待探索！';
  } else {
    level = '🌱 古滇学徒';
    message = '开始你的古滇文化探索之旅吧！';
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
