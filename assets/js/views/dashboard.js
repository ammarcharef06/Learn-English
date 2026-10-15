/* لوحة التقدّم (الرئيسية) — تخطيط منظّم بلا تكرار */
import { t } from '../core/i18n.js';
import { esc, speakBtn, todayKey, pct, ringHTML } from '../core/utils.js';
import { progress, settings, goalForToday } from '../core/store.js';
import { streakInfo, overallStats, accuracy, badgesWithState } from '../core/gamify.js';
import { LEVELS, nextLessonSuggestion, curriculumStats, levelPercent } from '../data/curriculum.js';
import { STUDY_TIPS } from '../data/badges.js';
import { vocabularyEntries } from '../core/quizgen.js';
import { weakestFirst, stats as srsStats } from '../core/srs.js';
import { statCard, progressBar } from './shell.js';
import { nextReminderText, wordOfTheDay } from '../core/notify.js';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'صباح الخير ☀️';
  if (h < 17) return 'نهارك سعيد 🌤️';
  if (h < 21) return 'مساء الخير 🌆';
  return 'أهلاً بك في جلسة ليلية 🌙';
}

function tipOfDay() {
  const seed = Number(todayKey().replace(/-/g, '')) % STUDY_TIPS.length;
  return STUDY_TIPS[seed];
}

