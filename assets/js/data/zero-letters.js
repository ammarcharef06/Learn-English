// بيانات المستوى الصفري: الحروف، الحروف المركّبة، الأرقام، الأرقام الترتيبية.

export const LETTERS = [
  { id: 'a', upper: 'A', lower: 'a', nameAr: 'إيه', soundAr: 'أَ / إيه', word: 'Apple', wordAr: 'تفاحة', wordPronAr: 'آبِل', emoji: '🍎', tipAr: 'A في Apple تنطق «أَ» قصيرة، ولا تنطق «إيه» كاملة.' },
  { id: 'b', upper: 'B', lower: 'b', nameAr: 'بي', soundAr: 'ب', word: 'Ball', wordAr: 'كرة', wordPronAr: 'بول', emoji: '⚽', tipAr: 'B صوت شفتين مع اهتزاز الحبال الصوتية، لا تخلطها بـ P.' },
  { id: 'c', upper: 'C', lower: 'c', nameAr: 'سي', soundAr: 'ك / س', word: 'Cat', wordAr: 'قطة', wordPronAr: 'كات', emoji: '🐱', tipAr: 'C تنطق «ك» قبل a وo وu، وتنطق «س» قبل e وi وy.' },
  { id: 'd', upper: 'D', lower: 'd', nameAr: 'دي', soundAr: 'د', word: 'Dog', wordAr: 'كلب', wordPronAr: 'دوغ', emoji: '🐶', tipAr: 'D صوت مجهور؛ لا تحوّله إلى «ت» في نهاية الكلمة.' },
  { id: 'e', upper: 'E', lower: 'e', nameAr: 'إي', soundAr: 'إِ / إي', word: 'Egg', wordAr: 'بيضة', wordPronAr: 'إِغ', emoji: '🥚', tipAr: 'E في Egg تنطق «إِ» قصيرة، أما اسم الحرف فهو «إي».' },
  { id: 'f', upper: 'F', lower: 'f', nameAr: 'إف', soundAr: 'ف', word: 'Fish', wordAr: 'سمكة', wordPronAr: 'فِش', emoji: '🐟', tipAr: 'F تُنطق بإسناد الأسنان العلوية على الشفة السفلى.' },
  { id: 'g', upper: 'G', lower: 'g', nameAr: 'جي', soundAr: 'غ / ج', word: 'Goat', wordAr: 'عنزة', wordPronAr: 'غوت', emoji: '🐐', tipAr: 'G تنطق «غ» في Goat، وتنطق «ج» في كلمات مثل Giant.' },
  { id: 'h', upper: 'H', lower: 'h', nameAr: 'إتش', soundAr: 'ه', word: 'Hat', wordAr: 'قبعة', wordPronAr: 'هات', emoji: '🎩', tipAr: 'H صوت نَفَس من الحلق؛ لا تهملها في Hat وHouse.' },
  { id: 'i', upper: 'I', lower: 'i', nameAr: 'آي', soundAr: 'إِ / آي', word: 'Ice', wordAr: 'جليد', wordPronAr: 'آيس', emoji: '🧊', tipAr: 'I في Ice تنطق «آي» مثل اسم الحرف تماماً.' },
  { id: 'j', upper: 'J', lower: 'j', nameAr: 'جيه', soundAr: 'ج', word: 'Juice', wordAr: 'عصير', wordPronAr: 'جوس', emoji: '🧃', tipAr: 'J تنطق «ج» مجهورة، ولا تنطق «ي» ولا «تش».' },
  { id: 'k', upper: 'K', lower: 'k', nameAr: 'كيه', soundAr: 'ك', word: 'Key', wordAr: 'مفتاح', wordPronAr: 'كي', emoji: '🔑', tipAr: 'K لا تنطق في بداية كلمات مثل Knee وKnife.' },
  { id: 'l', upper: 'L', lower: 'l', nameAr: 'إل', soundAr: 'ل', word: 'Lion', wordAr: 'أسد', wordPronAr: 'لايَن', emoji: '🦁', tipAr: 'L يلامس فيها اللسان سقف الفم أمام الأسنان، لا تكسرها.' },
  { id: 'm', upper: 'M', lower: 'm', nameAr: 'إم', soundAr: 'م', word: 'Moon', wordAr: 'قمر', wordPronAr: 'مون', emoji: '🌙', tipAr: 'M صوت شفتين مغلقتين ويخرج من الأنف.' },
  { id: 'n', upper: 'N', lower: 'n', nameAr: 'إن', soundAr: 'ن', word: 'Nose', wordAr: 'أنف', wordPronAr: 'نوز', emoji: '👃', tipAr: 'N صوت أنفي واللسان على سقف الفم، لا تقل «إن» كاملة.' },
  { id: 'o', upper: 'O', lower: 'o', nameAr: 'أو', soundAr: 'أُ / أو', word: 'Orange', wordAr: 'برتقالة', wordPronAr: 'أورِنج', emoji: '🍊', tipAr: 'O في Orange تنطق «أُ» قصيرة، واسم الحرف «أو».' },
  { id: 'p', upper: 'P', lower: 'p', nameAr: 'بي', soundAr: 'ب (مهموسة)', word: 'Pen', wordAr: 'قلم', wordPronAr: 'بِن', emoji: '🖊️', tipAr: 'P مثل B لكن بلا اهتزاز الحبال الصوتية، مع نَفَس قوي.' },
  { id: 'q', upper: 'Q', lower: 'q', nameAr: 'كيو', soundAr: 'ك', word: 'Queen', wordAr: 'ملكة', wordPronAr: 'كوين', emoji: '👑', tipAr: 'Q تأتي دائماً مع u وتنطق «كو» كما في Queen.' },
  { id: 'r', upper: 'R', lower: 'r', nameAr: 'آر', soundAr: 'ر', word: 'Rabbit', wordAr: 'أرنب', wordPronAr: 'رابِت', emoji: '🐰', tipAr: 'R الإنجليزية لا تُكرَّر ولا تُشدَّد مثل الراء العربية.' },
  { id: 's', upper: 'S', lower: 's', nameAr: 'إس', soundAr: 'س', word: 'Sun', wordAr: 'شمس', wordPronAr: 'سان', emoji: '☀️', tipAr: 'S تنطق «س» مهموسة، وتنطق «ز» بين حرفين صوتيين.' },
  { id: 't', upper: 'T', lower: 't', nameAr: 'تي', soundAr: 'ت', word: 'Tree', wordAr: 'شجرة', wordPronAr: 'تري', emoji: '🌳', tipAr: 'T صوت اللسان على أصول الأسنان، لا تنطقها «ط» مفخّمة.' },
  { id: 'u', upper: 'U', lower: 'u', nameAr: 'يو', soundAr: 'أَ / يو', word: 'Umbrella', wordAr: 'مظلة', wordPronAr: 'أَمبْرِلّا', emoji: '☔', tipAr: 'U في Umbrella تنطق «أَ» قصيرة، واسم الحرف «يو».' },
  { id: 'v', upper: 'V', lower: 'v', nameAr: 'في', soundAr: 'ف (مجهورة)', word: 'Van', wordAr: 'شاحنة صغيرة', wordPronAr: 'فان', emoji: '🚐', tipAr: 'V مثل F لكن مع اهتزاز الحبال الصوتية، ولا تنطقها «و».' },
  { id: 'w', upper: 'W', lower: 'w', nameAr: 'دَبِلْيو', soundAr: 'و', word: 'Water', wordAr: 'ماء', wordPronAr: 'ووتَر', emoji: '💧', tipAr: 'W تنطق «و» قصيرة جداً كما في Water وWe.' },
  { id: 'x', upper: 'X', lower: 'x', nameAr: 'إكس', soundAr: 'كس / ز', word: 'Xylophone', wordAr: 'زايْلُفون', wordPronAr: 'زايِلُفون', emoji: '🎹', tipAr: 'X في بداية الكلمة تنطق «ز»، وفي نهايتها تنطق «كس».' },
  { id: 'y', upper: 'Y', lower: 'y', nameAr: 'واي', soundAr: 'ي / آي', word: 'Yogurt', wordAr: 'زبادي', wordPronAr: 'يوجِرت', emoji: '🥛', tipAr: 'Y في بداية الكلمة تنطق «ي»، وفي نهايتها تنطق «آي».' },
  { id: 'z', upper: 'Z', lower: 'z', nameAr: 'زي', soundAr: 'ز', word: 'Zebra', wordAr: 'حمار وحشي', wordPronAr: 'زيبرا', emoji: '🦓', tipAr: 'Z صوت «ز» مجهور قوي، لا تخلطه بـ S المهموسة.' }
];

