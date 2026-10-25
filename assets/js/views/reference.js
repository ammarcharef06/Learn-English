import { t as uiText } from '../core/i18n.js';
/* المراجع السريعة: الضمائر، أدوات الربط، أدوات السؤال، جدول الضمائر، أمثلة للحفظ */
import { t } from '../core/i18n.js';
import { esc, speakBtn, qs } from '../core/utils.js';
import { PRONOUN_GROUPS, PRONOUN_TABLE, CONNECTORS, QUESTION_WORDS, KEY_EXAMPLES, STUDY_ORDER } from '../data/reference.js';
import { pageHead } from './shell.js';

function itemRow(en, ar, ex, note = '') {
  return `<div class="item-row" data-row data-search="${esc((en + ' ' + ar + ' ' + (ex ? ex.en : '')).toLowerCase())}">
    <span class="item-row__en">${esc(en)}</span>
    <span class="item-row__ar">
      ${esc(ar)}
      ${note ? `<div class="tiny muted">${esc(note)}</div>` : ''}
      ${ex ? `<div class="item-row__ex en">${esc(ex.en)}</div><div class="item-row__ex">${esc(ex.ar)}</div>` : ''}
    </span>
    <span class="row" style="gap:4px">
      ${speakBtn(en)}
      <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(en)}" data-ar="${esc(ar)}">📒</button>
    </span>
  </div>`;
}

function searchBar(placeholder) {
  return `<div class="field" style="max-width:420px">
    <input class="input" type="search" data-filter placeholder="${esc(placeholder)}" />
    <span class="hint" data-count></span>
  </div>`;
}

function bindFilter(host) {
  const input = qs('[data-filter]', host);
  const count = qs('[data-count]', host);
  const rows = Array.from(host.querySelectorAll('[data-row]'));
  const update = () => {
    const q = (input.value || '').trim().toLowerCase();
    let shown = 0;
    rows.forEach((r) => {
      const hit = !q || (r.dataset.search || '').includes(q);
      r.hidden = !hit;
      if (hit) shown++;
    });
    if (count) count.textContent = `${shown} / ${rows.length} ${t('ref.count')}`;
  };
  input?.addEventListener('input', update);
  update();
}

export function renderReference(host, section) {
  const sec = section || 'index';
  if (sec === 'index') return renderIndex(host);
  if (sec === 'pronouns') return renderPronouns(host);
  if (sec === 'connectors') return renderList(host, {
    icon: '🔗', title: t('ref.connectors'), subtitle: uiText('ui.literal.971b58e6'),
    rows: CONNECTORS.map((c, i) => ({ en: c.en, ar: `${c.ar}  ·  ${c.kind}`, ex: c.ex })),
    drillSource: 'connectors',
  });
  if (sec === 'questions') {
    const groups = [...new Set(QUESTION_WORDS.map((q) => q.group))];
    host.innerHTML = `
      ${pageHead({
        icon: '❓', title: t('ref.questionWords'), subtitle: uiText('ui.literal.d4fd7ef0'),
        actionsHtml: `<a class="btn btn--sm btn--primary" href="#/drills?source=questions">🎯 ${t('common.practice')}</a>
          <a class="btn btn--sm" href="#/reference">← ${t('nav.reference')}</a>`,
      })}
      ${searchBar(uiText('ui.literal.3c833eed'))}
      ${groups.map((g) => `<div class="card" style="margin-bottom:16px">
        <div class="card__title"><span class="ico">🔎</span><h3>${esc(g)}</h3></div>
        ${QUESTION_WORDS.filter((q) => q.group === g).map((q) => itemRow(q.en, q.ar, q.ex)).join('')}
      </div>`).join('')}`;
    bindFilter(host);
    return;
  }
  if (sec === 'table') return renderTable(host);
  if (sec === 'examples') return renderExamples(host);
  return renderIndex(host);
}

