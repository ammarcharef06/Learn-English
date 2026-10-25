import { t as uiText } from '../core/i18n.js';
import { esc } from '../core/utils.js';

/** Shared breadcrumb for the foundation path and its place in the Academy. */
export function zeroPageHead({ icon = '', title = '', subtitle = '', metaHtml = '', actionsHtml = '' }) {
  return `
    <header class="page-head" data-district="foundation">
      <div class="page-head__main">
        <nav class="page-head__wayfinding" aria-label="${uiText('ui.literal.e7e6f8ca')} ">
          <a href="./index.html#/" data-nav data-exit-zero><span aria-hidden="true">⌂</span>${uiText('ui.literal.112885cf')} A1–B1</a>
          <span class="page-head__separator" aria-hidden="true">/</span>
          <a href="#/zero" data-nav>${uiText('ui.literal.fabbd2bb')} A0</a>
        </nav>
        <div class="page-title"><span class="ico" aria-hidden="true">${esc(icon)}</span><h1>${esc(title)}</h1></div>
        ${subtitle ? `<p>${esc(subtitle)}</p>` : ''}
        ${metaHtml ? `<div class="page-head__meta">${metaHtml}</div>` : ''}
      </div>
      ${actionsHtml ? `<div class="row row--wrap">${actionsHtml}</div>` : ''}
    </header>`;
}