export const DIGRAPHS = [
  { id: 'sh', combo: 'sh', soundAr: 'ش', word: 'Ship', wordAr: 'سفينة', wordPronAr: 'شِب', emoji: '🚢', tipAr: 'sh صوت واحد «ش»؛ لا تنطقها «س» ثم «ه» منفصلتين.' },
  { id: 'ch', combo: 'ch', soundAr: 'تش', word: 'Chair', wordAr: 'كرسي', wordPronAr: 'تشير', emoji: '🪑', tipAr: 'ch صوت واحد «تش»؛ لا تفصلها إلى «ت» و«ش».' },
  { id: 'th-voiceless', combo: 'th', soundAr: 'ث', word: 'Three', wordAr: 'ثلاثة', wordPronAr: 'ثري', emoji: '3️⃣', tipAr: 'th هنا مهموسة مثل «ث»؛ طرف اللسان بين الأسنان.' },
  { id: 'th-voiced', combo: 'th', soundAr: 'ذ', word: 'This', wordAr: 'هذا', wordPronAr: 'ذِس', emoji: '👆', tipAr: 'th هنا مجهورة مثل «ذ»؛ مع اهتزاز الحبال الصوتية.' },
  { id: 'ph', combo: 'ph', soundAr: 'ف', word: 'Phone', wordAr: 'هاتف', wordPronAr: 'فون', emoji: '📱', tipAr: 'ph تنطق «ف» دائماً كما في Phone وPhoto.' },
  { id: 'ck', combo: 'ck', soundAr: 'ك', word: 'Duck', wordAr: 'بطة', wordPronAr: 'دَك', emoji: '🦆', tipAr: 'ck تنطق «ك» واحدة في نهاية الكلمة القصيرة.' },
  { id: 'ng', combo: 'ng', soundAr: 'نغ', word: 'King', wordAr: 'ملك', wordPronAr: 'كِينغ', emoji: '👑', tipAr: 'ng صوت أنفي واحد؛ لا تزد بعده «غ» قوية.' },
  { id: 'oo-long', combo: 'oo', soundAr: 'وو (طويل)', word: 'Spoon', wordAr: 'ملعقة', wordPronAr: 'سبون', emoji: '🥄', tipAr: 'oo هنا طويلة مثل «وو» في Spoon وMoon.' },
  { id: 'oo-short', combo: 'oo', soundAr: 'و (قصير)', word: 'Book', wordAr: 'كتاب', wordPronAr: 'بوك', emoji: '📚', tipAr: 'oo هنا قصيرة مثل «و» في Book وCook.' },
  { id: 'ee', combo: 'ee', soundAr: 'إي (طويل)', word: 'Bee', wordAr: 'نحلة', wordPronAr: 'بي', emoji: '🐝', tipAr: 'ee تنطق «إي» طويلة مثل اسم حرف E.' },
  { id: 'ea', combo: 'ea', soundAr: 'إي', word: 'Sea', wordAr: 'بحر', wordPronAr: 'سي', emoji: '🌊', tipAr: 'ea غالباً تنطق «إي» مثل Sea وTea.' },
  { id: 'ou', combo: 'ou', soundAr: 'آو', word: 'House', wordAr: 'منزل', wordPronAr: 'هاوس', emoji: '🏠', tipAr: 'ou تنطق «آو» في House وMouse.' }
];

