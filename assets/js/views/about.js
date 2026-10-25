import { t as uiText } from '../core/i18n.js';
/* حول الموقع */
import { t } from '../core/i18n.js';
import { esc } from '../core/utils.js';
import { curriculumStats, LEVELS } from '../data/curriculum.js';
import { PRONOUN_GROUPS, CONNECTORS, QUESTION_WORDS, KEY_EXAMPLES } from '../data/reference.js';
import { pageHead } from './shell.js';
import { APP_VERSION } from '../core/app-version.js';

export function renderAbout(host) {
  const cs = curriculumStats();
  const pronounsCount = PRONOUN_GROUPS.reduce((n, g) => n + g.items.length, 0);
  host.innerHTML = `
    ${pageHead({ icon: 'ℹ️', title: t('about.title'), subtitle: t('about.p1') })}

    <div class="grid grid--4">
      <div class="stat"><div class="stat__label">${uiText('ui.literal.32632f31')} </div><div class="stat__value">${pronounsCount}</div><div class="stat__foot">في ${PRONOUN_GROUPS.length} ${uiText('ui.literal.f1ca39d3')} </div></div>
      <div class="stat"><div class="stat__label">${uiText('ui.literal.5dada98b')} </div><div class="stat__value">${CONNECTORS.length}</div><div class="stat__foot">${uiText('ui.literal.8439e950')} </div></div>
      <div class="stat"><div class="stat__label">${uiText('ui.literal.0976905b')} </div><div class="stat__value">${QUESTION_WORDS.length}</div><div class="stat__foot">${uiText('ui.literal.36a1e775')} </div></div>
      <div class="stat"><div class="stat__label">${uiText('ui.literal.c74c6f53')} </div><div class="stat__value">${KEY_EXAMPLES.length}</div><div class="stat__foot">${uiText('ui.literal.0a5d109e')} </div></div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🎒</span><h2>${t('about.features')}</h2></div>
      <div class="grid grid--2">
        <ul class="muted" style="margin:0;padding-inline-start:1.2rem">
          <li>${uiText('ui.literal.23dcc069')} ${LEVELS.map((l) => l.label).join(' · ')}</li>
          <li>${cs.units} ${uiText('ui.literal.52e161c6')} ${cs.grammar} ${uiText('ui.literal.3128d76d')} ${cs.vocab} ${uiText('ui.literal.1807d2ec')} ${cs.sentences} ${uiText('ui.literal.fa51ae7b')} </li>
          <li>${cs.readings} ${uiText('ui.literal.265deee0')} </li>
          <li>${uiText('ui.literal.ac9fd003')} </li>
        </ul>
        <ul class="muted" style="margin:0;padding-inline-start:1.2rem">
          <li>${uiText('ui.literal.a63db17c')} SRS).</li>
          <li>${uiText('ui.literal.0f11607c')} </li>
          <li>${uiText('ui.literal.06657c54')} </li>
          <li>${uiText('ui.literal.e7f3a409')} </li>
          <li>${uiText('ui.literal.07ade162')} </li>
          <li>${uiText('ui.literal.a48867c8')} </li>
          <li>${uiText('ui.literal.dcfeab37')} Speech Synthesis).</li>
        </ul>
      </div>
    </div>

    <div class="grid grid--2" style="margin-top:18px">
      <div class="card">
        <div class="card__title"><span class="ico">📶</span><h2>${uiText('ui.literal.fef77f22')} </h2></div>
        <p class="muted">${t('about.offline')} ${uiText('ui.literal.d2c874ad')} PWA${uiText('ui.literal.f3c69468')} </p>
      </div>
      <div class="card">
        <div class="card__title"><span class="ico">🔐</span><h2>${uiText('ui.literal.c6a11afd')} </h2></div>
        <p class="muted">${t('about.privacy')} ${uiText('ui.literal.53a56992')} SHA-256 ${uiText('ui.literal.8e1ab38c')} </p>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🛠️</span><h2>${uiText('ui.literal.f38850fc')} </h2></div>
      <div class="table-wrap"><table class="tbl">
        <tbody>
          <tr><td>${uiText('ui.literal.9a10d617')} </td><td class="en-cell">GitHub Pages</td></tr>
          <tr><td>${uiText('ui.literal.9d4ee970')} </td><td class="en-cell">github.com/ammarcharef06/Learn-English</td></tr>
          <tr><td>${uiText('ui.literal.355c068f')} </td><td class="en-cell">HTML · CSS · JavaScript (ES Modules) · Capacitor Local Notifications · Electron</td></tr>
          <tr><td>${uiText('ui.literal.5b847884')} </td><td class="en-cell">LocalStorage (${uiText('ui.literal.6fa950b4')} </td></tr>
          <tr><td>${t('common.version')}</td><td class="en-cell">${esc(APP_VERSION)}</td></tr>
        </tbody>
      </table></div>
      <div class="tip-box tip-box--brand" style="margin-top:14px">
        <b>${uiText('ui.literal.08a45d23')} </b>${uiText('ui.literal.d7b76000')}
      </div>
    </div>`;
}