function renderIndex(host) {
  host.innerHTML = `
    ${pageHead({ icon: '📋', title: t('ref.title'), subtitle: t('ref.subtitle') })}
    <div class="grid grid--3">
      <a class="card" href="#/reference/pronouns" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">🙋</span><h3>${t('ref.pronouns')}</h3></div>
        <p class="small muted">${uiText('ui.literal.f6e7498d')} </p>
        <span class="chip chip--brand">${PRONOUN_GROUPS.reduce((n, g) => n + g.items.length, 0)} ${uiText('ui.literal.d2a1d9d8')} </span>
      </a>
      <a class="card" href="#/reference/connectors" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">🔗</span><h3>${t('ref.connectors')}</h3></div>
        <p class="small muted">AND, OR, BUT, BECAUSE, ALTHOUGH, HOWEVER… ${uiText('ui.literal.5e71ed05')} </p>
        <span class="chip chip--brand">${CONNECTORS.length} ${uiText('ui.literal.d2a1d9d8')} </span>
      </a>
      <a class="card" href="#/reference/questions" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">❓</span><h3>${t('ref.questionWords')}</h3></div>
        <p class="small muted">WHAT, WHERE, WHEN, WHO… و HOW MUCH / HOW MANY / HOW OFTEN…</p>
        <span class="chip chip--brand">${QUESTION_WORDS.length} ${uiText('ui.literal.d2a1d9d8')} </span>
      </a>
      <a class="card" href="#/reference/table" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">🧮</span><h3>${t('ref.personTable')}</h3></div>
        <p class="small muted">${uiText('ui.literal.14c0c377')} </p>
      </a>
      <a class="card" href="#/reference/examples" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">⭐</span><h3>${t('ref.keyExamples')}</h3></div>
        <p class="small muted">${uiText('ui.literal.4fa27d18')} </p>
        <span class="chip chip--brand">${KEY_EXAMPLES.length} ${uiText('ui.literal.c1463eac')} </span>
      </a>
      <a class="card" href="#/drills" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">🎯</span><h3>${t('nav.drills')}</h3></div>
        <p class="small muted">${uiText('ui.literal.0f71ac9e')} </p>
      </a>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🧭</span><h2>${uiText('ui.literal.48306983')} </h2></div>
      ${STUDY_ORDER.map((s) => `<div class="item-row">
        <span class="chip chip--brand">${s.step}</span>
        <span class="item-row__ar">${esc(s.ar)}</span>
      </div>`).join('')}
      <div class="tip-box tip-box--ok" style="margin-top:12px"><b>${uiText('ui.literal.0e849b7f')} </b>${uiText('ui.literal.f8ac6e66')} </div>
    </div>`;
}

function renderPronouns(host) {
  host.innerHTML = `
    ${pageHead({
      icon: '🙋', title: t('ref.pronouns'),
      subtitle: uiText('ui.literal.51cb0875'),
      actionsHtml: `<a class="btn btn--sm btn--primary" href="#/drills?source=pronouns">🎯 ${t('common.practice')}</a>
        <a class="btn btn--sm" href="#/reference">← ${t('nav.reference')}</a>`,
    })}
    ${searchBar(uiText('ui.literal.00864f21'))}
    ${PRONOUN_GROUPS.map((g, idx) => `<section class="acc ${idx === 0 ? 'is-open' : ''}" data-acc>
      <button class="acc__head" type="button" data-acc-head>
        <span class="ico">${g.icon}</span>
        <span class="grow"><b>${esc(g.title)}</b><span class="en">${esc(g.titleEn)} · ${g.items.length} ${t('ref.count')}</span></span>
        <span class="caret">▾</span>
      </button>
      <div class="acc__body">
        <div class="acc__inner">
        ${g.note ? `<div class="tip-box" style="margin-bottom:10px">${esc(g.note)}</div>` : ''}
        ${g.items.map((it) => itemRow(it.en, it.ar, it.ex, it.note)).join('')}
        </div>
      </div>
    </section>`).join('')}`;

  host.querySelectorAll('[data-acc-head]').forEach((b) => b.addEventListener('click', () => b.closest('[data-acc]')?.classList.toggle('is-open')));
  bindFilter(host);
}

