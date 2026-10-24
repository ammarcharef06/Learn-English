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
        { en: 'negotiate', ar: 'يفاوض', example: { en: 'The teams negotiated a practical solution.', ar: 'فاوض الفريقان للتوصل إلى حل عملي.' }, collocations: [{ en: 'negotiate terms', ar: 'يفاوض على الشروط' }] },
        { en: 'priority', ar: 'أولوية', example: { en: 'Safety is our highest priority.', ar: 'السلامة هي أولويتنا القصوى.' }, collocations: [{ en: 'set priorities', ar: 'يرتب الأولويات' }] },
        { en: 'compromise', ar: 'حل وسط أو يتوصل إلى حل وسط', example: { en: 'Both sides reached a compromise.', ar: 'توصل الطرفان إلى حل وسط.' }, collocations: [{ en: 'reach a compromise', ar: 'يتوصل إلى حل وسط' }] },
        { en: 'phase in', ar: 'يدخل أو يطبق تدريجياً', example: { en: 'The company will phase in the new schedule.', ar: 'ستطبق الشركة الجدول الجديد تدريجياً.' }, phrasalVerbs: [{ en: 'phase in', ar: 'يدخل أو يطبق تدريجياً' }] },
        { en: 'deadline', ar: 'موعد نهائي', example: { en: 'We met the deadline despite the delay.', ar: 'التزمنا بالموعد النهائي رغم التأخير.' }, collocations: [{ en: 'meet a deadline', ar: 'يلتزم بموعد نهائي' }] },
        { en: 'feasible', ar: 'قابل للتنفيذ', example: { en: 'The revised plan is financially feasible.', ar: 'الخطة المعدلة قابلة للتنفيذ مالياً.' }, collocations: [{ en: 'feasible option', ar: 'خيار قابل للتنفيذ' }] },
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
        { en: 'carry out', ar: 'يجري أو ينفذ بحثاً', example: { en: 'Researchers carry out a small-scale survey.', ar: 'يجري الباحثون استطلاعاً محدود النطاق.' }, phrasalVerbs: [{ en: 'point out', ar: 'يشير إلى أو يلفت الانتباه', example: { en: 'The report points out several limitations.', ar: 'يشير التقرير إلى عدة قيود.' } }] },
        { en: 'sample', ar: 'عينة', example: { en: 'The sample included participants from three regions.', ar: 'شملت العينة مشاركين من ثلاث مناطق.' }, collocations: [{ en: 'representative sample', ar: 'عينة ممثلة' }] },
        { en: 'reliable', ar: 'موثوق', example: { en: 'The sensor produced reliable readings.', ar: 'أنتج المستشعر قراءات موثوقة.' }, collocations: [{ en: 'reliable data', ar: 'بيانات موثوقة' }] },
        { en: 'analyse', ar: 'يحلل', example: { en: 'The researchers analysed the results carefully.', ar: 'حلل الباحثون النتائج بعناية.' }, collocations: [{ en: 'analyse data', ar: 'يحلل البيانات' }] },
        { en: 'limitation', ar: 'قيد أو محدودية', example: { en: 'A small sample is one limitation of the study.', ar: 'العينة الصغيرة إحدى محدوديات الدراسة.' }, collocations: [{ en: 'study limitation', ar: 'محدودية الدراسة' }] },
        { en: 'set up', ar: 'ينشئ أو يجهز', example: { en: 'The team set up a test environment.', ar: 'أعد الفريق بيئة اختبار.' }, phrasalVerbs: [{ en: 'set up', ar: 'ينشئ أو يجهز' }] },
        { en: 'significant', ar: 'ملحوظ أو ذو دلالة', example: { en: 'The analysis found a significant difference.', ar: 'وجد التحليل فرقاً ملحوظاً.' }, collocations: [{ en: 'significant difference', ar: 'فرق ملحوظ' }] },
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
        { en: 'bring about', ar: 'يحدث تغييراً', example: { en: 'The reform can bring about gradual change.', ar: 'يمكن للإصلاح أن يحدث تغييراً تدريجياً.' }, phrasalVerbs: [{ en: 'phase in', ar: 'يطبق تدريجياً', example: { en: 'The city phased in the new rules over a year.', ar: 'طبقت المدينة القواعد الجديدة تدريجياً خلال عام.' } }] },
        { en: 'congestion', ar: 'ازدحام', example: { en: 'The new route reduced congestion near the school.', ar: 'قلل المسار الجديد الازدحام قرب المدرسة.' }, collocations: [{ en: 'traffic congestion', ar: 'ازدحام مروري' }] },
        { en: 'access', ar: 'وصول أو إمكانية الوصول', example: { en: 'The service improves access to local clinics.', ar: 'تحسن الخدمة إمكانية الوصول إلى العيادات المحلية.' }, collocations: [{ en: 'equal access', ar: 'إمكانية وصول متساوية' }] },
        { en: 'stakeholder', ar: 'طرف معني أو صاحب مصلحة', example: { en: 'Each stakeholder was invited to the consultation.', ar: 'دعي كل طرف معني إلى المشاورة.' }, collocations: [{ en: 'key stakeholder', ar: 'طرف معني رئيس' }] },
        { en: 'consult', ar: 'يستشير', example: { en: 'The council consulted residents before the vote.', ar: 'استشار المجلس السكان قبل التصويت.' }, collocations: [{ en: 'consult residents', ar: 'يستشير السكان' }] },
        { en: 'roll out', ar: 'يطرح أو يطبق على نطاق أوسع', example: { en: 'The agency will roll out the service next year.', ar: 'ستطرح الوكالة الخدمة العام القادم.' }, phrasalVerbs: [{ en: 'roll out', ar: 'يطرح أو يطبق على نطاق أوسع' }] },
        { en: 'trade-off', ar: 'مفاضلة بين مكاسب وتكاليف', example: { en: 'Every option involves a trade-off between speed and cost.', ar: 'يتضمن كل خيار مفاضلة بين السرعة والتكلفة.' }, collocations: [{ en: 'balance a trade-off', ar: 'يوازن بين جوانب المفاضلة' }] },
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
        { en: 'back up', ar: 'يدعم رأياً بدليل', example: { en: 'The writer uses survey data to back up the claim.', ar: 'يستخدم الكاتب بيانات استطلاع لدعم الادعاء.' }, phrasalVerbs: [{ en: 'bring up', ar: 'يطرح موضوعاً للنقاش', example: { en: 'She brought up an important question about bias.', ar: 'طرحت سؤالاً مهماً عن التحيز.' } }] },
        { en: 'bias', ar: 'تحيز', example: { en: 'The report considers possible bias in the sample.', ar: 'ينظر التقرير في احتمال وجود تحيز في العينة.' }, collocations: [{ en: 'media bias', ar: 'تحيز إعلامي' }] },
        { en: 'perspective', ar: 'وجهة نظر', example: { en: 'The article presents a different perspective.', ar: 'يعرض المقال وجهة نظر مختلفة.' }, collocations: [{ en: 'different perspective', ar: 'وجهة نظر مختلفة' }] },
        { en: 'context', ar: 'سياق', example: { en: 'The context changes how the remark is understood.', ar: 'يغير السياق طريقة فهم الملاحظة.' }, collocations: [{ en: 'historical context', ar: 'سياق تاريخي' }] },
        { en: 'challenge', ar: 'يطعن في أو يتحدى', example: { en: 'The review challenges the assumption behind the headline.', ar: 'يطعن الاستعراض في الافتراض الكامن وراء العنوان.' }, collocations: [{ en: 'challenge an assumption', ar: 'يطعن في افتراض' }] },
        { en: 'come across as', ar: 'يبدو للآخرين على أنه', example: { en: 'The comment may come across as dismissive.', ar: 'قد يبدو التعليق استخفافياً.' }, phrasalVerbs: [{ en: 'come across as', ar: 'يبدو للآخرين على أنه' }] },
        { en: 'interpretation', ar: 'تفسير أو تأويل', example: { en: 'There is more than one interpretation of the image.', ar: 'هناك أكثر من تفسير للصورة.' }, collocations: [{ en: 'alternative interpretation', ar: 'تفسير بديل' }] },
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
        { en: 'emission', ar: 'انبعاث', example: { en: 'The factory reduced its carbon emissions.', ar: 'خفض المصنع انبعاثاته الكربونية.' }, collocations: [{ en: 'carbon emission', ar: 'انبعاث كربوني' }] },
        { en: 'renewable', ar: 'متجدد', example: { en: 'The region invested in renewable energy.', ar: 'استثمرت المنطقة في الطاقة المتجددة.' }, collocations: [{ en: 'renewable energy', ar: 'طاقة متجددة' }] },
        { en: 'efficient', ar: 'كفء أو فعّال', example: { en: 'A more efficient system uses less energy.', ar: 'يستخدم النظام الأكثر كفاءة طاقة أقل.' }, collocations: [{ en: 'energy efficient', ar: 'موفر للطاقة' }] },
        { en: 'adapt', ar: 'يتكيف أو يعدل', example: { en: 'Farmers adapted their methods to the changing climate.', ar: 'كيف المزارعون أساليبهم مع تغير المناخ.' }, collocations: [{ en: 'adapt to change', ar: 'يتكيف مع التغيير' }] },
        { en: 'scale up', ar: 'يوسع نطاق التطبيق', example: { en: 'The pilot programme may scale up next year.', ar: 'قد يوسع البرنامج التجريبي نطاقه العام القادم.' }, phrasalVerbs: [{ en: 'scale up', ar: 'يوسع نطاق التطبيق' }] },
        { en: 'footprint', ar: 'بصمة (أثر بيئي)', example: { en: 'The company aims to reduce its carbon footprint.', ar: 'تهدف الشركة إلى تقليل بصمتها الكربونية.' }, collocations: [{ en: 'carbon footprint', ar: 'بصمة كربونية' }] },
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
        { en: 'work out', ar: 'يتوصل إلى حل أو ترتيب', example: { en: 'The partners work out a fair compromise.', ar: 'يتوصل الشريكان إلى حل وسط عادل.' }, phrasalVerbs: [{ en: 'back down', ar: 'يتراجع عن موقف أو مطلب', example: { en: 'Neither side wanted to back down immediately.', ar: 'لم يرغب أي من الطرفين في التراجع فوراً.' } }] },
        { en: 'mediate', ar: 'يتوسط لحل خلاف', example: { en: 'A neutral colleague mediated the discussion.', ar: 'توسط زميل محايد في النقاش.' }, collocations: [{ en: 'mediate a dispute', ar: 'يتوسط لحل نزاع' }] },
        { en: 'misunderstanding', ar: 'سوء فهم', example: { en: 'A brief misunderstanding delayed the agreement.', ar: 'أخر سوء فهم قصير الاتفاق.' }, collocations: [{ en: 'resolve a misunderstanding', ar: 'يعالج سوء فهم' }] },
        { en: 'clarify', ar: 'يوضح', example: { en: 'Could you clarify what you mean by fair?', ar: 'هل يمكنك توضيح ما تقصده بكلمة عادل؟' }, collocations: [{ en: 'clarify a point', ar: 'يوضح نقطة' }] },
        { en: 'mutual', ar: 'متبادل', example: { en: 'Both sides reached a mutual understanding.', ar: 'توصل الطرفان إلى تفاهم متبادل.' }, collocations: [{ en: 'mutual understanding', ar: 'تفاهم متبادل' }] },
        { en: 'reach out to', ar: 'يتواصل مع', example: { en: 'I will reach out to the project coordinator.', ar: 'سأتواصل مع منسق المشروع.' }, phrasalVerbs: [{ en: 'reach out to', ar: 'يتواصل مع' }] },
        { en: 'resolution', ar: 'حل أو تسوية', example: { en: 'The resolution addressed both teams’ concerns.', ar: 'عالج الحل مخاوف الفريقين.' }, collocations: [{ en: 'peaceful resolution', ar: 'حل سلمي' }] },
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

