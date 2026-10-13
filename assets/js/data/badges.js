/* تعريف الشارات وإنجازات التحفيز */

export const BADGES = [
  { id: 'first-step', icon: '🚀', ar: 'أول خطوة', en: 'First step', descAr: 'أجبت عن أول سؤال', descEn: 'Answered your first question', check: (p) => (p.totals?.questions || 0) >= 1 },
  { id: 'ten-correct', icon: '✅', ar: 'بداية موفقة', en: 'Good start', descAr: '١٠ إجابات صحيحة', descEn: '10 correct answers', check: (p) => (p.totals?.correct || 0) >= 10 },
  { id: 'fifty-correct', icon: '💪', ar: 'خمسون صحيحة', en: 'Fifty right', descAr: '٥٠ إجابة صحيحة', descEn: '50 correct answers', check: (p) => (p.totals?.correct || 0) >= 50 },
  { id: 'hundred-correct', icon: '🎯', ar: 'مئة إصابة', en: 'Century', descAr: '١٠٠ إجابة صحيحة', descEn: '100 correct answers', check: (p) => (p.totals?.correct || 0) >= 100 },
  { id: 'thousand', icon: '🏆', ar: 'ألف إجابة', en: 'A thousand', descAr: '١٠٠٠ إجابة', descEn: '1000 answers', check: (p) => (p.totals?.questions || 0) >= 1000 },
  { id: 'combo-10', icon: '💎', ar: 'سلسلة ذهبية', en: 'Golden combo', descAr: '١٠ إجابات صحيحة متتالية', descEn: '10 correct answers in a row', check: (p) => (p.bestCombo || 0) >= 10 },
  { id: 'combo-25', icon: '🌟', ar: 'تركيز كامل', en: 'Full focus', descAr: '٢٥ إجابة صحيحة متتالية', descEn: '25 correct answers in a row', check: (p) => (p.bestCombo || 0) >= 25 },
  { id: 'streak-3', icon: '🔥', ar: 'ثلاثة أيام', en: 'Three days', descAr: '٣ أيام دراسة متتالية', descEn: '3 study days in a row', check: (p) => (p.bestStreak || 0) >= 3 },
  { id: 'streak-7', icon: '⚡', ar: 'أسبوع كامل', en: 'Full week', descAr: '٧ أيام متتالية', descEn: '7 days in a row', check: (p) => (p.bestStreak || 0) >= 7 },
  { id: 'streak-30', icon: '👑', ar: 'شهر من الإصرار', en: 'Month of grit', descAr: '٣٠ يوماً متتالياً', descEn: '30 days in a row', check: (p) => (p.bestStreak || 0) >= 30 },
  { id: 'unit-first', icon: '📘', ar: 'أول وحدة', en: 'First unit', descAr: 'أكملت وحدة كاملة', descEn: 'Completed a full unit', check: (p) => Object.values(p.units || {}).some((u) => u && u.done) },
  { id: 'units-6', icon: '📗', ar: 'ست وحدات', en: 'Six units', descAr: 'أكملت ٦ وحدات', descEn: 'Completed 6 units', check: (p) => Object.values(p.units || {}).filter((u) => u && u.done).length >= 6 },
  { id: 'units-12', icon: '📙', ar: 'اثنتا عشرة وحدة', en: 'Twelve units', descAr: 'أكملت ١٢ وحدة', descEn: 'Completed 12 units', check: (p) => Object.values(p.units || {}).filter((u) => u && u.done).length >= 12 },
  { id: 'level-a1', icon: '🌱', ar: 'أتممت A1', en: 'A1 complete', descAr: 'أكملت كل وحدات المبتدئ', descEn: 'Finished all A1 units', check: (p, ctx) => ctx?.levelDone?.('a1') },
  { id: 'level-a2', icon: '🌿', ar: 'أتممت A2', en: 'A2 complete', descAr: 'أكملت كل وحدات ما قبل المتوسط', descEn: 'Finished all A2 units', check: (p, ctx) => ctx?.levelDone?.('a2') },
  { id: 'level-b1', icon: '🌳', ar: 'أتممت B1', en: 'B1 complete', descAr: 'أكملت كل وحدات المتوسط', descEn: 'Finished all B1 units', check: (p, ctx) => ctx?.levelDone?.('b1') },
  { id: 'reader-3', icon: '📖', ar: 'قارئ نشيط', en: 'Active reader', descAr: 'أكملت ٣ مطالعات', descEn: 'Completed 3 passages', check: (p) => Object.values(p.readings || {}).filter((r) => r && r.done).length >= 3 },
  { id: 'reader-all', icon: '📚', ar: 'مكتبة كاملة', en: 'Full library', descAr: 'أكملت كل المطالعات', descEn: 'Completed every passage', check: (p, ctx) => ctx?.readingsTotal ? Object.values(p.readings || {}).filter((r) => r && r.done).length >= ctx.readingsTotal : false },
  { id: 'examiner', icon: '🎓', ar: 'ممتحَن', en: 'Examinee', descAr: 'أنهيت أول اختبار', descEn: 'Finished your first exam', check: (p) => (p.exams || []).length >= 1 },
  { id: 'ace', icon: '💯', ar: 'إتقان', en: 'Ace', descAr: 'دقة ٩٠٪ أو أكثر في اختبار', descEn: '90%+ in an exam', check: (p) => (p.exams || []).some((e) => e.total >= 10 && e.score / e.total >= 0.9) },
  { id: 'exams-5', icon: '📝', ar: 'معتاد الاختبارات', en: 'Exam regular', descAr: 'خمسة اختبارات', descEn: 'Five exams', check: (p) => (p.exams || []).length >= 5 },
  { id: 'notebook-20', icon: '✍️', ar: 'جامع الكلمات', en: 'Word collector', descAr: '٢٠ كلمة في دفترك', descEn: '20 words in your notebook', check: (p) => (p.notebook || []).length >= 20 },
  { id: 'goal-7', icon: '🎯', ar: 'سبعة أهداف', en: 'Seven goals', descAr: 'حققت هدفك اليومي ٧ مرات', descEn: 'Met your daily goal 7 times', check: (p) => Object.values(p.goals || {}).filter((g) => g && g.done).length >= 7 },
  { id: 'time-60', icon: '⏱️', ar: 'ساعة دراسية', en: 'One hour', descAr: '٦٠ دقيقة من الدراسة', descEn: '60 minutes of study', check: (p) => (p.totals?.minutes || 0) >= 60 },
  { id: 'points-500', icon: '⭐', ar: 'خمسمئة نقطة', en: '500 points', descAr: 'جمعت ٥٠٠ نقطة', descEn: 'Earned 500 points', check: (p) => (p.points || 0) >= 500 },
  { id: 'points-2000', icon: '🏅', ar: 'ألفا نقطة', en: '2000 points', descAr: 'جمعت ٢٠٠٠ نقطة', descEn: 'Earned 2000 points', check: (p) => (p.points || 0) >= 2000 },
];

