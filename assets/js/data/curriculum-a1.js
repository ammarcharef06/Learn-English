import { WORD_GROUPS as A0_WORD_GROUPS } from './zero-words.js';

export const LEVEL_A1 = {
  id: "a1",
  label: "A1 — المبتدئ",
  labelEn: "Beginner (A1)",
  icon: "🌱",
  color: "#22c55e",
  summary: "منهج المبتدئ يبدأ بالمفردات الأساسية المنقولة من التأسيس، ثم يبني عليها القواعد والتواصل اليومي.",
  units: [
    {
      id: "a1u1",
      title: "التحيات والتعريف بالنفس",
      titleEn: "Greetings and Introductions",
      icon: "👋",
      goal: "أن يحيّي المتعلم الآخرين ويعرّف بنفسه ويقدّم صديقاً بجمل قصيرة.",
      grammar: [
        {
          title: "فعل الكينونة في المضارع",
          explain: "<p>فعل الكينونة فعل أساسي في الإنجليزية، ومعناه يكون أو يوجد. نستخدمه للتعريف بأنفسنا ووصف حالتنا والأشياء من حولنا.</p><ul><li>يتغير شكل الفعل حسب الضمير، والجدول يوضح الصيغ الثلاث.</li><li>الصيغة الأولى خاصة بالمتكلم المفرد، والثانية للمخاطب والجمع، والثالثة للغائب المفرد.</li><li>لا نحذف الفعل من الجملة كما نفعل في العربية.</li></ul>",
          table: {
            headers: ["الضمير", "الفعل", "مثال"],
            rows: [
              ["I", "am", "I am a student."],
              ["You", "are", "You are my friend."],
              ["He", "is", "He is a teacher."],
              ["She", "is", "She is fine today."],
              ["It", "is", "It is a book."],
              ["We", "are", "We are in the class."],
              ["They", "are", "They are from Egypt."]
            ]
          },
          examples: [
            { en: "I am a student.", ar: "أنا طالب." },
            { en: "You are my friend.", ar: "أنت صديقي." },
            { en: "He is a teacher.", ar: "هو مدرّس." },
            { en: "She is fine today.", ar: "هي بخير اليوم." },
            { en: "We are in the class.", ar: "نحن في الصف." },
            { en: "They are from Egypt.", ar: "هم من مصر." }
          ],
          tips: [
            "استخدم الصيغة الكاملة في الكتابة، والاختصار في الكلام اليومي.",
            "لا تنسَ الفعل في الجملة، فالعربية تسمح بحذفه والإنجليزية لا تسمح.",
            "اختر صيغة الفعل المناسبة للضمير قبل أن تكتب الجملة."
          ]
        },
        {
          title: "ضمائر الفاعل",
          explain: "<p>ضمائر الفاعل كلمات صغيرة تحل محل الاسم وتأتي قبل الفعل. في العربية يكون الضمير مخفياً داخل الفعل غالباً، أما في الإنجليزية فيجب ذكره دائماً.</p><ul><li>للمتكلم ضمير واحد دائماً.</li><li>للمخاطب ضمير واحد للمفرد والجمع.</li><li>للغائب ضمير للمفرد المذكر وضمير للمفرد المؤنث وضمير لغير العاقل.</li></ul>",
          table: {
            headers: ["الضمير", "المعنى", "مثال"],
            rows: [
              ["I", "المتكلم", "I am here."],
              ["You", "المخاطب", "You are nice."],
              ["He", "الغائب المذكر", "He is a doctor."],
              ["She", "الغائبة", "She is happy."],
              ["It", "غير العاقل", "It is cold."],
              ["We", "المتكلمون", "We are friends."],
              ["They", "الغائبون", "They are students."]
            ]
          },
          examples: [
            { en: "I am happy.", ar: "أنا سعيد." },
            { en: "You are a good friend.", ar: "أنت صديق جيد." },
            { en: "It is a small house.", ar: "إنه منزل صغير." },
            { en: "We are ready.", ar: "نحن مستعدون." },
            { en: "They are at home.", ar: "هم في المنزل." }
          ],
          tips: [
            "يأتي ضمير الفاعل قبل الفعل في الجملة دائماً.",
            "نستخدم ضمير غير العاقل للأشياء والحيوانات.",
            "لا نكرر الاسم والضمير معاً في الجملة نفسها."
          ]
        }
      ],
      vocabulary: [
        { en: "hello", ar: "مرحباً", pos: "phrase", emoji: "👋", example: { en: "Hello, my name is Ali.", ar: "مرحباً، اسمي علي." } },
        { en: "goodbye", ar: "إلى اللقاء", pos: "phrase", emoji: "🙋", example: { en: "Goodbye, see you tomorrow.", ar: "إلى اللقاء، أراك غداً." } },
        { en: "name", ar: "اسم", pos: "noun", emoji: "📛", example: { en: "My name is Sara.", ar: "اسمي سارة." } },
        { en: "friend", ar: "صديق", pos: "noun", emoji: "🤝", example: { en: "Ali is my friend.", ar: "علي صديقي." } },
        { en: "teacher", ar: "مدرّس", pos: "noun", emoji: "👨‍🏫", example: { en: "My teacher is very kind.", ar: "مدرّسي لطيف جداً." } },
        { en: "student", ar: "طالب", pos: "noun", emoji: "🧑‍🎓", example: { en: "I am a student in this school.", ar: "أنا طالب في هذه المدرسة." } },
        { en: "school", ar: "مدرسة", pos: "noun", emoji: "🏫", example: { en: "My school is near my house.", ar: "مدرستي قريبة من منزلي." } },
        { en: "fine", ar: "بخير", pos: "adjective", emoji: "🙂", example: { en: "I am fine, thank you.", ar: "أنا بخير، شكراً." } },
        { en: "nice", ar: "لطيف", pos: "adjective", emoji: "😊", example: { en: "It is nice to meet you.", ar: "من اللطيف لقاؤك." } },
        { en: "meet", ar: "يلتقي", pos: "verb", emoji: "🤝", example: { en: "Nice to meet you.", ar: "سعيد بلقائك." } },
        { en: "morning", ar: "صباح", pos: "noun", emoji: "🌅", example: { en: "Good morning, everyone.", ar: "صباح الخير للجميع." } },
        { en: "please", ar: "من فضلك", pos: "adverb", emoji: "🙏", example: { en: "Please sit down.", ar: "من فضلك اجلس." } },
        { en: "thanks", ar: "شكراً", pos: "phrase", emoji: "🙏", example: { en: "Thanks for your help.", ar: "شكراً على مساعدتك." } },
        { en: "sorry", ar: "آسف", pos: "adjective", emoji: "😔", example: { en: "I am sorry, I am late.", ar: "أنا آسف، أنا متأخر." } },
        { en: "class", ar: "صف", pos: "noun", emoji: "🪑", example: { en: "Our class is big and clean.", ar: "صفنا كبير ونظيف." } },
        { en: "country", ar: "بلد", pos: "noun", emoji: "🌍", example: { en: "Egypt is a beautiful country.", ar: "مصر بلد جميل." } }
      ],
      sentences: [
        { en: "Hello, my name is Omar.", ar: "مرحباً، اسمي عمر." },
        { en: "Good morning, how are you?", ar: "صباح الخير، كيف حالك؟" },
        { en: "I am fine, thank you.", ar: "أنا بخير، شكراً." },
        { en: "Nice to meet you.", ar: "سعيد بلقائك." },
        { en: "This is my friend Sara.", ar: "هذه صديقتي سارة." },
        { en: "She is a student here.", ar: "هي طالبة هنا." },
        { en: "He is my English teacher.", ar: "هو مدرّس الإنجليزية." },
        { en: "We are from the same country.", ar: "نحن من البلد نفسه." },
        { en: "Welcome to our class.", ar: "أهلاً بك في صفنا." },
        { en: "Please sit down and listen.", ar: "من فضلك اجلس واستمع." },
        { en: "Goodbye, see you tomorrow.", ar: "إلى اللقاء، أراك غداً." },
        { en: "I am sorry, I am late.", ar: "أنا آسف، أنا متأخر." }
      ],
      dialogue: [
        { who: "A", en: "Hello! My name is Sara.", ar: "مرحباً! اسمي سارة." },
        { who: "B", en: "Hi, Sara. I am Omar.", ar: "أهلاً سارة. أنا عمر." },
        { who: "A", en: "Nice to meet you, Omar.", ar: "سعيد بلقائك يا عمر." },
        { who: "B", en: "Nice to meet you too.", ar: "سعيد بلقائك أيضاً." },
        { who: "A", en: "How are you today?", ar: "كيف حالك اليوم؟" },
        { who: "B", en: "I am fine, thank you.", ar: "أنا بخير، شكراً." }
      ]
    },
    {
      id: "a1u2",
      title: "العائلة والأشخاص",
      titleEn: "Family and People",
      icon: "👨‍👩‍👧‍👦",
      goal: "أن يتحدث المتعلم عن أفراد أسرته ويصف الأشخاص من حوله.",
      grammar: [
        {
          title: "صفات الملكية",
          explain: "<p>صفات الملكية كلمات صغيرة توضع قبل الاسم لتبين من يملك الشيء. تتغير حسب صاحب الملك لا حسب الشيء المملوك.</p><ul><li>لكل ضمير صفة ملكية واحدة.</li><li>تأتي الصفة قبل الاسم مباشرة.</li><li>لا تتغير الصفة إذا كان الاسم مفرداً أو جمعاً.</li></ul>",
          table: {
            headers: ["الضمير", "صفة الملكية", "مثال"],
            rows: [
              ["I", "my", "My father is a teacher."],
              ["You", "your", "Your sister is nice."],
              ["He", "his", "His brother is young."],
              ["She", "her", "Her mother is a doctor."],
              ["It", "its", "Its color is brown."],
              ["We", "our", "Our family is big."],
              ["They", "their", "Their son is a student."]
            ]
          },
          examples: [
            { en: "My mother is a doctor.", ar: "أمي طبيبة." },
            { en: "His brother is young.", ar: "أخوه صغير." },
            { en: "Her sister is my friend.", ar: "أختها صديقتي." },
            { en: "Our family is big.", ar: "عائلتنا كبيرة." },
            { en: "Their son is a student.", ar: "ابنهم طالب." }
          ],
          tips: [
            "ضع صفة الملكية قبل الاسم مباشرة.",
            "اختر الصفة حسب صاحب الشيء لا حسب الشيء نفسه.",
            "لا تضف أداة تعريف قبل صفة الملكية."
          ]
        },
        {
          title: "التعبير عن الملكية",
          explain: "<p>نستخدم فعل الملكية للتحدث عما نملكه من أشياء أو أفراد. له صيغتان: صيغة مع المتكلم والمخاطب والجمع، وصيغة أخرى مع المفرد الغائب.</p><ul><li>الصيغة الأولى تبقى كما هي مع أربعة ضمائر.</li><li>الصيغة الثانية خاصة بالمفرد الغائب المذكر والمؤنث وغير العاقل.</li><li>يمكن إضافة كلمة قصيرة بعد الفعل لتأكيد المعنى في الكلام اليومي.</li></ul>",
          table: {
            headers: ["الضمير", "الفعل", "مثال"],
            rows: [
              ["I", "have got", "I have got one brother."],
              ["You", "have got", "You have got a big family."],
              ["He", "has got", "He has got two sisters."],
              ["She", "has got", "She has got a nice house."],
              ["We", "have got", "We have got a small car."],
              ["They", "have got", "They have got three children."]
            ]
          },
          examples: [
            { en: "I have got one brother.", ar: "لدي أخ واحد." },
            { en: "She has got a big family.", ar: "لديها عائلة كبيرة." },
            { en: "He has got two sisters.", ar: "لديه أختان." },
            { en: "We have got a small house.", ar: "لدينا منزل صغير." },
            { en: "They have got a new car.", ar: "لديهم سيارة جديدة." }
          ],
          tips: [
            "نضيف حرف السين إلى الفعل مع المفرد الغائب.",
            "تأتي كلمة الإضافة بعد الفعل مباشرة.",
            "نستطيع استخدام الفعل وحده دون كلمة الإضافة."
          ]
        }
      ],
      vocabulary: [
        { en: "family", ar: "عائلة", pos: "noun", emoji: "👨‍👩‍👧‍👦", example: { en: "My family is small and happy.", ar: "عائلتي صغيرة وسعيدة." } },
        { en: "mother", ar: "أم", pos: "noun", emoji: "👩", example: { en: "My mother is a doctor.", ar: "أمي طبيبة." } },
        { en: "father", ar: "أب", pos: "noun", emoji: "👨", example: { en: "My father works in a bank.", ar: "أبي يعمل في مصرف." } },
        { en: "brother", ar: "أخ", pos: "noun", emoji: "👦", example: { en: "My brother is ten years old.", ar: "أخي عمره عشر سنوات." } },
        { en: "sister", ar: "أخت", pos: "noun", emoji: "👧", example: { en: "My sister likes music.", ar: "أختي تحب الموسيقى." } },
        { en: "parents", ar: "والدان", pos: "noun", emoji: "👫", example: { en: "My parents live in Cairo.", ar: "والداي يسكنان في القاهرة." } },
        { en: "son", ar: "ابن", pos: "noun", emoji: "🧒", example: { en: "My son is five years old.", ar: "ابني عمره خمس سنوات." } },
        { en: "daughter", ar: "ابنة", pos: "noun", emoji: "👧", example: { en: "Her daughter is at school.", ar: "ابنتها في المدرسة." } },
        { en: "husband", ar: "زوج", pos: "noun", emoji: "🤵", example: { en: "Her husband is a teacher.", ar: "زوجها مدرّس." } },
        { en: "wife", ar: "زوجة", pos: "noun", emoji: "👰", example: { en: "My wife is from Algeria.", ar: "زوجتي من الجزائر." } },
        { en: "boy", ar: "صبي", pos: "noun", emoji: "👦", example: { en: "The boy is very young.", ar: "الصبي صغير جداً." } },
        { en: "girl", ar: "فتاة", pos: "noun", emoji: "👧", example: { en: "The girl is my sister.", ar: "الفتاة أختي." } },
        { en: "man", ar: "رجل", pos: "noun", emoji: "🧍‍♂️", example: { en: "The man is my uncle.", ar: "الرجل عمي." } },
        { en: "woman", ar: "امرأة", pos: "noun", emoji: "🧍‍♀️", example: { en: "The woman is very kind.", ar: "المرأة لطيفة جداً." } },
        { en: "love", ar: "يحب", pos: "verb", emoji: "❤️", example: { en: "I love my family.", ar: "أحب عائلتي." } },
        { en: "live", ar: "يسكن", pos: "verb", emoji: "🏠", example: { en: "We live in a small city.", ar: "نسكن في مدينة صغيرة." } },
        { en: "young", ar: "صغير السن", pos: "adjective", emoji: "🧒", example: { en: "My sister is young and happy.", ar: "أختي صغيرة وسعيدة." } },
        { en: "old", ar: "كبير السن", pos: "adjective", emoji: "👴", example: { en: "My grandfather is old.", ar: "جدي كبير في السن." } }
      ],
      sentences: [
        { en: "This is my family photo.", ar: "هذه صورة عائلتي." },
        { en: "My mother is a doctor.", ar: "أمي طبيبة." },
        { en: "My father works in a bank.", ar: "أبي يعمل في مصرف." },
        { en: "I have two brothers and one sister.", ar: "لدي أخوان وأخت واحدة." },
        { en: "My sister is ten years old.", ar: "أختي عمرها عشر سنوات." },
        { en: "We live in a small city.", ar: "نسكن في مدينة صغيرة." },
        { en: "My grandparents live with us.", ar: "جدّاي يسكنان معنا." },
        { en: "Their son is a young boy.", ar: "ابنهم صبي صغير." },
        { en: "She loves her family very much.", ar: "تحب عائلتها كثيراً." },
        { en: "My brother has a new bike.", ar: "أخي لديه دراجة جديدة." },
        { en: "My parents are kind and happy.", ar: "والداي طيبان وسعيدان." },
        { en: "Our family is not very big.", ar: "عائلتنا ليست كبيرة جداً." }
      ],
      dialogue: [
        { who: "A", en: "Who is this in the photo?", ar: "من هذه في الصورة؟" },
        { who: "B", en: "This is my mother.", ar: "هذه أمي." },
        { who: "A", en: "And who is the young boy?", ar: "ومن هذا الصبي الصغير؟" },
        { who: "B", en: "He is my brother Omar.", ar: "إنه أخي عمر." },
        { who: "A", en: "Do you have sisters?", ar: "هل لديك أخوات؟" },
        { who: "B", en: "Yes, I have one sister.", ar: "نعم، لدي أخت واحدة." }
      ]
    },
    {
      id: "a1u3",
      title: "الأرقام والوقت والأيام",
      titleEn: "Numbers, Time and Days",
      icon: "🔢",
      goal: "أن يقرأ المتعلم الأرقام ويقول الوقت ويسأل عن الأيام.",
      grammar: [
        {
          title: "جمع الأسماء",
          explain: "<p>نعبّر عن الجمع في الإنجليزية بإضافة مقطع ثابت إلى نهاية الاسم، وبعض الأسماء لها جمع شاذ نحفظه كما هو.</p><ul><li>نضيف حرف السين إلى معظم الأسماء.</li><li>الأسماء المنتهية بأصوات قريبة من السين تأخذ مقطعاً أطول.</li><li>بعض الأسماء شاذة مثل رجل ورجال وطفل وأطفال.</li></ul>",
          table: {
            headers: ["المفرد", "الجمع", "مثال"],
            rows: [
              ["book", "books", "I have two books."],
              ["box", "boxes", "There are three boxes."],
              ["city", "cities", "We visit two cities."],
              ["family", "families", "Two families live here."],
              ["man", "men", "Two men are at the door."],
              ["child", "children", "The children are at school."]
            ]
          },
          examples: [
            { en: "I have two brothers.", ar: "لدي أخوان." },
            { en: "There are three books on the desk.", ar: "هناك ثلاثة كتب على المكتب." },
            { en: "We visit two cities every year.", ar: "نزور مدينتين كل سنة." },
            { en: "The children are in the garden.", ar: "الأطفال في الحديقة." },
            { en: "Two men are at the door.", ar: "رجلان عند الباب." },
            { en: "I need five minutes.", ar: "أحتاج خمس دقائق." }
          ],
          tips: [
            "نضيف حرف السين إلى معظم الأسماء لجمعها.",
            "الأسماء المنتهية بأصوات السين تأخذ مقطعاً أطول.",
            "احفظ الأسماء الشاذة كما هي دون إضافة."
          ]
        },
        {
          title: "حروف الجر للزمان",
          explain: "<p>نستخدم حروف جر مختلفة مع الزمن: حرف للساعة، وحرف للأيام والتواريخ، وحرف للشهور والفصول والفترات الطويلة.</p><ul><li>الحرف الأول مع الساعات واللحظات المحددة.</li><li>الحرف الثاني مع الأيام والتواريخ.</li><li>الحرف الثالث مع الشهور والفصول والسنوات.</li></ul>",
          table: {
            headers: ["الحرف", "الاستخدام", "مثال"],
            rows: [
              ["at", "الساعة واللحظة", "The class starts at eight."],
              ["on", "اليوم والتاريخ", "My birthday is on Monday."],
              ["in", "الشهر والفصل والسنة", "It is cold in January."],
              ["at", "أوقات اليوم", "I sleep at night."],
              ["on", "أيام الأسبوع", "We play on Friday."],
              ["in", "فترات طويلة", "We travel in summer."]
            ]
          },
          examples: [
            { en: "The class starts at eight.", ar: "يبدأ الدرس في الساعة الثامنة." },
            { en: "I get up at seven every day.", ar: "أستيقظ في السابعة كل يوم." },
            { en: "My birthday is on Monday.", ar: "عيد ميلادي يوم الاثنين." },
            { en: "It is very cold in January.", ar: "الجو بارد جداً في يناير." },
            { en: "We have a holiday in summer.", ar: "لدينا عطلة في الصيف." }
          ],
          tips: [
            "استخدم الحرف الأول مع الساعة.",
            "استخدم الحرف الثاني مع الأيام والتواريخ.",
            "استخدم الحرف الثالث مع الشهور والفصول والسنوات."
          ]
        }
      ],
      vocabulary: [
        { en: "number", ar: "رقم", pos: "noun", emoji: "🔢", example: { en: "My favourite number is seven.", ar: "رقمي المفضل هو سبعة." } },
        { en: "one", ar: "واحد", pos: "adjective", emoji: "1️⃣", example: { en: "I have one sister.", ar: "لدي أخت واحدة." } },
        { en: "two", ar: "اثنان", pos: "adjective", emoji: "2️⃣", example: { en: "I have two hands.", ar: "لدي يدان." } },
        { en: "three", ar: "ثلاثة", pos: "adjective", emoji: "3️⃣", example: { en: "There are three books on the desk.", ar: "هناك ثلاثة كتب على المكتب." } },
        { en: "ten", ar: "عشرة", pos: "adjective", emoji: "🔟", example: { en: "My brother is ten years old.", ar: "أخي عمره عشر سنوات." } },
        { en: "time", ar: "وقت", pos: "noun", emoji: "⏰", example: { en: "What time is it now?", ar: "كم الساعة الآن؟" } },
        { en: "clock", ar: "ساعة حائط", pos: "noun", emoji: "🕐", example: { en: "The clock is on the wall.", ar: "الساعة على الحائط." } },
        { en: "hour", ar: "ساعة زمنية", pos: "noun", emoji: "⏳", example: { en: "The film is two hours long.", ar: "الفيلم مدته ساعتان." } },
        { en: "minute", ar: "دقيقة", pos: "noun", emoji: "⏱️", example: { en: "Wait a minute, please.", ar: "انتظر دقيقة من فضلك." } },
        { en: "day", ar: "يوم", pos: "noun", emoji: "📅", example: { en: "Sunday is my favourite day.", ar: "الأحد يومي المفضل." } },
        { en: "week", ar: "أسبوع", pos: "noun", emoji: "🗓️", example: { en: "There are seven days in a week.", ar: "في الأسبوع سبعة أيام." } },
        { en: "month", ar: "شهر", pos: "noun", emoji: "📆", example: { en: "January is the first month.", ar: "يناير هو الشهر الأول." } },
        { en: "year", ar: "سنة", pos: "noun", emoji: "🎉", example: { en: "The year has twelve months.", ar: "في السنة اثنا عشر شهراً." } },
        { en: "today", ar: "اليوم", pos: "adverb", emoji: "📅", example: { en: "Today is Monday.", ar: "اليوم هو الاثنين." } },
        { en: "tomorrow", ar: "غداً", pos: "adverb", emoji: "⏭️", example: { en: "See you tomorrow morning.", ar: "أراك صباح الغد." } },
        { en: "night", ar: "ليل", pos: "noun", emoji: "🌙", example: { en: "Good night, sleep well.", ar: "تصبح على خير، نم جيداً." } }
      ],
      sentences: [
        { en: "What time is it now?", ar: "كم الساعة الآن؟" },
        { en: "It is eight o'clock.", ar: "إنها الساعة الثامنة." },
        { en: "I have three books and two pens.", ar: "لدي ثلاثة كتب وقلمان." },
        { en: "There are seven days in a week.", ar: "في الأسبوع سبعة أيام." },
        { en: "Today is Sunday, the first day.", ar: "اليوم هو الأحد، اليوم الأول." },
        { en: "My birthday is on the tenth of May.", ar: "عيد ميلادي في العاشر من مايو." },
        { en: "The class starts at nine in the morning.", ar: "يبدأ الدرس في التاسعة صباحاً." },
        { en: "We have lunch at two o'clock.", ar: "نتناول الغداء في الساعة الثانية." },
        { en: "See you tomorrow at the station.", ar: "أراك غداً في المحطة." },
        { en: "I sleep eight hours every night.", ar: "أنام ثماني ساعات كل ليلة." },
        { en: "The year has twelve months.", ar: "في السنة اثنا عشر شهراً." },
        { en: "Wait a minute, please.", ar: "انتظر دقيقة من فضلك." }
      ],
      dialogue: [
        { who: "A", en: "Excuse me, what time is it?", ar: "عفواً، كم الساعة؟" },
        { who: "B", en: "It is ten o'clock.", ar: "إنها الساعة العاشرة." },
        { who: "A", en: "Thanks. What day is it today?", ar: "شكراً. ما هو اليوم؟" },
        { who: "B", en: "Today is Monday.", ar: "اليوم هو الاثنين." },
        { who: "A", en: "And when is our class?", ar: "ومتى درسنا؟" },
        { who: "B", en: "Our class is at eleven.", ar: "درسنا في الساعة الحادية عشرة." }
      ]
    },
    {
      id: "a1u4",
      title: "الطعام والشراب",
      titleEn: "Food and Drink",
      icon: "🍽️",
      goal: "أن يعبّر المتعلم عن احتياجاته الغذائية ويطلب الطعام بلباقة.",
      grammar: [
        {
          title: "المضارع البسيط",
          explain: "<p>نستخدم المضارع البسيط للعادات اليومية والحقائق الثابتة. لا يتغير الفعل إلا مع المفرد الغائب حيث نضيف إليه حرف السين.</p><ul><li>نستعمل الصيغة الأصلية مع المتكلم والمخاطب والجمع.</li><li>نضيف حرف السين مع المفرد الغائب المذكر والمؤنث.</li><li>بعد أفعال الإعجاب يأتي الفعل الثاني بمقطع ثابت في نهايته كما في الجدول.</li></ul>",
          table: {
            headers: ["الضمير", "الفعل", "مثال"],
            rows: [
              ["I", "eat", "I eat bread every morning."],
              ["He", "eats", "He eats an apple after lunch."],
              ["She", "drinks", "She drinks milk at night."],
              ["We", "have", "We have dinner at eight."],
              ["I", "like reading", "I like reading books."],
              ["She", "likes drinking", "She likes drinking tea."]
            ]
          },
          examples: [
            { en: "I eat bread every morning.", ar: "آكل الخبز كل صباح." },
            { en: "She drinks milk at night.", ar: "تشرب الحليب في الليل." },
            { en: "He eats an apple after lunch.", ar: "يأكل تفاحة بعد الغداء." },
            { en: "We have dinner at eight.", ar: "نتعشى في الثامنة." },
            { en: "I like reading books.", ar: "أحب قراءة الكتب." },
            { en: "She likes drinking tea.", ar: "تحب شرب الشاي." }
          ],
          tips: [
            "نضيف حرف السين إلى الفعل مع المفرد الغائب.",
            "نستعمل هذا الزمن للعادات اليومية والحقائق.",
            "بعد فعل الإعجاب يأتي الفعل الثاني بمقطع ثابت في نهايته."
          ]
        },
        {
          title: "التعبير عن الكمية",
          explain: "<p>نستخدم أداتي الكمية للتحدث عن كمية غير محددة. الأولى في الجمل المثبتة، والثانية في النفي والسؤال.</p><ul><li>تأتي الأولى مع الأسماء غير المعدودة ومع الجمع.</li><li>تأتي الثانية في النفي والسؤال.</li><li>نستخدم الأولى أيضاً في العرض والطلب المؤدب.</li></ul>",
          table: {
            headers: ["الكلمة", "الاستخدام", "مثال"],
            rows: [
              ["some", "في الإثبات", "I have some bread."],
              ["any", "في النفي", "I do not have any milk."],
              ["any", "في السؤال", "Do you have any water?"],
              ["some", "في العرض والطلب", "Would you like some tea?"]
            ]
          },
          examples: [
            { en: "I have some bread and cheese.", ar: "لدي بعض الخبز والجبن." },
            { en: "There is some milk in the fridge.", ar: "هناك بعض الحليب في الثلاجة." },
            { en: "I do not have any apples.", ar: "ليس لدي أي تفاح." },
            { en: "Do you have any water?", ar: "هل لديك أي ماء؟" },
            { en: "Would you like some tea?", ar: "هل ترغب في بعض الشاي؟" }
          ],
          tips: [
            "استخدم الكلمة الأولى في الجمل المثبتة.",
            "استخدم الكلمة الثانية في النفي والسؤال.",
            "استخدم الكلمة الأولى أيضاً في الطلب والعرض المؤدب."
          ]
        }
      ],
      vocabulary: [
        { en: "food", ar: "طعام", pos: "noun", emoji: "🍽️", example: { en: "I like healthy food.", ar: "أحب الطعام الصحي." } },
        { en: "water", ar: "ماء", pos: "noun", emoji: "💧", example: { en: "I drink water every day.", ar: "أشرب الماء كل يوم." } },
        { en: "bread", ar: "خبز", pos: "noun", emoji: "🍞", example: { en: "We buy fresh bread every morning.", ar: "نشتري الخبز الطازج كل صباح." } },
        { en: "milk", ar: "حليب", pos: "noun", emoji: "🥛", example: { en: "She drinks milk at night.", ar: "تشرب الحليب في الليل." } },
        { en: "tea", ar: "شاي", pos: "noun", emoji: "🍵", example: { en: "My father drinks tea after lunch.", ar: "أبي يشرب الشاي بعد الغداء." } },
        { en: "coffee", ar: "قهوة", pos: "noun", emoji: "☕", example: { en: "I drink coffee in the morning.", ar: "أشرب القهوة في الصباح." } },
        { en: "rice", ar: "أرز", pos: "noun", emoji: "🍚", example: { en: "We eat rice with chicken.", ar: "نأكل الأرز مع الدجاج." } },
        { en: "egg", ar: "بيضة", pos: "noun", emoji: "🥚", example: { en: "I eat one egg for breakfast.", ar: "آكل بيضة واحدة في الفطور." } },
        { en: "cheese", ar: "جبن", pos: "noun", emoji: "🧀", example: { en: "This cheese is very good.", ar: "هذا الجبن جيد جداً." } },
        { en: "apple", ar: "تفاحة", pos: "noun", emoji: "🍎", example: { en: "The apple is red and sweet.", ar: "التفاحة حمراء وحلوة." } },
        { en: "banana", ar: "موزة", pos: "noun", emoji: "🍌", example: { en: "The banana is yellow.", ar: "الموزة صفراء." } },
        { en: "chicken", ar: "دجاج", pos: "noun", emoji: "🍗", example: { en: "We have chicken for dinner.", ar: "نتناول الدجاج في العشاء." } },
        { en: "eat", ar: "يأكل", pos: "verb", emoji: "🍽️", example: { en: "We eat dinner at eight.", ar: "نتعشى في الثامنة." } },
        { en: "drink", ar: "يشرب", pos: "verb", emoji: "🥤", example: { en: "I drink a lot of water.", ar: "أشرب كثيراً من الماء." } },
        { en: "hungry", ar: "جائع", pos: "adjective", emoji: "😋", example: { en: "I am hungry now.", ar: "أنا جائع الآن." } },
        { en: "breakfast", ar: "فطور", pos: "noun", emoji: "🍳", example: { en: "I have breakfast at seven.", ar: "أتناول الفطور في السابعة." } }
      ],
      sentences: [
        { en: "I am hungry and thirsty.", ar: "أنا جائع وعطشان." },
        { en: "We eat breakfast at seven.", ar: "نتناول الفطور في السابعة." },
        { en: "She drinks tea with milk.", ar: "تشرب الشاي مع الحليب." },
        { en: "My father likes black coffee.", ar: "أبي يحب القهوة السادة." },
        { en: "There is some bread on the table.", ar: "هناك بعض الخبز على الطاولة." },
        { en: "I do not like cold coffee.", ar: "لا أحب القهوة الباردة." },
        { en: "Would you like an apple?", ar: "هل ترغب في تفاحة؟" },
        { en: "We have rice and chicken for dinner.", ar: "نتناول الأرز والدجاج في العشاء." },
        { en: "He eats two eggs every morning.", ar: "يأكل بيضتين كل صباح." },
        { en: "The water is cold and clean.", ar: "الماء بارد ونظيف." },
        { en: "Please give me some water.", ar: "أعطني بعض الماء من فضلك." },
        { en: "My sister does not eat cheese.", ar: "أختي لا تأكل الجبن." }
      ],
      dialogue: [
        { who: "A", en: "I am hungry. Are you hungry too?", ar: "أنا جائع. هل أنت جائع أيضاً؟" },
        { who: "B", en: "Yes, I am very hungry.", ar: "نعم، أنا جائع جداً." },
        { who: "A", en: "What would you like to eat?", ar: "ماذا تحب أن تأكل؟" },
        { who: "B", en: "I would like some rice and chicken.", ar: "أريد بعض الأرز والدجاج." },
        { who: "A", en: "Would you like some tea?", ar: "هل ترغب في بعض الشاي؟" },
        { who: "B", en: "No, thanks. I would like some water.", ar: "لا، شكراً. أريد بعض الماء." }
      ]
    },
    {
      id: "a1u5",
      title: "المنزل والأشياء اليومية",
      titleEn: "Home and Daily Things",
      icon: "🏠",
      goal: "أن يصف المتعلم منزله وأشيائه اليومية ومواقعها في المكان.",
      grammar: [
        {
          title: "التعبير عن الوجود وأدوات التعريف",
          explain: "<p>نستخدم صيغة الوجود للقول إن شيئاً موجود في مكان ما. نختار الصيغة حسب العدد، ونضع قبل الاسم أداة تنكير أو تعريف.</p><ul><li>صيغة للمفرد وصيغة للجمع.</li><li>نضع أداة التنكير قبل الاسم المفرد المذكور أول مرة.</li><li>نضع أداة التعريف عند الحديث عن شيء معروف أو مذكور سابقاً.</li></ul>",
          table: {
            headers: ["الصيغة", "الاستخدام", "مثال"],
            rows: [
              ["There is", "شيء واحد", "There is a bed in my room."],
              ["There are", "أشياء كثيرة", "There are two windows in my room."],
              ["There is not", "نفي المفرد", "There is not a garden here."],
              ["Is there", "السؤال عن المفرد", "Is there a table in the kitchen?"],
              ["a", "قبل اسم مفرد يبدأ بحرف ساكن", "This is a chair."],
              ["an", "قبل اسم مفرد يبدأ بحرف علة", "This is an old house."],
              ["the", "لشيء معروف", "The house is very old."]
            ]
          },
          examples: [
            { en: "There is a bed in my room.", ar: "هناك سرير في غرفتي." },
            { en: "There are two windows in the kitchen.", ar: "هناك نافذتان في المطبخ." },
            { en: "Is there a bathroom near here?", ar: "هل هناك حمام قريب من هنا؟" },
            { en: "There are not any chairs in the garden.", ar: "ليس هناك أي كراسي في الحديقة." },
            { en: "This is an old house.", ar: "هذا منزل قديم." },
            { en: "The door is open.", ar: "الباب مفتوح." }
          ],
          tips: [
            "استخدم الصيغة الأولى مع المفرد والثانية مع الجمع.",
            "ضع أداة التنكير قبل الاسم المفرد المذكور أول مرة، وأداة التعريف عند إعادة ذكره.",
            "في النفي والسؤال استخدم أداة الكمية المناسبة مع الجمع."
          ]
        },
        {
          title: "حروف الجر للمكان",
          explain: "<p>حروف الجر للمكان تبين موضع الشيء. نضعها قبل الاسم للدلالة على مكانه بدقة.</p><ul><li>حرف للداخل وحرف للملامسة السطحية.</li><li>حرف لما هو أسفل شيء آخر.</li><li>عبارات مركبة للجانب والخلف والأمام.</li></ul>",
          table: {
            headers: ["الحرف", "الاستخدام", "مثال"],
            rows: [
              ["in", "داخل شيء", "The keys are in my bag."],
              ["on", "على سطح", "The book is on the table."],
              ["under", "تحت", "The cat is under the chair."],
              ["next to", "بجانب", "The lamp is next to the bed."],
              ["behind", "خلف", "The garden is behind the house."],
              ["in front of", "أمام", "The car is in front of the door."]
            ]
          },
          examples: [
            { en: "The book is on the table.", ar: "الكتاب على الطاولة." },
            { en: "My phone is in my bag.", ar: "هاتفي في حقيبتي." },
            { en: "The cat is under the chair.", ar: "القطة تحت الكرسي." },
            { en: "The lamp is next to my bed.", ar: "المصباح بجانب سريري." },
            { en: "The garden is behind the house.", ar: "الحديقة خلف المنزل." },
            { en: "The car is in front of the door.", ar: "السيارة أمام الباب." }
          ],
          tips: [
            "استخدم الحرف الأول للداخل والحرف الثاني للملامسة السطحية.",
            "استخدم الحرف الثالث لما هو أسفل شيء آخر.",
            "استخدم العبارات المركبة للموضع الجانبي والخلفي والأمامي."
          ]
        }
      ],
      vocabulary: [
        { en: "house", ar: "منزل", pos: "noun", emoji: "🏠", example: { en: "Our house is big and clean.", ar: "منزلنا كبير ونظيف." } },
        { en: "room", ar: "غرفة", pos: "noun", emoji: "🚪", example: { en: "My room is small but nice.", ar: "غرفتي صغيرة لكنها جميلة." } },
        { en: "door", ar: "باب", pos: "noun", emoji: "🚪", example: { en: "Please close the door.", ar: "أغلق الباب من فضلك." } },
        { en: "window", ar: "نافذة", pos: "noun", emoji: "🪟", example: { en: "Open the window, please.", ar: "افتح النافذة من فضلك." } },
        { en: "table", ar: "طاولة", pos: "noun", emoji: "🪑", example: { en: "The keys are on the table.", ar: "المفاتيح على الطاولة." } },
        { en: "chair", ar: "كرسي", pos: "noun", emoji: "💺", example: { en: "This chair is very comfortable.", ar: "هذا الكرسي مريح جداً." } },
        { en: "bed", ar: "سرير", pos: "noun", emoji: "🛏️", example: { en: "My bed is next to the window.", ar: "سريري بجانب النافذة." } },
        { en: "kitchen", ar: "مطبخ", pos: "noun", emoji: "🍳", example: { en: "My mother is in the kitchen.", ar: "أمي في المطبخ." } },
        { en: "bathroom", ar: "حمام", pos: "noun", emoji: "🚿", example: { en: "The bathroom is next to my room.", ar: "الحمام بجانب غرفتي." } },
        { en: "garden", ar: "حديقة", pos: "noun", emoji: "🌳", example: { en: "We have a small garden.", ar: "لدينا حديقة صغيرة." } },
        { en: "key", ar: "مفتاح", pos: "noun", emoji: "🔑", example: { en: "Where is my key?", ar: "أين مفتاحي؟" } },
        { en: "book", ar: "كتاب", pos: "noun", emoji: "📖", example: { en: "This book is very interesting.", ar: "هذا الكتاب ممتع جداً." } },
        { en: "phone", ar: "هاتف", pos: "noun", emoji: "📱", example: { en: "My phone is on the table.", ar: "هاتفي على الطاولة." } },
        { en: "lamp", ar: "مصباح", pos: "noun", emoji: "💡", example: { en: "Please turn on the lamp.", ar: "أشعل المصباح من فضلك." } },
        { en: "clean", ar: "ينظّف", pos: "verb", emoji: "🧹", example: { en: "I clean my room every day.", ar: "أنظّف غرفتي كل يوم." } },
        { en: "sleep", ar: "ينام", pos: "verb", emoji: "😴", example: { en: "I sleep eight hours every night.", ar: "أنام ثماني ساعات كل ليلة." } }
      ],
      sentences: [
        { en: "My house has three rooms.", ar: "منزلي فيه ثلاث غرف." },
        { en: "There is a big window in my room.", ar: "هناك نافذة كبيرة في غرفتي." },
        { en: "The kitchen is next to the bathroom.", ar: "المطبخ بجانب الحمام." },
        { en: "My keys are on the table.", ar: "مفاتيحي على الطاولة." },
        { en: "Please close the door.", ar: "أغلق الباب من فضلك." },
        { en: "I clean my room every morning.", ar: "أنظّف غرفتي كل صباح." },
        { en: "The cat is under the bed.", ar: "القطة تحت السرير." },
        { en: "We have a small garden behind the house.", ar: "لدينا حديقة صغيرة خلف المنزل." },
        { en: "My phone is in my bag.", ar: "هاتفي في حقيبتي." },
        { en: "This chair is very comfortable.", ar: "هذا الكرسي مريح جداً." },
        { en: "There are two lamps in the room.", ar: "هناك مصباحان في الغرفة." },
        { en: "I sleep eight hours every night.", ar: "أنام ثماني ساعات كل ليلة." }
      ],
      dialogue: [
        { who: "A", en: "Where is my phone?", ar: "أين هاتفي؟" },
        { who: "B", en: "It is on the table.", ar: "إنه على الطاولة." },
        { who: "A", en: "And where are my keys?", ar: "وأين مفاتيحي؟" },
        { who: "B", en: "They are in your bag.", ar: "إنها في حقيبتك." },
        { who: "A", en: "Is there a lamp in my room?", ar: "هل هناك مصباح في غرفتي؟" },
        { who: "B", en: "Yes, there is a small lamp next to the bed.", ar: "نعم، هناك مصباح صغير بجانب السرير." }
      ]
    },
    {
      id: "a1u6",
      title: "الألوان والملابس والأماكن",
      titleEn: "Colors, Clothes and Places",
      icon: "🎨",
      goal: "أن يصف المتعلم الألوان والملابس ويتحدث عن الأماكن من حوله.",
      grammar: [
        {
          title: "المضارع المستمر",
          explain: "<p>نستخدم المضارع المستمر للحديث عن حدث يجري في هذه اللحظة. نكوّن الجملة من فعل الكينونة ثم الفعل الأساسي مضافاً إليه مقطع ثابت في نهايته.</p><ul><li>نختار صيغة فعل الكينونة المناسبة للضمير.</li><li>نضيف المقطع الثابت إلى الفعل الأساسي.</li><li>نستخدم هذا الزمن مع الكلمات الدالة على اللحظة الحاضرة.</li></ul>",
          table: {
            headers: ["الضمير", "الصيغة", "مثال"],
            rows: [
              ["I", "am wearing", "I am wearing a red shirt."],
              ["You", "are wearing", "You are wearing new shoes."],
              ["He", "is wearing", "He is wearing a black jacket."],
              ["She", "is wearing", "She is wearing a beautiful dress."],
              ["We", "are buying", "We are buying fruit now."],
              ["They", "are playing", "They are playing in the park."]
            ]
          },
          examples: [
            { en: "I am wearing a red shirt.", ar: "أنا أرتدي قميصاً أحمر." },
            { en: "She is wearing a beautiful dress.", ar: "هي ترتدي فستاناً جميلاً." },
            { en: "They are playing in the park now.", ar: "هم يلعبون في الحديقة الآن." },
            { en: "We are buying bread now.", ar: "نحن نشتري الخبز الآن." },
            { en: "He is not working today.", ar: "هو لا يعمل اليوم." },
            { en: "What are you doing?", ar: "ماذا تفعل؟" }
          ],
          tips: [
            "ابدأ الجملة بضمير الفاعل ثم فعل الكينونة ثم الفعل الأساسي.",
            "لا تنسَ المقطع الثابت في نهاية الفعل الأساسي.",
            "استخدم هذا الزمن للأحداث الجارية الآن، لا للعادات."
          ]
        },
        {
          title: "التعبير عن القدرة والطلب",
          explain: "<p>نستخدم هذا الفعل المساعد للحديث عن القدرة وإمكانية القيام بشيء، وكذلك للطلب المؤدب. يأتي بعده الفعل في صورته الأصلية دون أي إضافة.</p><ul><li>لا يتغير شكله مع الضمائر كلها.</li><li>يأتي بعده الفعل دون أي إضافة.</li><li>نضيف كلمة النفي بعده لنفي القدرة.</li></ul>",
          table: {
            headers: ["الصيغة", "الاستخدام", "مثال"],
            rows: [
              ["can", "القدرة", "I can swim very well."],
              ["can", "القدرة", "She can cook very well."],
              ["can not", "عدم القدرة", "He can not come today."],
              ["Can ...?", "السؤال", "Can you help me?"],
              ["Can I ...?", "الطلب المؤدب", "Can I have some water?"]
            ]
          },
          examples: [
            { en: "I can speak three languages.", ar: "أستطيع التحدث بثلاث لغات." },
            { en: "She can cook very well.", ar: "تستطيع الطبخ جيداً جداً." },
            { en: "Can you help me, please?", ar: "هل يمكنك مساعدتي من فضلك؟" },
            { en: "Can I have this shirt, please?", ar: "هل يمكنني أخذ هذا القميص من فضلك؟" },
            { en: "He can not come today.", ar: "لا يستطيع المجيء اليوم." }
          ],
          tips: [
            "يبقى الفعل المساعد نفسه مع جميع الضمائر.",
            "يأتي الفعل بعده في صورته الأصلية دائماً.",
            "استخدمه للسؤال المؤدب والطلب في المتجر."
          ]
        }
      ],
      vocabulary: [
        { en: "color", ar: "لون", pos: "noun", emoji: "🎨", example: { en: "Blue is my favourite color.", ar: "الأزرق لوني المفضل." } },
        { en: "red", ar: "أحمر", pos: "adjective", emoji: "🔴", example: { en: "My bag is red.", ar: "حقيبتي حمراء." } },
        { en: "blue", ar: "أزرق", pos: "adjective", emoji: "🔵", example: { en: "The sky is blue today.", ar: "السماء زرقاء اليوم." } },
        { en: "green", ar: "أخضر", pos: "adjective", emoji: "🟢", example: { en: "The trees are green in spring.", ar: "الأشجار خضراء في الربيع." } },
        { en: "black", ar: "أسود", pos: "adjective", emoji: "⚫", example: { en: "He has a black car.", ar: "لديه سيارة سوداء." } },
        { en: "white", ar: "أبيض", pos: "adjective", emoji: "⚪", example: { en: "My shirt is white.", ar: "قميصي أبيض." } },
        { en: "shirt", ar: "قميص", pos: "noun", emoji: "👕", example: { en: "This shirt is very nice.", ar: "هذا القميص جميل جداً." } },
        { en: "dress", ar: "فستان", pos: "noun", emoji: "👗", example: { en: "Her dress is beautiful.", ar: "فستانها جميل." } },
        { en: "shoes", ar: "حذاء", pos: "noun", emoji: "👟", example: { en: "My shoes are new.", ar: "حذائي جديد." } },
        { en: "jacket", ar: "سترة", pos: "noun", emoji: "🧥", example: { en: "I wear a jacket in winter.", ar: "أرتدي سترة في الشتاء." } },
        { en: "wear", ar: "يرتدي", pos: "verb", emoji: "🧥", example: { en: "I wear a blue shirt to school.", ar: "أرتدي قميصاً أزرق في المدرسة." } },
        { en: "market", ar: "سوق", pos: "noun", emoji: "🏬", example: { en: "We buy fruit at the market.", ar: "نشتري الفاكهة من السوق." } },
        { en: "shop", ar: "متجر", pos: "noun", emoji: "🏪", example: { en: "The shop is open now.", ar: "المتجر مفتوح الآن." } },
        { en: "park", ar: "منتزه", pos: "noun", emoji: "🌳", example: { en: "The children play in the park.", ar: "الأطفال يلعبون في المنتزه." } },
        { en: "street", ar: "شارع", pos: "noun", emoji: "🛣️", example: { en: "Our street is very quiet.", ar: "شارعنا هادئ جداً." } },
        { en: "buy", ar: "يشتري", pos: "verb", emoji: "🛒", example: { en: "I want to buy a new shirt.", ar: "أريد شراء قميص جديد." } }
      ],
      sentences: [
        { en: "My favourite color is blue.", ar: "لوني المفضل هو الأزرق." },
        { en: "She is wearing a red dress today.", ar: "هي ترتدي فستاناً أحمر اليوم." },
        { en: "These shoes are new and white.", ar: "هذا الحذاء جديد وأبيض." },
        { en: "He is buying a black jacket.", ar: "هو يشتري سترة سوداء." },
        { en: "We are going to the market now.", ar: "نحن ذاهبون إلى السوق الآن." },
        { en: "The park is next to our street.", ar: "المنتزه بجانب شارعنا." },
        { en: "Can you help me, please?", ar: "هل يمكنك مساعدتي من فضلك؟" },
        { en: "I can wear this shirt to school.", ar: "أستطيع ارتداء هذا القميص في المدرسة." },
        { en: "The shop is closed on Sunday.", ar: "المتجر مغلق يوم الأحد." },
        { en: "I want to buy some bread.", ar: "أريد شراء بعض الخبز." },
        { en: "Her dress is green and beautiful.", ar: "فستانها أخضر وجميل." },
        { en: "They are playing in the park.", ar: "هم يلعبون في المنتزه." }
      ],
      dialogue: [
        { who: "A", en: "Hello! Can I help you?", ar: "مرحباً! هل يمكنني مساعدتك؟" },
        { who: "B", en: "Yes, I want to buy a shirt.", ar: "نعم، أريد شراء قميص." },
        { who: "A", en: "What color would you like?", ar: "ما اللون الذي تريده؟" },
        { who: "B", en: "I would like a blue shirt, please.", ar: "أريد قميصاً أزرق من فضلك." },
        { who: "A", en: "Here you are. It is very nice.", ar: "تفضل. إنه جميل جداً." },
        { who: "B", en: "Thank you. How much is it?", ar: "شكراً. كم ثمنه؟" }
      ]
    }
  ]
};

