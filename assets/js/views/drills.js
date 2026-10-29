import { t as uiText } from '../core/i18n.js';
﻿/* التدريبات التفاعلية — ثمانية أنواع */
import { t } from '../core/i18n.js';
import { esc, qs, toast } from '../core/utils.js';
import { progress, goalForToday } from '../core/store.js';
import { buildQuestions, sourcesForCurriculum } from '../core/quizgen.js';
import { navigate } from '../core/router.js';
import { pageHead, renderSidebarStats } from './shell.js';
import { runQuiz } from './quiz-runner.js';

const DRILL_TYPES = [
  { id: 'mixed', icon: '🎲', key: 'drills.t.mixed', descKey: 'drills.desc.mixed', types: ['mcq', 'fill', 'order', 'translate', 'listen'] },
  { id: 'mcq', icon: '✅', key: 'drills.t.mcq', descKey: 'drills.desc.mcq', types: ['mcq'] },
  { id: 'fill', icon: '✏️', key: 'drills.t.fill', descKey: 'drills.desc.fill', types: ['fill'] },
  { id: 'order', icon: '🧩', key: 'drills.t.order', descKey: 'drills.desc.order', types: ['order'] },
  { id: 'match', icon: '🔗', key: 'drills.t.match', descKey: 'drills.desc.match', types: ['match'] },
  { id: 'translate', icon: '🌍', key: 'drills.t.translate', descKey: 'drills.desc.translate', types: ['translate'] },
  { id: 'listen', icon: '🎧', key: 'drills.t.listen', descKey: 'drills.desc.listen', types: ['listen'] },
  { id: 'smart', icon: '🧠', key: 'drills.t.smart', descKey: 'drills.desc.smart', types: ['mcq', 'fill', 'translate', 'listen'], adaptive: true },
];

export { DRILL_TYPES };

export function drillTypeById(id) {
  return DRILL_TYPES.find((d) => d.id === id) || DRILL_TYPES[0];
}

function notebookEntries() {
  return (progress.notebook || []).map((n) => ({
    itemId: `nb:${String(n.en).toLowerCase().replace(/\s+/g, '_')}`,
    en: n.en, ar: n.ar, ex: null, kind: 'word', level: 'ref', topic: 'notebook', topicTitle: uiText('ui.literal.a5f8878f'), emoji: '📒',
  }));
}

export function questionsFor({ type, source, count, adaptive }) {
  const def = DRILL_TYPES.find((d) => d.id === type) || DRILL_TYPES[0];
  return buildQuestions({
    source,
    types: def.types,
    count,
    adaptive: adaptive || !!def.adaptive,
    matchSize: count <= 8 ? 4 : 5,
  });
}

export function renderDrills(host, query = {}) {
  const state = {
    type: query.type || (query.source === 'smart' ? 'smart' : 'mixed'),
    source: query.source || 'all',
    count: Number(query.count) || 10,
    adaptive: true,
  };

  const opts = sourcesForCurriculum().concat([{ id: 'notebook', ar: uiText('ui.literal.a5f8878f'), en: 'My notebook' }]);

  host.innerHTML = `
    ${pageHead({ icon: '🎯', title: t('drills.title'), subtitle: t('drills.subtitle') })}
    <div class="card">
      <div class="card__title"><span class="ico">🧩</span><h3>${t('drills.type')}</h3></div>
      <div class="grid grid--4 grid--tight" id="typeGrid">
        ${DRILL_TYPES.map((d) => `<button class="card ${d.id === state.type ? 'card--brand' : ''}" type="button" data-type="${d.id}" style="text-align:start;cursor:pointer;border-width:2px">
          <div style="font-size:1.6rem">${d.icon}</div>
          <b>${esc(t(d.key))}</b>
          <div class="tiny muted">${esc(t(d.descKey))}</div>
        </button>`).join('')}
      </div>

      <div class="grid grid--3" style="margin-top:18px">
        <div class="field">
          <label for="drillSource">${t('drills.source')}</label>
          <select class="select" id="drillSource">
            ${opts.map((s) => `<option value="${s.id}" ${s.id === state.source ? 'selected' : ''}>${esc(s.ar)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label for="drillCount">${t('drills.count')}</label>
          <select class="select" id="drillCount">
            ${[5, 10, 15, 20, 30].map((n) => `<option value="${n}" ${n === state.count ? 'selected' : ''}>${n}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>${t('drills.timed')}</label>
          <label class="switch" style="height:44px">
            <input type="checkbox" id="drillTimed" />
            <span class="switch__track"></span>
            <span class="small">${uiText('ui.literal.0f41cc76')} </span>
          </label>
        </div>
      </div>

      <div class="row row--wrap" style="gap:10px;margin-top:6px">
        <button class="btn btn--primary btn--lg" type="button" id="startDrill">▶ ${t('drills.start')}</button>
        <button class="btn" type="button" id="startGoal">🎯 ${uiText('ui.literal.bd48febb')} </button>
        <span class="chip chip--brand" id="drillPreview"></span>
      </div>
    </div>

  `;

  const preview = qs('#drillPreview', host);
  const updatePreview = () => {
    const d = DRILL_TYPES.find((x) => x.id === state.type);
    preview.textContent = `${d.icon} ${t(d.key)} · ${state.count} ${t('common.questionsShort')} · ${opts.find((o) => o.id === state.source)?.ar || ''}`;
  };
  updatePreview();

  host.querySelectorAll('[data-type]').forEach((b) => b.addEventListener('click', () => {
    state.type = b.dataset.type;
    host.querySelectorAll('[data-type]').forEach((x) => x.classList.toggle('card--brand', x.dataset.type === state.type));
    updatePreview();
  }));
  qs('#drillSource', host).addEventListener('change', (e) => { state.source = e.target.value; updatePreview(); });
  qs('#drillCount', host).addEventListener('change', (e) => { state.count = Number(e.target.value); updatePreview(); });

  /* كل تدريب يُفتح في صفحة مستقلة (#/drill) — لا واجهة مدمجة */
  const start = (countOverride = null, typeOverride = null, mode = null) => {
    const type = typeOverride || state.type;
    const count = countOverride || state.count;
    const source = state.source;
    if (source === 'notebook' && !notebookEntries().length) {
      toast(uiText('ui.literal.19694439'), 'warn');
      return;
    }
    const timed = qs('#drillTimed', host).checked ? '1' : '0';
    navigate('/drill', { type, source, count: String(count), timed, ...(mode ? { mode } : {}) });
  };

  qs('#startDrill', host).addEventListener('click', () => start());
  qs('#startGoal', host).addEventListener('click', () => start(null, 'mixed', 'goal'));

  /* روابط قديمة: #/drills?start=goal أو ?source=smart → نحوّل لصفحة التدريب المستقلة */
  if (query.source === 'smart' || query.mode === 'smart') {
    state.type = 'smart';
    setTimeout(() => { if (document.body.contains(host)) start(null, 'smart', 'smart'); }, 200);
  } else if (query.start === 'goal') {
    setTimeout(() => { if (document.body.contains(host)) start(null, 'mixed', 'goal'); }, 200);
  } else if (query.start === 'mixed') {
    setTimeout(() => { if (document.body.contains(host)) start(); }, 200);
  }
}
