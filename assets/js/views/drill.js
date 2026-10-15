/* صفحة التمرين المستقلة (#/drill) — واجهة كاملة بلا أي عناصر مدمجة */
import { t } from '../core/i18n.js';
import { esc, qs, toast } from '../core/utils.js';
import { progress, saveProgress, goalForToday } from '../core/store.js';
import { navigate } from '../core/router.js';
import { completeUnit } from '../core/gamify.js';
import { questionsFor, drillTypeById, DRILL_TYPES } from './drills.js';
import { runQuiz } from './quiz-runner.js';
import { renderSidebarStats } from './shell.js';

export function renderDrillPage(host, query = {}) {
  const typeId = query.type || (query.mode === 'smart' ? 'smart' : 'mixed');
  const def = drillTypeById(typeId);
  const mode = query.mode || '';
  let source = query.source || (mode === 'smart' ? 'smart' : 'all');
  let count = Number(query.count) || 10;
  const timed = query.timed === '1';

  if (mode === 'goal') {
    const g = goalForToday();
    count = Math.min(30, Math.max(5, g.target - g.done));
  }
  if (source === 'notebook' && !(progress.notebook || []).length) {
    toast('دفترك فارغ — أضف كلمات أثناء الدروس 📒', 'warn');
    navigate('/drills');
    return;
  }

  const unitId = query.unit || (source.startsWith('unit:') ? source.slice(5) : null);
  const unit = unitId ? (typeof query.unitTitle === 'string' ? query.unitTitle : '') : '';
  const title = query.title || `${def.icon} ${t(def.key)}`;

  const questions = questionsFor({ type: def.id, source, count, adaptive: true });
  if (!questions.length) {
    host.innerHTML = `<div class="empty"><span class="ico" aria-hidden="true">🤷</span><p>${esc(t('drills.noSource'))}</p>
      <a class="btn btn--sm mt-3" href="#/drills">${esc(t('nav.drills'))}</a></div>`;
    return;
  }

  host.innerHTML = `
    <div class="row row--between wrap mb-3">
      <div class="row wrap" style="gap:10px">
        <button class="btn btn--sm" id="drillExit" type="button">← ${esc(unitId ? t('common.back') : t('nav.drills'))}</button>
        <b>${esc(title)}</b>
      </div>
      <div class="row wrap" style="gap:6px">
        <span class="chip chip--brand">${questions.length} ${esc(t('common.questionsShort'))}</span>
        ${timed ? `<span class="chip">⏱ ${Math.round((count * 30) / 60)} ${esc(t('common.minutes'))}</span>` : ''}
        ${mode === 'smart' ? '<span class="chip chip--warn">🧠 أسئلة أخطائك</span>' : ''}
        ${mode === 'goal' ? '<span class="chip chip--ok">🎯 هدف اليوم</span>' : ''}
      </div>
    </div>
    <div id="drillRun"></div>`;

  qs('#drillExit', host)?.addEventListener('click', () => navigate(unitId ? `/unit/${unitId}` : '/drills'));

  runQuiz(qs('#drillRun', host), {
    questions,
    timed,
    seconds: timed ? count * 30 : 0,
    allowReveal: true,
    onSummary: (res) => {
      if (unitId) {
        saveProgress((p) => {
          p.units = p.units || {};
          const prev = p.units[unitId]?.quiz || { q: 0, c: 0 };
          p.units[unitId] = { ...(p.units[unitId] || {}), quiz: { q: prev.q + res.total, c: prev.c + res.correct } };
        });
        if (res.accuracy >= 80) completeUnit(unitId);
      }
      renderSidebarStats();
    },
    extraActionsHtml: unitId
      ? `<a class="btn" href="#/unit/${unitId}">${esc(t('common.back'))}</a>`
      : `<a class="btn" href="#/drills">${esc(t('drills.title'))}</a>`,
  });
}

export { DRILL_TYPES };
