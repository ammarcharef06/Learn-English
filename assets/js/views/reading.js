import { t as uiText } from '../core/i18n.js';
/* المطالعات: نصوص متدرجة + ترجمة + أسئلة فهم */
import { t } from '../core/i18n.js';
import { esc, speakBtn, qs, toast, pct } from '../core/utils.js';
import { progress, settings } from '../core/store.js';
import { READINGS, getReading, readingsOfLevel } from '../data/curriculum.js';
import { recordReading } from '../core/gamify.js';
import { runQuiz, readingQuestions } from './quiz-runner.js';
import { pageHead, progressBar, renderSidebarStats } from './shell.js';
import { speak, stopSpeaking } from '../core/speech.js';

const LEVEL_META = {
  a1: { label: uiText('ui.literal.c2934f72'), icon: '🌱', color: '#22c55e' },
  a2: { label: uiText('ui.literal.48702bf6'), icon: '🌿', color: '#f59e0b' },
  b1: { label: uiText('ui.literal.f7edd9aa'), icon: '🌳', color: '#8b5cf6' },
};

export function renderReading(host, id) {
  if (id) return renderOne(host, id);
  const done = Object.values(progress.readings || {}).filter((r) => r && r.done).length;
  host.innerHTML = `
    ${pageHead({
      icon: '📖', title: t('read.title'), subtitle: t('read.subtitle'),
      actionsHtml: `<span class="chip chip--ok">${done} / ${READINGS.length} ${t('read.done')}</span>`,
    })}
    ${['a1', 'a2', 'b1'].map((lv) => {
      const items = readingsOfLevel(lv);
      const meta = LEVEL_META[lv];
      return `<section style="margin-bottom:22px">
        <div class="row" style="gap:10px;margin-bottom:10px">
          <span style="font-size:1.4rem">${meta.icon}</span>
          <h2 style="margin:0;font-size:1.05rem">${esc(meta.label)}</h2>
          <span class="chip">${items.length} ${t('nav.reading')}</span>
        </div>
        <div class="grid grid--2">
          ${items.map((r) => {
            const st = progress.readings?.[r.id];
            const words = r.text.trim().split(/\s+/).length;
            return `<a class="unit-card" href="#/reading/${r.id}">
              <span class="unit-card__ico">${r.emoji || '📄'}</span>
              <span class="unit-card__body">
                <h3>${esc(r.titleAr)} ${st?.done ? '✅' : ''}</h3>
                <div class="small muted en">${esc(r.title)}</div>
                <div class="unit-card__meta">
                  <span class="chip">${words} ${uiText('ui.literal.a8426e04')} </span>
                  <span class="chip">${r.questions.length} ${esc(t('common.questions'))}</span>
                  <span class="chip">${(r.words || []).length} ${esc(t('common.words'))}</span>
                  ${st?.done ? `<span class="chip chip--ok">${esc(t('common.score'))}: ${st.score}/${st.total}</span>` : ''}
                </div>
              </span>
            </a>`;
          }).join('')}
        </div>
      </section>`;
    }).join('')}`;
}

function renderOne(host, id) {
  const r = getReading(id);
  if (!r) { host.innerHTML = uiText('ui.literal.460b8364'); return; }
  const meta = LEVEL_META[r.level] || LEVEL_META.a1;
  const paragraphs = String(r.text).split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  const arParagraphs = String(r.textAr || '').split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  const st = progress.readings?.[r.id];

  host.innerHTML = `
    ${pageHead({
      icon: r.emoji || '📄', title: r.titleAr, subtitle: `${meta.label} · ${r.title}`,
      actionsHtml: `<a class="btn btn--sm" href="#/reading">← ${t('nav.reading')}</a>`,
    })}
    ${st?.done ? `<div class="tip-box tip-box--ok" style="margin-bottom:14px"><b>${t('read.done')} ✅</b>${uiText('ui.literal.d98efa2b')} ${st.best || st.score} / ${st.total}</div>` : ''}

    <div class="card">
      <div class="reading-toolbar">
        <button class="btn btn--sm btn--primary" type="button" id="readAloud">🔊 ${uiText('ui.literal.92bfee08')} </button>
        <button class="btn btn--sm" type="button" id="stopAloud">⏹ ${uiText('ui.literal.bceab998')} </button>
        <button class="btn btn--sm" type="button" id="toggleAr">${esc(t('read.showAr'))}</button>
        ${speakBtn(r.text.slice(0, 200))}
      </div>
      <div class="reading-text" id="readText">
        ${paragraphs.map((p, i) => `<p data-p="${i}">${esc(p)}</p>`).join('')}
      </div>
      <div class="reading-ar lesson-explain" id="arBox" hidden>
        <b>${uiText('ui.literal.6823a6c9')} </b>
        ${(arParagraphs.length ? arParagraphs : [r.textAr || '']).map((p) => `<p>${esc(p)}</p>`).join('')}
      </div>
      <div class="row row--wrap" style="gap:8px;margin-top:12px">
        <span class="chip">${String(r.text).trim().split(/\s+/).length} ${uiText('ui.literal.a8426e04')} </span>
        <span class="chip">${r.questions.length} ${esc(t('common.questions'))}</span>
        <button class="btn btn--sm" type="button" id="nbWhole">📒 ${uiText('ui.literal.b7069df8')} </button>
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">🔤</span><h3>${t('read.newWords')}</h3></div>
      <div class="vocab-grid">
        ${(r.words || []).map((w) => `<div class="vocab-card">
          <span class="vocab-card__emoji">🔹</span>
          <span class="grow">
            <div class="row row--between"><span class="vocab-card__en">${esc(w.en)}</span>
              <span class="row" style="gap:4px">${speakBtn(w.en)}
                <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(w.en)}" data-ar="${esc(w.ar)}">📒</button>
              </span>
            </div>
            <div class="vocab-card__ar">${esc(w.ar)}</div>
          </span>
        </div>`).join('')}
      </div>
    </div>

    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">❓</span><h3>${t('read.comprehension')}</h3></div>
      <div id="readQuiz"></div>
    </div>`;

  qs('#toggleAr', host)?.addEventListener('click', (e) => {
    const box = qs('#arBox', host);
    box.hidden = !box.hidden;
    e.currentTarget.textContent = box.hidden ? t('read.showAr') : t('read.hideAr');
  });
  qs('#readAloud', host)?.addEventListener('click', () => speak(String(r.text).replace(/\n/g, ' '), { rate: 0.95 }));
  qs('#stopAloud', host)?.addEventListener('click', stopSpeaking);
  qs('#nbWhole', host)?.addEventListener('click', () => {
    import('../core/gamify.js').then(({ addNotebook }) => {
      addNotebook({ en: r.title, ar: r.titleAr, note: `${uiText('ui.literal.62354ae9')} ${meta.label})` });
      toast(uiText('ui.literal.e119b240'), 'ok');
    });
  });

  const quizHost = qs('#readQuiz', host);
  runQuiz(quizHost, {
    questions: readingQuestions(r),
    title: `${r.emoji || ''} ${r.titleAr}`,
    onSummary: (res) => {
      recordReading(r.id, res.correct, res.total);
      renderSidebarStats();
      toast(`${uiText('ui.literal.14be0e92')} ${res.correct}/${res.total} (${res.accuracy}%)`, res.accuracy >= 60 ? 'ok' : 'warn', t('read.result'));
    },
    extraActionsHtml: `<a class="btn" href="#/reading">${t('nav.reading')}</a>`,
  });
}
