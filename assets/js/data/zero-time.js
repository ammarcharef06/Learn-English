/* ============================================================
   بيانات وحدة المستوى الصفري: الأيام + الشهور + الفصول + الوقت
   + الضمائر + فعل الكينونة + قول الساعة
   لا تستورد هذه الوحدة أي ملف آخر، وتُصدّر سبع مصفوفات فقط.
   ============================================================ */

/* أيام الأسبوع بالترتيب الصحيح، وكل يوم بلغته ونطقه واختصاره */
export const DAYS = [
  { en: 'Sunday', ar: 'الأحد', pron: 'صَنْدَي', short: 'Sun', emoji: '☀️' },
  { en: 'Monday', ar: 'الاثنين', pron: 'مَنْدَي', short: 'Mon', emoji: '🌙' },
  { en: 'Tuesday', ar: 'الثلاثاء', pron: 'تُيُوزْدَي', short: 'Tue', emoji: '🔥' },
  { en: 'Wednesday', ar: 'الأربعاء', pron: 'وِنْزْدَي', short: 'Wed', emoji: '🌿' },
  { en: 'Thursday', ar: 'الخميس', pron: 'ثِرْزْدَي', short: 'Thu', emoji: '⭐' },
  { en: 'Friday', ar: 'الجمعة', pron: 'فْرَايْدَي', short: 'Fri', emoji: '🕌' },
  { en: 'Saturday', ar: 'السبت', pron: 'سَاتَرْدَي', short: 'Sat', emoji: '🎉' },
];

/* شهور السنة بالترتيب، مع عدد أيام كل شهر وفصله */
export const MONTHS = [
  { n: 1, en: 'January', ar: 'يناير', pron: 'جَانْيُوَري', season: 'winter', days: 31 },
  { n: 2, en: 'February', ar: 'فبراير', pron: 'فِبْرُوَري', season: 'winter', days: 28 },
  { n: 3, en: 'March', ar: 'مارس', pron: 'مَارْتْش', season: 'spring', days: 31 },
  { n: 4, en: 'April', ar: 'أبريل', pron: 'أَبْرِيل', season: 'spring', days: 30 },
  { n: 5, en: 'May', ar: 'مايو', pron: 'مَايْ', season: 'spring', days: 31 },
  { n: 6, en: 'June', ar: 'يونيو', pron: 'جُونْ', season: 'summer', days: 30 },
  { n: 7, en: 'July', ar: 'يوليو', pron: 'جُولَايْ', season: 'summer', days: 31 },
  { n: 8, en: 'August', ar: 'أغسطس', pron: 'أُوغَسْت', season: 'summer', days: 31 },
  { n: 9, en: 'September', ar: 'سبتمبر', pron: 'سِبْتَمْبَر', season: 'autumn', days: 30 },
  { n: 10, en: 'October', ar: 'أكتوبر', pron: 'أُوكْتُوبَر', season: 'autumn', days: 31 },
  { n: 11, en: 'November', ar: 'نوفمبر', pron: 'نُوفَمْبَر', season: 'autumn', days: 30 },
  { n: 12, en: 'December', ar: 'ديسمبر', pron: 'دِيسَمْبَر', season: 'winter', days: 31 },
];

/* فصول السنة الأربعة، وترتبط بالشهور عبر المعرّف */
export const SEASONS = [
  { id: 'winter', en: 'Winter', ar: 'الشتاء', pron: 'وِنْتَر', monthsAr: 'ديسمبر · يناير · فبراير', emoji: '❄️' },
  { id: 'spring', en: 'Spring', ar: 'الربيع', pron: 'سْبْرِنْغ', monthsAr: 'مارس · أبريل · مايو', emoji: '🌸' },
  { id: 'summer', en: 'Summer', ar: 'الصيف', pron: 'سَامَر', monthsAr: 'يونيو · يوليو · أغسطس', emoji: '☀️' },
  { id: 'autumn', en: 'Autumn', ar: 'الخريف', pron: 'أُوتَم', monthsAr: 'سبتمبر · أكتوبر · نوفمبر', emoji: '🍂' },
];