export function renderDashboard(host) {
  const st = streakInfo();
  const o = overallStats();
  const acc = accuracy();
  const q = goalForToday();
  const next = nextLessonSuggestion();
  const cs = curriculumStats();
  const due = srsStats(vocabularyEntries()).due;
  const badges = badgesWithState();
  const earned = badges.filter((b) => b.earned);
  const weak = weakestFirst(vocabularyEntries(), 6).filter((e) => (progress.items[e.itemId]?.wrong || 0) > 0 || !progress.items[e.itemId]);
  const today = progress.activity[todayKey()] || { q: 0, c: 0, minutes: 0, points: 0 };
  const goalReached = q.done >= q.target;
  const wod = wordOfTheDay();

  host.innerHTML = `
    <section class="hero">
      <span class="chip">${esc(greeting())}</span>
      <h1>${esc(t('dash.welcome'))}</h1>
      <p>${esc(t('dash.subtitle'))}</p>
      ${wod ? `<p class="mt-3"><b>📘 كلمة اليوم:</b> <span class="en" style="font-size:1.1rem">${esc(wod.en)}</span> — ${esc(wod.ar)} ${speakBtn(wod.en)}</p>` : ''}
      <div class="hero-actions">
        <a class="btn btn--solid" href="#/drill?mode=goal">🎯 ${esc(goalReached ? t('common.continue') : t('dash.goal'))}</a>
        <a class="btn" href="#/flashcards">🃏 ${esc(t('dash.quick.flash'))}${due ? ` (${due})` : ''}</a>
        <a class="btn" href="#/reading">📖 ${esc(t('dash.quick.read'))}</a>
      </div>
    </section>


    <div class="grid grid--4 mt-4">
      ${statCard({ label: t('common.points'), value: progress.points || 0, foot: `+${today.points || 0} ${t('common.today')}`, variant: 'stat--brand' })}
      ${statCard({ label: t('common.streak'), value: `${st.streak} 🔥`, foot: `أفضل سلسلة: ${st.best}`, variant: st.streak > 0 ? 'stat--ok' : '' })}
      ${statCard({ label: t('stats.accuracy'), value: `${acc}%`, foot: `${progress.totals.correct || 0} / ${progress.totals.questions || 0}` })}
      ${statCard({ label: t('stats.studyTime'), value: `${Math.round((progress.totals.seconds || 0) / 60)} د`, foot: `${q.done} ${t('common.questionsShort')} ${t('common.today')}` })}
    </div>

    <div class="grid grid--2 mt-4">
      <div class="card">
        <div class="card__title"><span class="ico" aria-hidden="true">🎯</span><h2>${esc(t('dash.goal'))}</h2></div>
        <div class="row wrap">
          ${ringHTML(pct(q.done, q.target), `${q.done}/${q.target}`)}
          <div class="grow">
            <p class="muted small">${goalReached ? 'أتممت هدف اليوم — أحسنت! 🎉' : `تبقّى ${Math.max(0, q.target - q.done)} سؤالاً لتُكمل هدف اليوم.`}</p>
            ${progressBar(pct(q.done, q.target), goalReached ? 'progress--ok' : '')}
            <div class="row wrap mt-3">
              <a class="btn btn--primary btn--sm" href="#/drill?mode=goal">${esc(goalReached ? t('common.continue') : t('common.start'))}</a>
              <a class="btn btn--ghost btn--sm" href="#/settings">${esc(t('common.goal'))}: ${q.target}</a>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <p class="small muted">🔔 ${esc(t('set.reminderOn'))}: ${esc(settings.reminder.enabled ? nextReminderText() : 'مُعطَّل')}</p>
      </div>

      <div class="card card--brand">
        <div class="card__title"><span class="ico" aria-hidden="true">🧭</span><h2>${esc(t('dash.continue'))}</h2></div>
        ${next ? `
          <p class="muted small">${esc(next.unit.levelLabel)} · ${esc(next.unit.goal || '')}</p>
          <div class="row row--between wrap">
            <b>${next.unit.icon} ${esc(next.unit.title)}</b>
            <a class="btn btn--primary btn--sm" href="#/lesson/${next.unit.id}/${next.lessonIndex}">${esc(t('common.continue'))} ←</a>
          </div>` : `
          <p class="muted small">أكملت كل الوحدات — حافظ على مستواك بالتدريب والمراجعة.</p>
          <a class="btn btn--primary btn--sm" href="#/drill?mode=smart">🧠 ${esc(t('dash.smartDrill'))}</a>`}
        <div class="divider"></div>
        <p class="small muted">💡 ${esc(tipOfDay())}</p>
      </div>
    </div>

    <div class="card mt-4">
      <div class="card__title">
        <span class="ico" aria-hidden="true">📊</span><h2>${esc(t('dash.levelProgress'))}</h2>
        <span class="spacer chip chip--brand">${o.unitsDone}/${o.unitsTotal} ${esc(t('lessons.units'))}</span>
      </div>
      <div class="stack">
        ${LEVELS.map((lv) => {
          const p = levelPercent(lv.id);
          return `<div>
            <div class="row row--between">
              <a href="#/level/${lv.id}" class="link-card">
                <span aria-hidden="true">${lv.icon}</span><b>${esc(lv.label)}</b>
                <span class="chip">${lv.units.length} ${esc(t('lessons.units'))}</span>
              </a>
              <span class="small muted">${p}%</span>
            </div>
            <div class="mt-3">${progressBar(p, p >= 100 ? 'progress--ok' : '')}</div>
          </div>`;
        }).join('')}
      </div>
      <div class="divider"></div>
      <div class="row wrap" style="gap:8px">
        <span class="chip chip--brand">${cs.vocab} ${esc(t('common.words'))}</span>
        <span class="chip">${cs.grammar} ${esc(t('lessons.grammar'))}</span>
        <span class="chip">${cs.readings} ${esc(t('nav.reading'))}</span>
        <span class="chip chip--ok">${cs.done} ${esc(t('common.done'))}</span>
      </div>
    </div>

    <div class="grid grid--2 mt-4">
      <div class="card">
        <div class="card__title"><span class="ico" aria-hidden="true">🩹</span><h2>${esc(t('common.weak'))}</h2></div>
        ${weak.length ? `
          <div>${weak.map((e) => `<div class="item-row">
            <span class="item-row__en">${esc(e.en)}</span>
            <span class="item-row__ar">${esc(e.ar)}</span>
            ${speakBtn(e.en)}
            <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(e.en)}" data-ar="${esc(e.ar)}" aria-label="أضف إلى دفتري">📒</button>
          </div>`).join('')}</div>
          <a class="btn btn--sm btn--primary mt-3" href="#/drill?mode=smart">🧠 ${esc(t('dash.smartDrill'))}</a>`
        : `<div class="empty"><span class="ico" aria-hidden="true">✨</span><p>لا أخطاء مسجّلة بعد — ابدأ التدريب وسنراقب نقاط ضعفك تلقائياً.</p></div>`}
      </div>

      <div class="card">
        <div class="card__title">
          <span class="ico" aria-hidden="true">🏅</span><h2>${esc(t('stats.badges'))}</h2>
          <span class="spacer small muted">${earned.length}/${badges.length}</span>
        </div>
        <div class="row wrap" style="gap:8px">
          ${earned.slice(-9).reverse().map((b) => `<span class="chip chip--ok" title="${esc(b.descAr)}">${b.icon} ${esc(b.ar)}</span>`).join('') || '<span class="muted small">لم تكسب شارات بعد — أول إجابة تمنحك 🚀</span>'}
        </div>
        <a class="btn btn--sm mt-3" href="#/stats">${esc(t('nav.stats'))} ←</a>
      </div>
    </div>
  `;
}