function advancedSpeech(id, en, ipa, ar, contrast, connectedSpeech, intonation) {
  return {
    id, en, ipa, ar,
    accentNote: 'تختلف بعض التفاصيل الصوتية بين اللهجات المعيارية؛ هذا الرمز مرجع تقريبي لا لهجة إلزامية.',
    contrastPairs: [contrast],
    connectedSpeech: [{ en, ar: connectedSpeech }],
    intonation: [{ en, ar: intonation }],
  };
}

export const C1_STAGED_CURRICULUM = {
  id: 'c1', label: 'C1 — متقدم', labelEn: 'Advanced (C1)',
  icon: '📚', color: '#7c3aed', status: 'staged',
  summary: 'ست وحدات متقدمة في الكتابة الأكاديمية والخطاب والنقد والتواصل الدقيق.',
  units: [
    {
      id: 'c1u1', title: 'البحث الأكاديمي وتركيب المصادر', titleEn: 'Academic Research and Source Synthesis',
      grammar: [
        { id: 'c1u1-attribution', title: 'الإسناد الدقيق والتحفظ الأكاديمي', explain: 'فرّق بين report, demonstrate, suggest وspeculate؛ فاختيار فعل الإسناد يحدد قوة الدليل وموقف الكاتب. استخدم may, appears to وis consistent with عندما لا تسمح المعطيات بالجزم.', examples: [{ en: 'The findings appear to be consistent with earlier research.', ar: 'يبدو أن النتائج تتفق مع أبحاث سابقة.' }] },
        { id: 'c1u1-synthesis', title: 'التلخيص والتركيب بين المصادر', explain: 'ادمج المصادر حول فكرة مشتركة بدلاً من تلخيص كل مصدر على حدة. استخدم whereas أو while للمقارنة، ثم اسند كل ادعاء بوضوح إلى مصدره.', examples: [{ en: 'Whereas Lee emphasises access, Patel questions the long-term effect.', ar: 'بينما يؤكد لي على إمكانية الوصول، يشكك باتل في الأثر طويل الأمد.' }] },
      ],
      vocabulary: [
        { en: 'synthesize', ar: 'يركب أفكاراً أو مصادر في خلاصة', example: { en: 'The review synthesizes evidence from three studies.', ar: 'تركب المراجعة أدلة من ثلاث دراسات.' }, collocations: [{ en: 'synthesize evidence', ar: 'يركب الأدلة' }] },
        { en: 'account for', ar: 'يفسر أو يشكل نسبة من', example: { en: 'The model accounts for most of the observed variation.', ar: 'يفسر النموذج معظم التباين الملحوظ.' }, phrasalVerbs: [{ en: 'draw on', ar: 'يستند إلى مصدر أو خبرة', example: { en: 'The chapter draws on recent survey data.', ar: 'يستند الفصل إلى بيانات استطلاع حديثة.' } }] },
        { en: 'notwithstanding', ar: 'على الرغم من', example: { en: 'Notwithstanding these limitations, the study offers useful evidence.', ar: 'على الرغم من هذه القيود، تقدم الدراسة أدلة مفيدة.' }, collocations: [{ en: 'notwithstanding the evidence', ar: 'على الرغم من الأدلة' }] },
        { en: 'robust', ar: 'متين أو قوي (منهجياً)', example: { en: 'The authors used a robust sampling method.', ar: 'استخدم المؤلفون طريقة أخذ عينات متينة.' }, phrasalVerbs: [{ en: 'build on', ar: 'يطور انطلاقاً من عمل سابق', example: { en: 'This study builds on earlier findings.', ar: 'تطور هذه الدراسة انطلاقاً من نتائج سابقة.' } }] },
      ],
      phonetics: [
        advancedSpeech('c1u1-synthesis', 'The findings appear to support the initial hypothesis.', '/ðə ˈfaɪndɪŋz əˈpɪə tə səˈpɔːt ði ɪˈnɪʃəl haɪˈpɒθəsɪs/', 'يبدو أن النتائج تدعم الفرضية الأولية.', { en: 'hypothesis / hypotheses', ar: 'تمييز المفرد /sɪs/ عن الجمع /siːz/ مع اختلاف موضع النبر.' }, 'تضعف to وthe في الكلام المتصل، بينما يحمل findings وsupport وhypothesis النبر المعجمي.', 'هبوط جزئي بعد findings، ونبرة غير نهائية على support، ثم هبوط عند اكتمال الجملة؛ قد تتغير حركة vowels بين النطق البريطاني والأمريكي.'),
        advancedSpeech('c1u1-stance', 'The evidence is compelling, though not conclusive.', '/ði ˈevɪdəns ɪz kəmˈpelɪŋ ðəʊ nɒt kənˈkluːsɪv/', 'الأدلة مقنعة، وإن لم تكن حاسمة.', { en: 'conclusive / inclusive', ar: 'لاحظ اختلاف المقطع الأول /kən/ و/ɪn/ والنبر الرئيس.' }, 'اربط evidence is مع انتقال صوت /z/، واستخدم نبرة خفيفة على though لإبراز القيد.', 'هبوط بعد compelling مع ارتفاع طفيف قبل التحفظ، ثم هبوط على conclusive لإغلاق التقييم المتوازن.'),
      ],
      arabic_l1_transfers: [
        { id: 'c1u1-evidence', incorrect: 'The evidences prove the hypothesis.', corrected: 'The evidence supports the hypothesis.', pattern: 'جمع evidence والمبالغة في فعل الإثبات', explanationAr: 'evidence اسم غير معدود غالباً، وsupports أدق من proves ما لم يكن الإثبات قطعياً.' },
        { id: 'c1u1-since', incorrect: 'The result is different since the previous study.', corrected: 'The result differs from that of the previous study.', pattern: 'ترجمة منذ/عن حرفياً عند المقارنة', explanationAr: 'للمقارنة استخدم differ from، ولا تستخدم since إلا للزمن أو السبب بحسب السياق.' },
      ],
      academic_focus: [
        { id: 'c1u1-derive', term: 'derive', meaningAr: 'يستمد أو يشتق', example: { en: 'The authors derive the estimate from longitudinal data.', ar: 'يشتق المؤلفون التقدير من بيانات طولية.' }, paraphrasing: [{ original: 'The estimate comes from repeated observations.', paraphrase: 'The estimate is derived from repeated observations.' }], idioms: [{ phrase: 'the tip of the iceberg', meaningAr: 'الجزء الظاهر من مشكلة أكبر' }], readingAnalysis: [{ term: 'methodological limitation', meaningAr: 'قيد في تصميم الدراسة أو طريقة البحث' }] },
        { id: 'c1u1-empirical', term: 'empirical', meaningAr: 'قائم على الملاحظة أو التجربة', example: { en: 'The claim requires stronger empirical support.', ar: 'يتطلب الادعاء دعماً تجريبياً أقوى.' }, paraphrasing: [{ original: 'The claim needs more evidence from observation.', paraphrase: 'The claim requires further empirical support.' }], idioms: [{ phrase: 'measure twice, cut once', meaningAr: 'تحقق جيداً قبل اتخاذ خطوة يصعب التراجع عنها' }], readingAnalysis: [{ term: 'operational definition', meaningAr: 'تعريف يحدد كيف سيُقاس المفهوم عملياً' }] },
      ],
      sentences: [{ en: 'Taken together, the studies suggest a robust association, although causality remains uncertain.', ar: 'تشير الدراسات مجتمعة إلى ارتباط قوي، رغم أن السببية لا تزال غير مؤكدة.' }],
      dialogue: [{ who: 'A', en: 'Can we claim that the intervention caused the improvement?', ar: 'هل يمكننا الجزم بأن التدخل سبب التحسن؟' }, { who: 'B', en: 'Not yet; the evidence is consistent with that explanation, but it does not establish causality.', ar: 'ليس بعد؛ الأدلة تتفق مع هذا التفسير، لكنها لا تثبت السببية.' }],
    },
    {
      id: 'c1u2', title: 'الخطاب العام والجدل المتقدم', titleEn: 'Public Discourse and Advanced Argument',
      grammar: [
        { id: 'c1u2-concession', title: 'التنازل المركب والرد المنصف', explain: 'اعرض أقوى نسخة من الرأي المخالف قبل الرد عليه. تراكيب Granted that, Much as وEven if تسمح بالتنازل دون التخلي عن الحجة الرئيسة.', examples: [{ en: 'Granted that the reform is costly, its long-term benefits may outweigh the initial expense.', ar: 'مع التسليم بأن الإصلاح مكلف، فقد تفوق فوائده طويلة الأمد تكلفته الأولية.' }] },
        { id: 'c1u2-rhetorical', title: 'الأسئلة البلاغية والتوكيد المقيد', explain: 'استخدم السؤال البلاغي بحذر لتوجيه الانتباه، لا لاستبدال الدليل. ضع even, only أو precisely قرب العنصر المراد توكيده لتجنب غموض نطاق التوكيد.', examples: [{ en: 'What, precisely, does the proposal seek to address?', ar: 'ما الذي يسعى المقترح تحديداً إلى معالجته؟' }] },
      ],
      vocabulary: [
        { en: 'substantiate', ar: 'يدعم الادعاء بأدلة', example: { en: 'The speaker substantiated the claim with verifiable figures.', ar: 'دعم المتحدث الادعاء بأرقام قابلة للتحقق.' }, collocations: [{ en: 'substantiate a claim', ar: 'يدعم ادعاءً' }] },
        { en: 'bear out', ar: 'يؤيد أو يثبت (الدليل)', example: { en: 'The latest figures bear out the earlier concern.', ar: 'تؤيد الأرقام الأخيرة المخاوف السابقة.' }, phrasalVerbs: [{ en: 'push back against', ar: 'يعترض على فكرة أو ضغط', example: { en: 'Several researchers pushed back against the assumption.', ar: 'اعترض عدة باحثين على الافتراض.' } }] },
        { en: 'nuanced', ar: 'دقيق يراعي الفروق', example: { en: 'The editorial offers a nuanced account of the dispute.', ar: 'يقدم المقال عرضاً دقيقاً للخلاف.' }, collocations: [{ en: 'a nuanced argument', ar: 'حجة دقيقة متعددة الجوانب' }] },
        { en: 'concede', ar: 'يقر بنقطة لصالح الطرف الآخر', example: { en: 'The candidate conceded that the figures were incomplete.', ar: 'أقر المرشح بأن الأرقام غير مكتملة.' }, phrasalVerbs: [{ en: 'come across as', ar: 'يبدو أو يُفهم على نحو معين', example: { en: 'The remark came across as dismissive.', ar: 'بدا التعليق استخفافياً.' } }] },
      ],
      phonetics: [
        advancedSpeech('c1u2-concession', 'Granted that the policy is imperfect, it remains preferable to inaction.', '/ˈɡrɑːntɪd ðət ðə ˈpɒləsi ɪz ɪmˈpɜːfɪkt | ɪt rɪˈmeɪnz ˈprefərəbəl tə ɪnˈækʃən/', 'مع التسليم بأن السياسة غير مثالية، فإنها تظل أفضل من عدم التحرك.', { en: 'present / precedent', ar: 'تمييز /z/ عن /s/ وملاحظة اختلاف النبر.' }, 'تُضعف that وto، وتظهر الوقفة بعد imperfect حدود التنازل والحجة.', 'هبوط معلّق على imperfect، ثم هبوط حاسم على inaction؛ تجنب جعل الجزء الأول يبدو خاتمة.' ),
        advancedSpeech('c1u2-irony', 'What a remarkably convenient explanation.', '/wɒt ə rɪˈmɑːkəbli kənˈviːniənt ˌekspləˈneɪʃən/', 'يا له من تفسير ملائم على نحو لافت.', { en: 'convenient / inconvenient', ar: 'لاحظ السابقة وتوزيع النبر.' }, 'تضعف a وتُختصر المقاطع غير المنبورة في remarkably؛ لا تساوِ النبر على كل كلمة.', 'يمكن أن تحمل العبارة سخرية إذا هبطت النبرة ببطء على remarkably وامتدّت على convenient، لكن المعنى يعتمد على السياق وتعابير الوجه.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c1u2-actually', incorrect: 'Actually, the reform is expensive but beneficial.', corrected: 'Admittedly, the reform is expensive, yet it may be beneficial.', pattern: 'بدء كل حجة بـactually كترجمة لـفي الحقيقة', explanationAr: 'actually تصحح افتراضاً أو تقدم حقيقة مخالفة؛ استخدم admittedly أو granted عند الإقرار بنقطة.' },
        { id: 'c1u2-emphasis', incorrect: 'The policy is very extremely costly.', corrected: 'The policy is exceptionally costly.', pattern: 'تكديس ظروف التوكيد', explanationAr: 'تجنب تكرار very وextremely؛ اختر محدداً واحداً أدق أو صفة قوية.' },
      ],
      academic_focus: [
        { id: 'c1u2-contradict', term: 'contradict', meaningAr: 'يناقض', example: { en: 'The later evidence contradicts the initial assumption.', ar: 'تناقض الأدلة اللاحقة الافتراض الأولي.' }, paraphrasing: [{ original: 'The evidence does not agree with the assumption.', paraphrase: 'The evidence contradicts the assumption.' }], idioms: [{ phrase: 'the devil is in the details', meaningAr: 'قد تكمن الصعوبة أو المشكلة في التفاصيل' }], readingAnalysis: [{ term: 'counterclaim', meaningAr: 'ادعاء مضاد يواجه الحجة الرئيسة' }] },
        { id: 'c1u2-inherent', term: 'inherent', meaningAr: 'متأصل أو ملازم بطبيعته', example: { en: 'There are inherent uncertainties in long-term forecasting.', ar: 'ثمة أوجه عدم يقين متأصلة في التنبؤ طويل الأمد.' }, paraphrasing: [{ original: 'Some uncertainty is part of long-term forecasting.', paraphrase: 'Some uncertainty is inherent in long-term forecasting.' }], idioms: [{ phrase: 'the exception that proves the rule', meaningAr: 'استثناء يبرز وجود قاعدة عامة' }], readingAnalysis: [{ term: 'implicit assumption', meaningAr: 'افتراض غير مصرح به يعتمد عليه الاستدلال' }] },
      ],
      sentences: [{ en: 'The argument is persuasive insofar as it acknowledges the trade-offs rather than dismissing them.', ar: 'تكون الحجة مقنعة بقدر ما تقر بالمفاضلات بدلاً من تجاهلها.' }],
      dialogue: [{ who: 'A', en: 'The proposal seems too costly to support.', ar: 'يبدو المقترح مكلفاً أكثر من اللازم لدعمه.' }, { who: 'B', en: 'That concern is valid; the question is whether the long-term gains justify the cost.', ar: 'هذا تخوف وجيه؛ والسؤال هو ما إذا كانت المكاسب طويلة الأمد تبرر التكلفة.' }],
    },
    {
      id: 'c1u3', title: 'النقد الأدبي والثقافي', titleEn: 'Literary and Cultural Criticism',
      grammar: [
        { id: 'c1u3-modality', title: 'الاحتمال والتأويل النقدي', explain: 'ميّز بين ما يصرح به النص وما يستنتجه القارئ. استخدم may imply وcould be read as للتأويل المحتمل، وclearly signals فقط عندما يكون الدليل النصي قوياً.', examples: [{ en: 'The repeated image may imply a tension between memory and identity.', ar: 'قد توحي الصورة المتكررة بتوتر بين الذاكرة والهوية.' }] },
        { id: 'c1u3-participial', title: 'التراكيب الاعتراضية وتجنب الجمل المعلقة', explain: 'تسمح العبارات الاعتراضية بإضافة سياق مكثف، لكن يجب أن يكون مرجعها واضحاً. راجع الفاعل الذي تصفه العبارة الافتتاحية كي لا تنسب الفعل إلى عنصر غير مقصود.', examples: [{ en: 'Read against its historical context, the novel challenges conventional narratives.', ar: 'إذا قُرئت الرواية في سياقها التاريخي، فإنها تتحدى السرديات التقليدية.' }] },
      ],
      vocabulary: [
        { en: 'ambivalent', ar: 'متردد أو يحمل مشاعر متناقضة', example: { en: 'The narrator remains ambivalent about returning home.', ar: 'يظل الراوي متردداً بشأن العودة إلى الوطن.' }, collocations: [{ en: 'ambivalent attitude', ar: 'موقف متردد' }] },
        { en: 'draw out', ar: 'يستخرج أو يبرز معنى', example: { en: 'The critic draws out the tension between the two voices.', ar: 'يبرز الناقد التوتر بين الصوتين.' }, phrasalVerbs: [{ en: 'allude to', ar: 'يلمح إلى', example: { en: 'The poem alludes to an earlier myth.', ar: 'تلمح القصيدة إلى أسطورة سابقة.' } }] },
        { en: 'juxtapose', ar: 'يضع عنصرين جنباً إلى جنب للمقارنة', example: { en: 'The novel juxtaposes public memory with private grief.', ar: 'تضع الرواية الذاكرة العامة إلى جانب الحزن الخاص.' }, collocations: [{ en: 'juxtapose contrasting images', ar: 'يضع صوراً متضادة للمقارنة' }] },
        { en: 'elusive', ar: 'مراوغ أو عسير التحديد', example: { en: 'The text gives an elusive definition of freedom.', ar: 'يقدم النص تعريفاً مراوغاً للحرية.' }, phrasalVerbs: [{ en: 'read into', ar: 'يحمّل النص معنى ضمنياً', example: { en: 'Do not read too much into the final image.', ar: 'لا تحمّل الصورة الختامية أكثر مما تحتمل.' } }] },
      ],
      phonetics: [
        advancedSpeech('c1u3-ambiguity', 'The ending is deliberately ambiguous.', '/ði ˈendɪŋ ɪz dɪˈlɪbərətli æmˈbɪɡjuəs/', 'النهاية ملتبسة عن قصد.', { en: 'ambiguous / ambiguity', ar: 'تغير موضع النبر بين الصفة والاسم المشتق.' }, 'يرتبط is بالفعل التالي مع تخفيف المقاطع الوسطى في deliberately.', 'هبوط نهائي محايد في القراءة التحليلية؛ وقفة قصيرة قبل deliberately قد تبرز قصد الكاتب.' ),
        advancedSpeech('c1u3-sarcasm', 'A truly subtle interpretation.', '/ə ˈtruːli ˈsʌtəl ɪnˌtɜːprɪˈteɪʃən/', 'تأويل دقيق حقاً.', { en: 'subtle / shuttle', ar: 'الحرف b صامت في subtle؛ لا تنطقه.' }, 'تضعف a، ولا تنطق b في subtle؛ تبقى المقاطع غير المنبورة خفيفة.', 'قد تصبح العبارة ساخرة إذا مُدّ النبر على truly ثم هبطت النبرة على subtle؛ لا يمكن الجزم بالسخرية من الصوت وحده.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c1u3-interpretation', incorrect: 'The author means that the image represents sadness.', corrected: 'The image may evoke grief, although the text leaves its meaning open.', pattern: 'تحويل التأويل إلى حقيقة قطعية', explanationAr: 'في النقد ميّز بين الدليل والتفسير؛ استخدم may suggest أو can be read as عند تعدد القراءات.' },
        { id: 'c1u3-article', incorrect: 'Author uses symbol to question identity.', corrected: 'The author uses a symbol to question identity.', pattern: 'حذف أدوات التنكير في الكتابة المتقدمة', explanationAr: 'الطلاقة لا تلغي أدوات الأسماء؛ راجع الاسم المفرد المعدود عند تحرير النص.' },
      ],
      academic_focus: [
        { id: 'c1u3-evoke', term: 'evoke', meaningAr: 'يستحضر شعوراً أو صورة', example: { en: 'The recurring motif evokes a sense of displacement.', ar: 'تستحضر الفكرة المتكررة إحساساً بالاغتراب.' }, paraphrasing: [{ original: 'The motif makes readers feel displaced.', paraphrase: 'The motif evokes displacement.' }], idioms: [{ phrase: 'a picture is worth a thousand words', meaningAr: 'قد تنقل الصورة معنى أوسع من كلمات كثيرة' }], readingAnalysis: [{ term: 'motif', meaningAr: 'عنصر أو صورة متكررة تسهم في بناء معنى النص' }] },
        { id: 'c1u3-subvert', term: 'subvert', meaningAr: 'يقوض أو يقلب توقعاً سائداً', example: { en: 'The novel subverts the conventional hero narrative.', ar: 'تقوض الرواية سردية البطل التقليدية.' }, paraphrasing: [{ original: 'The novel challenges the usual story of a hero.', paraphrase: 'The novel subverts the conventional hero narrative.' }], idioms: [{ phrase: 'there is more than meets the eye', meaningAr: 'ثمة ما يتجاوز الظاهر' }], readingAnalysis: [{ term: 'subtext', meaningAr: 'معنى ضمني لا يصرح به النص مباشرة' }] },
      ],
      sentences: [{ en: 'The narrator’s ambivalence complicates any straightforward reading of the final scene.', ar: 'يعقد تردد الراوي أي قراءة مباشرة للمشهد الأخير.' }],
      dialogue: [{ who: 'A', en: 'Do you think the ending is meant to be hopeful?', ar: 'هل تعتقد أن النهاية مقصود بها التفاؤل؟' }, { who: 'B', en: 'Possibly, though the final image also leaves room for a more ambivalent reading.', ar: 'ربما، مع أن الصورة الختامية تتيح أيضاً قراءة أكثر التباساً.' }],
    },
    {
      id: 'c1u4', title: 'الطلاقة الدبلوماسية والفروق اللهجية', titleEn: 'Diplomatic Fluency and Accent Variation',
      grammar: [
        { id: 'c1u4-stance', title: 'إعادة الصياغة وفق المقام', explain: 'عدّل درجة المباشرة بحسب العلاقة والهدف: I would be inclined to..., If I may qualify that... لا تفرط في أدوات التلطيف حتى يصبح موقفك غامضاً.', examples: [{ en: 'I would be inclined to revisit the timeline before committing.', ar: 'أميل إلى إعادة النظر في الجدول الزمني قبل الالتزام.' }] },
        { id: 'c1u4-inversion', title: 'التقديم البلاغي في الخطاب الرسمي', explain: 'تظهر التراكيب مثل Were we to proceed... وOnly then did... في الخطاب الرسمي. استخدمها حين تخدم التركيز ولا تكدسها في نص واحد.', examples: [{ en: 'Were we to proceed, further consultation would be essential.', ar: 'لو مضينا قدماً، لكانت المشاورة الإضافية ضرورية.' }] },
      ],
      vocabulary: [
        { en: 'pragmatic', ar: 'عملي يراعي الظروف', example: { en: 'A pragmatic compromise may be preferable.', ar: 'قد يكون الحل الوسط العملي أفضل.' }, collocations: [{ en: 'pragmatic approach', ar: 'نهج عملي' }] },
        { en: 'iron out', ar: 'يعالج خلافات أو تفاصيل صغيرة', example: { en: 'The teams met to iron out the remaining details.', ar: 'اجتمع الفريقان لمعالجة التفاصيل المتبقية.' }, phrasalVerbs: [{ en: 'touch base with', ar: 'يتواصل بإيجاز مع', example: { en: 'I will touch base with the regional team.', ar: 'سأتواصل بإيجاز مع الفريق الإقليمي.' } }] },
        { en: 'tactful', ar: 'لبق', example: { en: 'Her tactful response kept the discussion constructive.', ar: 'حافظ ردها اللبق على نقاش بنّاء.' }, collocations: [{ en: 'tactful response', ar: 'رد لبق' }] },
        { en: 'by and large', ar: 'بوجه عام', example: { en: 'By and large, the consultation was productive.', ar: 'بوجه عام، كانت المشاورة مثمرة.' }, phrasalVerbs: [{ en: 'come around to', ar: 'يقتنع تدريجياً برأي', example: { en: 'The board came around to the revised proposal.', ar: 'اقتنع المجلس تدريجياً بالمقترح المعدل.' } }] },
      ],
      phonetics: [
        advancedSpeech('c1u4-accent', 'I would have thought that was feasible.', '/aɪ wʊd əv θɔːt ðət wəz ˈfiːzəbəl/', 'كنت أظن أن ذلك ممكن.', { en: 'thought / taught', ar: 'يتقارب النطق في لهجات كثيرة؛ تختلف الحركة وفق اللهجة.' }, 'قد تختزل would have إلى /wʊdəv/ أو /wʊdə/؛ ويختلف نطق thought بين مجموعات اللهجات البريطانية والأمريكية.', 'هبوط خفيف على thought ثم هبوط على feasible قد يحمل تحفظاً مبطناً؛ لا تستنتج السخرية دون قرائن المقام.' ),
        advancedSpeech('c1u4-sarcasm', 'That went exceptionally well.', '/ðæt went ɪkˈsepʃənəli wel/', 'سار ذلك على نحو استثنائي.', { en: 'well / will', ar: 'حافظ على التمييز بين /e/ و/ɪ/.' }, 'تُخفف مقاطع exceptionally غير المنبورة؛ قد تُضغط في الكلام العفوي دون حذفها من النطق المتأني.', 'النبر المبالغ على exceptionally مع هبوط حاد بعد نتيجة فاشلة قد يشير إلى سخرية؛ النبرة نفسها قد تكون جادة إذا وافقها السياق.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c1u4-overstatement', incorrect: 'I totally agree in every single point.', corrected: 'I agree with most of your points.', pattern: 'توكيد مطلق وتعدية حرف الجر', explanationAr: 'تجنب المطلقات غير المقصودة، واستخدم agree with a point/person أو agree on a topic.' },
        { id: 'c1u4-nominalization', incorrect: 'The implementation of the discussion of the issue...', corrected: 'We discussed how to implement the proposal...', pattern: 'الإفراط في التراكيب الاسمية', explanationAr: 'تراكم الأسماء المجردة يجعل الإنجليزية ثقيلة؛ استعد الأفعال والفاعل الواضح.' },
      ],
      academic_focus: [
        { id: 'c1u4-justify', term: 'justify', meaningAr: 'يبرر بأسباب أو أدلة', example: { en: 'The available evidence does not justify such a broad conclusion.', ar: 'لا تبرر الأدلة المتاحة استنتاجاً واسعاً كهذا.' }, paraphrasing: [{ original: 'There is not enough evidence for that conclusion.', paraphrase: 'The evidence is insufficient to justify that conclusion.' }], idioms: [{ phrase: 'a stitch in time saves nine', meaningAr: 'التدخل المبكر يمنع مشكلة أكبر' }], readingAnalysis: [{ term: 'warrant', meaningAr: 'الأساس المنطقي أو الدليل الذي يربط الادعاء بالنتيجة' }] },
        { id: 'c1u4-subsequent', term: 'subsequent', meaningAr: 'لاحق', example: { en: 'Subsequent analysis revealed a regional difference.', ar: 'كشف التحليل اللاحق اختلافاً إقليمياً.' }, paraphrasing: [{ original: 'A later analysis found a difference.', paraphrase: 'Subsequent analysis revealed a difference.' }], idioms: [{ phrase: 'a blessing in disguise', meaningAr: 'أمر بدا سيئاً ثم ظهرت له فائدة' }], readingAnalysis: [{ term: 'register', meaningAr: 'مستوى اللغة المناسب للمقام والجمهور' }] },
      ],
      sentences: [{ en: 'By and large, the discussion was constructive, notwithstanding a few unresolved concerns.', ar: 'بوجه عام، كان النقاش بنّاءً رغم بعض المخاوف التي لم تحل.' }],
      dialogue: [{ who: 'A', en: 'The timeline is unrealistic.', ar: 'الجدول الزمني غير واقعي.' }, { who: 'B', en: 'I take your point. Perhaps we could revisit the scope before settling on a date.', ar: 'أتفهم وجهة نظرك. ربما يمكننا إعادة النظر في النطاق قبل تحديد موعد.' }],
    },
    {
      id: 'c1u5', title: 'التواصل العلمي والشرح للجمهور', titleEn: 'Science Communication for Wider Audiences',
      grammar: [
        { id: 'c1u5-metadiscourse', title: 'إشارات تنظيم الحجة للقارئ', explain: 'استخدم metadiscourse مثل more specifically, in practical terms وthis distinction matters to توجيه القارئ دون الإفراط في التعليق على بنية النص.', examples: [{ en: 'In practical terms, the distinction affects how the findings should be applied.', ar: 'من الناحية العملية، يؤثر هذا التمييز في كيفية تطبيق النتائج.' }] },
        { id: 'c1u5-definition', title: 'التعريف والتقييد الاصطلاحي', explain: 'عرّف المصطلح عند أول استخدام، وبيّن إن كان استعمالك أضيق من معناه الشائع. استخدم namely أو by this we mean لتحديد المقصود بدقة.', examples: [{ en: 'By resilience, we mean the capacity to recover after disruption.', ar: 'نعني بالمرونة القدرة على التعافي بعد الاضطراب.' }] },
      ],
      vocabulary: [
        { en: 'disseminate', ar: 'ينشر المعرفة أو النتائج', example: { en: 'The institute disseminates findings through public briefings.', ar: 'ينشر المعهد النتائج عبر إحاطات عامة.' }, collocations: [{ en: 'disseminate findings', ar: 'ينشر النتائج' }] },
        { en: 'spell out', ar: 'يوضح صراحةً', example: { en: 'The guide spells out the limits of the evidence.', ar: 'يوضح الدليل حدود الأدلة صراحةً.' }, phrasalVerbs: [{ en: 'boil down to', ar: 'يختزل في', example: { en: 'The disagreement boils down to different definitions.', ar: 'يختزل الخلاف في اختلاف التعريفات.' } }] },
        { en: 'salient', ar: 'بارز أو ذو صلة', example: { en: 'The most salient finding was a regional difference.', ar: 'كانت النتيجة الأبرز اختلافاً إقليمياً.' }, collocations: [{ en: 'salient finding', ar: 'نتيجة بارزة' }] },
        { en: 'accessible', ar: 'سهل الفهم أو الوصول', example: { en: 'The summary makes the research accessible to families.', ar: 'يجعل الملخص البحث مفهوماً للأسر.' }, phrasalVerbs: [{ en: 'break down', ar: 'يبسط إلى أجزاء مفهومة', example: { en: 'The presenter broke down the complex process.', ar: 'بسط مقدم العرض العملية المعقدة.' } }] },
      ],
      phonetics: [
        advancedSpeech('c1u5-clarity', 'More specifically, the measure captures access rather than quality.', '/mɔː spəˈsɪfɪkli | ðə ˈmeʒə ˈkæptʃəz ˈækses ˈræðə ðən ˈkwɒləti/', 'وبشكل أكثر تحديداً، يقيس المؤشر إمكانية الوصول لا الجودة.', { en: 'measure / major', ar: 'ميّز /ʒ/ عن /dʒ/ في بداية المقطع الأوسط.' }, 'تُخفف than، وتُبرز rather لتوجيه المقارنة؛ الوقفة بعد specifically تفصل الإطار عن المعلومة.', 'نبرة تمهيدية بعد more specifically ثم هبوط تصحيحي على rather than quality.' ),
        advancedSpeech('c1u5-sarcasm', 'That is a wonderfully simple explanation.', '/ðæt ɪz ə ˈwʌndəfəli ˈsɪmpəl ˌekspləˈneɪʃən/', 'ذلك تفسير بسيط على نحو رائع.', { en: 'simple / sample', ar: 'ميّز /ɪ/ عن /æ/ في الحركة الأولى.' }, 'قد تندمج that is، وتضعف أداة a والمقاطع غير المنبورة في wonderfully.', 'مدّ wonderfully مع هبوط بطيء على simple بعد شرح معقد قد يوحي بسخرية؛ القراءة المحايدة ممكنة أيضاً.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c1u5-explain', incorrect: 'The researcher explained us the result.', corrected: 'The researcher explained the result to us.', pattern: 'حذف حرف الجر بعد explain', explanationAr: 'نقول explain something to someone، بخلاف tell someone something.' },
        { id: 'c1u5-definition', incorrect: 'Resilience means the same as resistance.', corrected: 'Here, resilience refers to recovery after disruption, not resistance to change.', pattern: 'تسوية الفروق الدلالية بين المصطلحات', explanationAr: 'قد تتقارب الترجمات العربية؛ عرّف المفهوم في سياقه ولا تفترض ترادف المصطلحات.' },
      ],
      academic_focus: [
        { id: 'c1u5-disseminate', term: 'disseminate', meaningAr: 'ينشر المعلومات على نطاق واسع', example: { en: 'The team disseminated the results through accessible summaries.', ar: 'نشر الفريق النتائج عبر ملخصات ميسرة.' }, paraphrasing: [{ original: 'The team shared the results widely.', paraphrase: 'The team disseminated the findings widely.' }], idioms: [{ phrase: 'put it in a nutshell', meaningAr: 'يلخص الفكرة بإيجاز' }], readingAnalysis: [{ term: 'operationalise', meaningAr: 'يحول المفهوم المجرد إلى طريقة قابلة للرصد أو القياس' }] },
        { id: 'c1u5-robust', term: 'robust', meaningAr: 'متين أو قوي في مواجهة الاختبار', example: { en: 'The conclusion remains robust across several analytical models.', ar: 'يظل الاستنتاج متيناً عبر عدة نماذج تحليلية.' }, paraphrasing: [{ original: 'The conclusion holds across different models.', paraphrase: 'The conclusion is robust across models.' }], idioms: [{ phrase: 'a drop in the ocean', meaningAr: 'جزء ضئيل جداً من مقدار كبير' }], readingAnalysis: [{ term: 'generalisability', meaningAr: 'مدى انطباق النتائج على سياقات أو مجموعات أخرى' }] },
      ],
      sentences: [{ en: 'In practical terms, the findings are salient only when their limitations are made accessible to readers.', ar: 'من الناحية العملية، لا تكون النتائج البارزة مفيدة إلا إذا عُرضت حدودها بوضوح للقراء.' }],
      dialogue: [{ who: 'A', en: 'How can we explain the model without oversimplifying it?', ar: 'كيف نشرح النموذج دون تبسيطه أكثر من اللازم؟' }, { who: 'B', en: 'Define the key terms first, then spell out what the evidence cannot tell us.', ar: 'عرّف المصطلحات الرئيسة أولاً، ثم وضح ما لا تستطيع الأدلة إخبارنا به.' }],
    },
    {
      id: 'c1u6', title: 'القيادة متعددة الثقافات', titleEn: 'Intercultural Leadership and Nuance',
      grammar: [
        { id: 'c1u6-condition', title: 'الشرط الضمني والتوقع المهني', explain: 'يمكن حذف if في الشرط الرسمي بقلب الفعل المساعد: Had we consulted earlier... أو Were the teams to agree... استخدمه باعتدال حتى لا يبدو الكلام متكلفاً.', examples: [{ en: 'Had we clarified the remit earlier, the teams might have avoided duplication.', ar: 'لو كنا أوضحنا نطاق العمل مبكراً، لربما تجنبت الفرق التكرار.' }] },
        { id: 'c1u6-reference', title: 'الإحالة الواضحة عبر الفقرات', explain: 'تجنب this أو it غير المحددين بعد عرض عدة أفكار. أعد الاسم المحوري أو استخدم such an approach مع مرجع صريح.', examples: [{ en: 'This distinction matters because the two teams use different criteria.', ar: 'هذا التمييز مهم لأن الفريقين يستخدمان معايير مختلفة.' }] },
      ],
      vocabulary: [
        { en: 'accommodate', ar: 'يراعي أو يستوعب', example: { en: 'The schedule accommodates colleagues across time zones.', ar: 'يراعي الجدول زملاء في مناطق زمنية مختلفة.' }, collocations: [{ en: 'accommodate differences', ar: 'يراعي الاختلافات' }] },
        { en: 'bridge', ar: 'يردم فجوة أو يصل بين طرفين', example: { en: 'The facilitator bridged the gap between the two teams.', ar: 'ردم الميسر الفجوة بين الفريقين.' }, phrasalVerbs: [{ en: 'work around', ar: 'يتجاوز عائقاً بحل بديل', example: { en: 'We worked around the scheduling conflict.', ar: 'تجاوزنا تعارض المواعيد بحل بديل.' } }] },
        { en: 'reciprocal', ar: 'متبادل', example: { en: 'Trust depends on reciprocal respect.', ar: 'تعتمد الثقة على الاحترام المتبادل.' }, collocations: [{ en: 'reciprocal arrangement', ar: 'ترتيب متبادل' }] },
        { en: 'inadvertently', ar: 'من غير قصد', example: { en: 'The wording inadvertently excluded part-time staff.', ar: 'استبعدت الصياغة الموظفين بدوام جزئي من غير قصد.' }, phrasalVerbs: [{ en: 'smooth over', ar: 'يخفف أثر خلاف أو توتر', example: { en: 'A direct conversation helped smooth over the tension.', ar: 'ساعد حديث مباشر على تخفيف التوتر.' } }] },
      ],
      phonetics: [
        advancedSpeech('c1u6-intercultural', 'Had we clarified the remit, we might have avoided the overlap.', '/hæd wiː ˈklærɪfaɪd ðə ˈriːmɪt | wiː maɪt əv əˈvɔɪdɪd ði ˈəʊvəlæp/', 'لو أوضحنا نطاق العمل، لربما تجنبنا التداخل.', { en: 'remit / limit', ar: 'قارن بداية الكلمة ونبر المقطع الأول.' }, 'قد تختزل have بعد might، وتفصل الوقفة بين الشرط والنتيجة.', 'نبرة معلقة بعد remit ثم هبوط على overlap؛ يفيد التشديد على might في إظهار التحفظ.' ),
        advancedSpeech('c1u6-face', 'I can see why that might be a concern.', '/aɪ kən siː waɪ ðæt maɪt biː ə kənˈsɜːn/', 'أفهم لماذا قد يكون ذلك مصدر قلق.', { en: 'concern / concert', ar: 'انتبه إلى النهاية /n/ في concern و/t/ في concert.' }, 'تُضعف can وbe وa، ويقع النبر على see، might، concern.', 'هبوط دافئ على concern يعبر عن التعاطف؛ ارتفاع واسع قد يبدو استجوابياً بحسب العلاقة والسياق.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c1u6-respect', incorrect: 'We discussed about the cultural differences.', corrected: 'We discussed the cultural differences.', pattern: 'إضافة about بعد discuss', explanationAr: 'ناقش أمراً مباشرةً مع discuss؛ أما talk about فيأخذ about.' },
        { id: 'c1u6-directness', incorrect: 'You misunderstood the instruction.', corrected: 'I wonder whether we may have interpreted the instruction differently.', pattern: 'إسناد اللوم مباشرةً إلى المخاطب', explanationAr: 'عند اختلاف ثقافي أو مهني، يمكن وصف اختلاف التأويل بصياغة تشاركية دون التنازل عن الوضوح.' },
      ],
      academic_focus: [
        { id: 'c1u6-accommodate', term: 'accommodate', meaningAr: 'يراعي احتياجاً أو اختلافاً', example: { en: 'The revised process accommodates different working patterns.', ar: 'يراعي الإجراء المعدل أنماط العمل المختلفة.' }, paraphrasing: [{ original: 'The process allows for different needs.', paraphrase: 'The process accommodates differing needs.' }], idioms: [{ phrase: 'when in Rome, do as the Romans do', meaningAr: 'راعِ أعراف المكان الذي أنت فيه' }], readingAnalysis: [{ term: 'cultural relativism', meaningAr: 'فهم الممارسة ضمن سياقها الثقافي لا بمقياس واحد' }] },
        { id: 'c1u6-implicit', term: 'implicit', meaningAr: 'ضمني أو غير مصرح به', example: { en: 'The agreement contains an implicit expectation of reciprocity.', ar: 'يتضمن الاتفاق توقعاً ضمنياً للمعاملة بالمثل.' }, paraphrasing: [{ original: 'The agreement does not say this directly.', paraphrase: 'The agreement contains an implicit expectation.' }], idioms: [{ phrase: 'read the room', meaningAr: 'يستشعر أجواء المجموعة وموقفها' }], readingAnalysis: [{ term: 'pragmatic competence', meaningAr: 'اختيار اللغة المناسبة للمقام والعلاقة والهدف' }] },
      ],
      sentences: [{ en: 'Had the remit been stated explicitly, the teams might not have interpreted the boundary differently.', ar: 'لو حُدد نطاق العمل صراحةً، لربما لم تفسر الفرق الحد الفاصل بطرق مختلفة.' }],
      dialogue: [{ who: 'A', en: 'The phrase sounded dismissive to some colleagues.', ar: 'بدت العبارة استخفافية لبعض الزملاء.' }, { who: 'B', en: 'That was not the intention; perhaps we should clarify the wording and its cultural context.', ar: 'لم يكن ذلك مقصوداً؛ ربما ينبغي أن نوضح الصياغة وسياقها الثقافي.' }],
    },
  ],
};

