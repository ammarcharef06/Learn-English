/* لوحة التقدّم (الرئيسية) */
import { t } from '../core/i18n.js';
import { esc, speakBtn, todayKey, pct, qs, ringHTML } from '../core/utils.js';
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
  const tip = tipOfDay();
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
      ${wod ? `<p style="margin-top:10px"><b>📘 كلمة اليوم:</b> <span class="en" style="font-size:1.15rem">${esc(wod.en)}</span> = ${esc(wod.ar)} ${speakBtn(wod.en)}</p>` : ''}
      <div class="hero__actions">
        <a class="btn btn--solid" href="#/drills?start=mixed">🎯 ${esc(t('dash.quick.exam'))}</a>
        <a class="btn" href="#/drills?source=smart">🧠 ${esc(t('dash.smartDrill'))}</a>
        <a class="btn" href="#/flashcards">🃏 ${esc(t('dash.quick.flash'))}${due ? ` (${due})` : ''}</a>
        <a class="btn" href="#/reading">📖 ${esc(t('dash.quick.read'))}</a>
      </div>
    </section>

    <div class="grid grid--4" style="margin-top:18px">
      ${statCard({ label: t('common.points'), value: progress.points || 0, foot: `+${today.points || 0} ${t('common.today')}`, variant: 'stat--brand' })}
      ${statCard({ label: t('common.streak'), value: `${st.streak} 🔥`, foot: `أفضل سلسلة: ${st.best}`, variant: st.streak > 0 ? 'stat--ok' : '' })}
      ${statCard({ label: t('stats.accuracy'), value: `${acc}%`, foot: `${progress.totals.correct || 0} / ${progress.totals.questions || 0}` })}
      ${statCard({ label: t('stats.studyTime'), value: `${Math.round((progress.totals.seconds || 0) / 60)} د`, foot: `${q.done} ${t('common.questionsShort')} ${t('common.today')}` })}
    </div>

    <div class="grid grid--2" style="margin-top:18px">
      <div class="card">
        <div class="card__title"><span class="ico">🎯</span><h2>${esc(t('dash.goal'))}</h2></div>
        <div class="row" style="gap:18px;align-items:center">
          ${ringHTML(pct(q.done, q.target), `${q.done}/${q.target}`)}
          <div class="grow">
            <p class="muted small" style="margin-bottom:8px">${goalReached ? 'أتممت هدف اليوم — أحسنت! 🎉' : `تبقّى ${Math.max(0, q.target - q.done)} سؤالاً لتُكمل هدف اليوم.`}</p>
            ${progressBar(pct(q.done, q.target), q.done >= q.target ? 'progress--ok' : '')}
            <div class="row" style="margin-top:12px;gap:8px;flex-wrap:wrap">
              <a class="btn btn--primary btn--sm" href="#/drills?start=goal">${esc(q.done >= q.target ? t('common.continue') : t('common.start'))}</a>
              <a class="btn btn--sm" href="#/settings">${esc(t('common.goal'))}: ${q.target}</a>
            </div>
          </div>
        </div>
        <div class="divider"></div>
        <div class="small muted">🔔 ${esc(t('set.reminderOn'))}: ${esc(settings.reminder.enabled ? nextReminderText() : 'مُعطَّل')}</div>
      </div>

      <div class="card">
        <div class="card__title"><span class="ico">💡</span><h2>${esc(t('dash.tipOfDay'))}</h2></div>
        <div class="tip-box tip-box--brand">${esc(tip)}</div>
        <div class="divider"></div>
        <div class="card__title"><span class="ico">🧠</span><h3>${esc(t('dash.smartDrill'))}</h3></div>
        <p class="small muted">${esc(t('dash.smartDrillDesc'))}</p>
        <a class="btn btn--primary btn--sm" href="#/drills?source=smart">${esc(t('common.start'))} ←</a>
      </div>
    </div>

    ${next ? `<div class="card card--brand" style="margin-top:18px">
      <div class="card__title"><span class="ico">${next.unit.levelIcon}</span><h2>${esc(t('dash.continue'))}</h2></div>
      <div class="row row--between row--wrap">
        <div>
          <b>${esc(next.unit.title)}</b>
          <div class="small muted">${esc(next.unit.levelLabel)} · ${esc(next.unit.goal)}</div>
        </div>
        <a class="btn btn--primary" href="#/lesson/${next.unit.id}/${next.lessonIndex}">${esc(t('common.continue'))} →</a>
      </div>
    </div>` : ''}

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">📊</span><h2>${esc(t('dash.levelProgress'))}</h2></div>
      <div class="stack">
        ${LEVELS.map((lv) => {
          const p = levelPercent(lv.id);
          return `<div>
            <div class="row row--between">
              <a href="#/level/${lv.id}" class="row" style="gap:8px;text-decoration:none;color:inherit">
                <span>${lv.icon}</span><b>${esc(lv.label)}</b>
                <span class="chip">${lv.units.length} ${esc(t('lessons.units'))}</span>
              </a>
              <span class="small muted">${p}%</span>
            </div>
            <div style="margin-top:6px">${progressBar(p, p >= 100 ? 'progress--ok' : '')}</div>
          </div>`;
        }).join('')}
      </div>
      <div class="divider"></div>
      <div class="row row--wrap" style="gap:8px">
        <span class="chip chip--brand">${cs.units} ${esc(t('lessons.units'))}</span>
        <span class="chip">${cs.vocab} ${esc(t('common.words'))}</span>
        <span class="chip">${cs.grammar} ${esc(t('lessons.grammar'))}</span>
        <span class="chip">${cs.readings} ${esc(t('nav.reading'))}</span>
        <span class="chip chip--ok">${cs.done} ${esc(t('common.done'))}</span>
      </div>
    </div>

    <div class="grid grid--2" style="margin-top:18px">
      <div class="card">
        <div class="card__title"><span class="ico">🩹</span><h2>${esc(t('common.weak'))}</h2></div>
        ${weak.length ? `<div>${weak.map((e) => `<div class="item-row">
            <span class="item-row__en">${esc(e.en)}</span>
            <span class="item-row__ar">${esc(e.ar)}</span>
            ${speakBtn(e.en)}
            <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(e.en)}" data-ar="${esc(e.ar)}">📒</button>
          </div>`).join('')}</div>
          <a class="btn btn--sm btn--primary" style="margin-top:12px" href="#/drills?source=smart">تدرّب عليها ←</a>`
        : `<div class="empty"><span class="ico">✨</span><p>لا أخطاء مسجّلة بعد — ابدأ التدريب وسنراقب نقاط ضعفك تلقائياً.</p></div>`}
      </div>

      <div class="card">
        <div class="card__title"><span class="ico">🏅</span><h2>${esc(t('stats.badges'))}</h2></div>
        <p class="small muted">${earned.length} / ${badges.length} ${esc(t('stats.earned'))}</p>
        <div class="row row--wrap" style="gap:8px;margin-top:8px">
          ${earned.slice(-8).reverse().map((b) => `<span class="chip chip--ok" title="${esc(b.descAr)}">${b.icon} ${esc(b.ar)}</span>`).join('') || '<span class="muted small">لم تكسب شارات بعد — أول إجابة تمنحك 🚀</span>'}
        </div>
        <a class="btn btn--sm" style="margin-top:12px" href="#/stats">${esc(t('nav.stats'))} ←</a>
      </div>
    </div>
  `;
  window.__leaAfterUnlock = () => renderDashboard(host);
}