const A1_UNIT_ENRICHMENT = {
  a1u1: {
    phonetics: [
      { id: "hello", en: "hello", ipa: "/həˈləʊ/", ar: "مرحباً", contrastPairs: [{ en: "he / hi", ar: "ميّز /ɪ/ القصيرة عن /iː/ الطويلة." }], connectedSpeech: [{ en: "Nice to meet you.", ar: "اربط الكلمات بسلاسة مع إبقاء كل كلمة واضحة." }], intonation: [{ en: "How are you? ↗", ar: "تنغيم صاعد في السؤال الودّي القصير." }] },
      { id: "name", en: "name", ipa: "/neɪm/", ar: "اسم", contrastPairs: [{ en: "name / nine", ar: "لاحظ اختلاف الحركة والنهاية /m/ و/n/." }], connectedSpeech: [{ en: "My name is Ali.", ar: "قد يضعف صوت is في الكلام المتصل، لكنه لا يُحذف." }], intonation: [{ en: "My name is Sara. ↘", ar: "تنغيم هابط عند إكمال المعلومة." }] },
    ],
    arabic_l1_transfers: [
      { id: "copula", incorrect: "I student.", corrected: "I am a student.", pattern: "حذف فعل الكينونة", explanationAr: "قد تُحذف الرابطة في العربية، لكن الإنجليزية تحتاج am/is/are، ويحتاج الاسم المفرد المعدود غالباً a/an." },
      { id: "subject", incorrect: "My name, it is Ali.", corrected: "My name is Ali.", pattern: "تكرار الفاعل اسماً وضميراً", explanationAr: "اذكر الفاعل مرة واحدة في الجملة الإنجليزية المحايدة." },
    ],
    academic_focus: [
      { id: "introduce", term: "introduce", meaningAr: "يقدّم شخصاً أو يعرّف بنفسه", example: { en: "I would like to introduce my classmate.", ar: "أود أن أقدّم زميلي في الصف." }, paraphrasing: [{ original: "This is my friend Ali.", paraphrase: "Let me introduce my friend, Ali." }] },
      { id: "detail", term: "detail", meaningAr: "معلومة أو تفصيل", example: { en: "My name and country are details about me.", ar: "اسمي وبلدي معلومتان عني." }, readingAnalysis: [{ term: "personal information", meaningAr: "معلومات التعريف الأساسية بالشخص" }] },
    ],
    vocabulary: {
      hello: { collocations: [{ en: "say hello", ar: "يلقي التحية", example: { en: "Please say hello to your teacher.", ar: "ألقِ التحية على معلمك من فضلك." } }] },
      meet: { collocations: [{ en: "meet a friend", ar: "يلتقي صديقاً" }] },
    },
  },
  a1u2: {
    phonetics: [
      { id: "family", en: "family", ipa: "/ˈfæməli/", ar: "عائلة", contrastPairs: [{ en: "man / men", ar: "ميّز /æ/ في man عن /e/ في men." }], connectedSpeech: [{ en: "My mother is kind.", ar: "اربط mother is بخفة دون حذف is." }], intonation: [{ en: "Is she your sister? ↗", ar: "تنغيم صاعد في سؤال نعم/لا." }] },
      { id: "brother", en: "brother", ipa: "/ˈbrʌðə(r)/", ar: "أخ", contrastPairs: [{ en: "three / tree", ar: "ابدأ /θ/ بوضع اللسان قرب الأسنان ولا تستبدله بـ/t/." }], connectedSpeech: [{ en: "This is my brother.", ar: "تجنب إدخال حركة بين this وis." }], intonation: [{ en: "He is very kind. ↘", ar: "تنغيم هابط في الجملة الخبرية." }] },
    ],
    arabic_l1_transfers: [
      { id: "possessive", incorrect: "the my sister", corrected: "my sister", pattern: "جمع أداة التعريف وصفة الملكية", explanationAr: "صفة الملكية my تحدد صاحب الاسم، فلا تسبقها the." },
      { id: "repeated-subject", incorrect: "My father, he is a doctor.", corrected: "My father is a doctor.", pattern: "تكرار الفاعل", explanationAr: "يكفي الاسم فاعلاً؛ لا تكرره بضمير he في الجملة المحايدة." },
    ],
    academic_focus: [
      { id: "member", term: "member", meaningAr: "فرد أو عضو في مجموعة", example: { en: "Each member of my family has a role.", ar: "لكل فرد في عائلتي دور." }, paraphrasing: [{ original: "My family has five people.", paraphrase: "There are five members in my family." }] },
      { id: "similar", term: "similar", meaningAr: "متشابه", example: { en: "The two sisters have similar interests.", ar: "للأختين اهتمامات متشابهة." }, readingAnalysis: [{ term: "description", meaningAr: "وصف صفات الشخص أو المجموعة" }] },
    ],
    vocabulary: { family: { collocations: [{ en: "close family", ar: "عائلة مترابطة" }] }, live: { collocations: [{ en: "live with", ar: "يعيش مع" }] } },
  },
  a1u3: {
    phonetics: [
      { id: "three", en: "three", ipa: "/θriː/", ar: "ثلاثة", contrastPairs: [{ en: "three / tree", ar: "ميّز /θ/ عن /t/ ولا تحوّل th إلى تاء." }], connectedSpeech: [{ en: "three o'clock", ar: "اربط العدد بعبارة الوقت من دون وقفة طويلة." }], intonation: [{ en: "What time is it? ↘", ar: "تنغيم هابط شائع في سؤال أداة الاستفهام." }] },
      { id: "day", en: "day", ipa: "/deɪ/", ar: "يوم", contrastPairs: [{ en: "day / they", ar: "ميّز /d/ عن /ð/ في بداية الكلمة." }], connectedSpeech: [{ en: "on Monday at eight", ar: "اربط on بـMonday مع إبقاء حرف الجر مسموعاً." }], intonation: [{ en: "Is it Friday today? ↗", ar: "تنغيم صاعد في سؤال نعم/لا." }] },
    ],
    arabic_l1_transfers: [
      { id: "plural", incorrect: "two book", corrected: "two books", pattern: "نسيان علامة الجمع", explanationAr: "يأتي الاسم المعدود جمعاً بعد الأعداد الأكبر من واحد." },
      { id: "weekday-preposition", incorrect: "in Monday", corrected: "on Monday", pattern: "نقل حرف الجر حرفياً", explanationAr: "تُستخدم on مع أيام الأسبوع، وat مع وقت الساعة المحدد مثل at six." },
    ],
    academic_focus: [
      { id: "period", term: "period", meaningAr: "فترة زمنية", example: { en: "A week is a period of seven days.", ar: "الأسبوع فترة من سبعة أيام." }, paraphrasing: [{ original: "The lesson lasts 60 minutes.", paraphrase: "The lesson lasts one hour." }] },
      { id: "data", term: "data", meaningAr: "بيانات أو معلومات", example: { en: "The table shows the class times.", ar: "يعرض الجدول أوقات الصف." }, readingAnalysis: [{ term: "table", meaningAr: "جدول ينظم البيانات في صفوف وأعمدة" }] },
    ],
    vocabulary: { time: { collocations: [{ en: "tell the time", ar: "يقرأ الساعة" }] } },
  },
  a1u4: {
    phonetics: [
      { id: "egg", en: "egg", ipa: "/eɡ/", ar: "بيضة", contrastPairs: [{ en: "pen / pan", ar: "ميّز /e/ في pen عن /æ/ في pan." }], connectedSpeech: [{ en: "an apple", ar: "اربط an بالكلمة التالية دون فصل مصطنع." }], intonation: [{ en: "Would you like some tea? ↘", ar: "غالباً ينخفض الصوت في العرض المهذب." }] },
      { id: "rice", en: "rice", ipa: "/raɪs/", ar: "أرز", contrastPairs: [{ en: "rice / rise", ar: "ميّز /s/ المهموسة عن /z/ المجهورة." }], connectedSpeech: [{ en: "I eat rice every day.", ar: "حافظ على نهايات الكلمات عند وصل الجملة." }], intonation: [{ en: "Tea or coffee? ↘↗", ar: "قد يرتفع الصوت عند الخيار الأول ويهبط عند الأخير." }] },
    ],
    arabic_l1_transfers: [
      { id: "article", incorrect: "I eat apple.", corrected: "I eat an apple.", pattern: "حذف أداة التنكير", explanationAr: "الاسم المفرد المعدود يحتاج عادةً a أو an إذا لم يكن محدداً." },
      { id: "uncountable", incorrect: "two breads", corrected: "two pieces of bread", pattern: "جمع اسم غير معدود", explanationAr: "bread غير معدود بهذا المعنى؛ استخدم وحدة مثل pieces of bread." },
    ],
    academic_focus: [
      { id: "category", term: "category", meaningAr: "فئة أو تصنيف", example: { en: "Fruit is a food category.", ar: "الفاكهة فئة من الطعام." }, paraphrasing: [{ original: "Apples and bananas are fruit.", paraphrase: "Apples and bananas belong to the fruit category." }] },
      { id: "process", term: "process", meaningAr: "عملية أو خطوات متتابعة", example: { en: "Making a sandwich is a simple process.", ar: "إعداد شطيرة عملية بسيطة." }, readingAnalysis: [{ term: "sequence", meaningAr: "ترتيب الخطوات حسب حدوثها" }] },
    ],
    vocabulary: { water: { collocations: [{ en: "a glass of water", ar: "كوب من الماء" }] } },
  },
  a1u5: {
    phonetics: [
      { id: "room", en: "room", ipa: "/ruːm/", ar: "غرفة", contrastPairs: [{ en: "room / broom", ar: "لاحظ /r/ في مقابل مجموعة الأصوات /br/." }], connectedSpeech: [{ en: "There is a lamp.", ar: "اربط there is بسلاسة مع وضوح is." }], intonation: [{ en: "Is there a garden? ↗", ar: "تنغيم صاعد في سؤال نعم/لا." }] },
      { id: "chair", en: "chair", ipa: "/tʃeə(r)/", ar: "كرسي", contrastPairs: [{ en: "chair / share", ar: "ميّز الصوت المركب /tʃ/ عن /ʃ/." }], connectedSpeech: [{ en: "a chair in the room", ar: "لا تضف حركة بين حرف الجر والاسم التالي." }], intonation: [{ en: "The keys are on the table. ↘", ar: "تنغيم هابط في وصف المكان." }] },
    ],
    arabic_l1_transfers: [
      { id: "existence", incorrect: "In my room a bed.", corrected: "There is a bed in my room.", pattern: "نقل ترتيب الجملة الاسمية", explanationAr: "استخدم There is/are لتقديم وجود الشيء، ثم اذكر مكانه." },
      { id: "place-preposition", incorrect: "The book is in the table.", corrected: "The book is on the table.", pattern: "الخلط بين حروف الجر المكانية", explanationAr: "on لسطح الشيء، وin لما بداخله؛ اختر وفق العلاقة المكانية." },
    ],
    academic_focus: [
      { id: "location", term: "location", meaningAr: "موقع أو مكان", example: { en: "The map shows the location of the rooms.", ar: "تعرض الخريطة مواقع الغرف." }, paraphrasing: [{ original: "The lamp is next to the bed.", paraphrase: "The lamp is beside the bed." }] },
      { id: "function", term: "function", meaningAr: "وظيفة أو غرض", example: { en: "A key has the function of opening a lock.", ar: "وظيفة المفتاح فتح القفل." }, readingAnalysis: [{ term: "label", meaningAr: "تسمية عنصر في مخطط أو رسم" }] },
    ],
    vocabulary: { house: { collocations: [{ en: "at home", ar: "في المنزل" }] } },
  },
  a1u6: {
    phonetics: [
      { id: "shirt", en: "shirt", ipa: "/ʃɜːt/", ar: "قميص", contrastPairs: [{ en: "sheep / ship", ar: "ميّز /iː/ الطويلة عن /ɪ/ القصيرة." }], connectedSpeech: [{ en: "She is wearing a shirt.", ar: "تُوصل she is وقد تختصر إلى she's في الحديث." }], intonation: [{ en: "What are you wearing? ↘", ar: "تنغيم هابط شائع في سؤال أداة الاستفهام." }] },
      { id: "green", en: "green", ipa: "/ɡriːn/", ar: "أخضر", contrastPairs: [{ en: "green / clean", ar: "ميّز /ɡ/ المجهورة عن /k/ المهموسة." }], connectedSpeech: [{ en: "a green jacket", ar: "اربط أداة التنكير بالصفة دون إضافة مقطع." }], intonation: [{ en: "Are they new shoes? ↗", ar: "تنغيم صاعد في سؤال نعم/لا." }] },
    ],
    arabic_l1_transfers: [
      { id: "adjective-order", incorrect: "a shirt blue", corrected: "a blue shirt", pattern: "وضع الصفة بعد الاسم", explanationAr: "تأتي الصفة عادةً قبل الاسم في الإنجليزية." },
      { id: "clothing-article", incorrect: "I am wearing red jacket.", corrected: "I am wearing a red jacket.", pattern: "حذف أداة الاسم المفرد المعدود", explanationAr: "أضف a/an قبل الصفة والاسم المفرد المعدود غير المحدد." },
    ],
    academic_focus: [
      { id: "describe", term: "describe", meaningAr: "يصف بذكر الصفات", example: { en: "Describe the colors in the picture.", ar: "صِف الألوان في الصورة." }, paraphrasing: [{ original: "The park is large and green.", paraphrase: "It is a spacious park with green grass." }] },
      { id: "feature", term: "feature", meaningAr: "صفة أو خاصية مميزة", example: { en: "Color is one feature of the jacket.", ar: "اللون إحدى خصائص السترة." }, readingAnalysis: [{ term: "visual detail", meaningAr: "تفصيل يمكن ملاحظته في صورة أو مشهد" }] },
    ],
    vocabulary: { wear: { collocations: [{ en: "wear a uniform", ar: "يرتدي زياً موحداً" }] } },
  },
};

