/* الإحصائيات والرسوم البيانية */
import { t } from '../core/i18n.js';
import { esc, qs, pct, todayKey, addDays, dateKey, dayNameAr, fmtDuration, speakBtn } from '../core/utils.js';
import { progress } from '../core/store.js';
import { accuracy, badgesWithState, streakInfo, overallStats, levelStats } from '../core/gamify.js';
import { vocabularyEntries, curriculumReviewEntries } from '../core/quizgen.js';
import { getItem, weakestFirst } from '../core/srs.js';
import { LEVELS } from '../data/curriculum.js';
import { pageHead, progressBar, statCard } from './shell.js';
import { weeklySummary } from '../core/journey.js';

const TYPE_LABELS = {
  mcq: 'اختيار من متعدد', fill: 'ملء الفراغ', order: 'ترتيب الكلمات',
  match: 'توصيل ومطابقة', translate: 'ترجمة', listen: 'استماع', flash: 'بطاقات الحفظ',
};
const LEVEL_LABELS = { a1: 'A1 مبتدئ', a2: 'A2 ما قبل المتوسط', b1: 'B1 متوسط', ref: 'المراجع' };

export function renderStats(host) {
  const totals = progress.totals || {};
  const acc = accuracy();
  const st = streakInfo();
  const badges = badgesWithState();
  const earned = badges.filter((b) => b.earned);
  const o = overallStats();
  const minutes = Math.round((totals.seconds || 0) / 60);
  const week = weeklySummary();

  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = dateKey(addDays(new Date(), -i));
    const a = progress.activity?.[d] || { q: 0, c: 0, minutes: 0 };
    days.push({ key: d, q: a.q || 0, c: a.c || 0, minutes: a.minutes || 0 });
  }
  const maxQ = Math.max(10, ...days.map((d) => d.q));

  const byType = Object.entries(progress.byType || {}).map(([k, v]) => ({ k, ...v, acc: pct(v.c, v.q) }));
  const byLevel = Object.entries(progress.byLevel || {}).map(([k, v]) => ({ k, ...v, acc: pct(v.c, v.q) }));
  const reviewEntries = [...vocabularyEntries(), ...curriculumReviewEntries()];
  const weak = weakestFirst(reviewEntries, 12).filter((entry) => getItem(entry.itemId).lapses > 0);

  host.innerHTML = `
    ${pageHead({ icon: '📊', title: t('stats.title'), subtitle: t('stats.subtitle') })}

    <div class="grid grid--4">
      ${statCard({ label: t('common.points'), value: progress.points || 0, foot: `⭐ ${earned.length} ${t('stats.earned')}`, variant: 'stat--brand' })}
      ${statCard({ label: t('stats.accuracy'), value: `${acc}%`, foot: `${totals.correct || 0} / ${totals.questions || 0}`, variant: acc >= 70 ? 'stat--ok' : acc ? 'stat--bad' : '' })}
      ${statCard({ label: t('common.streak'), value: st.streak, foot: `أفضل سلسلة: ${st.best}` })}
      ${statCard({ label: t('stats.studyTime'), value: `${minutes} د`, foot: `${(totals.sessions || 0)} ${t('stats.sessions')}` })}
    </div>

    <section class="card weekly-report" aria-labelledby="weeklyReportTitle" style="margin-top:18px">
      <div class="dashboard-section-head">
        <div class="card__title"><span class="dashboard-icon" aria-hidden="true">🗓️</span><div><span class="dashboard-label">${esc(t('journey.weekly'))}</span><h2 id="weeklyReportTitle">${esc(t('journey.weeklyTitle'))}</h2></div></div>
        <a class="btn btn--sm" href="#/journey">${esc(t('journey.openMap'))} ←</a>
      </div>
      <div class="grid grid--4">
        ${statCard({ label: t('journey.studyDays'), value: `${week.current.activeDays}/7`, foot: `${t('journey.previousWeek')}: ${week.previous.activeDays}/7` })}
        ${statCard({ label: t('journey.questions'), value: week.current.questions, foot: `${t('journey.previousWeek')}: ${week.previous.questions}` })}
        ${statCard({ label: t('journey.talks'), value: week.current.conversations, foot: `${t('journey.previousWeek')}: ${week.previous.conversations}` })}
        ${statCard({ label: t('stats.accuracy'), value: `${week.current.accuracy}%`, foot: `${week.current.minutes} ${t('stats.studyTime')}` })}
      </div>
      <p class="muted small" style="margin-top:12px">${esc(week.current.activeDays ? t('journey.weeklyEncouragement') : t('journey.weeklyEmpty'))} 🔒 ${esc(t('journey.localOnly'))}</p>
    </section>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">📈</span><h2>${t('stats.last14')}</h2></div>
      ${days.every((d) => d.q === 0) ? `<div class="empty"><span class="ico">🌱</span><p>${t('stats.noData')}</p></div>` : `
      <div class="bars">
        ${days.map((d) => `<div class="bars__col" title="${d.q} سؤال · ${d.minutes} دقيقة">
          <span class="tiny muted">${d.q || ''}</span>
          <div class="bars__bar ${d.q ? '' : 'bars__bar--empty'}" style="height:${Math.max(4, (d.q / maxQ) * 100)}%"></div>
          <span class="bars__label">${dayNameAr(d.key).slice(0, 3)}</span>
        </div>`).join('')}
      </div>`}
      <div class="row row--wrap" style="gap:8px;margin-top:12px">
        <span class="chip">إجمالي: ${totals.questions || 0} سؤال</span>
        <span class="chip">صحيحة: ${totals.correct || 0}</span>
        <span class="chip">أفضل تتابع: ${progress.bestCombo || 0} 🔥</span>
      </div>
    </div>

    <div class="grid grid--2" style="margin-top:18px">
      <div class="card">
        <div class="card__title"><span class="ico">🧩</span><h2>${t('stats.byType')}</h2></div>
        ${byType.length ? byType.sort((a, b) => b.q - a.q).map((r) => `<div style="margin-bottom:12px">
          <div class="row row--between"><span>${esc(TYPE_LABELS[r.k] || r.k)}</span><span class="small muted">${r.c}/${r.q} · ${r.acc}%</span></div>
          <div style="margin-top:4px">${progressBar(r.acc, r.acc >= 80 ? 'progress--ok' : r.acc < 50 ? 'progress--warn' : '')}</div>
        </div>`).join('') : `<p class="muted small">${t('stats.noData')}</p>`}
      </div>

      <div class="card">
        <div class="card__title"><span class="ico">🎚️</span><h2>${t('stats.byLevel')}</h2></div>
        ${byLevel.length ? byLevel.map((r) => `<div style="margin-bottom:12px">
          <div class="row row--between"><span>${esc(LEVEL_LABELS[r.k] || r.k)}</span><span class="small muted">${r.c}/${r.q} · ${r.acc}%</span></div>
          <div style="margin-top:4px">${progressBar(r.acc, r.acc >= 80 ? 'progress--ok' : r.acc < 50 ? 'progress--warn' : '')}</div>
        </div>`).join('') : `<p class="muted small">${t('stats.noData')}</p>`}
        <div class="divider"></div>
        <div class="row row--between"><b>${t('dash.courseProgress')}</b><span class="small muted">${o.unitsDone}/${o.unitsTotal}</span></div>
        <div style="margin-top:6px">${progressBar(o.percent, o.percent >= 100 ? 'progress--ok' : '')}</div>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🏅</span><h2>${t('stats.badges')} (${earned.length}/${badges.length})</h2></div>
      <div class="badge-grid">
        ${badges.map((b) => `<div class="badge-item ${b.earned ? 'is-earned' : ''}">
          <span class="ico" title="${esc(b.descAr)}">${b.icon}</span>
          <b>${esc(b.ar)}</b>
          <span>${esc(b.descAr)}</span>
        </div>`).join('')}
      </div>
    </div>

    <div class="grid grid--2" style="margin-top:18px">
      <div class="card">
        <div class="card__title"><span class="ico">🩹</span><h2>${t('stats.weakAreas')}</h2></div>
        ${weak.length ? weak.map((e) => {
          const it = progress.items[e.itemId];
          return `<div class="item-row">
            <span class="item-row__en">${esc(e.en)}</span>
            <span class="item-row__ar">${esc(e.ar)}<div class="tiny muted">أخطأت ${it.wrong} مرة · أصبت ${it.correct}</div></span>
            ${speakBtn(e.en)}
          </div>`;
        }).join('') + `<a class="btn btn--primary btn--sm" style="margin-top:12px" href="#/drills?source=smart">🧠 ${t('dash.smartDrill')}</a>`
        : `<p class="muted small">لا أخطاء مسجّلة — استمر! ✨</p>`}
      </div>

      <div class="card">
        <div class="card__title"><span class="ico">📚</span><h2>تقدّم الوحدات</h2></div>
        ${LEVELS.map((lv) => {
          const s = levelStats(lv.id);
          return `<div style="margin-bottom:12px">
            <div class="row row--between"><span>${lv.icon} ${esc(lv.label)}</span><span class="small muted">${s.done}/${s.total}</span></div>
            <div style="margin-top:4px">${progressBar(s.percent, s.percent >= 100 ? 'progress--ok' : '')}</div>
          </div>`;
        }).join('')}
        <div class="divider"></div>
        <div class="row row--between"><span>دروس القواعد المقروءة</span><b>${o.grammarDone} / ${o.grammarTotal}</b></div>
        <div class="row row--between" style="margin-top:6px"><span>المطالعات المكتملة</span><b>${Object.values(progress.readings || {}).filter((r) => r?.done).length}</b></div>
      </div>
    </div>`;
}