export const C2_STAGED_CURRICULUM = {
  id: 'c2', label: 'C2 — إتقان', labelEn: 'Proficiency (C2)',
  icon: '🏛️', color: '#b45309', status: 'staged',
  summary: 'ست وحدات للإتقان الدقيق: تركيب الأدلة، البلاغة، المعنى الضمني، والتحرير المتقدم.',
  units: [
    {
      id: 'c2u1', title: 'تركيب الأدلة والكتابة البحثية', titleEn: 'Evidence Synthesis and Research Writing',
      grammar: [
        { id: 'c2u1-synthesis', title: 'تركيب مصادر متعددة بصوت تحليلي', explain: 'اجمع النتائج المتفقة والمتعارضة مع إسناد واضح لكل منها. استخدم Taken together, in contrast وa plausible explanation، وميّز بين نتيجة البيانات وتأويل الباحث.', examples: [{ en: 'Taken together, the studies point to a qualified rather than universal effect.', ar: 'تشير الدراسات مجتمعة إلى أثر مشروط لا شامل.' }] },
        { id: 'c2u1-ellipsis', title: 'الحذف المتوازي والاقتصاد الأسلوبي', explain: 'استخدم الحذف عندما يكون الجزء المحذوف واضحاً من السياق، خصوصاً في المقارنات، لكن لا تحذف عنصراً يسبب التباساً في العامل أو النطاق.', examples: [{ en: 'The first study examined access; the second, long-term outcomes.', ar: 'درست الدراسة الأولى إمكانية الوصول؛ والثانية النتائج طويلة الأمد.' }] },
      ],
      vocabulary: [
        { en: 'corroborate', ar: 'يعزز أو يؤيد بدليل مستقل', example: { en: 'An independent dataset corroborates the initial estimate.', ar: 'تعزز مجموعة بيانات مستقلة التقدير الأولي.' }, collocations: [{ en: 'corroborate a finding', ar: 'يؤيد نتيجة بدليل' }] },
        { en: 'account for', ar: 'يفسر أو يعلل', example: { en: 'The model accounts for the discrepancy between samples.', ar: 'يفسر النموذج التباين بين العينتين.' }, phrasalVerbs: [{ en: 'follow through on', ar: 'يتم ما التزم به', example: { en: 'The team followed through on its data-sharing commitment.', ar: 'وفى الفريق بالتزامه بمشاركة البيانات.' } }] },
        { en: 'ostensibly', ar: 'ظاهرياً أو بحسب الظاهر', example: { en: 'The ostensibly neutral measure had unequal effects.', ar: 'كان للمقياس المحايد ظاهرياً آثار غير متساوية.' }, collocations: [{ en: 'ostensibly neutral', ar: 'محايد ظاهرياً' }] },
        { en: 'intrinsic', ar: 'جوهري أو متأصل', example: { en: 'Uncertainty is intrinsic to this type of forecast.', ar: 'عدم اليقين متأصل في هذا النوع من التنبؤ.' }, phrasalVerbs: [{ en: 'bear out', ar: 'يؤكد أو يسند (الدليل)', example: { en: 'The replication bears out the original pattern.', ar: 'تؤكد إعادة التجربة النمط الأصلي.' } }] },
      ],
      phonetics: [
        advancedSpeech('c2u1-corroborate', 'The replication broadly corroborates the original result.', '/ðə ˌreplɪˈkeɪʃən ˈbrɔːdli kəˈrɒbəreɪts ði əˈrɪdʒənəl rɪˈzʌlt/', 'تؤيد إعادة التجربة النتيجة الأصلية إلى حد بعيد.', { en: 'corroborate / collaborate', ar: 'تمييز بنية المقاطع والنبر والمعنى رغم التشابه الصوتي الجزئي.' }, 'تخفف الأدوات the وthe، ويربط broadly corroborates مع تتابع النبرات الرئيسية.', 'تُبرز broadly لتقييد درجة التأييد، ثم تهبط النبرة على result؛ النبر الشامل على كل المقاطع يضعف الوضوح.' ),
        advancedSpeech('c2u1-qualification', 'The pattern is suggestive, albeit far from definitive.', '/ðə ˈpætən ɪz səˈdʒestɪv ɔːlˈbiːɪt fɑː frəm dɪˈfɪnɪtɪv/', 'النمط دالّ، وإن كان بعيداً عن الحسم.', { en: 'definitive / definite', ar: 'تمييز لاحقة /ɪv/ عن /ət/ وتحديد النبر.' }, 'تضعف is وfrom؛ تُنطق albeit بوضوح نسبي بوصفها أداة تنازل.', 'هبوط متحفظ على suggestive ثم ارتفاع طفيف على albeit وهبوط نهائي على definitive.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c2u1-research-count', incorrect: 'The researches confirm the results.', corrected: 'The research confirms the results.', pattern: 'جمع research عند قصد المجال أو العمل إجمالاً', explanationAr: 'research غالباً غير معدود؛ استخدم studies إذا قصدت أبحاثاً منفصلة.' },
        { id: 'c2u1-collocation', incorrect: 'The results depend of the sample.', corrected: 'The results depend on the sample.', pattern: 'اختيار حرف الجر بالتقابل العربي', explanationAr: 'التلازم هو depend on؛ لا يكفي نقل حرف الجر من العربية.' },
      ],
      academic_focus: [
        { id: 'c2u1-corroborate', term: 'corroborate', meaningAr: 'يؤيد بدليل مستقل', example: { en: 'The replication corroborates the finding under a different protocol.', ar: 'تؤيد إعادة التجربة النتيجة وفق بروتوكول مختلف.' }, paraphrasing: [{ original: 'The new test supports the earlier finding.', paraphrase: 'The new test corroborates the earlier finding.' }], idioms: [{ phrase: 'the proof of the pudding is in the eating', meaningAr: 'تظهر قيمة الشيء عند اختباره عملياً' }], readingAnalysis: [{ term: 'triangulation', meaningAr: 'مقارنة أدلة من مصادر أو طرق متعددة' }] },
        { id: 'c2u1-parameter', term: 'parameter', meaningAr: 'معلمة أو حد يحدد نطاق التحليل', example: { en: 'The authors state the parameters of the comparison explicitly.', ar: 'يحدد المؤلفون معلمات المقارنة بوضوح.' }, paraphrasing: [{ original: 'The comparison has clearly defined limits.', paraphrase: 'The parameters of the comparison are explicit.' }], idioms: [{ phrase: 'look at the bigger picture', meaningAr: 'ينظر إلى الصورة الكاملة' }], readingAnalysis: [{ term: 'replicability', meaningAr: 'إمكان إعادة الدراسة والوصول إلى نتائج قابلة للفحص' }] },
      ],
      sentences: [{ en: 'The replication corroborates the direction of the effect, albeit with a smaller magnitude.', ar: 'تؤيد إعادة التجربة اتجاه الأثر، وإن كان حجمه أصغر.' }],
      dialogue: [{ who: 'A', en: 'Can we describe the result as definitive?', ar: 'هل يمكننا وصف النتيجة بأنها حاسمة؟' }, { who: 'B', en: 'I would call it corroborative; the effect is robust, but its scope remains uncertain.', ar: 'سأصفها بأنها مؤيدة؛ الأثر متين، لكن نطاقه لا يزال غير مؤكد.' }],
    },
    {
      id: 'c2u2', title: 'البلاغة والمفارقة والمعنى الضمني', titleEn: 'Rhetoric, Irony and Implicature',
      grammar: [
        { id: 'c2u2-implicature', title: 'الاستلزام الحواري والتحفظ التداولي', explain: 'افصل بين المعنى الحرفي وما يستلزمه المقام. تراكيب It is not as though وI take it that تسمح بتقييم ضمني، لكن فهمها يعتمد على النبر والمعرفة المشتركة.', examples: [{ en: 'It is not as though the warning had gone unnoticed.', ar: 'ليس الأمر كما لو أن التحذير لم يلحظه أحد.' }] },
        { id: 'c2u2-parenthetical', title: 'الجمل الاعتراضية وتغيير زاوية الصوت', explain: 'تسمح الجمل الاعتراضية بإظهار موقف الكاتب أو تصحيح مساره، مثل the claim—though plausible—is not conclusive. احرص أن تبقى الجملة الأساسية سليمة عند حذف الاعتراض.', examples: [{ en: 'The conclusion—persuasive as it is—rests on a narrow sample.', ar: 'يستند الاستنتاج، رغم إقناعه، إلى عينة ضيقة.' }] },
      ],
      vocabulary: [
        { en: 'equivocal', ar: 'ملتبس أو يحتمل أكثر من معنى', example: { en: 'The minister gave an equivocal response.', ar: 'قدم الوزير إجابة ملتبسة.' }, collocations: [{ en: 'equivocal response', ar: 'إجابة ملتبسة' }] },
        { en: 'play down', ar: 'يقلل من أهمية', example: { en: 'The statement played down the scale of the disruption.', ar: 'قلل البيان من حجم الاضطراب.' }, phrasalVerbs: [{ en: 'read into', ar: 'يستنتج معنى ضمنياً من', example: { en: 'It is easy to read too much into a pause.', ar: 'يسهل استنتاج أكثر مما تحتمل وقفة.' } }] },
        { en: 'laconic', ar: 'مقتضب', example: { en: 'Her laconic reply left the audience uncertain.', ar: 'ترك ردها المقتضب الجمهور غير متأكد.' }, collocations: [{ en: 'laconic remark', ar: 'ملاحظة مقتضبة' }] },
        { en: 'deadpan', ar: 'جاف التعبير (قد يخفي سخرية)', example: { en: 'He delivered the punchline in a deadpan voice.', ar: 'ألقى خاتمة النكتة بصوت جامد.' }, phrasalVerbs: [{ en: 'come off as', ar: 'يبدو للآخرين على أنه', example: { en: 'The irony came off as criticism.', ar: 'بدت المفارقة وكأنها نقد.' } }] },
      ],
      phonetics: [
        advancedSpeech('c2u2-deadpan', 'Well, that was an inspired decision.', '/wel ðæt wəz ən ɪnˈspaɪəd dɪˈsɪʒən/', 'حسناً، كان ذلك قراراً ملهماً.', { en: 'inspired / uninspired', ar: 'انتبه إلى السابقة التي تقلب المعنى.' }, 'تضعف was وan، وتحدد الوقفة بعد well إطار التعليق.', 'هبوط مسطح ومبالغة خفيفة على inspired بعد نتيجة سيئة قد يوحيان بالسخرية؛ إلقاء العبارة وحده لا يثبت المقصد.' ),
        advancedSpeech('c2u2-implicature', 'I am sure that was entirely accidental.', '/aɪ əm ʃɔː ðæt wəz ɪnˈtaɪəli ˌæksɪˈdentəl/', 'أنا متأكد أن ذلك كان عرضياً تماماً.', { en: 'sure / shore', ar: 'قد يتطابقان في لهجات، ويفترقان في أخرى؛ هذا اختلاف لهجي لا خطأ.' }, 'يمكن اختزال I am إلى الاختصار I’m؛ تُخفف that was وتبرز entirely عند التصحيح أو المفارقة.', 'نبر قوي على entirely مع هبوط بطيء قد يدل على تشكيك ساخر؛ نبرة مستقيمة قد تكون تأكيداً حرفياً.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c2u2-sarcasm', incorrect: 'He is joking because he said something funny.', corrected: 'His tone suggests irony, though the context remains ambiguous.', pattern: 'تفسير السخرية من الكلمات وحدها', explanationAr: 'قد تتعارض الدلالة الحرفية مع النبرة والسياق؛ صف التأويل باحتمال ولا تجزم دون قرائن.' },
        { id: 'c2u2-idiom', incorrect: 'The decision was on the edge of the table.', corrected: 'The decision was on the table.', pattern: 'ترجمة حرفية لتعبير اصطلاحي', explanationAr: 'on the table تعني مطروحاً للنقاش، ولا تضف كلمة edge من التعبير العربي.' },
      ],
      academic_focus: [
        { id: 'c2u2-ambiguous', term: 'ambiguous', meaningAr: 'ملتبس يحتمل قراءات متعددة', example: { en: 'The ambiguity is deliberate rather than accidental.', ar: 'الالتباس مقصود لا عارض.' }, paraphrasing: [{ original: 'The statement can be understood in two ways.', paraphrase: 'The statement is deliberately ambiguous.' }], idioms: [{ phrase: 'the elephant in the room', meaningAr: 'حقيقة واضحة يتجنب الحاضرون مناقشتها' }], readingAnalysis: [{ term: 'implicature', meaningAr: 'معنى يستنتج من المقام ولا يقال حرفياً' }] },
        { id: 'c2u2-rhetoric', term: 'rhetoric', meaningAr: 'الأساليب المستخدمة للتأثير والإقناع', example: { en: 'The analysis distinguishes evidence from persuasive rhetoric.', ar: 'يميز التحليل بين الدليل والخطاب الإقناعي.' }, paraphrasing: [{ original: 'The speech tries to persuade through language.', paraphrase: 'The speech relies on persuasive rhetoric.' }], idioms: [{ phrase: 'actions speak louder than words', meaningAr: 'الأفعال أبلغ من الأقوال' }], readingAnalysis: [{ term: 'verbal irony', meaningAr: 'قول معنى حرفي يُقصد به غالباً معنى مخالف' }] },
      ],
      sentences: [{ en: 'The ostensibly complimentary remark becomes ironic when read against the preceding exchange.', ar: 'تغدو الملاحظة التي تبدو إطراءً ساخرة عند قراءتها في ضوء الحوار السابق.' }],
      dialogue: [{ who: 'A', en: 'He called the launch a triumph after the system failed twice.', ar: 'وصف الإطلاق بأنه انتصار بعدما تعطل النظام مرتين.' }, { who: 'B', en: 'The wording sounds ironic, but we should check the wider context.', ar: 'تبدو الصياغة ساخرة، لكن ينبغي أن نراجع السياق الأوسع.' }],
    },
    {
      id: 'c2u3', title: 'المفردات الدقيقة والأمثال والسياق', titleEn: 'Lexical Precision, Proverbs and Context',
      grammar: [
        { id: 'c2u3-colligation', title: 'التلازم النحوي والاختيار المعجمي', explain: 'تختلف الكلمات المتقاربة في التلازم النحوي: abate غالباً لازم، mitigate يأخذ مفعولاً، وalleviate يتصل بالألم أو الأثر. تعلم الكلمة ضمن إطارها النحوي لا منفردة.', examples: [{ en: 'The measures may mitigate the impact but cannot eliminate it.', ar: 'قد تخفف الإجراءات الأثر لكنها لا تستطيع إزالته.' }] },
        { id: 'c2u3-proverb', title: 'الأمثال وتكييفها للمقام', explain: 'الأمثال أدوات ثقافية لا براهين؛ استخدمها باعتدال، وفسرها إذا كان الجمهور متعدد الخلفيات. اختر مثلاً يضيف معنى ولا يحل محل التحليل.', examples: [{ en: 'As the saying goes, a rising tide lifts all boats—but only if access is equitable.', ar: 'كما يقول المثل، المد الصاعد يرفع جميع القوارب، لكن ذلك يتطلب عدالة الوصول.' }] },
      ],
      vocabulary: [
        { en: 'mitigate', ar: 'يخفف من أثر سلبي', example: { en: 'The redesign mitigated the risk of data loss.', ar: 'خفف التصميم الجديد خطر فقدان البيانات.' }, collocations: [{ en: 'mitigate risk', ar: 'يخفف المخاطر' }] },
        { en: 'weed out', ar: 'يستبعد تدريجياً ما لا يلائم', example: { en: 'The review weeds out unsupported claims.', ar: 'تستبعد المراجعة الادعاءات غير المدعومة.' }, phrasalVerbs: [{ en: 'boil down to', ar: 'يختزل في أو جوهره', example: { en: 'The dispute boils down to a question of access.', ar: 'يختزل الخلاف في مسألة الوصول.' } }] },
        { en: 'intransigent', ar: 'متعنت لا يلين', example: { en: 'An intransigent stance can obstruct negotiation.', ar: 'قد تعرقل المواقف المتعنتة التفاوض.' }, collocations: [{ en: 'intransigent position', ar: 'موقف متعنت' }] },
        { en: 'by the same token', ar: 'وبالمنطق نفسه', example: { en: 'By the same token, transparency requires clear limits.', ar: 'وبالمنطق نفسه، تتطلب الشفافية حدوداً واضحة.' }, phrasalVerbs: [{ en: 'set out', ar: 'يعرض أو يحدد بوضوح', example: { en: 'The report sets out three competing explanations.', ar: 'يعرض التقرير ثلاثة تفسيرات متنافسة.' } }] },
      ],
      phonetics: [
        advancedSpeech('c2u3-mitigation', 'The proposal may mitigate risk, but it cannot eliminate uncertainty.', '/ðə prəˈpəʊzəl meɪ ˈmɪtɪɡeɪt rɪsk | bət ɪt ˈkænɒt ɪˈlɪmɪneɪt ʌnˈsɜːtənti/', 'قد يخفف المقترح المخاطر، لكنه لا يزيل عدم اليقين.', { en: 'mitigate / mediate', ar: 'ميّز الحركة الأولى وتتابع المقاطع والنبر.' }, 'تُضعف but it، ويُبرز النبر التباين بين mitigate وeliminate.', 'هبوط جزئي بعد risk ثم ارتفاع على but ورفض صريح يهبط على uncertainty.' ),
        advancedSpeech('c2u3-proverb', 'A rising tide lifts all boats.', '/ə ˈraɪzɪŋ taɪd lɪfts ɔːl bəʊts/', 'المد الصاعد يرفع جميع القوارب.', { en: 'tide / tied', ar: 'متشابهان في النطق غالباً؛ يحدد السياق المعنى.' }, 'ترتبط lifts all مع إدغام /s/ قبل الحركة؛ لا تضف حركة بعد مجموعة /fts/.', 'نبر الأمثال متوازن وإيقاعي؛ وقفة قبل but تسمح بإضافة قيد أو نقد للمثل.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c2u3-mitigate', incorrect: 'This policy mitigates from the risk.', corrected: 'This policy mitigates the risk.', pattern: 'إضافة حرف جر بعد فعل متعدٍ', explanationAr: 'mitigate يأخذ مفعولاً مباشراً؛ لا تضف from أو on دون تركيب يطلبه.' },
        { id: 'c2u3-proverb-register', incorrect: 'As my grandmother says, the early bird catches the worm, in this peer-reviewed article...', corrected: 'A commonly cited principle is that early action can confer an advantage.', pattern: 'إدخال مثل محكي في سجل بحثي دون مواءمة', explanationAr: 'لا تحظر الأمثال مطلقاً، لكن أعد صياغة معناها بلغة تحليلية عندما لا يلائم السجل الأكاديمي.' },
      ],
      academic_focus: [
        { id: 'c2u3-mitigate', term: 'mitigate', meaningAr: 'يخفف شدة أثر أو خطر', example: { en: 'The safeguards mitigate, but do not eliminate, the risk.', ar: 'تخفف الضمانات الخطر لكنها لا تزيله.' }, paraphrasing: [{ original: 'The safeguards make the risk less severe.', paraphrase: 'The safeguards mitigate the risk.' }], idioms: [{ phrase: 'a rising tide lifts all boats', meaningAr: 'قد يستفيد الجميع من تحسن عام، إذا توفرت العدالة' }], readingAnalysis: [{ term: 'externality', meaningAr: 'أثر جانبي يتحمله طرف غير مشارك مباشرة في القرار' }] },
        { id: 'c2u3-intrinsic', term: 'intrinsic', meaningAr: 'جوهري أو متأصل', example: { en: 'The analysis treats uncertainty as intrinsic to the forecast.', ar: 'يتعامل التحليل مع عدم اليقين بوصفه متأصلاً في التنبؤ.' }, paraphrasing: [{ original: 'Uncertainty is part of this forecast by its nature.', paraphrase: 'Uncertainty is intrinsic to this forecast.' }], idioms: [{ phrase: 'you cannot make an omelette without breaking eggs', meaningAr: 'قد يتطلب تحقيق نتيجة مرغوبة تقبل بعض الكلفة' }], readingAnalysis: [{ term: 'lexical prosody', meaningAr: 'الميل الدلالي أو التقييمي الذي تكتسبه الكلمة من سياقاتها المعتادة' }] },
      ],
      sentences: [{ en: 'The proverb captures a possibility, not a guarantee; distributional effects still require scrutiny.', ar: 'يلتقط المثل احتمالاً لا ضماناً؛ وما زالت آثار التوزيع بحاجة إلى تمحيص.' }],
      dialogue: [{ who: 'A', en: 'Could we say the policy will benefit everyone?', ar: 'هل يمكننا القول إن السياسة ستفيد الجميع؟' }, { who: 'B', en: 'Only with qualification; the aggregate gain may conceal uneven effects.', ar: 'فقط مع التحفظ؛ فقد تخفي المكاسب الإجمالية آثاراً غير متساوية.' }],
    },
    {
      id: 'c2u4', title: 'التحرير والأسلوب الطبيعي المتقن', titleEn: 'Editorial Mastery and Idiomatic Precision',
      grammar: [
        { id: 'c2u4-editing', title: 'الإحكام والحذف دون فقد المعنى', explain: 'حرر الجمل بتقديم الفعل والفاعل المهمين، واحذف التكرار الذي لا يضيف قيداً. اجعل كل ضمير ذا مرجع واضح ولا تحول كل فقرة إلى جملة طويلة متعددة الاعتراضات.', examples: [{ en: 'Because the sample was small, the authors limited their conclusion.', ar: 'لأن العينة كانت صغيرة، قصر المؤلفون استنتاجهم.' }] },
        { id: 'c2u4-focus', title: 'التركيز الموضوعي والتوازي البلاغي', explain: 'حافظ على التوازي عند تعداد الحجج، واجعل الموضوع المعروف في بداية الجملة ثم المعلومة الجديدة في نهايتها. غيّر البنية عند الحاجة لتجنب الرتابة لا لمجرد التنويع.', examples: [{ en: 'The policy is affordable, the evidence is transparent, and the outcome is measurable.', ar: 'السياسة ميسورة التكلفة، والأدلة شفافة، والنتيجة قابلة للقياس.' }] },
      ],
      vocabulary: [
        { en: 'obfuscate', ar: 'يحجب الوضوح أو يعتم المعنى', example: { en: 'Unnecessary jargon can obfuscate a straightforward finding.', ar: 'قد تحجب المصطلحات غير الضرورية نتيجة واضحة.' }, collocations: [{ en: 'obfuscate an issue', ar: 'يعتم مسألة' }] },
        { en: 'boil down to', ar: 'يختزل في أو يعود جوهره إلى', example: { en: 'The disagreement boils down to different assumptions.', ar: 'يعود الخلاف إلى افتراضات مختلفة.' }, phrasalVerbs: [{ en: 'spell out', ar: 'يشرح بوضوح وتفصيل', example: { en: 'The introduction spells out the scope of the review.', ar: 'توضح المقدمة نطاق المراجعة.' } }] },
        { en: 'idiosyncratic', ar: 'خاص أو مميز بطريقة فردية', example: { en: 'The author retains an idiosyncratic but consistent voice.', ar: 'يحافظ الكاتب على صوت فردي مميز ومتسق.' }, collocations: [{ en: 'idiosyncratic style', ar: 'أسلوب فردي مميز' }] },
        { en: 'all things considered', ar: 'بعد أخذ كل الأمور في الحسبان', example: { en: 'All things considered, the cautious approach is warranted.', ar: 'بعد أخذ كل الأمور في الحسبان، يكون النهج الحذر مبرراً.' }, phrasalVerbs: [{ en: 'pare down', ar: 'يختصر إلى الضروري', example: { en: 'The editor pared down the abstract without losing its argument.', ar: 'اختصر المحرر الملخص دون أن يفقد حجته.' } }] },
      ],
      phonetics: [
        advancedSpeech('c2u4-editorial', 'All things considered, the conclusion is warranted.', '/ɔːl θɪŋz kənˈsɪdəd | ðə kənˈkluːʒən ɪz ˈwɒrəntɪd/', 'بعد أخذ كل الأمور في الحسبان، يكون الاستنتاج مبرراً.', { en: 'warranted / wanted', ar: 'لاحظ المجموعة /r/ في warranted واختلاف المقطع.' }, 'تُخفف things considered، وتفصل وقفة موجزة المقدمة عن الحكم.', 'هبوط محدود على considered، ثم هبوط نهائي على warranted؛ تجنب نبرة حاسمة إذا كان الحكم مشروطاً.' ),
        advancedSpeech('c2u4-ironic-praise', 'An admirably concise account.', '/ən ˈædmərəbli kənˈsaɪs əˈkaʊnt/', 'عرض موجز على نحو يُحمد.', { en: 'concise / precise', ar: 'قارن البدايتين مع نبر المقطع الثاني.' }, 'تُخفف أداة an والمقاطع الوسطى في admirably، وتبرز concise.', 'قد تحمل admirable مبالغة صوتية بعد نص مفرط الطول سخرية؛ لا تخلطها بالمدح الحرفي دون السياق.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c2u4-redundancy', incorrect: 'The reason is because the data are incomplete.', corrected: 'The reason is that the data are incomplete.', pattern: 'ازدواج تركيب السبب', explanationAr: 'تجنب جمع reason is وbecause؛ استخدم reason is that أو the data are incomplete because...' },
        { id: 'c2u4-nominal-stack', incorrect: 'The consideration of the implementation of the revision...', corrected: 'We considered how to implement the revision...', pattern: 'تراكم المصادر والمبني للمجهول', explanationAr: 'أعد الفعل إلى بنية مباشرة بفاعل واضح؛ الاقتصاد هنا يزيد الدقة لا يقللها.' },
      ],
      academic_focus: [
        { id: 'c2u4-scrutiny', term: 'scrutiny', meaningAr: 'تمحيص أو فحص دقيق', example: { en: 'The claim does not withstand close scrutiny.', ar: 'لا يصمد الادعاء أمام التمحيص الدقيق.' }, paraphrasing: [{ original: 'A close examination reveals weaknesses in the claim.', paraphrase: 'The claim does not withstand close scrutiny.' }], idioms: [{ phrase: 'less is more', meaningAr: 'الإيجاز قد يكون أبلغ' }], readingAnalysis: [{ term: 'coherence', meaningAr: 'ترابط الأفكار منطقياً داخل النص' }] },
        { id: 'c2u4-precise', term: 'precise', meaningAr: 'دقيق ومحدد', example: { en: 'A precise definition prevents the argument from shifting.', ar: 'يمنع التعريف الدقيق انتقال الحجة عن معناها.' }, paraphrasing: [{ original: 'The definition is exact and clear.', paraphrase: 'The definition is precise.' }], idioms: [{ phrase: 'cut to the chase', meaningAr: 'ينتقل مباشرة إلى النقطة الأساسية' }], readingAnalysis: [{ term: 'rhetorical economy', meaningAr: 'تحقيق الأثر المقصود بأقل قدر لازم من الكلمات' }] },
      ],
      sentences: [{ en: 'All things considered, a more precise definition would strengthen the argument without obscuring its limits.', ar: 'بعد أخذ كل الأمور في الحسبان، من شأن تعريف أدق أن يقوي الحجة دون حجب حدودها.' }],
      dialogue: [{ who: 'A', en: 'The paragraph sounds impressive, but I cannot identify its main claim.', ar: 'تبدو الفقرة مثيرة للإعجاب، لكنني لا أستطيع تحديد ادعائها الرئيس.' }, { who: 'B', en: 'Then we should pare it down and state the claim plainly before adding qualifications.', ar: 'إذن ينبغي أن نختصرها ونذكر الادعاء بوضوح قبل إضافة التحفظات.' }],
    },
    {
      id: 'c2u5', title: 'التفاوض الدقيق وإدارة الخلاف', titleEn: 'Deliberative Negotiation and Conflict',
      grammar: [
        { id: 'c2u5-pragmatic', title: 'الإقرار المقيد والاختلاف المهذب', explain: 'استخدم I grant that, for all that وthat said لتقديم تنازل حقيقي يتبعه تمييز محدد. حافظ على علاقة منطقية بين التنازل والاستنتاج وتجنب الروابط المتراكمة.', examples: [{ en: 'I grant that the timetable is ambitious; that said, the milestones remain attainable.', ar: 'أقر بأن الجدول الزمني طموح؛ ومع ذلك، تظل المراحل قابلة للتحقيق.' }] },
        { id: 'c2u5-conditional', title: 'الشرط المضاد للواقع والالتزام', explain: 'تساعد صيغ Had we..., Were it not for... وShould circumstances change... على ضغط الشروط في السجل الرسمي. ميز الزمن المرجعي ولا تستخدمها لمجرد إظهار التعقيد.', examples: [{ en: 'Were it not for the revised safeguards, we would not endorse the plan.', ar: 'لولا الضمانات المعدلة لما أيدنا الخطة.' }] },
      ],
      vocabulary: [
        { en: 'reconcile', ar: 'يوفق بين أمرين', example: { en: 'The panel reconciled the competing objectives.', ar: 'وفق الفريق بين الأهداف المتنافسة.' }, collocations: [{ en: 'reconcile competing priorities', ar: 'يوفق بين الأولويات المتنافسة' }] },
        { en: 'hammer out', ar: 'يتفاوض حتى يتوصل إلى اتفاق', example: { en: 'The parties hammered out a workable agreement.', ar: 'توصل الطرفان بالتفاوض إلى اتفاق عملي.' }, phrasalVerbs: [{ en: 'hold to', ar: 'يلتزم بوعد أو مبدأ', example: { en: 'Both parties held to the agreed safeguards.', ar: 'التزم الطرفان بالضمانات المتفق عليها.' } }] },
        { en: 'intransigent', ar: 'متعنت لا يلين', example: { en: 'An intransigent position can foreclose useful compromise.', ar: 'قد يغلق الموقف المتعنت باب التسوية المفيدة.' }, collocations: [{ en: 'intransigent stance', ar: 'موقف متعنت' }] },
        { en: 'convergence', ar: 'تقارب أو التقاء', example: { en: 'The discussions revealed a convergence of interests.', ar: 'كشفت المناقشات عن تقارب المصالح.' }, phrasalVerbs: [{ en: 'come around to', ar: 'يقتنع تدريجياً بـ', example: { en: 'The panel came around to a narrower proposal.', ar: 'اقتنع الفريق تدريجياً بمقترح أضيق.' } }] },
      ],
      phonetics: [
        advancedSpeech('c2u5-concession', 'I grant that the concern is legitimate; that said, the evidence is equivocal.', '/aɪ ɡrɑːnt ðət ðə kənˈsɜːn ɪz ləˈdʒɪtɪmət | ðæt sed | ði ˈevɪdəns ɪz ɪˈkwɪvəkəl/', 'أقر بأن التخوف مشروع؛ ومع ذلك، فالأدلة ملتبسة.', { en: 'legitimate / legislated', ar: 'لاحظ اختلاف المقاطع والنبر بين الصفتين.' }, 'تخفف that، وتفصل الوقفات الثلاث مراحل الحجة دون تقطيع مفرط.', 'هبوط متعاطف على legitimate ثم وقفة على that said وهبوط متحفظ على equivocal.' ),
        advancedSpeech('c2u5-sarcasm', 'A truly constructive suggestion.', '/ə ˈtruːli kənˈstrʌktɪv səˈdʒestʃən/', 'اقتراح بنّاء حقاً.', { en: 'constructive / destructive', ar: 'تقابل السابقة وتغيّر المعنى؛ حافظ على نبر المقطع الثاني.' }, 'تضعف أداة a، وتُبرز constructive في الوصف المحايد.', 'قد يشير التشديد المبالغ على truly مع هبوط مقتضب إلى سخرية؛ لا تدرّسها كدلالة مؤكدة دون سياق.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c2u5-compromise', incorrect: 'We discussed on a compromise.', corrected: 'We discussed a compromise.', pattern: 'إضافة on بعد discuss أو بعد compromise', explanationAr: 'نقول discuss a proposal وreach/agree on a compromise؛ يتغير حرف الجر بتغير الفعل.' },
        { id: 'c2u5-supposed', incorrect: 'We are agree to the condition.', corrected: 'We agree to the condition.', pattern: 'نقل بناء الفعل المساعد من العربية', explanationAr: 'agree فعل رئيس لا يحتاج are؛ استخدم are agreeing فقط عندما تقصد الفعل الجاري.' },
      ],
      academic_focus: [
        { id: 'c2u5-reconcile', term: 'reconcile', meaningAr: 'يوفق بين مطالب أو نتائج متعارضة', example: { en: 'The framework reconciles efficiency with procedural fairness.', ar: 'يوفق الإطار بين الكفاءة والإنصاف الإجرائي.' }, paraphrasing: [{ original: 'The framework balances efficiency and fairness.', paraphrase: 'The framework reconciles efficiency with fairness.' }], idioms: [{ phrase: 'a happy medium', meaningAr: 'حل وسط مناسب' }], readingAnalysis: [{ term: 'deliberative legitimacy', meaningAr: 'شرعية القرار الناتجة عن تداول مبرر وشامل' }] },
        { id: 'c2u5-foreclose', term: 'foreclose', meaningAr: 'يمنع خياراً أو احتمالاً مسبقاً', example: { en: 'A narrow mandate may foreclose alternative solutions.', ar: 'قد يمنع التفويض الضيق حلولاً بديلة.' }, paraphrasing: [{ original: 'The mandate may rule out other solutions.', paraphrase: 'The mandate may foreclose alternatives.' }], idioms: [{ phrase: 'agree to disagree', meaningAr: 'يقبل الطرفان استمرار الاختلاف' }], readingAnalysis: [{ term: 'procedural fairness', meaningAr: 'إنصاف الخطوات التي اتبعت في اتخاذ القرار' }] },
      ],
      sentences: [{ en: 'The parties reconciled competing priorities without foreclosing further review.', ar: 'وفق الطرفان بين الأولويات المتنافسة دون منع مراجعة لاحقة.' }],
      dialogue: [{ who: 'A', en: 'We cannot accept the proposal in its current form.', ar: 'لا نستطيع قبول المقترح بصيغته الحالية.' }, { who: 'B', en: 'Understood. Could we narrow its scope while holding to the safeguards?', ar: 'مفهوم. هل يمكننا تضييق نطاقه مع الالتزام بالضمانات؟' }],
    },
    {
      id: 'c2u6', title: 'التأويل الشفهي والفروق الدقيقة', titleEn: 'Oral Interpretation and Nuanced Meaning',
      grammar: [
        { id: 'c2u6-stance', title: 'تعدد الأصوات والمسافة عن الادعاء', explain: 'في التحليل المتقدم، انسب التقييم إلى مصدره: the narrator appears to imply، the speaker pointedly stops short of claiming. هذه المسافة تميز بين صوت الكاتب والاستنتاج النقدي.', examples: [{ en: 'The narrator appears to stop short of endorsing the speaker’s conclusion.', ar: 'يبدو أن الراوي يتوقف دون تأييد استنتاج المتحدث.' }] },
        { id: 'c2u6-focus', title: 'المعلومة المفترضة والبؤرة الجديدة', explain: 'ضع المعلومة المشتركة في موضع البداية والجديدة في موضع البؤرة. يمكن لتغيير ترتيب الجملة أن يغير ما يبدو مفترضاً أو محل خلاف، لذلك اقرأ التركيز في سياقه.', examples: [{ en: 'What the passage leaves unresolved is the source of the discrepancy.', ar: 'ما يتركه المقطع دون حسم هو مصدر التباين.' }] },
      ],
      vocabulary: [
        { en: 'quintessential', ar: 'نموذجي أو يجسد جوهر الشيء', example: { en: 'The scene is a quintessential example of restrained irony.', ar: 'المشهد مثال نموذجي على المفارقة المنضبطة.' }, collocations: [{ en: 'quintessential example', ar: 'مثال نموذجي' }] },
        { en: 'let on', ar: 'يفصح أو يظهر ما يعرفه', example: { en: 'The speaker never lets on what she already knows.', ar: 'لا تفصح المتحدثة عما تعرفه مسبقاً.' }, phrasalVerbs: [{ en: 'give away', ar: 'يكشف دون قصد', example: { en: 'A brief pause gave away his uncertainty.', ar: 'كشفت وقفة قصيرة عن عدم يقينه.' } }] },
        { en: 'tacit', ar: 'ضمني أو غير مصرح به', example: { en: 'The exchange relies on a tacit understanding.', ar: 'يعتمد الحوار على تفاهم ضمني.' }, collocations: [{ en: 'tacit assumption', ar: 'افتراض ضمني' }] },
        { en: 'inadvertent', ar: 'غير مقصود', example: { en: 'The speaker’s inadvertent pause altered the implication.', ar: 'غيرت وقفة المتحدث غير المقصودة الدلالة.' }, phrasalVerbs: [{ en: 'pass over', ar: 'يتجاوز نقطة دون مناقشتها', example: { en: 'The reviewer passed over a central ambiguity.', ar: 'تجاوز المراجع التباساً محورياً دون مناقشته.' } }] },
      ],
      phonetics: [
        advancedSpeech('c2u6-prosody', 'I would not call the conclusion entirely convincing.', '/aɪ wʊd nɒt kɔːl ðə kənˈkluːʒən ɪnˈtaɪəli kənˈvɪnsɪŋ/', 'لن أصف الاستنتاج بأنه مقنع تماماً.', { en: 'record (noun) / record (verb)', ar: 'يتغير موضع النبر بين الاسم والفعل مع ثبات التهجئة.' }, 'تخفف would وthe، وقد يندمج not مع الفعل؛ النبر النووي يحدد الجزء موضع التحفظ.', 'نبر entirely مع إطالة طفيفة قد يجعل العبارة أكثر تحفظاً أو ساخرة؛ يحدد السياق ونمط المقابلة المقصد.' ),
        advancedSpeech('c2u6-variety', 'The latter reading is plausible, albeit not inevitable.', '/ðə ˈlætə ˈriːdɪŋ ɪz ˈplɔːzəbəl ɔːlˈbiːɪt nɒt ɪnˈevɪtəbəl/', 'القراءة الثانية معقولة، وإن لم تكن حتمية.', { en: 'plausible / possible', ar: 'قارن حركة المقطع الأول والنبر؛ الكلمتان متقاربتان لا مترادفتان تماماً.' }, 'اربط reading is مع ضعف is، وتبقى albeit واضحة نسبياً كأداة انتقال.', 'هبوط غير نهائي على plausible، ووقفة قصيرة، ثم هبوط على inevitable يحدد قيد القراءة.' ),
      ],
      arabic_l1_transfers: [
        { id: 'c2u6-voice', incorrect: 'The author means this is the only correct reading.', corrected: 'The passage appears to privilege this reading, without ruling out alternatives.', pattern: 'إسناد نية قطعية للكاتب', explanationAr: 'استعمل appears to أو may privilege عند تفسير مقصد غير مصرح به، وميّز النص عن تأويلك.' },
        { id: 'c2u6-intonation', incorrect: 'He said “fine” so he agreed.', corrected: 'He said “fine,” though the falling, clipped delivery may signal reluctance.', pattern: 'اعتبار الدلالة المعجمية وحدها كافية', explanationAr: 'قد تغير النبرة والوقفة والإيقاع المقصود؛ صف العلامات بوصفها قرائن لا أحكاماً قطعية.' },
      ],
      academic_focus: [
        { id: 'c2u6-quintessential', term: 'quintessential', meaningAr: 'يجسد السمات النموذجية لشيء', example: { en: 'The passage is a quintessential example of controlled ambiguity.', ar: 'المقطع مثال نموذجي على الالتباس المنضبط.' }, paraphrasing: [{ original: 'The passage shows the typical features of controlled ambiguity.', paraphrase: 'The passage is quintessentially ambiguous.' }], idioms: [{ phrase: 'actions speak louder than words', meaningAr: 'الأفعال قد تكشف أكثر مما تقوله الكلمات' }], readingAnalysis: [{ term: 'prosodic cue', meaningAr: 'إشارة من النبر أو الإيقاع أو التنغيم تسهم في بناء المعنى' }] },
        { id: 'c2u6-equivocal', term: 'equivocal', meaningAr: 'ملتبس أو يحتمل أكثر من تفسير', example: { en: 'The response remains equivocal despite its confident wording.', ar: 'تظل الإجابة ملتبسة رغم صياغتها الواثقة.' }, paraphrasing: [{ original: 'The response can be interpreted in several ways.', paraphrase: 'The response is equivocal.' }], idioms: [{ phrase: 'the silence speaks volumes', meaningAr: 'قد يكون للصمت دلالة كبيرة' }], readingAnalysis: [{ term: 'stance attribution', meaningAr: 'تحديد صاحب الموقف: الكاتب أم الراوي أم شخصية أخرى' }] },
      ],
      sentences: [{ en: 'The clipped delivery may imply reluctance, although the wording itself remains ostensibly affirmative.', ar: 'قد توحي طريقة الإلقاء المقتضبة بالتردد، رغم أن الصياغة نفسها تبدو إيجابية.' }],
      dialogue: [{ who: 'A', en: 'Was the reply sincere or sarcastic?', ar: 'هل كان الرد صادقاً أم ساخراً؟' }, { who: 'B', en: 'The prosody permits either reading; we need the preceding exchange to decide.', ar: 'يسمح التنغيم بالقراءتين؛ نحتاج إلى الحوار السابق للترجيح.' }],
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