for (const unit of LEVEL_A1.units) {
  const enrichment = A1_UNIT_ENRICHMENT[unit.id];
  Object.assign(unit, {
    phonetics: enrichment.phonetics,
    arabic_l1_transfers: enrichment.arabic_l1_transfers,
    academic_focus: enrichment.academic_focus,
  });
  for (const word of unit.vocabulary) {
    const addition = enrichment.vocabulary[word.en];
    if (addition) Object.assign(word, addition);
  }
}

for (const unit of LEVEL_A1.units.filter((item) => A1_UNIT_ENRICHMENT[item.id])) {
  unit.academic_focus = [
    { term: 'word', meaningAr: 'كلمة', example: { en: 'Write the new word.', ar: 'اكتب الكلمة الجديدة.' } },
    { term: 'sentence', meaningAr: 'جملة', example: { en: 'Read the sentence aloud.', ar: 'اقرأ الجملة بصوت مسموع.' } },
  ];
}

const FOUNDATION_UNIT_DETAILS = {
  family: {
    title: 'الأشخاص والجسم: الكلمات الأولى', titleEn: 'First Words: People and the Body', icon: '👨‍👩‍👧',
    goal: 'أن يسمّي المتعلم أفراد العائلة والأشخاص وأجزاء الجسم الأساسية.',
    grammar: 'استخدم this is للتعريف بشخص أو جزء من الجسم، وthese are للتعريف بأكثر من شخص.',
    example: { en: 'This is my mother.', ar: 'هذه أمي.' },
    phonetics: { en: 'mother', ipa: '/ˈmʌðə/', ar: 'أم', pair: 'mother / brother', tip: 'انتبه إلى اختلاف الحركة الأولى بين الكلمتين.' },
    transfer: { incorrect: 'This is my parents.', corrected: 'These are my parents.', explanationAr: 'استخدم صيغة الجمع these are عند الحديث عن الوالدين.' },
  },
  body: {
    title: 'الجسم والصحة: الكلمات الأولى', titleEn: 'First Words: Body and Health', icon: '💪',
    goal: 'أن يسمّي المتعلم أجزاء الجسم الأساسية وبعض الأشخاص المرتبطين بالصحة.',
    grammar: 'استخدم my قبل اسم الجزء الذي تتحدث عنه.',
    example: { en: 'My head hurts.', ar: 'رأسي يؤلمني.' },
    phonetics: { en: 'head', ipa: '/hed/', ar: 'رأس', pair: 'head / hand', tip: 'ميّز بين الحركة القصيرة /e/ في head وبين /æ/ في hand.' },
    transfer: { incorrect: 'My head is hurt.', corrected: 'My head hurts.', explanationAr: 'لوصف الألم المعتاد نقول إن الجزء يؤلمنا: My head hurts.' },
  },
  food: {
    title: 'الطعام والألوان: الكلمات الأولى', titleEn: 'First Words: Food and Colors', icon: '🍎',
    goal: 'أن يسمّي المتعلم أطعمة ومشروبات وألواناً وأشكالاً أساسية.',
    grammar: 'استخدم I like مع الطعام، وضع اللون قبل الاسم عند وصف شيء.',
    example: { en: 'I like bread and cheese.', ar: 'أحب الخبز والجبن.' },
    phonetics: { en: 'fish', ipa: '/fɪʃ/', ar: 'سمك', pair: 'fan / van', tip: 'ميّز /f/ المهموس عن /v/ المجهور.' },
    transfer: { incorrect: 'I like the tea.', corrected: 'I like tea.', explanationAr: 'عند الحديث عن الشاي عموماً لا نحتاج عادةً إلى the.' },
  },
  colors: {
    title: 'الألوان والأشكال: الكلمات الأولى', titleEn: 'First Words: Colors and Shapes', icon: '🎨',
    goal: 'أن يسمّي المتعلم ألواناً وأشكالاً أساسية.',
    grammar: 'تأتي الصفة اللونية قبل الاسم في الإنجليزية.',
    example: { en: 'It is a red circle.', ar: 'إنها دائرة حمراء.' },
    phonetics: { en: 'red', ipa: '/red/', ar: 'أحمر', pair: 'red / read (past)', tip: 'في صيغة الماضي، read تُنطق مثل red؛ والسياق يوضح المعنى.' },
    transfer: { incorrect: 'a car red', corrected: 'a red car', explanationAr: 'تأتي الصفة قبل الاسم في الإنجليزية.' },
  },
  animals: {
    title: 'الحيوانات: الكلمات الأولى', titleEn: 'First Words: Animals', icon: '🐾',
    goal: 'أن يسمّي المتعلم حيوانات مألوفة.',
    grammar: 'استخدم a قبل اسم الحيوان المفرد الذي يبدأ بصوت ساكن.',
    example: { en: 'I see a cat.', ar: 'أرى قطة.' },
    phonetics: { en: 'cat', ipa: '/kæt/', ar: 'قطة', pair: 'cat / cut', tip: 'ميّز /æ/ في cat عن /ʌ/ في cut.' },
    transfer: { incorrect: 'I have cat.', corrected: 'I have a cat.', explanationAr: 'يحتاج الاسم المفرد المعدود غالباً إلى a أو an.' },
  },
  school: {
    title: 'المدرسة: الكلمات الأولى', titleEn: 'First Words: School', icon: '🏫',
    goal: 'أن يسمّي المتعلم أدوات وأشخاصاً وأعمالاً مدرسية أساسية.',
    grammar: 'استخدم this is لتسمية شيء قريب، وmy لبيان أنه يخصك.',
    example: { en: 'This is my pen.', ar: 'هذا قلمي.' },
    phonetics: { en: 'pen', ipa: '/pen/', ar: 'قلم', pair: 'pen / pan', tip: 'ميّز /e/ القصيرة عن /æ/ في pan.' },
    transfer: { incorrect: 'I in school.', corrected: 'I am at school.', explanationAr: 'تحتاج الجملة الإنجليزية إلى فعل، ونستخدم at school للحديث عن الوجود في المدرسة.' },
  },
  home: {
    title: 'المنزل والأفعال اليومية: الكلمات الأولى', titleEn: 'First Words: Home and Everyday Verbs', icon: '🏠',
    goal: 'أن يسمّي المتعلم أشياء المنزل ويستخدم أفعالاً يومية شائعة.',
    grammar: 'ابدأ الجملة بضمير الفاعل ثم الفعل، واستخدم in أو on لوصف المكان.',
    example: { en: 'My book is on the table.', ar: 'كتابي على الطاولة.' },
    phonetics: { en: 'house', ipa: '/haʊs/', ar: 'منزل', pair: 'house / horse', tip: 'انتبه إلى اختلاف الحركة في الكلمتين.' },
    transfer: { incorrect: 'The book is in the table.', corrected: 'The book is on the table.', explanationAr: 'استخدم on عندما يكون الشيء فوق سطح الطاولة.' },
  },
  verbs: {
    title: 'أفعال يومية: الكلمات الأولى', titleEn: 'First Words: Everyday Verbs', icon: '🏃',
    goal: 'أن يستخدم المتعلم أفعالاً يومية شائعة في جمل قصيرة.',
    grammar: 'ابدأ الجملة بضمير الفاعل ثم الفعل بصيغته الأساسية مع I.',
    example: { en: 'I read every day.', ar: 'أقرأ كل يوم.' },
    phonetics: { en: 'read', ipa: '/riːd/', ar: 'يقرأ', pair: 'read / red', tip: 'في المضارع تُنطق read /riːd/، وتُنطق red /red/.' },
    transfer: { incorrect: 'Study English every day.', corrected: 'I study English every day.', explanationAr: 'اذكر ضمير الفاعل في الجملة الإنجليزية العادية.' },
  },
};

