/* ============================================================================
   LEA v2 — Voice Practice Engine
   SpeechRecognition wrapper + pronunciation scoring
   ============================================================================ */

const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

export function isSupported() {
  return !!SR;
}

export function startRecognition({ lang = 'en-US', onResult, onError, onEnd, continuous = false, interim = true } = {}) {
  if (!SR) {
    onError?.(new Error('Speech Recognition not supported'));
    return null;
  }
  const rec = new SR();
  rec.lang = lang;
  rec.continuous = continuous;
  rec.interimResults = interim;
  rec.maxAlternatives = 3;

  rec.onresult = (e) => {
    const results = [];
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      const alternatives = [];
      for (let j = 0; j < r.length; j++) {
        alternatives.push({ transcript: r[j].transcript, confidence: r[j].confidence });
      }
      results.push({ isFinal: r.isFinal, alternatives });
    }
    onResult?.(results);
  };
  rec.onerror = (e) => onError?.(new Error(e.error || 'recognition-error'));
  rec.onend = () => onEnd?.();

  try {
    rec.start();
    return rec;
  } catch (e) {
    onError?.(e);
    return null;
  }
}

export function stopRecognition(rec) {
  try { rec?.stop(); } catch {}
}

function lev(a, b) {
  a = a.toLowerCase().trim();
  b = b.toLowerCase().trim();
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

export function scorePronunciation(target, spoken) {
  if (!spoken || !spoken.trim()) {
    return { score: 0, percent: 0, words: [], grade: 0, spoken: '' };
  }

  const targetWords = target.toLowerCase().replace(/[^\w\s']/g, '').split(/\s+/).filter(Boolean);
  const spokenWords = spoken.toLowerCase().replace(/[^\w\s']/g, '').split(/\s+/).filter(Boolean);

  const matched = new Array(targetWords.length).fill(false);
  for (let i = 0; i < targetWords.length; i++) {
    const tw = targetWords[i];
    let bestSim = 0;
    for (let j = 0; j < spokenWords.length; j++) {
      const sim = 1 - lev(tw, spokenWords[j]) / Math.max(tw.length, spokenWords[j].length);
      if (sim > bestSim) bestSim = sim;
    }
    if (bestSim >= 0.65) matched[i] = true;
  }

  const matchedCount = matched.filter(Boolean).length;
  const percent = Math.round((matchedCount / targetWords.length) * 100);
  const overallSim = 1 - lev(target.toLowerCase(), spoken.toLowerCase()) / Math.max(target.length, spoken.length);
  const score = Math.round(percent * 0.7 + overallSim * 100 * 0.3);

  let grade = 0;
  if (score >= 90) grade = 5;
  else if (score >= 75) grade = 4;
  else if (score >= 55) grade = 3;
  else if (score >= 30) grade = 1;

  return {
    score,
    percent,
    words: targetWords.map((w, i) => ({ word: w, ok: matched[i] })),
    grade,
    spoken,
  };
}

export function sparkStage(masteryPct) {
  if (masteryPct >= 90) return 5;
  if (masteryPct >= 75) return 4;
  if (masteryPct >= 50) return 3;
  if (masteryPct >= 25) return 2;
  return 1;
}