/* نصائح توعوية تدور على لوحة التحكم */
export const STUDY_TIPS = [
  'التكرار المتباعد أفضل من المذاكرة الطويلة مرة واحدة: ١٠ دقائق يومياً تتغلّب على ٣ ساعات في نهاية الأسبوع.',
  'انطق الكلمة بصوت مسموع عند حفظها — النطق يثبّت الكلمة في الذاكرة أكثر من القراءة الصامتة.',
  'لا تحفظ كلمة منفردة، احفظها داخل جملة كاملة. لهذا كل كلمة في الموقع لها مثال.',
  'قاعدة ٨٠/٢٠: ركّز ٨٠٪ من وقتك على الكلمات التي تخطئ فيها، و٢٠٪ على مراجعة السهل.',
  'اكتب ٣ جمل من إنشائك في اليوم باستخدام الكلمات الجديدة، وستثبت أسرع بثلاث مرات.',
  'الاستماع قبل النوم مباشرة يزيد تثبيت المفردات لأن الدماغ يراجعها أثناء النوم.',
  'لا تخف من الخطأ: كل خطأ تسجّله الأكاديمية يتحول تلقائياً إلى تدريب ذكي لك.',
  'اختبار قصير كل أسبوع يكشف نقاط ضعفك بدقة أكثر من إعادة قراءة الدروس.',
  'تعلّم الضمائر أولاً ثم أدوات الربط ثم أدوات السؤال — هذا الترتيب يبني ٦٠٪ من جمل الحياة اليومية.',
  'اجعل الإنجليزية عادة مرتبطة بشيء يومي: بعد القهوة الصباحية، أو قبل النوم، أو بعد الرياضة.',
];
