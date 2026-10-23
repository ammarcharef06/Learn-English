/* تكرار متباعد (SRS) — نظام صناديق بسيط وفعّال */
import { progress, saveProgress } from './store.js';
import { todayKey, dateKey, addDays, daysBetween } from './utils.js';

export const BOX_DAYS = [0, 1, 2, 4, 7, 14, 30, 60, 120, 240];

export function getItem(itemId) {
  return progress.items[itemId] || { seen: 0, correct: 0, wrong: 0, box: 0, due: todayKey(), last: '' };
}

export function gradeItem(itemId, quality) {
  // quality: 0 = لم أتذكر، 1 = صعب، 2 = جيد، 3 = سهل
  saveProgress((p) => {
    const it = p.items[itemId] || { seen: 0, correct: 0, wrong: 0, box: 0, due: todayKey(), last: '' };
    it.seen += 1;
    if (quality === 0) {
      it.wrong += 1;
      it.box = 0;
    } else {
      it.correct += 1;
      it.box = quality === 1 ? Math.max(1, it.box) : Math.min(BOX_DAYS.length - 1, it.box + (quality === 3 ? 2 : 1));
    }
    const interval = BOX_DAYS[it.box];
    it.due = dateKey(addDays(new Date(), interval));
    it.last = todayKey();
    p.items[itemId] = it;
    p.missionActivity = p.missionActivity || {};
    const mission = p.missionActivity[todayKey()] || { reviewedItems: [] };
    mission.reviewedItems = mission.reviewedItems || [];
    if (!mission.reviewedItems.includes(itemId) && mission.reviewedItems.length < 20) {
      mission.reviewedItems.push(itemId);
    }
    p.missionActivity[todayKey()] = mission;
  });
  return getItem(itemId);
}

export function isDue(itemId, ref = todayKey()) {
  const it = progress.items[itemId];
  if (!it) return true;
  return daysBetween(it.due || ref, ref) >= 0;
}

export function dueCount(entries) {
  return entries.reduce((n, e) => n + (isDue(e.itemId) ? 1 : 0), 0);
}

export function stats(entries) {
  const total = entries.length;
  let newCount = 0, learning = 0, mature = 0, due = 0;
  for (const e of entries) {
    const it = progress.items[e.itemId];
    if (!it || !it.seen) newCount++;
    else if (it.box >= 5) mature++;
    else learning++;
    if (isDue(e.itemId)) due++;
  }
  return { total, new: newCount, learning, mature, due, mastered: mature };
}

/* ترتيب الأضعف: أخطاء أكثر أولاً، ثم غير المرئية */
export function weakestFirst(entries, limit = null) {
  const scored = entries.map((e) => {
    const it = progress.items[e.itemId];
    const seen = it ? it.seen : 0;
    const wrong = it ? it.wrong : 0;
    const acc = it && seen ? it.correct / seen : 0.5;
    const weight = (wrong * 2.2) + (seen === 0 ? 0.6 : 0) + (1 - acc);
    return { e, weight, seen };
  }).sort((a, b) => b.weight - a.weight);
  const out = scored.map((s) => s.e);
  return limit ? out.slice(0, limit) : out;
}

export function masteryOf(itemId) {
  const it = progress.items[itemId];
  if (!it || !it.seen) return 0;
  const acc = it.correct / it.seen;
  return Math.round(Math.min(1, (it.box / (BOX_DAYS.length - 1)) * 0.7 + acc * 0.3) * 100);
}

export function buildSession(entries, size = 20) {
  const seen = new Set();
  const out = [];
  const take = (arr, limit) => {
    let added = 0;
    for (const e of arr) {
      if (added >= limit || out.length >= size) break;
      if (seen.has(e.itemId)) continue;
      seen.add(e.itemId);
      out.push(e);
      added++;
    }
  };
  const withItems = entries.filter((e) => progress.items[e.itemId]);
  const due = withItems.filter((e) => isDue(e.itemId));
  const learning = withItems.filter((e) => !isDue(e.itemId));
  const fresh = entries.filter((e) => !progress.items[e.itemId]);

  take(due, Math.ceil(size * 0.6));
  take(fresh, Math.ceil(size * 0.4));
  take(learning, size);
  take(due, size);
  take(fresh, size);
  return out;
}
