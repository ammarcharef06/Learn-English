import { getEshProfile, saveEshProfile } from '../../../curriculum/esh/personalization.js';
import { esc } from '../core/utils.js';
import { navigate } from '../core/router.js';

const QUESTIONS = [
  {
    key: 'motivation',
    title: 'ما هدفك الأهم من تعلّم الإنجليزية؟',
    options: [
      ['travel', 'السفر والتنقّل', 'مواقف عملية تساعدك على التواصل أثناء الرحلات.'],
      ['work', 'العمل والتطوّر المهني', 'لغة العمل والاجتماعات والتواصل المهني.'],
      ['study', 'الدراسة والاختبارات', 'مهارات الدراسة والقراءة والكتابة الأكاديمية.'],
      ['daily', 'الحياة اليومية', 'محادثات ومواقف تتكرر في يومك.'],
      ['confidence', 'التحدّث بثقة', 'تدريب تفاعلي على المحادثة والاستماع.'],
    ],
  },
  {
    key: 'experience',
    title: 'كيف تصف خبرتك الحالية؟',
    options: [
      ['new', 'أبدأ من الصفر', 'أحتاج إلى أساسيات بسيطة ومتدرجة.'],
      ['basic', 'أعرف بعض الأساسيات', 'أستطيع استخدام كلمات وجمل قصيرة.'],
      ['intermediate', 'أتواصل في مواقف مألوفة', 'أريد تطوير الطلاقة والدقة.'],
      ['advanced', 'أستخدم الإنجليزية باستمرار', 'أبحث عن محتوى متقدم ومتخصص.'],
    ],
  },
  {
    key: 'challenge',
    title: 'ما الجانب الذي تريد تحسينه أولاً؟',
    options: [
      ['speaking', 'التحدّث والمحادثة', 'أعبّر عن أفكاري وأتفاعل بسهولة.'],
      ['listening', 'الاستماع وفهم النطق', 'ألتقط الكلمات والمعنى عند الاستماع.'],
      ['vocabulary', 'المفردات والتعبير', 'أختار الكلمات المناسبة وأستخدمها.'],
      ['grammar', 'القواعد وبناء الجمل', 'أبني جملاً صحيحة وواضحة.'],
    ],
  },
  {
    key: 'bridgeLanguage',
    title: 'ما اللغة التي تفضّل الاستعانة بها عند شرح فكرة جديدة؟',
    options: [
      ['ar', 'العربية', 'أفضّل الاستفادة من الشرح والترجمة العربية.'],
      ['fr', 'الفرنسية', 'أستخدم الفرنسية أحياناً لتقريب المعنى.'],
      ['en', 'الإنجليزية', 'أفضّل الشرح بالإنجليزية قدر الإمكان.'],
      ['none', 'لا لغة وسيطة', 'أفضّل التعلّم من السياق والأمثلة.'],
    ],
  },
  {
    key: 'minutesPerSession',
    title: 'كم دقيقة تستطيع تخصيصها للجلسة الواحدة؟',
    options: [
      ['5', '٥ دقائق', 'جلسة سريعة ومركّزة.'],
      ['10', '١٠ دقائق', 'وقت قصير للتعلّم والتطبيق.'],
      ['15', '١٥ دقيقة', 'جلسة أوسع للتدرّب والمراجعة.'],
    ],
  },
];

const QUICK_TEST = [
  { prompt: 'She ___ from Cairo.', options: ['am', 'is', 'are'], answer: 'is' },
  { prompt: 'Yesterday, we ___ the museum.', options: ['visit', 'visited', 'visits'], answer: 'visited' },
  { prompt: 'If I ___ more time, I would study.', options: ['have', 'had', 'will have'], answer: 'had' },
];

const INITIAL_ANSWERS = {
  motivation: 'travel',
  experience: 'new',
  challenge: 'speaking',
  bridgeLanguage: 'ar',
  minutesPerSession: '5',
  quickTest: ['', '', ''],
};

