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
