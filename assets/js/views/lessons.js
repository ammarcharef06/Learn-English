/* الدروس والمنهج: المستويات ← الوحدات ← الدروس */
import { t } from '../core/i18n.js';
import { esc, speakBtn, qs, pct } from '../core/utils.js';
import { progress, settings, saveProgress } from '../core/store.js';
import { LEVELS, getLevel, getUnit, unitsOfLevel, unitPercent, levelPercent, isLevelUnlocked } from '../data/curriculum.js';
import { markLessonRead, completeUnit, levelStats } from '../core/gamify.js';
import { pageHead, progressBar, renderSidebarStats } from './shell.js';
import { navigate } from '../core/router.js';
import { maybeShowInterstitial } from '../core/ads.js';

/* ---------- قائمة المستويات ---------- */
export function renderLessons(host) {
  host.innerHTML = `
    ${pageHead({ icon: '📚', title: t('lessons.title'), subtitle: t('lessons.subtitle') })}
    <div class="grid grid--3">
      ${LEVELS.map((lv, i) => {
        const p = levelPercent(lv.id);
        return `<a class="level-card" href="#/level/${lv.id}" style="background:linear-gradient(135deg, ${lv.color}, ${lv.color}bb)">
          <span class="ico">${lv.icon}</span>
          <h3>${esc(lv.label)}</h3>
          <p>${esc(lv.summary || '')}</p>
          <div class="row row--wrap" style="gap:6px;margin-top:6px">
            <span class="chip">${lv.units.length} ${esc(t('lessons.units'))}</span>
            <span class="chip">${lv.units.reduce((n, u) => n + u.vocab.length, 0)} ${esc(t('common.words'))}</span>
          </div>
          <div class="progress" style="margin-top:10px;background:rgba(255,255,255,.28)"><i style="width:${p}%;background:#fff"></i></div>
          <span class="tiny">${p}% ${esc(t('common.done'))}</span>
        </a>`;
      }).join('')}
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🗺️</span><h2>كيف تدرس المنهج؟</h2></div>
      <ol class="small muted" style="margin:0;padding-inline-start:1.2rem">
        <li>افتح وحدة، اقرأ دروس القواعد واستمع للأمثلة بالصوت.</li>
        <li>راجع بطاقات المفردات في نفس الوحدة، وأضف الصعب منها إلى دفترك.</li>
        <li>شغّل «اختبار الوحدة» حتى تتقن ٨٠٪ أو أكثر، فيُعتبر الدرس مكتملاً.</li>
        <li>انتقل للوحدة التالية، وكرّر أسبوعياً مع «التدريب الذكي» على أخطائك.</li>
      </ol>
    </div>`;
}

/* ---------- صفحة مستوى ---------- */
export function renderLevel(host, levelId) {
  const lv = getLevel(levelId);
  if (!lv) { host.innerHTML = `<div class="empty"><span class="ico">🤷</span><p>المستوى غير موجود.</p></div>`; return; }
  const units = unitsOfLevel(lv.id);
  const p = levelPercent(lv.id);
  host.innerHTML = `
    ${pageHead({
      icon: lv.icon, title: lv.label, subtitle: lv.summary || '',
      actionsHtml: `<a class="btn btn--sm" href="#/lessons">← ${t('nav.lessons')}</a>
        <a class="btn btn--sm btn--primary" href="#/drills?source=level:${lv.id}">${t('common.practice')}</a>`,
    })}
    <div class="card">
      <div class="row row--between"><b>${t('common.progress')}</b><span class="small muted">${p}%</span></div>
      <div style="margin-top:8px">${progressBar(p, p >= 100 ? 'progress--ok' : '')}</div>
    </div>
    <div class="grid grid--2" style="margin-top:16px">
      ${units.map((u) => {
        const up = unitPercent(u.id);
        const done = !!progress.units?.[u.id]?.done;
        return `<a class="unit-card" href="#/unit/${u.id}">
          <span class="unit-card__ico">${u.icon}</span>
          <span class="unit-card__body">
            <h3>${esc(u.title)} ${done ? '✅' : ''}</h3>
            <div class="small muted">${esc(u.goal || '')}</div>
            <div class="unit-card__meta">
              <span class="chip">${u.grammar.length} ${esc(t('common.grammar'))}</span>
              <span class="chip">${u.vocab.length} ${esc(t('common.words'))}</span>
              <span class="chip chip--brand">${up}%</span>
            </div>
            <div style="margin-top:8px">${progressBar(up, up >= 100 ? 'progress--ok' : '')}</div>
          </span>
        </a>`;
      }).join('')}
    </div>`;
}

