export const CURRICULUM_SCHEMA_VERSION = 1;

export const UNIT_COMPONENTS = [
  'grammar',
  'vocabulary',
  'phonetics',
  'arabic_l1_transfers',
  'academic_focus',
];

export const ADVANCED_UNIT_SCHEMA = {
  grammar: ['title', 'explain', 'examples', 'practice'],
  vocabulary: ['en', 'ar', 'kind', 'example'],
  phonetics: ['en', 'ipa', 'contrastPairs', 'connectedSpeech', 'intonation', 'audioKey'],
  arabic_l1_transfers: ['pattern', 'incorrect', 'corrected', 'explanationAr', 'practice'],
  academic_focus: ['term', 'meaningAr', 'paraphrasing', 'idioms', 'readingAnalysis'],
};

const LEVEL_DIMENSIONS = {
  b2: {
    languageUse: 'إبداء الرأي والدفاع عنه والمشاركة باستقلالية في نقاشات متنوعة.',
    grammarAndLexis: 'تراكيب مركبة، متلازمات شائعة، أفعال مركبة، وإعادة صياغة المعنى.',
    phoneticsAndSpeech: 'الوصل في الكلام، النبر، والتنغيم في الحديث المتصل.',
    arabicTransfer: 'تمييز أنماط النقل من العربية التي تؤثر في التراكيب وحروف الجر.',
    discourseAndAutonomy: 'فهم نصوص أطول وبناء حجج مترابطة مع اختيار الأسلوب المناسب.',
  },
  c1: {
    languageUse: 'استخدام مرن ودقيق للغة في الدراسة والعمل والمواقف الاجتماعية.',
    grammarAndLexis: 'مفردات أكاديمية، تعبيرات اصطلاحية، ودقة في الفروق الأسلوبية.',
    phoneticsAndSpeech: 'وضوح الكلام والطلاقة والتنغيم الملائم للمقصد والسياق.',
    arabicTransfer: 'مراجعة أخطاء النقل اللغوي في الصياغة الرسمية والأكاديمية.',
    discourseAndAutonomy: 'تحليل الحجج والمقالات وتلخيص الأفكار المعقدة بنبرة مناسبة.',
  },
  c2: {
    languageUse: 'التعبير الدقيق والطبيعي وفهم المعنى الضمني في سياقات متعددة.',
    grammarAndLexis: 'اختيار دقيق للمفردات والتراكيب والتعبيرات بحسب المقام.',
    phoneticsAndSpeech: 'فهم الفروق الدقيقة في النبر والتنغيم والأساليب المنطوقة.',
    arabicTransfer: 'تحرير آثار النقل من العربية للوصول إلى تعبير إنجليزي طبيعي.',
    discourseAndAutonomy: 'قراءة نقدية وتركيب مصادر وأفكار مع الحفاظ على صوت الكاتب.',
  },
};

export const PLANNED_LEVELS = [
  { id: 'b2', label: 'B2 — فوق المتوسط', labelEn: 'Upper-Intermediate (B2)', icon: '🧭', color: '#0f766e' },
  { id: 'c1', label: 'C1 — متقدم', labelEn: 'Advanced (C1)', icon: '📚', color: '#7c3aed' },
  { id: 'c2', label: 'C2 — إتقان', labelEn: 'Proficiency (C2)', icon: '🏛️', color: '#b45309' },
].map((level) => ({
  ...level,
  status: 'planned',
  units: [],
  dimensions: LEVEL_DIMENSIONS[level.id],
}));