/* عبارات الوقت الأساسية التي يحتاجها المبتدئ في أول درس */
export const TIME_WORDS = [
  { en: 'today', ar: 'اليوم', pron: 'تُودَي', emoji: '📅' },
  { en: 'tomorrow', ar: 'غداً', pron: 'تُومُورُو', emoji: '⏩' },
  { en: 'yesterday', ar: 'أمس', pron: 'يِسْتَرْدَي', emoji: '⏪' },
  { en: 'now', ar: 'الآن', pron: 'نَاوْ', emoji: '⏰' },
  { en: 'morning', ar: 'الصباح', pron: 'مُورْنِنْغ', emoji: '🌄' },
  { en: 'afternoon', ar: 'بعد الظهر', pron: 'آفْتَرْنُون', emoji: '🌞' },
  { en: 'evening', ar: 'المساء', pron: 'إيفْنِنْغ', emoji: '🌆' },
  { en: 'night', ar: 'الليل', pron: 'نَايْت', emoji: '🌃' },
  { en: 'day', ar: 'يوم', pron: 'دَي', emoji: '☀️' },
  { en: 'week', ar: 'أسبوع', pron: 'وِيك', emoji: '📆' },
  { en: 'month', ar: 'شهر', pron: 'مَانْث', emoji: '🗓️' },
  { en: 'year', ar: 'سنة', pron: 'يِير', emoji: '🎊' },
  { en: 'hour', ar: 'ساعة', pron: 'آوَر', emoji: '🕐' },
  { en: 'minute', ar: 'دقيقة', pron: 'مِنِت', emoji: '⏱️' },
  { en: 'second', ar: 'ثانية', pron: 'سِيكَنْد', emoji: '⚡' },
  { en: "o'clock", ar: 'الساعة تماماً', pron: 'أُوكْلُوك', emoji: '🕰️' },
  { en: 'half', ar: 'النصف', pron: 'هَاف', emoji: '🌗' },
  { en: 'quarter', ar: 'الربع', pron: 'كْوَارْتَر', emoji: '🌓' },
];

/* ضمائر الفاعل. ملاحظة: كلمة you صيغة واحدة للمفرد والجمع في الإنجليزية،
   لذلك جاءت في عنصرين منفصلين ليتمكن المتعلم من التمييز بين الحالتين. */
export const PRONOUNS = [
  { en: 'I', ar: 'أنا', pron: 'آي', emoji: '🙋', be: 'am', example: 'I am a student.', exampleAr: 'أنا طالب.', examplePron: 'آي آم أَ سْتُودِنت' },
  { en: 'You', ar: 'أنتَ / أنتِ', pron: 'يُو', emoji: '🧍', be: 'are', example: 'You are my friend.', exampleAr: 'أنت صديقي.', examplePron: 'يُو آر مَايْ فْرِنْد' },
  { en: 'He', ar: 'هو', pron: 'هِي', emoji: '👨', be: 'is', example: 'He is a teacher.', exampleAr: 'هو مدرّس.', examplePron: 'هِي إز أَ تِيتْشَر' },
  { en: 'She', ar: 'هي', pron: 'شِي', emoji: '👩', be: 'is', example: 'She is my sister.', exampleAr: 'هي أختي.', examplePron: 'شِي إز مَايْ سِسْتَر' },
  { en: 'It', ar: 'هو / هي لغير العاقل', pron: 'إِت', emoji: '📦', be: 'is', example: 'It is a nice city.', exampleAr: 'إنها مدينة جميلة.', examplePron: 'إِت إز أَ نَايْس سِتِي' },
  { en: 'We', ar: 'نحن', pron: 'وِي', emoji: '🤝', be: 'are', example: 'We are ready.', exampleAr: 'نحن مستعدون.', examplePron: 'وِي آر رِيدِي' },
  { en: 'You', ar: 'أنتم / أنتنّ', pron: 'يُو', emoji: '👥', be: 'are', example: 'You are students.', exampleAr: 'أنتم طلاب.', examplePron: 'يُو آر سْتُودِنتْس' },
  { en: 'They', ar: 'هم / هنّ', pron: 'ذَي', emoji: '👪', be: 'are', example: 'They are at home.', exampleAr: 'هم في المنزل.', examplePron: 'ذَي آر أَت هُوم' },
];