/* ---------- صفحة وحدة ---------- */
export function renderUnit(host, unitId) {
  const u = getUnit(unitId);
  if (!u) { host.innerHTML = `<div class="empty"><span class="ico">🤷</span><p>الوحدة غير موجودة.</p></div>`; return; }
  const up = unitPercent(u.id);
  const done = !!progress.units?.[u.id]?.done;

  host.innerHTML = `
    ${pageHead({
      icon: u.icon, title: u.title,
      subtitle: `${u.levelLabel} · ${u.goal || ''}`,
      actionsHtml: `<a class="btn btn--sm" href="#/level/${u.levelId}">← ${esc(u.levelLabel)}</a>`,
    })}

    <div class="card">
      <div class="row row--between"><b>${t('common.progress')}</b><span class="small muted">${up}%</span></div>
      <div style="margin-top:8px">${progressBar(up, up >= 100 ? 'progress--ok' : '')}</div>
      <div class="row row--wrap" style="gap:8px;margin-top:12px">
        <button class="btn btn--primary btn--sm" type="button" id="unitQuiz">🧪 ${esc(t('lessons.unitQuiz'))}</button>
        <button class="btn btn--sm" type="button" id="unitDone">${done ? '✅ ' + t('common.done') : '✔️ ' + t('lessons.markRead')}</button>
        <a class="btn btn--sm" href="#/drills?source=unit:${u.id}">🎯 ${esc(t('common.practice'))}</a>
      </div>
    </div>

    ${u.grammar.map((g, i) => {
      const read = !!progress.lessons?.[`${u.id}:${i}`];
      return `<section class="acc ${i === 0 ? 'is-open' : ''}" data-acc>
        <button class="acc__head" type="button" data-acc-head>
          <span class="ico">${read ? '✅' : '📘'}</span>
          <span class="grow">
            <b>${esc(g.title)}</b>
            <span class="en">${t('common.grammar')} ${i + 1}</span>
          </span>
          <span class="chip">${(g.examples || []).length} ${esc(t('common.examples'))}</span>
          <span class="caret">▾</span>
        </button>
        <div class="acc__body">
          <div class="lesson-explain">${g.explain || ''}</div>
          ${g.table ? `<div class="table-wrap" style="margin-top:12px"><table class="tbl">
            <thead><tr>${g.table.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
            <tbody>${g.table.rows.map((r) => `<tr>${r.map((cell, ci) => `<td class="${ci === 0 ? '' : 'en-cell'}">${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
          </table></div>` : ''}
          <h4 style="margin-top:14px">${t('common.examples')}</h4>
          <div>${(g.examples || []).map((e) => `<div class="example-line">
            <div class="grow"><div class="en">${esc(e.en)}</div><div class="ar">${esc(e.ar)}</div></div>
            ${speakBtn(e.en)}
            <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(e.en)}" data-ar="${esc(e.ar)}">📒</button>
          </div>`).join('')}</div>
          ${(g.tips || []).length ? `<div class="tip-box" style="margin-top:14px"><b>${t('common.tips')}</b><ul style="margin:0;padding-inline-start:1.1rem">${g.tips.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
          <div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap">
            <a class="btn btn--sm btn--primary" href="#/lesson/${u.id}/${i}">فتح الدرس كاملاً ←</a>
            <button class="btn btn--sm" type="button" data-read="${i}">${read ? '✅ ' + t('lessons.read') : t('lessons.markRead')}</button>
          </div>
          </div>
        </div>
      </section>`;
    }).join('')}

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🧠</span><h2>${t('common.vocab')} (${u.vocab.length})</h2></div>
      <div class="vocab-grid">
        ${u.vocab.map((v) => `<div class="vocab-card">
          <span class="vocab-card__emoji">${v.emoji || '🔹'}</span>
          <span class="grow">
            <div class="row row--between" style="gap:6px">
              <span class="vocab-card__en">${esc(v.en)}</span>
              <span class="row" style="gap:4px">
                ${speakBtn(v.en)}
                <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(v.en)}" data-ar="${esc(v.ar)}">📒</button>
              </span>
            </div>
            <div class="vocab-card__ar">${esc(v.ar)} <span class="chip tiny">${esc(v.pos || '')}</span></div>
            ${v.example ? `<div class="vocab-card__ex en">${esc(v.example.en)}</div><div class="tiny muted">${esc(v.example.ar)}</div>` : ''}
          </span>
        </div>`).join('')}
      </div>
    </div>

    ${(u.sentences || []).length ? `<div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">✍️</span><h2>جمل نموذجية (${u.sentences.length})</h2></div>
      ${u.sentences.map((s) => `<div class="example-line">
        <div class="grow"><div class="en">${esc(s.en)}</div><div class="ar">${esc(s.ar)}</div></div>
        ${speakBtn(s.en)}
        <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(s.en)}" data-ar="${esc(s.ar)}">📒</button>
      </div>`).join('')}
    </div>` : ''}

    ${(u.dialogue || []).length ? `<div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">💬</span><h2>${t('common.dialogue')}</h2></div>
      <div class="dialogue">
        ${u.dialogue.map((d) => `<div class="bubble bubble--${String(d.who).toLowerCase() === 'b' ? 'b' : 'a'}">
          <div class="en">${esc(d.en)} ${speakBtn(d.en)}</div>
          <div class="ar">${esc(d.ar)}</div>
        </div>`).join('')}
      </div>
    </div>` : ''}
  `;

  host.querySelectorAll('[data-acc-head]').forEach((btn) => btn.addEventListener('click', () => {
    btn.closest('[data-acc]')?.classList.toggle('is-open');
  }));

  host.querySelectorAll('[data-read]').forEach((btn) => btn.addEventListener('click', () => {
    markLessonRead(`${u.id}:${btn.dataset.read}`);
    renderUnit(host, unitId);
  }));

  qs('#unitDone', host)?.addEventListener('click', () => {
    const res = completeUnit(u.id);
    renderSidebarStats();
    renderUnit(host, unitId);
    if (res.first) import('../core/utils.js').then(({ toast, confetti }) => {
      confetti(70); toast(`أكملت وحدة «${u.title}» — +60 نقطة 🎉`, 'ok', 'وحدة مكتملة');
    });
    if (res.first) maybeShowInterstitial(`unit:${u.id}`).catch((error) => console.warn('Interstitial ad unavailable.', error));
  });

  qs('#unitQuiz', host)?.addEventListener('click', () => {
    // يُفتح في صفحة مستقلة كاملة (بدل واجهة مدمجة)
    navigate('/drill', {
      source: `unit:${u.id}`, unit: u.id, count: '8', timed: '1',
      title: `اختبار: ${u.title}`,
    });
  });
}

/* ---------- صفحة درس قواعد ---------- */
export function renderLesson(host, unitId, index) {
  const u = getUnit(unitId);
  if (!u) { host.innerHTML = `<div class="empty"><span class="ico">🤷</span><p>الدرس غير موجود.</p></div>`; return; }
  const i = Math.max(0, Math.min(u.grammar.length - 1, Number(index) || 0));
  const g = u.grammar[i];
  markLessonRead(`${u.id}:${i}`);
  renderSidebarStats();

  host.innerHTML = `
    ${pageHead({
      icon: u.icon, title: g.title, subtitle: `${u.title} · ${u.levelLabel} · ${t('common.lesson')} ${i + 1} ${t('common.of')} ${u.grammar.length}`,
      actionsHtml: `<a class="btn btn--sm" href="#/unit/${u.id}">← ${esc(u.title)}</a>`,
    })}
    <div class="card lesson-card">
      <div class="lesson-explain">${g.explain || ''}</div>
      ${g.table ? `<div class="table-wrap lesson-table-wrap"><table class="tbl">
        <thead><tr>${g.table.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>${g.table.rows.map((r) => `<tr>${r.map((cell, ci) => `<td class="${ci === 0 ? '' : 'en-cell'}">${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>` : ''}

      <h3 class="lesson-examples-title">${t('common.examples')}</h3>
      ${(g.examples || []).map((e) => `<div class="example-line">
        <div class="grow"><div class="en">${esc(e.en)}</div><div class="ar">${esc(e.ar)}</div></div>
        ${speakBtn(e.en)}
        <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(e.en)}" data-ar="${esc(e.ar)}">📒</button>
      </div>`).join('')}

      ${(g.tips || []).length ? `<div class="tip-box tip-box--brand lesson-tips"><b>${t('common.tips')}</b>
        <ul style="margin:0;padding-inline-start:1.1rem">${g.tips.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}

      <div class="row row--between row--wrap lesson-nav">
        ${i > 0 ? `<a class="btn btn--sm" href="#/lesson/${u.id}/${i - 1}">→ ${t('common.prev')}</a>` : '<span></span>'}
        <div class="row" style="gap:8px">
          <button class="btn btn--sm btn--primary" type="button" id="lessonQuiz">🎯 تمرين سريع</button>
          ${i < u.grammar.length - 1
            ? `<a class="btn btn--sm" href="#/lesson/${u.id}/${i + 1}">${t('common.next')} ←</a>`
            : `<a class="btn btn--sm btn--ok" href="#/unit/${u.id}">${t('lessons.unitQuiz')} ←</a>`}
        </div>
      </div>
    </div>`;

  qs('#lessonQuiz', host)?.addEventListener('click', () => {
    navigate('/drill', {
      source: `unit:${u.id}`, unit: u.id, count: '5',
      title: `${g.title} — تمرين سريع`,
    });
  });
}