export const B2_STAGED_CURRICULUM = {
  id: 'b2',
  label: 'B2 — فوق المتوسط',
  labelEn: 'Upper-Intermediate (B2)',
  icon: '🧭',
  color: '#0f766e',
  status: 'staged',
  summary: 'ست وحدات متقدمة في العمل والبحث والسياسات والإعلام والاستدامة والتواصل.',
  units: [
    {
      id: 'b2u1', title: 'القيادة والعمل والتفاوض', titleEn: 'Leadership, Work and Negotiation',
      grammar: [
        { id: 'b2u1-hedging', title: 'التحفظ والدقة في عرض الرأي', explain: 'استخدم may, tends to وappears to لتحديد قوة الادعاء وتجنب التعميم المطلق. ضع أداة التحفظ قرب الفكرة التي تحدّها.', examples: [{ en: 'The revised schedule may improve team productivity.', ar: 'قد يحسن الجدول المعدل إنتاجية الفريق.' }] },
        { id: 'b2u1-inversion', title: 'التوكيد بالتقديم الرسمي', explain: 'عند تقديم عبارة نفي مثل Not only، يتقدم الفعل المساعد على الفاعل: Not only did we meet the deadline, but we also reduced costs.', examples: [{ en: 'Not only did the team meet the deadline, but it also improved the process.', ar: 'لم يلتزم الفريق بالموعد النهائي فحسب، بل حسّن العملية أيضاً.' }] },
      ],
      vocabulary: [
        { en: 'allocate', ar: 'يخصص (موارد أو وقتاً)', example: { en: 'The manager allocated additional time to staff training.', ar: 'خصص المدير وقتاً إضافياً لتدريب الموظفين.' }, collocations: [{ en: 'allocate resources', ar: 'يخصص الموارد' }] },
        { en: 'follow up on', ar: 'يتابع موضوعاً أو إجراءً', example: { en: 'I will follow up on the budget proposal tomorrow.', ar: 'سأتابع مقترح الميزانية غداً.' }, phrasalVerbs: [{ en: 'take on', ar: 'يتولى مسؤولية', example: { en: 'She took on the role of project lead.', ar: 'تولت دور قائدة المشروع.' } }] },
      ],
      phonetics: [
        { id: 'b2u1-linking', en: 'allocate resources', ipa: '/ˈæləkeɪt rɪˈzɔːsɪz/', ar: 'يخصص الموارد', contrastPairs: [{ en: 'allocate / advocate', ar: 'ميّز /l/ عن /v/ ولا تستبدل /v/ بـ/f/.' }], connectedSpeech: [{ en: 'We need to allocate our resources carefully.', ar: 'تُضعف to إلى /tə/ ويرتبط الكلام مع بقاء النبر على allocate وresources.' }], intonation: [{ en: 'We can reduce the cost, but only if we adjust the scope. ↘↗ ... ↘', ar: 'هبوط في الاقتراح، وارتفاع على but only if للتحفظ، ثم هبوط في الشرط الحاسم.' }] },
        { id: 'b2u1-turntaking', en: 'Would you consider a phased approach?', ipa: '/wʊd juː kənˈsɪdər ə feɪzd əˈprəʊtʃ/', ar: 'هل تنظر في نهج مرحلي؟', contrastPairs: [{ en: 'phased / faced', ar: 'ميّز /z/ المجهورة في phased عن /t/ في faced.' }], connectedSpeech: [{ en: 'Would you consider...', ar: 'قد تندمج would you إلى /wʊdʒə/ في الحديث السريع.' }], intonation: [{ en: 'Would you consider a phased approach? ↗ ... ↘', ar: 'ارتفاع مهذب يفتح التفاوض وهبوط على approach عند اكتمال السؤال.' }] },
      ],
      arabic_l1_transfers: [
        { id: 'b2u1-article', incorrect: 'We need to reach agreement about the budget.', corrected: 'We need to reach an agreement about the budget.', pattern: 'حذف أداة مع اسم معدود مفرد', explanationAr: 'agreement اسم معدود عند قصد اتفاق محدد؛ استخدم an agreement. وقد يأتي غير معدود في سياقات أخرى.' },
        { id: 'b2u1-concession', incorrect: 'Although the cost is high, but the plan is useful.', corrected: 'Although the cost is high, the plan is useful.', pattern: 'تكرار أداة التنازل', explanationAr: 'لا تجمع although وbut في التركيب نفسه؛ اختر إحداهما بحسب بناء الجملة.' },
      ],
      academic_focus: [
        { id: 'b2u1-allocate', term: 'allocate', meaningAr: 'يخصص موارد أو وقتاً', example: { en: 'The organisation allocated funding to staff development.', ar: 'خصصت المؤسسة تمويلاً لتطوير الموظفين.' }, paraphrasing: [{ original: 'The company gave more money to training.', paraphrase: 'The company allocated additional funding to training.' }], idioms: [{ phrase: 'learn the ropes', meaningAr: 'يتعلم أصول العمل' }], readingAnalysis: [{ term: 'resource allocation', meaningAr: 'توزيع الموارد المحدودة بين الاحتياجات' }] },
        { id: 'b2u1-criterion', term: 'criterion', meaningAr: 'معيار (جمعها criteria)', example: { en: 'Cost was one criterion in the final decision.', ar: 'كانت التكلفة أحد معايير القرار النهائي.' }, paraphrasing: [{ original: 'We judged the options by cost and impact.', paraphrase: 'Cost and impact were key evaluation criteria.' }], readingAnalysis: [{ term: 'evaluation criterion', meaningAr: 'مقياس يستخدم للمفاضلة أو التقييم' }] },
      ],
      sentences: [{ en: 'The proposal is likely to reduce delays if we allocate enough staff.', ar: 'من المرجح أن يقلل المقترح التأخير إذا خصصنا عدداً كافياً من الموظفين.' }],
      dialogue: [{ who: 'A', en: 'Could we phase in the change over two months?', ar: 'هل يمكننا تطبيق التغيير على مراحل خلال شهرين؟' }, { who: 'B', en: 'That seems reasonable, provided we review the results weekly.', ar: 'يبدو ذلك معقولاً، شريطة أن نراجع النتائج أسبوعياً.' }],
    },
    {
      id: 'b2u2', title: 'البحث والتقنية والبيانات', titleEn: 'Research, Technology and Data',
      grammar: [
        { id: 'b2u2-reporting', title: 'أفعال الإبلاغ والتحفظ البحثي', explain: 'استخدم the data suggest وthe study demonstrates وthe author argues لتوضيح مصدر الادعاء وقوته. لا تحول الارتباط إلى سببية ما لم يدعمها تصميم البحث.', examples: [{ en: 'The findings suggest a link between screen time and sleep quality.', ar: 'تشير النتائج إلى علاقة بين وقت الشاشة وجودة النوم.' }] },
        { id: 'b2u2-noun-phrases', title: 'العبارات الاسمية المركبة', explain: 'تختصر العبارات الاسمية مفاهيم متكررة مثل a rapid increase in online access. حافظ على وضوح الاسم الرئيس والعلاقات بين المعدلات.', examples: [{ en: 'The survey found a significant increase in online access.', ar: 'وجد الاستطلاع زيادة ملحوظة في الوصول إلى الإنترنت.' }] },
      ],
      vocabulary: [
        { en: 'evidence', ar: 'دليل أو شواهد', example: { en: 'The evidence supports the main conclusion.', ar: 'يدعم الدليل الاستنتاج الرئيس.' }, collocations: [{ en: 'gather evidence', ar: 'يجمع الأدلة' }] },
        { en: 'carry out', ar: 'يجري أو ينفذ بحثاً', example: { en: 'Researchers carried out a small-scale survey.', ar: 'أجرى الباحثون استطلاعاً محدود النطاق.' }, phrasalVerbs: [{ en: 'point out', ar: 'يشير إلى أو يلفت الانتباه', example: { en: 'The report points out several limitations.', ar: 'يشير التقرير إلى عدة قيود.' } }] },
      ],
      phonetics: [
        { id: 'b2u2-evidence', en: 'evidence', ipa: '/ˈevɪdəns/', ar: 'دليل', contrastPairs: [{ en: 'evidence / evident', ar: 'تدرب على نهاية الاسم /əns/ والصفة /ənt/.' }], connectedSpeech: [{ en: 'The evidence suggests a possible link.', ar: 'تُبرز evidence وsuggests وتُخفف الكلمات الوظيفية غير المنبورة.' }], intonation: [{ en: 'The results are promising; however, the sample is small. ↘↗ ... ↘', ar: 'هبوط جزئي بعد النتيجة وارتفاع على however ثم هبوط يبرز القيد.' }] },
        { id: 'b2u2-qualification', en: 'The evidence suggests a link.', ipa: '/ði ˈevɪdəns səˈdʒests ə lɪŋk/', ar: 'تشير الأدلة إلى علاقة.', contrastPairs: [{ en: 'think / this', ar: 'ميّز /θ/ في think عن /ð/ في this.' }], connectedSpeech: [{ en: 'suggests a', ar: 'اربط نهاية الفعل بأداة a الضعيفة من دون حذفها.' }], intonation: [{ en: 'The data suggest a link, not a cause. ↘↗ ... ↘', ar: 'هبوط عند عرض العلاقة، وارتفاع تصحيحي على not a cause.' }] },
      ],
      arabic_l1_transfers: [
        { id: 'b2u2-evidence-count', incorrect: 'These evidences support the claim.', corrected: 'This evidence supports the claim.', pattern: 'جمع evidence في الاستعمال الأكاديمي المعتاد', explanationAr: 'evidence غالباً غير معدود؛ استخدم a piece of evidence لعد دليل واحد.' },
        { id: 'b2u2-causation', incorrect: 'The study proves that screen time causes poor sleep.', corrected: 'The study suggests an association between screen time and poor sleep.', pattern: 'المبالغة في قوة الاستنتاج', explanationAr: 'لا تستخدم proves أو causes إلا إذا كان تصميم الدراسة يدعم السببية؛ قد تكون النتائج ارتباطية.' },
      ],
      academic_focus: [
        { id: 'b2u2-evaluate', term: 'evaluate', meaningAr: 'يقيّم قوة أو قيمة شيء', example: { en: 'The authors evaluated the reliability of each source.', ar: 'قيّم المؤلفون موثوقية كل مصدر.' }, paraphrasing: [{ original: 'The team checked whether the sources were trustworthy.', paraphrase: 'The team evaluated source reliability.' }], idioms: [{ phrase: 'shed light on', meaningAr: 'يسلط الضوء على' }], readingAnalysis: [{ term: 'reliability', meaningAr: 'مدى اتساق القياس أو موثوقية المصدر' }] },
        { id: 'b2u2-indicate', term: 'indicate', meaningAr: 'يشير إلى', example: { en: 'The results indicate a possible association.', ar: 'تشير النتائج إلى ارتباط محتمل.' }, paraphrasing: [{ original: 'The data show a possible connection.', paraphrase: 'The data indicate a possible association.' }], readingAnalysis: [{ term: 'limitation', meaningAr: 'قيد يحد من تفسير النتائج أو تعميمها' }] },
      ],
      sentences: [{ en: 'The findings indicate an association, although further research is needed.', ar: 'تشير النتائج إلى وجود ارتباط، رغم الحاجة إلى مزيد من البحث.' }],
      dialogue: [{ who: 'A', en: 'Does the study prove that the new tool works?', ar: 'هل تثبت الدراسة أن الأداة الجديدة فعالة؟' }, { who: 'B', en: 'Not quite; it suggests a benefit, but the sample was limited.', ar: 'ليس تماماً؛ فهي تشير إلى فائدة، لكن العينة كانت محدودة.' }],
    },
    {
      id: 'b2u3', title: 'المجتمع والسياسات العامة', titleEn: 'Society and Public Policy',
      grammar: [
        { id: 'b2u3-conditionals', title: 'الشرط المركب والنتائج المحتملة', explain: 'استخدم الشرط الواقعي أو الافتراضي لشرح أثر السياسة: If the city expands the network, more residents may use public transport. وفي الافتراض استخدم الماضي بعد if وwould في النتيجة.', examples: [{ en: 'If fares were lower, more residents might use the bus.', ar: 'لو كانت الأجرة أقل، فقد يستخدم مزيد من السكان الحافلة.' }] },
        { id: 'b2u3-concession', title: 'التنازل والموازنة بين الحجج', explain: 'اعترف بجانب من الحجة ثم وازنه: While the policy may be costly, it could reduce congestion. لا تخلط بين while الزمنية والتنازل.', examples: [{ en: 'While the policy requires investment, it could improve access.', ar: 'رغم أن السياسة تتطلب استثماراً، فقد تحسن إمكانية الوصول.' }] },
      ],
      vocabulary: [
        { en: 'implement', ar: 'ينفذ سياسة أو خطة', example: { en: 'The council implemented the transport plan in stages.', ar: 'نفذ المجلس خطة النقل على مراحل.' }, collocations: [{ en: 'implement a policy', ar: 'ينفذ سياسة' }] },
        { en: 'bring about', ar: 'يحدث تغييراً', example: { en: 'The reform brought about gradual change.', ar: 'أحدث الإصلاح تغييراً تدريجياً.' }, phrasalVerbs: [{ en: 'phase in', ar: 'يطبق تدريجياً', example: { en: 'The city phased in the new rules over a year.', ar: 'طبقت المدينة القواعد الجديدة تدريجياً خلال عام.' } }] },
      ],
      phonetics: [
        { id: 'b2u3-implement', en: 'implement a policy', ipa: '/ˈɪmplɪment ə ˈpɒlɪsi/', ar: 'ينفذ سياسة', contrastPairs: [{ en: 'policy / politics', ar: 'ميّز النهايتين /si/ و/tɪks/ واختلاف المعنى.' }], connectedSpeech: [{ en: 'implement a', ar: 'تُخفف a إلى /ə/ وتندمج إيقاعياً مع الكلمة السابقة.' }], intonation: [{ en: 'The policy is costly, yet it could improve access. ↘↗ ... ↘', ar: 'هبوط عند ذكر الكلفة وارتفاع على yet ثم هبوط عند النتيجة.' }] },
        { id: 'b2u3-emphasis', en: 'If the council invests now, access will improve.', ipa: '/ɪf ðə ˈkaʊnsəl ɪnˈvests naʊ | ˈækses wɪl ɪmˈpruːv/', ar: 'إذا استثمر المجلس الآن، فسيتحسن الوصول.', contrastPairs: [{ en: 'think / this', ar: 'تدرب على /θ/ و/ð/ في أدوات الربط والضمائر.' }], connectedSpeech: [{ en: 'access will', ar: 'قد تضعف will إلى /wəl/ مع إبراز الفعل الرئيس.' }], intonation: [{ en: 'If the council invests now, access will improve. ↗ ... ↘', ar: 'تنغيم معلق على الشرط وهبوط واضح في النتيجة.' }] },
      ],
      arabic_l1_transfers: [
        { id: 'b2u3-implement', incorrect: 'The council implemented about a new policy.', corrected: 'The council implemented a new policy.', pattern: 'إضافة حرف جر لا يطلبه الفعل', explanationAr: 'implement فعل متعدٍ يأخذ المفعول مباشرة دون about.' },
        { id: 'b2u3-condition', incorrect: 'If the fares would fall, more people would travel.', corrected: 'If the fares fell, more people would travel.', pattern: 'تكرار would في الشرط الافتراضي', explanationAr: 'في الشرط الافتراضي المعتاد نستخدم الماضي بعد if وwould في النتيجة.' },
      ],
      academic_focus: [
        { id: 'b2u3-policy', term: 'policy', meaningAr: 'سياسة أو خطة عمل عامة', example: { en: 'The policy aims to improve access to public services.', ar: 'تهدف السياسة إلى تحسين الوصول إلى الخدمات العامة.' }, paraphrasing: [{ original: 'The city introduced a plan for public transport.', paraphrase: 'The city implemented a transport policy.' }], idioms: [{ phrase: 'the bigger picture', meaningAr: 'الصورة الأشمل' }], readingAnalysis: [{ term: 'stakeholder', meaningAr: 'طرف يتأثر بالقرار أو يشارك فيه' }] },
        { id: 'b2u3-consequence', term: 'consequence', meaningAr: 'نتيجة أو أثر مترتب', example: { en: 'One consequence may be higher demand.', ar: 'قد يكون أحد الآثار زيادة الطلب.' }, paraphrasing: [{ original: 'The change could lead to more demand.', paraphrase: 'One possible consequence is increased demand.' }], readingAnalysis: [{ term: 'trade-off', meaningAr: 'مفاضلة بين فائدة وتكلفة أو قيد' }] },
      ],
      sentences: [{ en: 'Although the policy requires investment, it may bring about lasting benefits.', ar: 'رغم أن السياسة تتطلب استثماراً، فقد تحقق فوائد طويلة الأمد.' }],
      dialogue: [{ who: 'A', en: 'Would lower fares solve the congestion problem?', ar: 'هل ستحل الأجور الأقل مشكلة الازدحام؟' }, { who: 'B', en: 'They might help, provided the service is reliable as well.', ar: 'قد تساعد، شريطة أن تكون الخدمة موثوقة أيضاً.' }],
    },
    {
      id: 'b2u4', title: 'الإعلام والثقافة والحجج', titleEn: 'Media, Culture and Argument',
      grammar: [
        { id: 'b2u4-reporting', title: 'النقل غير المباشر المتقدم', explain: 'اختر فعل الإبلاغ بحسب الموقف: claim, acknowledge, challenge, point out. استخدم المصدر مع to بعد claim، وجملة that بعد argue، وأعد الصياغة بدلاً من النقل الحرفي.', examples: [{ en: 'The columnist argues that the headline oversimplifies the issue.', ar: 'يجادل كاتب العمود بأن العنوان يبسط القضية أكثر من اللازم.' }] },
        { id: 'b2u4-cleft', title: 'التوكيد بتراكيب it-cleft', explain: 'يبرز تركيب It is/was ... that/who عنصراً محدداً: It was the missing context that changed the interpretation.', examples: [{ en: 'It was the source, not the headline, that changed my view.', ar: 'كان المصدر، لا العنوان، هو ما غيّر رأيي.' }] },
      ],
      vocabulary: [
        { en: 'interpret', ar: 'يفسر أو يؤول', example: { en: 'Readers may interpret the image in different ways.', ar: 'قد يفسر القراء الصورة بطرق مختلفة.' }, collocations: [{ en: 'interpret evidence', ar: 'يفسر الأدلة' }] },
        { en: 'back up', ar: 'يدعم رأياً بدليل', example: { en: 'The writer backs up the claim with survey data.', ar: 'يدعم الكاتب الادعاء ببيانات استطلاع.' }, phrasalVerbs: [{ en: 'bring up', ar: 'يطرح موضوعاً للنقاش', example: { en: 'She brought up an important question about bias.', ar: 'طرحت سؤالاً مهماً عن التحيز.' } }] },
      ],
      phonetics: [
        { id: 'b2u4-interpret', en: 'interpret', ipa: '/ɪnˈtɜːprɪt/', ar: 'يفسر', contrastPairs: [{ en: 'interpret / interrupt', ar: 'لاحظ اختلاف المقاطع وموقع النبر.' }], connectedSpeech: [{ en: 'The writer points out that...', ar: 'تُوصل that الضعيفة بالفعل السابق دون إبرازها بنبر.' }], intonation: [{ en: 'The image is powerful, but the caption is misleading. ↘↗ ... ↘', ar: 'هبوط في التقييم ثم ارتفاع استدراكي على but وهبوط في الحكم.' }] },
        { id: 'b2u4-counterpoint', en: 'Some readers may disagree.', ipa: '/sʌm ˈriːdəz meɪ ˌdɪsəˈɡriː/', ar: 'قد يختلف بعض القراء.', contrastPairs: [{ en: 'agree / disagree', ar: 'انتبه إلى السابقة dis والنبر قرب نهاية الكلمة.' }], connectedSpeech: [{ en: 'readers may', ar: 'تتصل /z/ بنطق may مع استمرار الإيقاع.' }], intonation: [{ en: 'Some readers may disagree; nevertheless, the evidence is clear. ↘↗ ... ↘', ar: 'نبرة مفتوحة بعد الاعتراض ثم هبوط حاسم على الخلاصة.' }] },
      ],
      arabic_l1_transfers: [
        { id: 'b2u4-argue', incorrect: 'The writer argues about the headline is misleading.', corrected: 'The writer argues that the headline is misleading.', pattern: 'about قبل جملة تابعة', explanationAr: 'استخدم argue that + جملة، وargue about + اسم لموضوع الخلاف.' },
        { id: 'b2u4-despite', incorrect: 'Despite the article was balanced, it received criticism.', corrected: 'Although the article was balanced, it received criticism.', pattern: 'جملة كاملة بعد despite', explanationAr: 'تتبع despite عبارة اسمية أو -ing؛ وتتبع although جملة تامة.' },
      ],
      academic_focus: [
        { id: 'b2u4-interpret', term: 'interpret', meaningAr: 'يفسر معنى أو دلالة', example: { en: 'The analysis interprets results in their social context.', ar: 'يفسر التحليل النتائج في سياقها الاجتماعي.' }, paraphrasing: [{ original: 'The writer explains what the results mean.', paraphrase: 'The writer interprets the results.' }], idioms: [{ phrase: 'read between the lines', meaningAr: 'يفهم المعنى الضمني' }], readingAnalysis: [{ term: 'bias', meaningAr: 'ميل قد يؤثر في اختيار المعلومات أو تفسيرها' }] },
        { id: 'b2u4-acknowledge', term: 'acknowledge', meaningAr: 'يقر بوجود نقطة أو حقيقة', example: { en: 'The article acknowledges the limits of the evidence.', ar: 'يقر المقال بحدود الأدلة.' }, paraphrasing: [{ original: 'The writer admits that there are limits.', paraphrase: 'The writer acknowledges the limitations.' }], readingAnalysis: [{ term: 'counterargument', meaningAr: 'حجة تعرض رأياً مخالفاً للحجة الأساسية' }] },
      ],
      sentences: [{ en: 'The author acknowledges a counterargument before defending the main claim.', ar: 'يقر الكاتب بحجة مضادة قبل الدفاع عن الادعاء الرئيس.' }],
      dialogue: [{ who: 'A', en: 'The headline makes the story sound certain.', ar: 'يجعل العنوان الخبر يبدو مؤكداً.' }, { who: 'B', en: 'True, but the article itself acknowledges some uncertainty.', ar: 'صحيح، لكن المقال نفسه يقر ببعض عدم اليقين.' }],
    },
    {
      id: 'b2u5', title: 'البيئة والابتكار والاستدامة', titleEn: 'Environment, Innovation and Sustainability',
      grammar: [
        { id: 'b2u5-participle', title: 'عبارات الوصف المختصرة', explain: 'تختصر عبارات -ing و-ed معلومات الاسم: households using less energy وmaterials produced locally. يجب أن تصف العبارة الاسم المقصود لا أن تُترك معلقة.', examples: [{ en: 'Products made from recycled materials often require less energy.', ar: 'غالباً ما تتطلب المنتجات المصنوعة من مواد معاد تدويرها طاقة أقل.' }] },
        { id: 'b2u5-cause', title: 'التعبير الدقيق عن السبب والنتيجة', explain: 'ميّز بين because + جملة، وbecause of + اسم، وresult in + نتيجة، وresult from + سبب. لا تدّع السببية ما لم تدعمها البيانات.', examples: [{ en: 'Lower energy use can result in reduced emissions.', ar: 'قد يؤدي انخفاض استهلاك الطاقة إلى تقليل الانبعاثات.' }] },
      ],
      vocabulary: [
        { en: 'sustainable', ar: 'مستدام', example: { en: 'The city is investing in sustainable transport.', ar: 'تستثمر المدينة في النقل المستدام.' }, collocations: [{ en: 'sustainable development', ar: 'تنمية مستدامة' }] },
        { en: 'phase out', ar: 'يوقف تدريجياً', example: { en: 'The company will phase out single-use packaging.', ar: 'ستوقف الشركة التغليف أحادي الاستخدام تدريجياً.' }, phrasalVerbs: [{ en: 'run out of', ar: 'ينفد منه', example: { en: 'Some regions may run out of water during dry periods.', ar: 'قد تنفد المياه من بعض المناطق خلال فترات الجفاف.' } }] },
      ],
      phonetics: [
        { id: 'b2u5-sustainable', en: 'sustainable development', ipa: '/səˈsteɪnəbəl dɪˈveləpmənt/', ar: 'تنمية مستدامة', contrastPairs: [{ en: 'sustain / sustainable', ar: 'لاحظ انتقال النبر في اشتقاق الصفة.' }], connectedSpeech: [{ en: 'materials produced locally', ar: 'اربط produced locally مع وضوح نهاية /d/ قبل /l/.' }], intonation: [{ en: 'If emissions continue to rise, the impact could be severe. ↗ ... ↘', ar: 'نبرة غير نهائية في الشرط ثم هبوط على التحذير.' }] },
        { id: 'b2u5-chart', en: 'The chart shows a gradual decline.', ipa: '/ðə tʃɑːt ʃəʊz ə ˈɡrædʒuəl dɪˈklaɪn/', ar: 'يعرض المخطط انخفاضاً تدريجياً.', contrastPairs: [{ en: 'chart / sharp', ar: 'ميّز /tʃ/ عن /ʃ/ في البداية.' }], connectedSpeech: [{ en: 'shows a', ar: 'تُخفف a إلى /ə/ بعد نهاية الفعل المجهورة.' }], intonation: [{ en: 'The chart shows a decline, although the change is modest. ↘↗ ... ↘', ar: 'هبوط في وصف البيانات وارتفاع للتنازل ثم هبوط عند تحديد حجم التغير.' }] },
      ],
      arabic_l1_transfers: [
        { id: 'b2u5-result', incorrect: 'The change resulted to lower emissions.', corrected: 'The change resulted in lower emissions.', pattern: 'اختيار حرف الجر مع result', explanationAr: 'نقول result in لذكر النتيجة وresult from لذكر السبب.' },
        { id: 'b2u5-participle', incorrect: 'Using recycled materials, the products are cheaper.', corrected: 'Products made using recycled materials are cheaper.', pattern: 'عبارة وصف معلقة بفاعل غير مقصود', explanationAr: 'تأكد أن فاعل عبارة -ing هو الاسم الذي يليها أو يطابق المعنى المقصود.' },
      ],
      academic_focus: [
        { id: 'b2u5-sustain', term: 'sustain', meaningAr: 'يحافظ على استمرارية شيء', example: { en: 'The project aims to sustain local employment.', ar: 'يهدف المشروع إلى الحفاظ على فرص العمل المحلية.' }, paraphrasing: [{ original: 'The project will keep local jobs available.', paraphrase: 'The project will sustain local employment.' }], idioms: [{ phrase: 'in the long run', meaningAr: 'على المدى البعيد' }], readingAnalysis: [{ term: 'sustainability', meaningAr: 'القدرة على الاستمرار مع مراعاة الموارد والآثار' }] },
        { id: 'b2u5-decline', term: 'decline', meaningAr: 'انخفاض أو يتراجع', example: { en: 'The chart shows a gradual decline in energy use.', ar: 'يعرض المخطط انخفاضاً تدريجياً في استهلاك الطاقة.' }, paraphrasing: [{ original: 'Energy use went down slowly.', paraphrase: 'Energy use declined gradually.' }], readingAnalysis: [{ term: 'trend', meaningAr: 'اتجاه عام في تغير البيانات عبر الزمن' }] },
      ],
      sentences: [{ en: 'The figures suggest a gradual decline, although more data are needed.', ar: 'تشير الأرقام إلى انخفاض تدريجي، رغم الحاجة إلى مزيد من البيانات.' }],
      dialogue: [{ who: 'A', en: 'Will phasing out plastic increase costs?', ar: 'هل سيؤدي الإيقاف التدريجي للبلاستيك إلى زيادة التكاليف؟' }, { who: 'B', en: 'Possibly at first, but reusable packaging may reduce waste over time.', ar: 'ربما في البداية، لكن التغليف القابل لإعادة الاستخدام قد يقلل النفايات بمرور الوقت.' }],
    },
    {
      id: 'b2u6', title: 'التواصل العالمي وحل النزاعات', titleEn: 'Global Communication and Conflict Resolution',
      grammar: [
        { id: 'b2u6-diplomacy', title: 'التلطيف والطلب الدبلوماسي', explain: 'استخدم الأسئلة غير المباشرة وعبارات التلطيف: I wonder whether..., Would it be possible to... بعد أداة الاستفهام في السؤال المضمن استخدم ترتيب الجملة الخبرية.', examples: [{ en: 'Could you explain how the deadline was selected?', ar: 'هل يمكنك توضيح كيفية اختيار الموعد النهائي؟' }] },
        { id: 'b2u6-subjunctive', title: 'التوصية الرسمية وصيغة الاقتراح', explain: 'في الأسلوب الرسمي قد يأتي الفعل بصورته الأساسية بعد recommend/suggest that: We recommend that each team member review the draft. ويشيع أيضاً استخدام should.', examples: [{ en: 'The mediator recommended that both sides reconsider the proposal.', ar: 'أوصى الوسيط بأن يعيد الطرفان النظر في المقترح.' }] },
      ],
      vocabulary: [
        { en: 'facilitate', ar: 'يسهّل أو ييسّر', example: { en: 'A clear agenda can facilitate discussion.', ar: 'يمكن لجدول أعمال واضح أن يسهّل النقاش.' }, collocations: [{ en: 'facilitate communication', ar: 'يسهّل التواصل' }] },
        { en: 'work out', ar: 'يتوصل إلى حل أو ترتيب', example: { en: 'The partners worked out a fair compromise.', ar: 'توصل الشريكان إلى حل وسط عادل.' }, phrasalVerbs: [{ en: 'back down', ar: 'يتراجع عن موقف أو مطلب', example: { en: 'Neither side wanted to back down immediately.', ar: 'لم يرغب أي من الطرفين في التراجع فوراً.' } }] },
      ],
      phonetics: [
        { id: 'b2u6-facilitate', en: 'facilitate communication', ipa: '/fəˈsɪlɪteɪt kəˌmjuːnɪˈkeɪʃən/', ar: 'يسهّل التواصل', contrastPairs: [{ en: 'facilitate / facility', ar: 'لاحظ اختلاف النبر بين الفعل والاسم.' }], connectedSpeech: [{ en: 'Could you clarify your main concern?', ar: 'قد تختزل could you إلى /kədʒə/ في الحديث الهادئ.' }], intonation: [{ en: 'I see why that matters; could we explore another option? ↘↗ ... ↘↗', ar: 'هبوط متعاطف ثم ارتفاع لفتح خيار بديل وارتفاع لطيف في السؤال الدبلوماسي.' }] },
        { id: 'b2u6-disagreement', en: 'I take your point, although I see it differently.', ipa: '/aɪ teɪk jɔː pɔɪnt | ɔːlˈðəʊ aɪ siː ɪt ˈdɪfrəntli/', ar: 'أتفهم وجهة نظرك، رغم أنني أراها بشكل مختلف.', contrastPairs: [{ en: 'think / although', ar: 'ميّز /θ/ المهموسة عن /ð/ المجهورة.' }], connectedSpeech: [{ en: 'take your', ar: 'قد تضعف your إلى /jə/؛ حافظ على نبر take.' }], intonation: [{ en: 'I take your point ↘, although ↗ I see it differently ↘', ar: 'هبوط للتصديق، وارتفاع تمهيدي عند although، ثم هبوط يحدد الاختلاف.' }] },
      ],
      arabic_l1_transfers: [
        { id: 'b2u6-indirect-question', incorrect: 'Could you explain how did you choose the date?', corrected: 'Could you explain how you chose the date?', pattern: 'قلب ترتيب الفاعل والفعل في السؤال غير المباشر', explanationAr: 'بعد how في السؤال المضمن استخدم ترتيب الجملة الخبرية ولا تكرر did.' },
        { id: 'b2u6-diplomacy', incorrect: 'I agree with you, but your idea is wrong.', corrected: 'I see your point; however, I have a different concern.', pattern: 'نقل صيغة المواجهة المباشرة', explanationAr: 'يمكن الإقرار بجزء من الرأي ثم عرض تحفظ محدد بصياغة أقل تصادمية.' },
      ],
      academic_focus: [
        { id: 'b2u6-facilitate', term: 'facilitate', meaningAr: 'يسهّل أو يجعل العملية أيسر', example: { en: 'A shared glossary can facilitate communication across teams.', ar: 'يمكن لمسرد مشترك أن يسهّل التواصل بين الفرق.' }, paraphrasing: [{ original: 'The glossary makes communication easier.', paraphrase: 'The glossary facilitates communication.' }], idioms: [{ phrase: 'meet halfway', meaningAr: 'يتوصل إلى حل وسط' }], readingAnalysis: [{ term: 'mechanism', meaningAr: 'الطريقة التي يحدث بها أثر أو تغير' }] },
        { id: 'b2u6-establish', term: 'establish', meaningAr: 'يرسخ أو ينشئ', example: { en: 'The partners established a process for resolving disputes.', ar: 'أنشأ الشريكان آلية لحل النزاعات.' }, paraphrasing: [{ original: 'They created a clear process.', paraphrase: 'They established a clear procedure.' }], readingAnalysis: [{ term: 'procedure', meaningAr: 'خطوات محددة لإنجاز مهمة أو التعامل مع حالة' }] },
      ],
      sentences: [{ en: 'The mediator facilitated a discussion that helped both sides establish common ground.', ar: 'يسّر الوسيط نقاشاً ساعد الطرفين على إيجاد أرضية مشتركة.' }],
      dialogue: [{ who: 'A', en: 'I take your point, but I am concerned about the timing.', ar: 'أتفهم وجهة نظرك، لكنني قلق بشأن التوقيت.' }, { who: 'B', en: 'That is fair. Could we agree on a later review date?', ar: 'هذا معقول. هل يمكن أن نتفق على موعد مراجعة لاحق؟' }],
    },
  ],
};

