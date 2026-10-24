/* SuperMemo-2 spaced repetition for every reviewable curriculum item. */
import { progress, saveProgress } from './store.js';
import { todayKey, dateKey, addDays, daysBetween } from './utils.js';

export const MIN_EASE_FACTOR = 1.3;
export const INITIAL_EASE_FACTOR = 2.5;
export const MASTERY_INTERVAL_DAYS = 21;

function newItem() {
  return {
    algorithm: 'sm2',
    repetitions: 0,
    interval: 0,
    easeFactor: INITIAL_EASE_FACTOR,
    seen: 0,
    correct: 0,
    wrong: 0,
    lapses: 0,
    due: todayKey(),
    last: '',
  };
}

function isSm2Item(item) {
  return item?.algorithm === 'sm2';
}

export function getItem(itemId) {
  const item = progress.items[itemId];
  return isSm2Item(item) ? item : newItem();
}

export function nextInterval(item, quality) {
  if (quality < 3) return 1;
  if (item.repetitions === 0) return 1;
  if (item.repetitions === 1) return 6;
  return Math.max(1, Math.round(item.interval * item.easeFactor));
}

export function gradeItem(itemId, quality) {
  if (!Number.isInteger(quality) || quality < 0 || quality > 5) {
    throw new RangeError('SM-2 quality must be an integer from 0 to 5.');
  }

  saveProgress((p) => {
    const existing = p.items[itemId];
    const it = isSm2Item(existing) ? existing : newItem();
    const efDelta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    it.easeFactor = Math.max(MIN_EASE_FACTOR, it.easeFactor + efDelta);
    it.seen += 1;

    if (quality < 3) {
      it.wrong += 1;
      it.lapses += 1;
      it.repetitions = 0;
    } else {
      it.correct += 1;
      it.interval = nextInterval(it, quality);
      it.repetitions += 1;
    }

    if (quality < 3) it.interval = nextInterval(it, quality);
    it.due = dateKey(addDays(new Date(), it.interval));
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
  if (!isSm2Item(it)) return true;
  return daysBetween(it.due || ref, ref) >= 0;
}

export function dueCount(entries) {
  return entries.reduce((n, e) => n + (isDue(e.itemId) ? 1 : 0), 0);
}

export function dueEntries(entries, ref = todayKey()) {
  return entries.filter((entry) => isSm2Item(progress.items[entry.itemId])
    && progress.items[entry.itemId].seen > 0 && isDue(entry.itemId, ref));
}

export function stats(entries) {
  const total = entries.length;
  let newCount = 0, learning = 0, mature = 0, due = 0;
  for (const entry of entries) {
    const item = progress.items[entry.itemId];
    if (!isSm2Item(item) || !item.seen) newCount++;
    else if (item.repetitions >= 3 && item.interval >= MASTERY_INTERVAL_DAYS) mature++;
    else learning++;
    if (isDue(entry.itemId)) due++;
  }
  return { total, new: newCount, learning, mature, due, mastered: mature };
}

export function weakestFirst(entries, limit = null) {
  const scored = entries.map((entry) => {
    const stored = progress.items[entry.itemId];
    const item = isSm2Item(stored) ? stored : null;
    const seen = item ? item.seen : 0;
    const accuracy = item && seen ? item.correct / seen : 0.5;
    const lapseWeight = item ? item.lapses * 2.2 : 0;
    const easePenalty = item ? Math.max(0, INITIAL_EASE_FACTOR - item.easeFactor) : 0;
    const weight = lapseWeight + (seen === 0 ? 0.6 : 0) + (1 - accuracy) + easePenalty;
    return { entry, weight };
  }).sort((a, b) => b.weight - a.weight);
  const out = scored.map(({ entry }) => entry);
  return limit ? out.slice(0, limit) : out;
}

export function smartReviewPlan(entries, size = 15, ref = todayKey()) {
  const limit = Math.max(0, Math.floor(Number(size) || 0));
  if (!limit) return { entries: [], dueCount: 0, weakCount: 0, newCount: 0 };

  const unique = [...new Map(entries.map((entry) => [entry.itemId, entry])).values()];
  const due = unique.flatMap((entry) => {
    const item = progress.items[entry.itemId];
    if (!isSm2Item(item) || !item.seen) return [];
    const overdueDays = daysBetween(item.due || ref, ref);
    if (overdueDays < 0) return [];
    const accuracy = item.correct / Math.max(1, item.seen);
    const weak = item.lapses > 0 && (accuracy < 0.7 || item.easeFactor < 2.1);
    return [{
      entry,
      weak,
      priority: overdueDays * 10 + (1 - accuracy) * 4
        + Math.min(item.lapses, 8) * 0.4
        + Math.max(0, INITIAL_EASE_FACTOR - item.easeFactor),
    }];
  }).sort((a, b) => b.priority - a.priority || a.entry.itemId.localeCompare(b.entry.itemId));

  const selectedDue = due.slice(0, limit);
  const selected = selectedDue.map(({ entry }) => entry);
  const selectedIds = new Set(selected.map((entry) => entry.itemId));
  const freshLimit = Math.min(5, limit - selected.length);
  const fresh = unique.filter((entry) => !isSm2Item(progress.items[entry.itemId]) && !selectedIds.has(entry.itemId))
    .slice(0, freshLimit);

  return {
    entries: [...selected, ...fresh],
    dueCount: selected.length,
    weakCount: selectedDue.filter((item) => item.weak).length,
    newCount: fresh.length,
  };
}

export function masteryOf(itemId) {
  const item = progress.items[itemId];
  if (!isSm2Item(item) || !item.seen) return 0;
  const repetitionScore = Math.min(1, item.repetitions / 5) * 0.6;
  const intervalScore = Math.min(1, item.interval / MASTERY_INTERVAL_DAYS) * 0.4;
  return Math.round((repetitionScore + intervalScore) * 100);
}

export function buildSession(entries, size = 20) {
  const seen = new Set();
  const out = [];
  const take = (arr, limit) => {
    let added = 0;
    for (const entry of arr) {
      if (added >= limit || out.length >= size) break;
      if (seen.has(entry.itemId)) continue;
      seen.add(entry.itemId);
      out.push(entry);
      added++;
    }
  };
  const withItems = entries.filter((entry) => isSm2Item(progress.items[entry.itemId]));
  const due = withItems.filter((entry) => isDue(entry.itemId));
  const learning = withItems.filter((entry) => !isDue(entry.itemId));
  const fresh = entries.filter((entry) => !isSm2Item(progress.items[entry.itemId]));

  take(due, Math.ceil(size * 0.6));
  take(fresh, Math.ceil(size * 0.4));
  take(learning, size);
  take(due, size);
  take(fresh, size);
  return out;
}
