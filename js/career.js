const CAREER_KEY = 'heboCareer';

function getCareer() {
  try {
    const data = localStorage.getItem(CAREER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
}

function startCareer() {
  const career = {
    startedAt: Date.now(),
    level1: null,
    level2: null,
    level3: null,
    completed: false
  };
  localStorage.setItem(CAREER_KEY, JSON.stringify(career));
  return career;
}

function saveLevelResult(level, score, maxScore, timeMs) {
  const career = getCareer() || startCareer();
  career['level' + level] = {
    score: score,
    maxScore: maxScore,
    time: timeMs,
    completedAt: Date.now()
  };
  if (level === 3) {
    career.completed = true;
  }
  localStorage.setItem(CAREER_KEY, JSON.stringify(career));
}

function getLevelResult(level) {
  const career = getCareer();
  return career ? career['level' + level] : null;
}

function canPlayLevel(level) {
  if (level === 1) return true;
  return !!getLevelResult(level - 1);
}

function getTotalScore() {
  const career = getCareer();
  if (!career) return 0;
  let total = 0;
  [1, 2, 3].forEach(function(l) {
    const r = career['level' + l];
    if (r) total += r.score;
  });
  return total;
}

function getTotalMaxScore() {
  const career = getCareer();
  if (!career) return 0;
  let total = 0;
  [1, 2, 3].forEach(function(l) {
    const r = career['level' + l];
    if (r) total += r.maxScore;
  });
  return total;
}

function getTotalTime() {
  const career = getCareer();
  if (!career) return 0;
  let total = 0;
  [1, 2, 3].forEach(function(l) {
    const r = career['level' + l];
    if (r) total += r.time;
  });
  return total;
}

function getRank() {
  const total = getTotalScore();
  const max = getTotalMaxScore();
  if (!max) return { title: '益州郡新兵', badge: '🌱', desc: '尚未完成任何考核' };
  const pct = total / max;
  if (pct >= 0.9) return { title: '益州郡太守', badge: '🏆', desc: '才华横溢，堪当大任！' };
  if (pct >= 0.75) return { title: '益州郡长史', badge: '📜', desc: '学识渊博，栋梁之材！' };
  if (pct >= 0.6) return { title: '益州郡功曹', badge: '🔍', desc: '勤勉踏实，渐入佳境！' };
  if (pct >= 0.4) return { title: '益州郡书佐', badge: '📚', desc: '初露头角，继续努力！' };
  return { title: '益州郡门吏', badge: '🌾', desc: '初入职场，多多历练！' };
}

function getPersonalizedTitle() {
  var career = getCareer();
  if (!career) return null;

  var bestLevel = -1;
  var bestPct = -1;
  var bestTime = 0;
  var levelData = [
    { level: 1, name: '策问', type: '知识', icon: '📝' },
    { level: 2, name: '勘探', type: '考古', icon: '⛏️' },
    { level: 3, name: '修复', type: '拼图', icon: '🧩' }
  ];

  for (var i = 0; i < levelData.length; i++) {
    var r = career['level' + levelData[i].level];
    if (r && r.maxScore > 0) {
      var pct = r.score / r.maxScore;
      if (pct > bestPct) {
        bestPct = pct;
        bestLevel = i;
        bestTime = r.time || 0;
      }
    }
  }

  if (bestLevel === -1) return null;

  var info = levelData[bestLevel];
  var titles = {
    1: ['求知学徒', '博学书佐', '策问高手', '古滇百科全书'],
    2: ['实习考古员', '铲土能手', '勘探先锋', '金牌铲屎官'],
    3: ['拼图学徒', '修复工匠', '拼图大师', '皇家修复师']
  };

  var idx = 0;
  if (bestPct >= 0.9) idx = 3;
  else if (bestPct >= 0.75) idx = 2;
  else if (bestPct >= 0.6) idx = 1;

  var timeSec = bestTime / 1000;
  var modifier = '';
  if (timeSec > 0 && timeSec < 30) modifier = '⚡闪电';
  else if (timeSec > 0 && timeSec < 60) modifier = '迅捷';
  else if (timeSec > 180) modifier = '从容';

  var titleName = titles[info.level][idx];

  return {
    full: (modifier ? modifier : '') + titleName + '（' + info.type + '向）',
    short: titleName,
    type: info.type,
    modifier: modifier,
    scorePct: Math.round(bestPct * 100),
    levelName: info.name,
    badge: info.icon
  };
}

function getCareerTitle(level) {
  const map = {
    1: { name: '入职试炼', sub: '策问考核', icon: '📝' },
    2: { name: '实地勘探', sub: '寻找官印', icon: '⛏️' },
    3: { name: '文物修复', sub: '归位国宝', icon: '🧩' }
  };
  return map[level] || map[1];
}

function resetCareer() {
  localStorage.removeItem(CAREER_KEY);
}

function formatTimeMs(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return m + '分' + (rs < 10 ? '0' : '') + rs + '秒';
}

function formatTimeSec(s) {
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return (m > 0 ? m + ':' : '') + (rs < 10 ? '0' : '') + rs;
}
