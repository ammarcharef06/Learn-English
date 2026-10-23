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
      <div class="stat"><div class="stat__label">الضمائر</div><div class="stat__value">${pronounsCount}</div><div class="stat__foot">في ${PRONOUN_GROUPS.length} مجموعة</div></div>
      <div class="stat"><div class="stat__label">أدوات الربط</div><div class="stat__value">${CONNECTORS.length}</div><div class="stat__foot">مع أمثلة ناطقة</div></div>
      <div class="stat"><div class="stat__label">أدوات السؤال</div><div class="stat__value">${QUESTION_WORDS.length}</div><div class="stat__foot">أساسية ومركّبة</div></div>
      <div class="stat"><div class="stat__label">أمثلة للحفظ</div><div class="stat__value">${KEY_EXAMPLES.length}</div><div class="stat__foot">جاهزة للحفظ</div></div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🎒</span><h2>${t('about.features')}</h2></div>
      <div class="grid grid--2">
        <ul class="muted" style="margin:0;padding-inline-start:1.2rem">
          <li>منهج متدرّج: ${LEVELS.map((l) => l.label).join(' · ')}</li>
          <li>${cs.units} وحدة و${cs.grammar} درس قواعد و${cs.vocab} كلمة و${cs.sentences} جملة نموذجية.</li>
          <li>${cs.readings} نص مطالعة مع ترجمة كاملة وأسئلة فهم.</li>
          <li>٨ أنواع من التدريبات التفاعلية مع تصحيح فوري وشرح.</li>
        </ul>
        <ul class="muted" style="margin:0;padding-inline-start:1.2rem">
          <li>بطاقات حفظ بنظام المراجعة المتباعدة (SRS).</li>
          <li>اختبارات مؤقتة وشهادة نتيجة قابلة للطباعة.</li>
          <li>نقاط وسلاسل أيام وشارات وأهداف يومية وإحصائيات بيانية.</li>
          <li>مهمة يومية شخصية وخريطة تُظهر تقدمك في كل وحدة.</li>
          <li>محادثات قصيرة من مواقف الحياة اليومية مع نطق وتصحيح وتقدم محفوظ محلياً.</li>
          <li>ملخص أسبوعي يقارن نشاطك بالأسبوع السابق، دون إرسال بياناتك.</li>
          <li>نطق صوتي لكل كلمة وجملة (Speech Synthesis).</li>
        </ul>
      </div>
    </div>

    <div class="grid grid--2" style="margin-top:18px">
      <div class="card">
        <div class="card__title"><span class="ico">📶</span><h2>يعمل بلا إنترنت</h2></div>
        <p class="muted">${t('about.offline')} يُثبَّت كتطبيق على الهاتف وسطح المكتب عبر تقنية PWA، ويحتفظ بمحتواه في الذاكرة المؤقتة للجهاز.</p>
      </div>
      <div class="card">
        <div class="card__title"><span class="ico">🔐</span><h2>الخصوصية</h2></div>
        <p class="muted">${t('about.privacy')} كلمة المرور تُخزَّن كبصمة SHA-256 داخل جهازك، ولا توجد أي قاعدة بيانات خارجية.</p>
      </div>
    </div>

    <div class="card" style="margin-top:18px">
      <div class="card__title"><span class="ico">🛠️</span><h2>معلومات تقنية</h2></div>
      <div class="table-wrap"><table class="tbl">
        <tbody>
          <tr><td>الاستضافة</td><td class="en-cell">GitHub Pages</td></tr>
          <tr><td>المستودع</td><td class="en-cell">github.com/ammarcharef06/Learn-English</td></tr>
          <tr><td>التقنيات</td><td class="en-cell">HTML · CSS · JavaScript (ES Modules) · Capacitor Local Notifications · Electron</td></tr>
          <tr><td>التخزين</td><td class="en-cell">LocalStorage (محلي بالكامل)</td></tr>
          <tr><td>${t('common.version')}</td><td class="en-cell">${esc(APP_VERSION)}</td></tr>
        </tbody>
      </table></div>
      <div class="tip-box tip-box--brand" style="margin-top:14px">
        <b>نصيحة أخيرة</b>الاستمرارية أهم من الكمّية: ١٥ دقيقة كل يوم أفضل من ٣ ساعات مرة واحدة في الأسبوع.
      </div>
    </div>`;
}
