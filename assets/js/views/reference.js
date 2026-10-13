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
    icon: '🔗', title: t('ref.connectors'), subtitle: '٤٠ أداة ربط مع المعنى والاستخدام ومثال ناطق.',
    rows: CONNECTORS.map((c, i) => ({ en: c.en, ar: `${c.ar}  ·  ${c.kind}`, ex: c.ex })),
    drillSource: 'connectors',
  });
  if (sec === 'questions') {
    const groups = [...new Set(QUESTION_WORDS.map((q) => q.group))];
    host.innerHTML = `
      ${pageHead({
        icon: '❓', title: t('ref.questionWords'), subtitle: 'أدوات السؤال الأساسية وتراكيب السؤال مع أمثلة ناطقة.',
        actionsHtml: `<a class="btn btn--sm btn--primary" href="#/drills?source=questions">🎯 ${t('common.practice')}</a>
          <a class="btn btn--sm" href="#/reference">← ${t('nav.reference')}</a>`,
      })}
      ${searchBar('ابحث عن أداة سؤال أو معنى…')}
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
        <p class="small muted">١١ مجموعة: الفاعل، المفعول، الملكية، الانعكاسية، الإشارة، الاستفهام، الوصل، غير المحددة، التبادلية…</p>
        <span class="chip chip--brand">${PRONOUN_GROUPS.reduce((n, g) => n + g.items.length, 0)} عنصر</span>
      </a>
      <a class="card" href="#/reference/connectors" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">🔗</span><h3>${t('ref.connectors')}</h3></div>
        <p class="small muted">AND, OR, BUT, BECAUSE, ALTHOUGH, HOWEVER… مع المعنى والاستخدام.</p>
        <span class="chip chip--brand">${CONNECTORS.length} عنصر</span>
      </a>
      <a class="card" href="#/reference/questions" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">❓</span><h3>${t('ref.questionWords')}</h3></div>
        <p class="small muted">WHAT, WHERE, WHEN, WHO… و HOW MUCH / HOW MANY / HOW OFTEN…</p>
        <span class="chip chip--brand">${QUESTION_WORDS.length} عنصر</span>
      </a>
      <a class="card" href="#/reference/table" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">🧮</span><h3>${t('ref.personTable')}</h3></div>
        <p class="small muted">كل أشكال الضمير في جدول واحد: الفاعل، المفعول، الملكية، الانعكاسي.</p>
      </a>
      <a class="card" href="#/reference/examples" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">⭐</span><h3>${t('ref.keyExamples')}</h3></div>
        <p class="small muted">أمثلة مختصرة تُحفظ كما هي لتثبيت التركيب.</p>
        <span class="chip chip--brand">${KEY_EXAMPLES.length} مثالاً</span>
      </a>
      <a class="card" href="#/drills" style="text-decoration:none;color:inherit">
        <div class="card__title"><span class="ico">🎯</span><h3>${t('nav.drills')}</h3></div>
        <p class="small muted">حوّل كل ما تقرأه هنا إلى تدريب تفاعلي فوري.</p>
      </a>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🧭</span><h2>ترتيب الحفظ المقترح</h2></div>
      ${STUDY_ORDER.map((s) => `<div class="item-row">
        <span class="chip chip--brand">${s.step}</span>
        <span class="item-row__ar">${esc(s.ar)}</span>
      </div>`).join('')}
      <div class="tip-box tip-box--ok" style="margin-top:12px"><b>نصيحة عملية</b>ابدأ بحفظ ضمائر الفاعل، ثم ضمائر المفعول به، ثم الملكية، وبعدها بقية الأنواع.</div>
    </div>`;
}

function renderPronouns(host) {
  host.innerHTML = `
    ${pageHead({
      icon: '🙋', title: t('ref.pronouns'),
      subtitle: 'كل مجموعات الضمائر مع النطق والترجمة والمثال، إضافة إلى جدول الضمائر الكامل.',
      actionsHtml: `<a class="btn btn--sm btn--primary" href="#/drills?source=pronouns">🎯 ${t('common.practice')}</a>
        <a class="btn btn--sm" href="#/reference">← ${t('nav.reference')}</a>`,
    })}
    ${searchBar('ابحث عن ضمير أو معنى…')}
    ${PRONOUN_GROUPS.map((g, idx) => `<section class="acc ${idx === 0 ? 'is-open' : ''}" data-acc>
      <button class="acc__head" type="button" data-acc-head>
        <span class="ico">${g.icon}</span>
        <span class="grow"><b>${esc(g.title)}</b><span class="en">${esc(g.titleEn)} · ${g.items.length} ${t('ref.count')}</span></span>
        <span class="caret">▾</span>
      </button>
      <div class="acc__body">
        ${g.note ? `<div class="tip-box" style="margin-bottom:10px">${esc(g.note)}</div>` : ''}
        ${g.items.map((it) => itemRow(it.en, it.ar, it.ex, it.note)).join('')}
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
    ${searchBar('ابحث عن أداة أو معنى…')}
    <div class="card">
      ${rows.map((r) => itemRow(r.en, r.ar, r.ex)).join('')}
    </div>`;
  bindFilter(host);
}

function renderTable(host) {
  host.innerHTML = `
    ${pageHead({
      icon: '🧮', title: t('ref.personTable'),
      subtitle: 'عمود واحد لكل نوع من الضمائر، وصف واحد لكل شخص.',
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
      <b>ملاحظة مهمة</b>لا يوجد ضمير ملكية مستقل شائع لكلمة ITS، وهذا هو الفراغ الوحيد في الجدول.
    </div>
    <div class="card" style="margin-top:16px">
      <div class="card__title"><span class="ico">🧠</span><h3>كيف تستخدم الجدول؟</h3></div>
      <ul class="small muted" style="margin:0;padding-inline-start:1.2rem">
        <li>حدّد الشخص أولاً (متكلم / مخاطب / غائب)، ثم اختر العمود الذي تحتاجه.</li>
        <li>بعد الفعل استخدم عمود «ضمير المفعول»، وقبل الاسم استخدم «صفة الملكية».</li>
        <li>إذا كان الفاعل والمفعول نفس الشخص، استخدم العمود الانعكاسي.</li>
      </ul>
    </div>`;
}

function renderExamples(host) {
  const tags = [...new Set(KEY_EXAMPLES.map((k) => k.tag))];
  host.innerHTML = `
    ${pageHead({
      icon: '⭐', title: t('ref.keyExamples'),
      subtitle: 'أمثلة قصيرة تُحفظ كما هي — اضغط 🔊 لتسمعها وتثبيتها.',
      actionsHtml: `<a class="btn btn--sm btn--primary" href="#/drills?source=key">🎯 ${t('common.practice')}</a>
        <a class="btn btn--sm" href="#/reference">← ${t('nav.reference')}</a>`,
    })}
    ${tags.map((tag) => `<div class="card" style="margin-bottom:16px">
      <div class="card__title"><span class="ico">${tag === 'ضمائر' ? '🙋' : tag === 'ربط' ? '🔗' : '❓'}</span><h3>أمثلة ${esc(tag)}</h3></div>
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