function renderList(host, { icon, title, subtitle, rows, drillSource }) {
  host.innerHTML = `
    ${pageHead({
      icon, title, subtitle,
      actionsHtml: `<a class="btn btn--sm btn--primary" href="#/drills?source=${drillSource}">🎯 ${t('common.practice')}</a>
        <a class="btn btn--sm" href="#/reference">← ${t('nav.reference')}</a>`,
    })}
    ${searchBar(uiText('ui.literal.dd55bf6f'))}
    <div class="card">
      ${rows.map((r) => itemRow(r.en, r.ar, r.ex)).join('')}
    </div>`;
  bindFilter(host);
}

function renderTable(host) {
  host.innerHTML = `
    ${pageHead({
      icon: '🧮', title: t('ref.personTable'),
      subtitle: uiText('ui.literal.efd8661b'),
      actionsHtml: `<a class="btn btn--sm btn--primary" href="#/drills?source=pronouns">🎯 ${t('common.practice')}</a>
        <a class="btn btn--sm" href="#/reference">← ${t('nav.reference')}</a>`,
    })}
    <div class="table-wrap">
      <table class="tbl">
        <thead><tr>${PRONOUN_TABLE.headers.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
        <tbody>
          ${PRONOUN_TABLE.rows.map((r) => `<tr>
            <td>${esc(r.person)}</td>
            ${['subject', 'object', 'det', 'poss', 'refl'].map((f) => `<td class="en-cell">${esc(r[f])} ${r[f] !== '—' ? speakBtn(r[f]) : ''}</td>`).join('')}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="tip-box tip-box--brand" style="margin-top:14px">
      <b>${uiText('ui.literal.2597329b')} </b>${uiText('ui.literal.efd804cf')} ITS${uiText('ui.literal.f012653a')}
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">🧠</span><h3>${uiText('ui.literal.af01c575')} </h3></div>
      <ul class="small muted" style="margin:0;padding-inline-start:1.2rem">
        <li>${uiText('ui.literal.07ffc381')} / ${uiText('ui.literal.8dc9ba78')} / ${uiText('ui.literal.8fe0e597')} </li>
        <li>${uiText('ui.literal.2e29fe08')} </li>
        <li>${uiText('ui.literal.6ef0b9ff')} </li>
      </ul>
    </div>`;
}

function renderExamples(host) {
  const tags = [...new Set(KEY_EXAMPLES.map((k) => k.tag))];
  host.innerHTML = `
    ${pageHead({
      icon: '⭐', title: t('ref.keyExamples'),
      subtitle: uiText('ui.literal.5194669b'),
      actionsHtml: `<a class="btn btn--sm btn--primary" href="#/drills?source=key">🎯 ${t('common.practice')}</a>
        <a class="btn btn--sm" href="#/reference">← ${t('nav.reference')}</a>`,
    })}
    ${tags.map((tag) => `<div class="card" style="margin-bottom:16px">
      <div class="card__title"><span class="ico">${tag === uiText('ui.literal.d631d334') ? '🙋' : tag === uiText('ui.literal.b7b5e1f1') ? '🔗' : '❓'}</span><h3>${uiText('ui.literal.03dbe0c9')} ${esc(tag)}</h3></div>
      ${KEY_EXAMPLES.filter((k) => k.tag === tag).map((k) => `<div class="example-line" data-row data-search="${esc((k.en + ' ' + k.ar).toLowerCase())}">
        <div class="grow">
          <div class="en">${esc(k.en)}</div>
          <div class="ar">${esc(k.ar)}</div>
          ${k.note ? `<div class="tiny muted">💡 ${esc(k.note)}</div>` : ''}
        </div>
        ${speakBtn(k.en)}
        <button class="btn btn--ghost btn--sm" type="button" data-nb data-en="${esc(k.en)}" data-ar="${esc(k.ar)}">📒</button>
      </div>`).join('')}
    </div>`).join('')}`;
}