function foundationExample(groupId, word) {
  if (groupId === 'family') {
    const familySubjects = {
      mother: 'أمي', father: 'أبي', sister: 'أختي', brother: 'أخي',
      grandmother: 'جدتي', grandfather: 'جدي', son: 'ابني', daughter: 'ابنتي',
      baby: 'طفلي الصغير', family: 'عائلتي', parents: 'والداي', wife: 'زوجتي',
      husband: 'زوجي', aunt: 'عمتي', uncle: 'عمي',
    };
    return word.en === 'parents'
      ? { en: 'My parents are here.', ar: 'والداي هنا.' }
      : { en: `My ${word.en} is here.`, ar: `${familySubjects[word.en] || word.ar} هنا.` };
  }
  if (groupId === 'body') {
    const bodyExamples = {
      head: ['I wash my head.', 'أغسل رأسي.'],
      eye: ['I wash my eye.', 'أغسل عيني.'],
      ear: ['I wash my ear.', 'أغسل أذني.'],
      nose: ['I wash my nose.', 'أغسل أنفي.'],
      mouth: ['I wash my mouth.', 'أغسل فمي.'],
      hand: ['I wash my hand.', 'أغسل يدي.'],
      foot: ['I wash my foot.', 'أغسل قدمي.'],
      hair: ['I wash my hair.', 'أغسل شعري.'],
      tooth: ['I brush my tooth.', 'أنظف سني بالفرشاة.'],
      face: ['I wash my face.', 'أغسل وجهي.'],
      arm: ['I wash my arm.', 'أغسل ذراعي.'],
      leg: ['I wash my leg.', 'أغسل ساقي.'],
      finger: ['I wash my finger.', 'أغسل إصبعي.'],
      heart: ['The doctor checks my heart.', 'يفحص الطبيب قلبي.'],
      doctor: ['The doctor helps me.', 'الطبيب يساعدني.'],
    };
    const [en, ar] = bodyExamples[word.en];
    return { en, ar };
  }
  if (groupId === 'food') return { en: `I like ${word.en}.`, ar: `أحب ${word.ar}.` };
  if (groupId === 'colors') return word.en === 'color'
    ? { en: 'What color is it?', ar: 'ما لونه؟' }
    : ['circle', 'square', 'triangle', 'star'].includes(word.en)
    ? { en: `I see a ${word.en}.`, ar: `أرى ${word.ar}.` }
    : { en: `It is ${word.en}.`, ar: `إنه ${word.ar}.` };
  if (groupId === 'animals') return word.en === 'animal'
    ? { en: 'I see an animal.', ar: 'أرى حيواناً.' }
    : { en: `I see a ${word.en}.`, ar: `أرى ${word.ar}.` };
  if (groupId === 'school' || groupId === 'home') return { en: `This is my ${word.en}.`, ar: `هذا ${word.ar}.` };
  const verbExamples = {
    go: ['I go to school.', 'أذهب إلى المدرسة.'],
    come: ['I come home at four.', 'أعود إلى المنزل في الرابعة.'],
    see: ['I see my friend.', 'أرى صديقي.'],
    read: ['I read every day.', 'أقرأ كل يوم.'],
    write: ['I write a word.', 'أكتب كلمة.'],
    speak: ['I speak English.', 'أتحدث الإنجليزية.'],
    listen: ['I listen to my teacher.', 'أستمع إلى معلمي.'],
    wake: ['I wake up early.', 'أستيقظ مبكراً.'],
    play: ['I play after school.', 'ألعب بعد المدرسة.'],
    work: ['I work every day.', 'أعمل كل يوم.'],
    study: ['I study English.', 'أدرس الإنجليزية.'],
    eat: ['I eat lunch at home.', 'أتناول الغداء في المنزل.'],
    drink: ['I drink water.', 'أشرب الماء.'],
  };
  const [en, ar] = verbExamples[word.en] || [`I ${word.en} every day.`, `أستخدم الفعل ${word.ar} في جملة.`];
  return { en, ar };
}