function nonEmptyArray(value) {
  return Array.isArray(value) && value.length > 0;
}

export function normalizeCurriculumUnit(unit = {}) {
  if (!unit || typeof unit !== 'object') unit = {};
  return {
    ...unit,
    grammar: Array.isArray(unit.grammar) ? unit.grammar : [],
    vocabulary: Array.isArray(unit.vocabulary) ? unit.vocabulary : [],
    phonetics: Array.isArray(unit.phonetics) ? unit.phonetics : [],
    arabic_l1_transfers: Array.isArray(unit.arabic_l1_transfers) ? unit.arabic_l1_transfers : [],
    academic_focus: Array.isArray(unit.academic_focus) ? unit.academic_focus : [],
    sentences: Array.isArray(unit.sentences) ? unit.sentences : [],
    dialogue: Array.isArray(unit.dialogue) ? unit.dialogue : [],
  };
}

export function validateLevel(level) {
  const warnings = [];
  if (!level || typeof level !== 'object') {
    return { valid: false, warnings: ['المستوى غير صالح: المتوقع كائن بيانات.'], errors: ['invalid-level'] };
  }
  if (!Array.isArray(level.units) || !level.units.length) {
    warnings.push(`${level.id || 'المستوى'}: لا يحتوي وحدات مكتملة.`);
    return { valid: false, warnings, errors: ['missing-units'] };
  }

  const ids = new Set();
  level.units.forEach((rawUnit, index) => {
    const unit = normalizeCurriculumUnit(rawUnit);
    const label = unit.id || `الوحدة ${index + 1}`;
    if (!unit.id || ids.has(unit.id)) warnings.push(`${label}: معرّف الوحدة مفقود أو مكرر.`);
    ids.add(unit.id);
    for (const component of UNIT_COMPONENTS) {
      if (!nonEmptyArray(unit[component])) warnings.push(`${label}: المكوّن "${component}" مفقود أو فارغ.`);
      const itemIds = (unit[component] || []).map((item) => item?.id).filter(Boolean);
      if (new Set(itemIds).size !== itemIds.length) warnings.push(`${label}: معرّفات متكررة في "${component}".`);
    }
  });

  return { valid: warnings.length === 0, warnings, errors: warnings.length ? ['incomplete-units'] : [] };
}