export const NUMBERS = [
  { n: 0, en: 'zero', ar: 'صفر', pron: 'زِيرو' },
  { n: 1, en: 'one', ar: 'واحد', pron: 'وَن' },
  { n: 2, en: 'two', ar: 'اثنان', pron: 'تو' },
  { n: 3, en: 'three', ar: 'ثلاثة', pron: 'ثري' },
  { n: 4, en: 'four', ar: 'أربعة', pron: 'فور' },
  { n: 5, en: 'five', ar: 'خمسة', pron: 'فايف' },
  { n: 6, en: 'six', ar: 'ستة', pron: 'سِكس' },
  { n: 7, en: 'seven', ar: 'سبعة', pron: 'سِفِن' },
  { n: 8, en: 'eight', ar: 'ثمانية', pron: 'إيت' },
  { n: 9, en: 'nine', ar: 'تسعة', pron: 'ناين' },
  { n: 10, en: 'ten', ar: 'عشرة', pron: 'تِن' },
  { n: 11, en: 'eleven', ar: 'أحد عشر', pron: 'إلِفِن' },
  { n: 12, en: 'twelve', ar: 'اثنا عشر', pron: 'تويلف' },
  { n: 13, en: 'thirteen', ar: 'ثلاثة عشر', pron: 'ثِرتين' },
  { n: 14, en: 'fourteen', ar: 'أربعة عشر', pron: 'فورتين' },
  { n: 15, en: 'fifteen', ar: 'خمسة عشر', pron: 'فِفتين' },
  { n: 16, en: 'sixteen', ar: 'ستة عشر', pron: 'سِكستين' },
  { n: 17, en: 'seventeen', ar: 'سبعة عشر', pron: 'سِفِنتين' },
  { n: 18, en: 'eighteen', ar: 'ثمانية عشر', pron: 'إيتين' },
  { n: 19, en: 'nineteen', ar: 'تسعة عشر', pron: 'ناينتين' },
  { n: 20, en: 'twenty', ar: 'عشرون', pron: 'توينتي' },
  { n: 30, en: 'thirty', ar: 'ثلاثون', pron: 'ثِرتي' },
  { n: 40, en: 'forty', ar: 'أربعون', pron: 'فورتي' },
  { n: 50, en: 'fifty', ar: 'خمسون', pron: 'فِفتي' },
  { n: 60, en: 'sixty', ar: 'ستون', pron: 'سِكستي' },
  { n: 70, en: 'seventy', ar: 'سبعون', pron: 'سِفِنتي' },
  { n: 80, en: 'eighty', ar: 'ثمانون', pron: 'إيتي' },
  { n: 90, en: 'ninety', ar: 'تسعون', pron: 'ناينتي' },
  { n: 100, en: 'one hundred', ar: 'مئة', pron: 'وَن هَندرِد' }
];

export const ORDINALS = [
  { n: 1, en: 'first', ar: 'الأول', pron: 'فِرست' },
  { n: 2, en: 'second', ar: 'الثاني', pron: 'سِكِند' },
  { n: 3, en: 'third', ar: 'الثالث', pron: 'ثِرد' },
  { n: 4, en: 'fourth', ar: 'الرابع', pron: 'فورث' },
  { n: 5, en: 'fifth', ar: 'الخامس', pron: 'فِفث' },
  { n: 6, en: 'sixth', ar: 'السادس', pron: 'سِكسث' },
  { n: 7, en: 'seventh', ar: 'السابع', pron: 'سِفِنث' },
  { n: 8, en: 'eighth', ar: 'الثامن', pron: 'إيتث' },
  { n: 9, en: 'ninth', ar: 'التاسع', pron: 'ناينث' },
  { n: 10, en: 'tenth', ar: 'العاشر', pron: 'تِنث' }
];

// نهاية بيانات الحروف.
