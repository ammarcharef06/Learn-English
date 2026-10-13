/* دفتر كلماتي */
import { t } from '../core/i18n.js';
import { esc, qs, speakBtn, download, toast } from '../core/utils.js';
import { progress } from '../core/store.js';
import { removeNotebook } from '../core/gamify.js';
import { pageHead } from './shell.js';

export function renderNotebook(host) {
  const items = progress.notebook || [];
  host.innerHTML = `
    ${pageHead({
      icon: '📒', title: t('nb.title'), subtitle: t('nb.subtitle'),
      actionsHtml: `<span class="chip chip--brand">${items.length} ${t('common.words')}</span>
        ${items.length ? `<button class="btn btn--sm" type="button" id="nbExport">⬇ تصدير</button>
        <a class="btn btn--sm btn--primary" href="#/drills?source=notebook">🎯 تدرّب على دفتري</a>` : ''}`,
    })}
    ${items.length ? `
      <div class="field" style="max-width:420px">
        <input class="input" type="search" placeholder="ابحث في دفترك…" id="nbSearch" />
      </div>
      <div class="card" id="nbList">
        ${items.map((n, i) => `<div class="item-row" data-nb-row data-search="${esc((n.en + ' ' + n.ar).toLowerCase())}">
          <span class="item-row__en">${esc(n.en)}</span>
          <span class="item-row__ar">${esc(n.ar)}${n.note ? `<div class="tiny muted">${esc(n.note)}</div>` : ''}</span>
          <span class="row" style="gap:4px">
            ${speakBtn(n.en)}
            <button class="btn btn--ghost btn--sm" type="button" data-del="${i}" title="حذف">🗑</button>
          </span>
        </div>`).join('')}
      </div>`
      : `<div class="empty"><span class="ico">📒</span><p>${t('nb.empty')}</p>
          <div class="row" style="justify-content:center;gap:8px;margin-top:12px">
            <a class="btn btn--primary" href="#/lessons">${t('nav.lessons')}</a>
            <a class="btn" href="#/reference">${t('nav.reference')}</a>
          </div></div>`}`;

  const input = qs('#nbSearch', host);
  input?.addEventListener('input', () => {
    const v = input.value.trim().toLowerCase();
    host.querySelectorAll('[data-nb-row]').forEach((r) => {
      r.hidden = !!v && !(r.dataset.search || '').includes(v);
    });
  });

  host.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
    const idx = Number(b.dataset.del);
    const item = items[idx];
    removeNotebook(item.en);
    toast('حُذفت من الدفتر', 'info');
    renderNotebook(host);
  }));

  qs('#nbExport', host)?.addEventListener('click', () => {
    const lines = items.map((n) => `${n.en}\t${n.ar}`).join('\n');
    download('my-english-notebook.txt', `${lines}\n`, 'text/plain');
  });
}