/* فعل الكينونة في المضارع: ثلاث صيغ فقط، ولكل صيغة ثلاثة أمثلة */
export const TO_BE = [
  {
    verb: 'am',
    withAr: 'مع ضمير أنا فقط',
    ruleAr: 'نستعمل am بعد الضمير أنا للحديث عن أنفسنا، ولا تأتي مع أي ضمير آخر.',
    examples: [
      { en: 'I am happy.', ar: 'أنا سعيد.', pron: 'آي آم هَابي' },
      { en: 'I am a teacher.', ar: 'أنا مدرّس.', pron: 'آي آم أَ تِيتْشَر' },
      { en: 'I am from Algeria.', ar: 'أنا من الجزائر.', pron: 'آي آم فْرُوم أَلْجِيرِيَا' },
    ],
  },
  {
    verb: 'is',
    withAr: 'مع هو و هي وأي اسم مفرد',
    ruleAr: 'نستعمل is مع الغائب المفرد: هو، هي، واسم شخص واحد أو شيء واحد.',
    examples: [
      { en: 'He is a doctor.', ar: 'هو طبيب.', pron: 'هِي إز أَ دُوكْتَر' },
      { en: 'She is my mother.', ar: 'هي أمي.', pron: 'شِي إز مَايْ مَاذَر' },
      { en: 'It is cold today.', ar: 'الجو بارد اليوم.', pron: 'إِت إز كُولْد تُودَي' },
    ],
  },
  {
    verb: 'are',
    withAr: 'مع نحن و أنتم و هم والجمع',
    ruleAr: 'نستعمل are مع الجمع وضمير المخاطب، سواء كان مفرداً أو جمعاً.',
    examples: [
      { en: 'We are ready.', ar: 'نحن مستعدون.', pron: 'وِي آر رِيدِي' },
      { en: 'They are my friends.', ar: 'هم أصدقائي.', pron: 'ذَي آر مَايْ فْرِنْدْس' },
      { en: 'You are a good student.', ar: 'أنت طالب جيد.', pron: 'يُو آر أَ غُود سْتُودِنت' },
    ],
  },
];

/* قول الساعة: الساعة تماماً، والنصف، والربع، وأوقات مختلفة */
export const NUMBERS_TIME = [
  { en: "It's three o'clock.", ar: 'إنها الثالثة.', pron: 'إتْس ثْرِي أُوكْلُوك' },
  { en: "It's twelve o'clock.", ar: 'إنها الثانية عشرة.', pron: 'إتْس تْوِيلْف أُوكْلُوك' },
  { en: "It's half past seven.", ar: 'إنها السابعة والنصف.', pron: 'إتْس هَاف بَاسْت سِيفَن' },
  { en: "It's a quarter past nine.", ar: 'إنها التاسعة والربع.', pron: 'إتْس أَ كْوَارْتَر بَاسْت نَايْن' },
  { en: "It's a quarter to six.", ar: 'إنها السادسة إلا الربع.', pron: 'إتْس أَ كْوَارْتَر تُو سِيكْس' },
  { en: "It's ten past four.", ar: 'إنها الرابعة وعشر دقائق.', pron: 'إتْس تِين بَاسْت فُور' },
  { en: "It's twenty to eight.", ar: 'إنها الثامنة إلا عشرين دقيقة.', pron: 'إتْس تْوِينْتِي تُو إيتْ' },
  { en: "It's five o'clock in the evening.", ar: 'إنها الخامسة مساءً.', pron: 'إتْس فَايْف أُوكْلُوك إِن ذِي إيفْنِنْغ' },
];

// نهاية بيانات الوقت والضمائر.