export function exportStagedLevel(level) {
  const validation = validateLevel(level);
  if (!validation.valid) {
    const error = new Error('لا يمكن تصدير مستوى غير مكتمل.');
    error.validation = validation;
    throw error;
  }
  return JSON.stringify({
    schemaVersion: CURRICULUM_SCHEMA_VERSION,
    level: {
      ...level,
      status: 'ready',
      units: level.units.map(normalizeCurriculumUnit),
    },
  }, null, 2);
}

export function importStagedLevel(payload) {
  let bundle = payload;
  try {
    if (typeof payload === 'string') bundle = JSON.parse(payload);
  } catch {
    return { level: null, valid: false, warnings: ['تعذرت قراءة ملف المنهج: JSON غير صالح.'] };
  }
  const level = bundle?.level;
  if (bundle?.schemaVersion !== CURRICULUM_SCHEMA_VERSION) {
    return { level: null, valid: false, warnings: [`إصدار المخطط غير مدعوم: ${bundle?.schemaVersion ?? 'غير محدد'}.`] };
  }
  const validation = validateLevel(level);
  if (!validation.valid) return { level: null, ...validation };
  return {
    level: {
      ...level,
      status: 'ready',
      units: level.units.map(normalizeCurriculumUnit),
    },
    ...validation,
  };
}

export function isPlannedLevel(level) {
  return Boolean(level && level.status === 'planned' && Array.isArray(level.units) && level.units.length === 0);
}