export function renderEshOnboarding(host) {
  const existing = getEshProfile();
  const answers = existing
    ? {
      ...INITIAL_ANSWERS,
      ...existing,
      minutesPerSession: String(existing.minutesPerSession),
      quickTest: existing.quickTest || ['', '', ''],
    }
    : { ...INITIAL_ANSWERS, quickTest: [...INITIAL_ANSWERS.quickTest] };
  let step = 0;

  const render = () => {
    const isTest = step === QUESTIONS.length;
    const title = isTest ? 'اختبار سريع لتحديد نقطة البداية' : QUESTIONS[step].title;
    const content = isTest
      ? `<div class="esh-onboarding__quiz">${QUICK_TEST.map((question, index) => `
          <fieldset class="esh-onboarding__question">
            <legend><span>${index + 1}</span><b dir="ltr" lang="en">${esc(question.prompt)}</b></legend>
            <div class="esh-onboarding__choices esh-onboarding__choices--compact">
              ${question.options.map((option) => `<button type="button" class="esh-onboarding__choice ${answers.quickTest[index] === option ? 'is-selected' : ''}" data-test-index="${index}" data-test-answer="${esc(option)}" aria-pressed="${answers.quickTest[index] === option}"><span dir="ltr" lang="en">${esc(option)}</span></button>`).join('')}
            </div>
          </fieldset>`).join('')}
        </div>`
      : `<div class="esh-onboarding__choices" role="group" aria-label="${esc(title)}">
          ${QUESTIONS[step].options.map(([value, label, description]) => `
            <button type="button" class="esh-onboarding__choice ${String(answers[QUESTIONS[step].key]) === value ? 'is-selected' : ''}" data-field="${QUESTIONS[step].key}" data-choice="${value}" aria-pressed="${String(answers[QUESTIONS[step].key]) === value}">
              <span class="esh-onboarding__choice-title">${esc(label)}</span>
              <span class="esh-onboarding__choice-description">${esc(description)}</span>
            </button>`).join('')}
        </div>`;
    const completed = isTest ? answers.quickTest.filter(Boolean).length === QUICK_TEST.length : Boolean(answers[QUESTIONS[step].key]);

    host.innerHTML = `
      <section class="esh-onboarding" aria-labelledby="eshOnboardingTitle">
        <div class="esh-onboarding__brand"><span aria-hidden="true">✦</span> ESH · مسارك الشخصي</div>
        <div class="esh-onboarding__progress" role="progressbar" aria-label="تقدّم إعداد ملفك الشخصي" aria-valuemin="1" aria-valuemax="6" aria-valuenow="${step + 1}">
          <span style="width:${((step + 1) / 6) * 100}%"></span>
        </div>
        <p class="esh-onboarding__step">السؤال ${step + 1} من ٦</p>
        <h1 id="eshOnboardingTitle">${esc(title)}</h1>
        <p class="esh-onboarding__intro">${isTest ? 'أجب عن هذه الأسئلة القصيرة لنقترح نقطة بداية مناسبة. لا بأس إن لم تعرف الإجابة.' : 'اختر الإجابة الأقرب إليك؛ سنستخدمها لاقتراح دروس تناسب هدفك ووقتك.'}</p>
        ${content}
        <div class="esh-onboarding__footer">
          <button type="button" class="btn" data-back ${step === 0 ? 'disabled' : ''}>رجوع</button>
          ${isTest
            ? `<button type="button" class="btn btn--primary" data-finish ${completed ? '' : 'disabled'}>ابدأ مساري الشخصي</button>`
            : `<button type="button" class="btn btn--primary" data-next ${completed ? '' : 'disabled'}>التالي</button>`}
        </div>
        <p class="esh-onboarding__privacy">إجاباتك محفوظة على هذا الجهاز فقط.</p>
      </section>`;

    host.querySelectorAll('[data-field]').forEach((button) => button.addEventListener('click', () => {
      answers[button.dataset.field] = button.dataset.choice;
      render();
    }));
    host.querySelectorAll('[data-test-index]').forEach((button) => button.addEventListener('click', () => {
      answers.quickTest[Number(button.dataset.testIndex)] = button.dataset.testAnswer;
      render();
    }));
    host.querySelector('[data-back]')?.addEventListener('click', () => {
      if (step > 0) { step -= 1; render(); }
    });
    host.querySelector('[data-next]')?.addEventListener('click', () => {
      if (completed) { step += 1; render(); }
    });
    host.querySelector('[data-finish]')?.addEventListener('click', () => {
      if (!completed) return;
      try {
        saveEshProfile(answers);
        navigate('/');
      } catch (error) {
        console.error('Could not save the ESH learner profile.', error);
        host.querySelector('.esh-onboarding__privacy').textContent = 'تعذّر حفظ إجاباتك. تحقّق من مساحة التخزين في المتصفح وحاول مجدداً.';
      }
    });
  };

  render();
}