const EXISTING_A1_WORDS = new Set(LEVEL_A1.units.flatMap((unit) => unit.vocabulary.map((word) => word.en.toLowerCase())));
const A0_FOUNDATION_GROUPS = [
  { id: 'people-body', groupIds: ['family', 'body'], detailId: 'family' },
  { id: 'food-colors', groupIds: ['food', 'colors'], detailId: 'food' },
  { id: 'animals', groupIds: ['animals'], detailId: 'animals' },
  { id: 'school', groupIds: ['school'], detailId: 'school' },
  { id: 'home-verbs', groupIds: ['home', 'verbs'], detailId: 'home' },
];

const MIGRATED_A0_UNITS = A0_FOUNDATION_GROUPS.map((cluster) => {
  const details = FOUNDATION_UNIT_DETAILS[cluster.detailId];
  const words = A0_WORD_GROUPS.filter((group) => cluster.groupIds.includes(group.id))
    .flatMap((group) => group.words.map((word) => ({ ...word, groupId: group.id })))
    .filter((word) => !EXISTING_A1_WORDS.has(word.en.toLowerCase()));
  const vocabulary = words.map((word) => ({
    en: word.en,
    ar: word.ar,
    pos: word.groupId === 'verbs' ? 'verb' : word.groupId === 'colors' && !['circle', 'square', 'triangle', 'star', 'color'].includes(word.en) ? 'adjective' : 'noun',
    emoji: word.emoji,
    example: foundationExample(word.groupId, word),
  }));
  return {
    id: `a1-foundation-${cluster.id}`,
    title: details.title,
    titleEn: details.titleEn,
    icon: details.icon,
    goal: details.goal,
    grammar: [{
      title: details.grammar,
      explain: `<p>${details.grammar}</p>`,
      examples: [details.example],
      tips: ['اقرأ المثال بصوت واضح، ثم استبدل الكلمة بكلمة أخرى من المجموعة.'],
    }],
    vocabulary,
    phonetics: [{
      en: details.phonetics.en,
      ipa: details.phonetics.ipa,
      ar: details.phonetics.ar,
      contrastPairs: [{ en: details.phonetics.pair, ar: details.phonetics.tip }],
      connectedSpeech: [{ en: details.example.en, ar: 'اربط الكلمات في العبارة بسلاسة، مع إبقاء كل كلمة واضحة.' }],
      intonation: [{ en: `${details.example.en} ↘`, ar: 'نبرة هادئة تهبط عند نهاية الجملة الخبرية.' }],
    }],
    arabic_l1_transfers: [
      {
        incorrect: details.transfer.incorrect,
        corrected: details.transfer.corrected,
        explanationAr: details.transfer.explanationAr,
      },
      { incorrect: 'I happy.', corrected: 'I am happy.', explanationAr: 'لا تحذف فعل الكينونة am في جملة الوصف.' },
    ],
    academic_focus: [
      { term: 'word', meaningAr: 'كلمة', example: { en: 'Read the word.', ar: 'اقرأ الكلمة.' } },
      { term: 'example', meaningAr: 'مثال', example: { en: 'Read one example.', ar: 'اقرأ مثالاً واحداً.' } },
    ],
    sentences: vocabulary.slice(0, 6).map((word) => word.example),
    dialogue: [],
  };
});

LEVEL_A1.units.unshift(...MIGRATED_A0_UNITS);
