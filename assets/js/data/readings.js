import { WORD_GROUPS as A0_WORD_GROUPS, READINGS as A0_READINGS } from './zero-words.js';

const BASE_READINGS = [
  {
    id: "r-a1-1",
    level: "a1",
    title: "My Day",
    titleAr: "يومي",
    emoji: "🌞",
    text: "I wake up at six o'clock every morning. I wash my face and brush my teeth. Then I eat bread, cheese and eggs with my family. I go to work at seven thirty. I work in a small shop near my house. At twelve o'clock I eat lunch with my friend. In the afternoon I go home and drink tea. I sleep at ten o'clock at night.",
    textAr: "أستيقظ في السادسة صباحاً كل يوم. أغسل وجهي وأنظّف أسناني. ثم آكل الخبز والجبن والبيض مع عائلتي. أذهب إلى العمل في السابعة والنصف. أعمل في متجر صغير قريب من بيتي. في الثانية عشرة آكل الغداء مع صديقي. في فترة بعد الظهر أعود إلى البيت وأشرب الشاي. أنام في العاشرة ليلاً.",
    words: [
      { en: "wake up", ar: "يستيقظ" },
      { en: "brush my teeth", ar: "أنظّف أسناني" },
      { en: "breakfast", ar: "فطور" },
      { en: "shop", ar: "متجر" },
      { en: "near", ar: "قريب من" },
      { en: "afternoon", ar: "بعد الظهر" },
      { en: "at night", ar: "ليلًا" }
    ],
    questions: [
      { q: "What time does the writer wake up?", qAr: "في أي وقت يستيقظ الكاتب؟", options: ["At six o'clock", "At seven o'clock", "At eight o'clock", "At ten o'clock"], answer: 0, explain: "النص يبدأ بعبارة I wake up at six o'clock every morning، أي السادسة صباحاً." },
      { q: "What does the writer eat in the morning?", qAr: "ماذا يأكل الكاتب في الصباح؟", options: ["Rice and fish", "Bread, cheese and eggs", "Only fruit", "Soup and salad"], answer: 1, explain: "يقول النص إنه يأكل الخبز والجبن والبيض مع عائلته في الصباح." },
      { q: "Where does the writer work?", qAr: "أين يعمل الكاتب؟", options: ["In a big factory", "In a school", "In a small shop near his house", "In a hospital"], answer: 2, explain: "الفقرة تذكر I work in a small shop near my house، أي متجر صغير قريب من البيت." },
      { q: "Who does the writer eat lunch with?", qAr: "مع من يتناول الكاتب الغداء؟", options: ["With his family", "With his brother", "Alone", "With his friend"], answer: 3, explain: "النص يقول At twelve o'clock I eat lunch with my friend، أي مع صديقه." },
      { q: "When does the writer go to sleep?", qAr: "متى ينام الكاتب؟", options: ["At ten o'clock at night", "At nine o'clock", "At eleven o'clock", "At midnight"], answer: 0, explain: "الجملة الأخيرة تقول I sleep at ten o'clock at night، أي في العاشرة ليلاً." }
    ]
  },
  {
    id: "r-a1-2",
    level: "a1",
    title: "My Family",
    titleAr: "عائلتي",
    emoji: "👨‍👩‍👧‍👦",
    text: "My name is Lina. I have a small family. My father is a driver and my mother is a nurse. I have one brother and two sisters. My brother is ten years old and he likes football. My sisters are students. We live in a big house with my grandmother. On Friday we eat lunch together. My mother cooks chicken and rice. After lunch we drink tea and talk. I love my family very much.",
    textAr: "اسمي لينا. لديّ عائلة صغيرة. أبي سائق وأمي ممرضة. لديّ أخ واحد وأختان. أخي عمره عشر سنوات ويحب كرة القدم. أختاي طالبتان. نسكن في بيت كبير مع جدتي. يوم الجمعة نأكل الغداء معاً. تطبخ أمي الدجاج والأرز. بعد الغداء نشرب الشاي ونتحدث. أنا أحب عائلتي كثيراً.",
    words: [
      { en: "family", ar: "عائلة" },
      { en: "driver", ar: "سائق" },
      { en: "nurse", ar: "ممرضة" },
      { en: "brother", ar: "أخ" },
      { en: "grandmother", ar: "جدة" },
      { en: "cook", ar: "يطبخ" },
      { en: "together", ar: "معًا" }
    ],
    questions: [
      { q: "What is the writer's name?", qAr: "ما اسم الكاتبة؟", options: ["Sara", "Lina", "Nour", "Mona"], answer: 1, explain: "تبدأ الفقرة بعبارة My name is Lina، أي أن الاسم هو لينا." },
      { q: "What is the father's job?", qAr: "ما عمل الأب؟", options: ["A nurse", "A teacher", "A driver", "A cook"], answer: 2, explain: "النص يذكر My father is a driver، أي أن الأب سائق." },
      { q: "How many sisters does Lina have?", qAr: "كم عدد أخوات لينا؟", options: ["One", "Three", "Four", "Two"], answer: 3, explain: "تقول لينا I have one brother and two sisters، أي أختان." },
      { q: "Who lives with the family?", qAr: "من يسكن مع العائلة؟", options: ["The grandmother", "The uncle", "The cousin", "The neighbour"], answer: 0, explain: "الجملة تذكر We live in a big house with my grandmother، أي الجدة." },
      { q: "What does the mother cook on Friday?", qAr: "ماذا تطبخ الأم يوم الجمعة؟", options: ["Fish and salad", "Chicken and rice", "Soup and bread", "Meat and potatoes"], answer: 1, explain: "النص يقول My mother cooks chicken and rice، أي الدجاج والأرز." }
    ]
  },
  {
    id: "r-a1-3",
    level: "a1",
    title: "My City",
    titleAr: "مدينتي",
    emoji: "🏙️",
    text: "I live in a quiet city near the sea. There is a big market in the centre. You can buy fruit, vegetables and fish there. There are two libraries and a new hospital. My favourite place is the park. It is next to the market. In the park there are tall trees and small birds. Children play football on the grass. On Saturday I walk to the park with my father. We sit and watch the sea. I like my city a lot.",
    textAr: "أسكن في مدينة هادئة قريبة من البحر. يوجد سوق كبير في المركز. يمكنك أن تشتري هناك الفواكه والخضروات والسمك. توجد مكتبتان ومستشفى جديد. مكاني المفضل هو الحديقة. إنها بجانب السوق. في الحديقة أشجار عالية وطيور صغيرة. يلعب الأطفال كرة القدم على العشب. يوم السبت أمشي إلى الحديقة مع أبي. نجلس وننظر إلى البحر. أنا أحب مدينتي كثيراً.",
    words: [
      { en: "city", ar: "مدينة" },
      { en: "market", ar: "سوق" },
      { en: "library", ar: "مكتبة" },
      { en: "hospital", ar: "مستشفى" },
      { en: "park", ar: "حديقة عامة" },
      { en: "tree", ar: "شجرة" },
      { en: "grass", ar: "عشب" },
      { en: "quiet", ar: "هادئ" }
    ],
    questions: [
      { q: "Where is the city?", qAr: "أين تقع المدينة؟", options: ["In the mountains", "Near the sea", "In the desert", "Near a big river"], answer: 1, explain: "النص يقول I live in a quiet city near the sea، أي قريبة من البحر." },
      { q: "What can you buy in the market?", qAr: "ماذا يمكنك أن تشتري في السوق؟", options: ["Books and pens", "Clothes and shoes", "Fruit, vegetables and fish", "Cars and bikes"], answer: 2, explain: "يذكر النص أنك تستطيع شراء الفواكه والخضروات والسمك في السوق." },
      { q: "How many libraries are there in the city?", qAr: "كم عدد المكتبات في المدينة؟", options: ["One", "Four", "Three", "Two"], answer: 3, explain: "الجملة تقول There are two libraries، أي مكتبتان." },
      { q: "Where is the park?", qAr: "أين تقع الحديقة؟", options: ["Next to the market", "Behind the hospital", "Near the library", "In front of the school"], answer: 0, explain: "النص يوضح It is next to the market، أي بجانب السوق." },
      { q: "What do the children do in the park?", qAr: "ماذا يفعل الأطفال في الحديقة؟", options: ["They read books", "They play football", "They swim", "They ride bikes"], answer: 1, explain: "يقول النص Children play football on the grass، أي يلعبون كرة القدم." }
    ]
  },
  {
    id: "r-a1-4",
    level: "a1",
    title: "My Work",
    titleAr: "عملي",
    emoji: "💼",
    text: "My name is Omar. I am a teacher in a small school. I get up at half past five. I go to school by bus. My first lesson starts at eight o'clock. I teach English to forty students. The students are quiet and friendly. At ten o'clock we have a short break. I drink coffee and eat a sandwich. In the afternoon I go home and correct the homework. I like my job because I love books and children.",
    textAr: "اسمي عمر. أنا مدرّس في مدرسة صغيرة. أستيقظ في الخامسة والنصف. أذهب إلى المدرسة بالحافلة. يبدأ درسي الأول في الثامنة. أُدرّس الإنجليزية لأربعين طالباً. الطلاب هادئون وودودون. في العاشرة لدينا استراحة قصيرة. أشرب القهوة وآكل شطيرة. في فترة بعد الظهر أعود إلى البيت وأصحّح الواجبات. أحب عملي لأنني أحب الكتب والأطفال.",
    words: [
      { en: "teacher", ar: "مدرّس" },
      { en: "lesson", ar: "درس" },
      { en: "student", ar: "طالب" },
      { en: "break", ar: "استراحة" },
      { en: "homework", ar: "واجب منزلي" },
      { en: "correct", ar: "يصحّح" },
      { en: "friendly", ar: "ودود" }
    ],
    questions: [
      { q: "What is Omar's job?", qAr: "ما عمل عمر؟", options: ["A doctor", "A teacher", "A driver", "A shopkeeper"], answer: 1, explain: "يقول عمر I am a teacher in a small school، أي أنه مدرّس." },
      { q: "How does Omar go to school?", qAr: "كيف يذهب عمر إلى المدرسة؟", options: ["By car", "On foot", "By bus", "By train"], answer: 2, explain: "النص يذكر I go to school by bus، أي بالحافلة." },
      { q: "What time does the first lesson start?", qAr: "في أي وقت يبدأ الدرس الأول؟", options: ["At seven o'clock", "At half past eight", "At nine o'clock", "At eight o'clock"], answer: 3, explain: "الجملة تقول My first lesson starts at eight o'clock، أي في الثامنة." },
      { q: "How many students does Omar teach?", qAr: "كم عدد الطلاب الذين يدرّسهم عمر؟", options: ["Forty", "Fourteen", "Thirty", "Fifty"], answer: 0, explain: "النص يقول I teach English to forty students، أي أربعين طالباً." },
      { q: "What does Omar do in the afternoon?", qAr: "ماذا يفعل عمر في فترة بعد الظهر؟", options: ["He plays football", "He corrects the homework", "He sleeps", "He visits his friends"], answer: 1, explain: "يذكر النص In the afternoon I go home and correct the homework، أي يصحّح الواجبات." }
    ]
  },
  {
    id: "r-a2-1",
    level: "a2",
    title: "A Trip to Istanbul",
    titleAr: "رحلة إلى إسطنبول",
    emoji: "✈️",
    text: "Last spring my friend Hadi and I travelled to Istanbul for five days. We booked a cheap hotel in the old city, so we walked to most of the famous places. On the first morning we visited a large mosque near the sea. The building was beautiful and very quiet. In the afternoon we took a boat on the water and watched the sun go down. The next day we ate fish sandwiches for lunch and drank tea in a small café. I bought a blue scarf for my mother and a book for my brother. We spent a lot of money, but we were very happy. The only problem was the busy traffic. Next year I want to visit the east of the country.",
    textAr: "في الربيع الماضي سافرت أنا وصديقي هادي إلى إسطنبول لمدة خمسة أيام. حجزنا فندقاً رخيصاً في المدينة القديمة، لذلك مشينا إلى معظم الأماكن الشهيرة. في الصباح الأول زرنا مسجداً كبيراً قريباً من البحر. كان المبنى جميلاً وهادئاً جداً. في فترة بعد الظهر ركبنا قارباً في الماء وشاهدنا الشمس وهي تغيب. في اليوم التالي أكلنا شطائر السمك على الغداء وشربنا الشاي في مقهى صغير. اشتريت وشاحاً أزرق لأمي وكتاباً لأخي. أنفقنا الكثير من المال، لكننا كنا سعداء جداً. المشكلة الوحيدة كانت حركة المرور المزدحمة. في السنة القادمة أريد أن أزور شرق البلاد.",
    words: [
      { en: "travel", ar: "يسافر" },
      { en: "book a hotel", ar: "يحجز فندقاً" },
      { en: "mosque", ar: "مسجد" },
      { en: "boat", ar: "قارب" },
      { en: "scarf", ar: "وشاح" },
      { en: "traffic", ar: "حركة المرور" },
      { en: "spend money", ar: "ينفق المال" },
      { en: "building", ar: "مبنى" }
    ],
    questions: [
      { q: "How long did the writer stay in Istanbul?", qAr: "كم مدة إقامة الكاتب في إسطنبول؟", options: ["Three days", "Five days", "A week", "Ten days"], answer: 1, explain: "النص يذكر travelled to Istanbul for five days، أي خمسة أيام." },
      { q: "Why did they walk to most places?", qAr: "لماذا مشوا إلى معظم الأماكن؟", options: ["Because the buses were expensive", "Because they wanted to be healthy", "Because their hotel was in the old city", "Because they had no money"], answer: 2, explain: "حجزوا فندقاً في المدينة القديمة، لذلك كان الوصول إلى الأماكن الشهيرة ممكناً سيراً على الأقدام." },
      { q: "What did the writer buy for his mother?", qAr: "ماذا اشترى الكاتب لأمه؟", options: ["A book", "A fish sandwich", "A boat ticket", "A blue scarf"], answer: 3, explain: "النص يقول I bought a blue scarf for my mother، أي وشاحاً أزرق." },
      { q: "What did they do in the afternoon of the first day?", qAr: "ماذا فعلا في فترة بعد الظهر في اليوم الأول؟", options: ["They took a boat on the water", "They visited a museum", "They went shopping", "They stayed in the hotel"], answer: 0, explain: "يذكر النص In the afternoon we took a boat on the water، أي ركوب قارب." },
      { q: "What was the only problem of the trip?", qAr: "ما المشكلة الوحيدة في الرحلة؟", options: ["The cold weather", "The busy traffic", "The expensive hotel", "The bad food"], answer: 1, explain: "الجملة تقول The only problem was the busy traffic، أي ازدحام المرور." }
    ]
  },
  {
    id: "r-a2-2",
    level: "a2",
    title: "My Favourite Hobby",
    titleAr: "هوايتي المفضلة",
    emoji: "📷",
    text: "When I was ten years old, my uncle gave me an old camera. At first I did not understand how to use it, and most of my pictures were dark or unclear. Then I joined a small club at school, and a kind teacher taught me how to hold the camera and how to choose the light. Now photography is my favourite hobby. On Fridays I walk around the old streets of my town and take pictures of doors, markets and birds. Sometimes I take photos of my little sister when she is playing. I never sell my pictures because I do not want to lose them. My dream is to travel to new countries and make a big album of my best photos.",
    textAr: "عندما كان عمري عشر سنوات، أعطاني عمي كاميرا قديمة. في البداية لم أفهم كيف أستخدمها، وكانت معظم صوري داكنة أو غير واضحة. ثم انضممت إلى نادٍ صغير في المدرسة، وعلّمني مدرّس طيّب كيف أمسك الكاميرا وكيف أختار الإضاءة. الآن التصوير هوايتي المفضلة. يوم الجمعة أتجول في شوارع بلدتي القديمة وألتقط صوراً للأبواب والأسواق والطيور. أحياناً ألتقط صوراً لأختي الصغيرة وهي تلعب. لا أبيع صوري أبداً لأنني لا أريد أن أفقدها. حلمي أن أسافر إلى بلاد جديدة وأن أصنع ألبوماً كبيراً بأفضل صوري.",
    words: [
      { en: "hobby", ar: "هواية" },
      { en: "camera", ar: "كاميرا" },
      { en: "take a picture", ar: "يلتقط صورة" },
      { en: "unclear", ar: "غير واضح" },
      { en: "club", ar: "نادٍ" },
      { en: "light", ar: "إضاءة / ضوء" },
      { en: "album", ar: "ألبوم" },
      { en: "choose", ar: "يختار" }
    ],
    questions: [
      { q: "Who gave the writer a camera?", qAr: "من أعطى الكاتب كاميرا؟", options: ["His father", "His uncle", "His teacher", "His friend"], answer: 1, explain: "النص يذكر my uncle gave me an old camera، أي أن عمه هو من أعطاه الكاميرا." },
      { q: "What was the problem with his first pictures?", qAr: "ما المشكلة في صوره الأولى؟", options: ["They were too small", "They were black and white", "They were dark or unclear", "They were lost"], answer: 2, explain: "يقول النص إن معظم صوره الأولى كانت داكنة أو غير واضحة." },
      { q: "Where does he take pictures on Fridays?", qAr: "أين يلتقط الصور يوم الجمعة؟", options: ["In the school garden", "Near the sea", "At home", "In the old streets of his town"], answer: 3, explain: "يذكر النص أنه يتجول في شوارع بلدته القديمة ويصور الأبواب والأسواق والطيور." },
      { q: "Why does he never sell his pictures?", qAr: "لماذا لا يبيع صوره أبداً؟", options: ["Because he does not want to lose them", "Because they are very expensive", "Because nobody wants to buy them", "Because his uncle does not allow it"], answer: 0, explain: "السبب مذكور بوضوح: I do not want to lose them، أي لا يريد أن يفقدها." },
      { q: "What is the writer's dream?", qAr: "ما حلم الكاتب؟", options: ["To buy a new camera", "To travel and make a big photo album", "To work in a shop", "To teach photography"], answer: 1, explain: "حلمه أن يسافر إلى بلاد جديدة ويصنع ألبوماً كبيراً بأفضل صوره." }
    ]
  },
  {
    id: "r-a2-3",
    level: "a2",
    title: "A Healthy Change",
    titleAr: "تغيير صحي",
    emoji: "🏃",
    text: "My brother Karim was not healthy last year. He worked for ten hours every day and he never did any sport. He ate fast food three times a week and he drank a lot of sweet drinks. He often felt tired in the morning and he could not sleep well. One day the doctor told him that his blood pressure was high and asked him to change his habits. Karim started to walk for thirty minutes every evening after dinner. He also stopped eating fast food and began to cook vegetables at home. At first it was difficult, but after one month he felt much better. After six months he lost eight kilos. Now he says that walking is the best part of his day.",
    textAr: "كان أخي كريم غير صحي في السنة الماضية. كان يعمل عشر ساعات كل يوم ولم يمارس أي رياضة أبداً. كان يأكل الوجبات السريعة ثلاث مرات في الأسبوع ويشرب الكثير من المشروبات المحلاة. كان يشعر بالتعب غالباً في الصباح ولم يستطع النوم جيداً. في أحد الأيام أخبره الطبيب أن ضغط دمه مرتفع وطلب منه أن يغيّر عاداته. بدأ كريم بالمشي ثلاثين دقيقة كل مساء بعد العشاء. توقف أيضاً عن أكل الوجبات السريعة وبدأ يطبخ الخضروات في البيت. في البداية كان الأمر صعباً، لكن بعد شهر واحد شعر بتحسّن كبير. بعد ستة أشهر فقد ثمانية كيلوغرامات. الآن يقول إن المشي هو أفضل جزء في يومه.",
    words: [
      { en: "healthy", ar: "صحي / سليم" },
      { en: "fast food", ar: "وجبات سريعة" },
      { en: "tired", ar: "متعب" },
      { en: "blood pressure", ar: "ضغط الدم" },
      { en: "habit", ar: "عادة" },
      { en: "vegetables", ar: "خضروات" },
      { en: "lose weight", ar: "يفقد الوزن" },
      { en: "feel better", ar: "يشعر بتحسّن" }
    ],
    questions: [
      { q: "How many hours did Karim work every day?", qAr: "كم ساعة كان كريم يعمل كل يوم؟", options: ["Six hours", "Eight hours", "Ten hours", "Twelve hours"], answer: 2, explain: "النص يقول He worked for ten hours every day، أي عشر ساعات." },
      { q: "What did the doctor tell Karim?", qAr: "ماذا أخبر الطبيب كريم؟", options: ["He needed a long holiday", "His blood pressure was high", "He should eat more meat", "He should stop working"], answer: 1, explain: "أخبره الطبيب أن ضغط دمه مرتفع وطلب منه تغيير عاداته." },
      { q: "When did Karim start walking?", qAr: "متى بدأ كريم بالمشي؟", options: ["Every morning before work", "At lunch time", "On the weekend only", "Every evening after dinner"], answer: 3, explain: "بدأ بالمشي ثلاثين دقيقة كل مساء بعد العشاء." },
      { q: "How much weight did he lose after six months?", qAr: "كم فقد من وزنه بعد ستة أشهر؟", options: ["Eight kilos", "Three kilos", "Ten kilos", "Fifteen kilos"], answer: 0, explain: "النص يذكر After six months he lost eight kilos، أي ثمانية كيلوغرامات." },
      { q: "How does Karim feel about walking now?", qAr: "كيف يشعر كريم تجاه المشي الآن؟", options: ["He thinks it is boring", "He says it is the best part of his day", "He wants to stop it", "He thinks it is too difficult"], answer: 1, explain: "يقول كريم الآن إن المشي هو أفضل جزء في يومه." }
    ]
  },
  {
    id: "r-a2-4",
    level: "a2",
    title: "The School Garden",
    titleAr: "حديقة المدرسة",
    emoji: "🌱",
    text: "Two years ago, the land behind our school was dry and full of rubbish. Nobody used it, and the students threw old paper and plastic there every day. Then our science teacher, Miss Salma, had an idea. She asked the students to clean the land and to make a small garden. At the weekend, thirty students came with their parents. We collected the rubbish in big bags and we planted ten young trees. We also grew tomatoes, mint and beans. The work was hard because the ground was very dry, so we carried water from the school kitchen. Today the garden is green and beautiful. We sell some vegetables and use the money to buy new seeds. Miss Salma says that the garden teaches us more than books.",
    textAr: "قبل سنتين كانت الأرض خلف مدرستنا جافة ومليئة بالقمامة. لم يستخدمها أحد، وكان الطلاب يرمون هناك الورق القديم والبلاستيك كل يوم. ثم كان لدى مدرّسة العلوم، الآنسة سلمى، فكرة. طلبت من الطلاب أن ينظفوا الأرض وأن يصنعوا حديقة صغيرة. في نهاية الأسبوع جاء ثلاثون طالباً مع أولياء أمورهم. جمعنا القمامة في أكياس كبيرة وزرعنا عشر أشجار صغيرة. زرعنا أيضاً الطماطم والنعناع والفاصولياء. كان العمل شاقاً لأن الأرض كانت جافة جداً، لذلك حملنا الماء من مطبخ المدرسة. اليوم الحديقة خضراء وجميلة. نبيع بعض الخضروات ونستخدم المال لشراء بذور جديدة. تقول الآنسة سلمى إن الحديقة تعلّمنا أكثر من الكتب.",
    words: [
      { en: "rubbish", ar: "قمامة" },
      { en: "garden", ar: "حديقة" },
      { en: "plant", ar: "يزرع" },
      { en: "grow", ar: "ينمو / يزرع" },
      { en: "ground", ar: "أرض / تربة" },
      { en: "seed", ar: "بذرة" },
      { en: "collect", ar: "يجمع" },
      { en: "dry", ar: "جاف" }
    ],
    questions: [
      { q: "What was behind the school two years ago?", qAr: "ماذا كان خلف المدرسة قبل سنتين؟", options: ["A small park", "A dry land full of rubbish", "A football field", "A new building"], answer: 1, explain: "النص يصف المكان بأنه أرض جافة مليئة بالقمامة." },
      { q: "Who had the idea of the garden?", qAr: "من صاحب فكرة الحديقة؟", options: ["The school director", "The students", "Miss Salma", "The parents"], answer: 2, explain: "الفكرة كانت لمدرّسة العلوم الآنسة سلمى." },
      { q: "How many trees did they plant?", qAr: "كم شجرة زرعوا؟", options: ["Five", "Twenty", "Thirty", "Ten"], answer: 3, explain: "النص يقول we planted ten young trees، أي عشر أشجار صغيرة." },
      { q: "Why was the work hard?", qAr: "لماذا كان العمل شاقاً؟", options: ["Because the ground was very dry", "Because it rained every day", "Because nobody helped them", "Because they had no tools"], answer: 0, explain: "كان العمل شاقاً لأن الأرض كانت جافة جداً، فاضطروا لحمل الماء من مطبخ المدرسة." },
      { q: "What do they do with the money from the vegetables?", qAr: "ماذا يفعلون بالمال الذي يأتي من الخضروات؟", options: ["They buy new books", "They buy new seeds", "They repair the school", "They give it to the teachers"], answer: 1, explain: "يستخدمون المال لشراء بذور جديدة." }
    ]
  },
  {
    id: "r-b1-1",
    level: "b1",
    title: "The Lost Wallet",
    titleAr: "المحفظة المفقودة",
    emoji: "👛",
    text: "Last winter, Sami was waiting for the bus after a long day at work. It was raining heavily, and the street was almost empty. While he was looking at his phone, he noticed a brown wallet lying on the wet ground near the bench. He picked it up and opened it carefully. Inside there were about two hundred euros, a bank card, and a photograph of two children. For a moment, Sami thought about keeping the money. He needed new shoes and his salary was small. However, he remembered his own father, who once lost a wallet with all his documents and cried for two days. Sami closed the wallet and walked to the small police station on the corner. The officer thanked him and called the owner, a woman who was shopping nearby. When she arrived, she was shaking and could not stop thanking him. She wanted to give him fifty euros, but he refused politely. He was also sure that the children in the photograph would sleep better that night. On his way home, Sami felt richer than he had felt for months.",
    textAr: "في الشتاء الماضي كان سامي ينتظر الحافلة بعد يوم طويل من العمل. كانت تمطر بغزارة، وكان الشارع شبه خالٍ. وبينما كان ينظر إلى هاتفه، لاحظ محفظة بنية ملقاة على الأرض المبللة قرب المقعد. رفعها وفتحها بحذر. كان فيها نحو مئتي يورو، وبطاقة بنكية، وصورة لطفلين. للحظة فكّر سامي في الاحتفاظ بالمال. كان يحتاج حذاءً جديداً وراتبه قليل. غير أنه تذكّر والده الذي فقد مرة محفظة بكل وثائقه وبكى يومين. أغلق سامي المحفظة وسار إلى مركز الشرطة الصغير في نهاية الشارع. شكرَه الشرطي واتصل بالمالكة، وهي امرأة كانت تتسوق قريباً. وعندما وصلت كانت ترتجف ولم تستطع التوقف عن شكره. أرادت أن تعطيه خمسين يورو، لكنه رفض بلطف. وكان واثقاً أيضاً أن الطفلين في الصورة سينامان تلك الليلة بشكل أفضل. وفي طريقه إلى البيت شعر سامي بأنه أغنى مما شعر به منذ أشهر.",
    words: [
      { en: "wallet", ar: "محفظة" },
      { en: "notice", ar: "يلاحظ" },
      { en: "bench", ar: "مقعد" },
      { en: "salary", ar: "راتب" },
      { en: "documents", ar: "وثائق / أوراق رسمية" },
      { en: "refuse", ar: "يرفض" },
      { en: "owner", ar: "المالك / صاحب الشيء" },
      { en: "shaking", ar: "يرتجف" }
    ],
    questions: [
      { q: "Where did Sami find the wallet?", qAr: "أين وجد سامي المحفظة؟", options: ["On the bus", "On the wet ground near the bench", "Inside a shop", "At the police station"], answer: 1, explain: "لاحظ المحفظة ملقاة على الأرض المبللة قرب المقعد في محطة الحافلة." },
      { q: "What was inside the wallet?", qAr: "ماذا كان داخل المحفظة؟", options: ["Only a bank card", "A phone and keys", "Money, a bank card and a photograph", "A passport and a ticket"], answer: 2, explain: "النص يذكر مئتي يورو وبطاقة بنكية وصورة لطفلين." },
      { q: "Why did Sami think about keeping the money?", qAr: "لماذا فكّر سامي في الاحتفاظ بالمال؟", options: ["Because he needed new shoes and his salary was small", "Because he did not like the owner", "Because the police station was closed", "Because his friend told him to do it"], answer: 0, explain: "كان يحتاج حذاءً جديداً وراتبه قليل، وهذا ما جعله يفكر في الاحتفاظ بالمال." },
      { q: "What made Sami change his mind?", qAr: "ما الذي غيّر رأي سامي؟", options: ["The rain stopped suddenly", "He remembered his father losing a wallet", "The officer saw him", "The photograph was old"], answer: 1, explain: "تذكّر والده الذي فقد محفظته مرة وبكى يومين، فقرر إعادة المحفظة." },
      { q: "How did Sami feel on his way home?", qAr: "كيف شعر سامي في طريق عودته؟", options: ["Angry and tired", "Afraid of the police", "Sorry about the money", "Richer than he had felt for months"], answer: 3, explain: "الجملة الأخيرة تقول إنه شعر بأنه أغنى مما شعر به منذ أشهر، أي رضا داخلياً." }
    ]
  },
  {
    id: "r-b1-2",
    level: "b1",
    title: "Should Students Use Phones at School?",
    titleAr: "هل يستخدم الطلاب الهواتف في المدرسة؟",
    emoji: "📱",
    text: "Mobile phones are now part of daily life, and many schools are asking an important question: should students use them during the school day? Supporters of phones say that these devices help students search for information quickly, check the meaning of new words, and stay in contact with their parents in an emergency. In some classes, a phone can even replace a dictionary or a camera. However, other people believe that the disadvantages are much bigger. Studies in several countries show that students who look at their phones during lessons remember less and get lower marks. In addition, phones can cause serious problems such as cyberbullying, and some students feel anxious when they cannot check their messages. Teachers also complain that they spend more time fighting for attention than teaching. In my opinion, the best solution is not to ban phones completely, but to control them. Many schools now keep the devices in a locked box during lessons and return them at the end of the day. This simple rule protects young people and still teaches them how to use technology in a responsible way.",
    textAr: "أصبحت الهواتف المحمولة جزءاً من الحياة اليومية، وتسأل مدارس كثيرة سؤالاً مهماً: هل ينبغي للطلاب استخدامها خلال اليوم الدراسي؟ يقول المؤيدون للهواتف إن هذه الأجهزة تساعد الطلاب على البحث عن المعلومة بسرعة، والتحقق من معنى الكلمات الجديدة، والبقاء على تواصل مع آبائهم في حالة الطوارئ. وفي بعض الحصص يمكن للهاتف أن يحل حتى محل القاموس أو الكاميرا. غير أن أشخاصاً آخرين يرون أن العيوب أكبر بكثير. وتُظهر دراسات في عدة بلدان أن الطلاب الذين ينظرون إلى هواتفهم أثناء الدروس يتذكرون أقل ويحصلون على درجات أدنى. إضافة إلى ذلك، قد تسبب الهواتف مشكلات خطيرة مثل التنمّر الإلكتروني، ويشعر بعض الطلاب بالقلق عندما لا يستطيعون تفقّد رسائلهم. ويشكو المدرّسون أيضاً من أنهم يقضون وقتاً أطول في محاولة جذب الانتباه بدلاً من التعليم. وفي رأيي، الحل الأفضل ليس منع الهواتف تماماً، بل تنظيم استخدامها. تحتفظ مدارس كثيرة الآن بالأجهزة في صندوق مغلق أثناء الدروس وتعيدها في نهاية اليوم. هذه القاعدة البسيطة تحمي الشباب وتعلّمهم في الوقت نفسه كيف يستخدمون التقنية بمسؤولية.",
    words: [
      { en: "device", ar: "جهاز" },
      { en: "search for", ar: "يبحث عن" },
      { en: "disadvantage", ar: "عيب / مساوئ" },
      { en: "marks", ar: "درجات" },
      { en: "cyberbullying", ar: "التنمّر الإلكتروني" },
      { en: "anxious", ar: "قلق" },
      { en: "ban", ar: "يمنع" },
      { en: "responsible", ar: "مسؤول" }
    ],
    questions: [
      { q: "What is the main question of the article?", qAr: "ما السؤال الرئيسي في المقال؟", options: ["How much do phones cost?", "Whether students should use phones at school", "Why teachers do not like technology", "How to buy a good phone"], answer: 1, explain: "يفتتح النص بالسؤال عن مدى ملاءمة استخدام الطلاب للهواتف خلال اليوم الدراسي." },
      { q: "According to supporters, how can phones help students?", qAr: "بحسب المؤيدين، كيف تساعد الهواتف الطلاب؟", options: ["They make lessons shorter", "They replace teachers", "They help them find information quickly", "They improve their handwriting"], answer: 2, explain: "المؤيدون يقولون إنها تساعد على البحث السريع عن المعلومات والتحقق من معاني الكلمات." },
      { q: "What do studies mentioned in the text show?", qAr: "ماذا تُظهر الدراسات المذكورة في النص؟", options: ["Students with phones get lower marks", "Phones are too expensive for schools", "Most students never use phones", "Teachers use phones more than students"], answer: 0, explain: "تشير الدراسات إلى أن الطلاب الذين يستخدمون الهواتف في الحصص يتذكرون أقل ويحصلون على درجات أدنى." },
      { q: "What problem do teachers complain about?", qAr: "ما المشكلة التي يشكو منها المدرّسون؟", options: ["The noise of the school bell", "Spending more time on attention than teaching", "The number of exams", "The size of the classrooms"], answer: 1, explain: "يشكو المدرّسون من أنهم يقضون وقتاً أطول في محاولة جذب انتباه الطلاب بدلاً من التعليم." },
      { q: "What is the writer's opinion?", qAr: "ما رأي الكاتب؟", options: ["Phones should be banned completely", "Every student should have two phones", "Schools should ignore the problem", "Phones should be controlled, not banned"], answer: 3, explain: "يرى الكاتب أن الحل الأفضل ليس المنع الكامل بل التنظيم، مثل حفظ الأجهزة في صندوق مغلق." }
    ]
  },
  {
    id: "r-b1-3",
    level: "b1",
    title: "A Village Cleans Its Beach",
    titleAr: "قرية تنظّف شاطئها",
    emoji: "🌊",
    text: "Three years ago, the beach near the small village of Timzight was covered with plastic bottles and old fishing nets. Tourists stopped coming, and the fishermen complained that the fish were disappearing. The situation changed when a group of students decided to act. They wrote a letter to the local council and asked for help, but the answer was slow, so they started to work alone. Every Saturday morning, about forty volunteers met at the beach and filled large bags with rubbish. They also put wooden signs along the coast asking visitors to keep the place clean. The idea spread quickly. At the beginning, some older people laughed at them and said that the sea would bring new rubbish with every storm. The volunteers did not argue; they simply continued their work. Shops in the village gave free gloves and water, and a young engineer designed simple bins from old oil drums. After one year, the beach was clean again, and last summer more than two hundred families visited it. The council finally paid for a small recycling centre. The students say the real success is not the clean sand but the new habit: people now understand that the sea belongs to everyone.",
    textAr: "قبل ثلاث سنوات كان الشاطئ القريب من قرية تيمزغيت الصغيرة مغطى بالزجاجات البلاستيكية وشباك الصيد القديمة. توقف السيّاح عن القدوم، واشتكى الصيادون من اختفاء الأسماك. تغيّر الوضع عندما قررت مجموعة من الطلاب التحرك. كتبوا رسالة إلى المجلس المحلي وطلبوا المساعدة، لكن الجواب تأخر، فبدأوا العمل وحدهم. كل صباح سبت كان نحو أربعين متطوعاً يلتقون عند الشاطئ ويملؤون أكياساً كبيرة بالقمامة. كما وضعوا لافتات خشبية على طول الساحل تطلب من الزوار الحفاظ على نظافة المكان. انتشرت الفكرة بسرعة. في البداية ضحك بعض كبار السن منهم وقالوا إن البحر سيجلب قمامة جديدة مع كل عاصفة. لم يجادل المتطوعون، بل واصلوا عملهم ببساطة. قدّمت محلات القرية قفازات وماءً مجاناً، وصمّم مهندس شاب حاويات بسيطة من براميل زيت قديمة. بعد سنة واحدة أصبح الشاطئ نظيفاً مرة أخرى، وفي الصيف الماضي زارته أكثر من مئتي عائلة. وأخيراً دفعت البلدية ثمن مركز صغير لإعادة التدوير. يقول الطلاب إن النجاح الحقيقي ليس الرمل النظيف بل العادة الجديدة: لقد فهم الناس الآن أن البحر ملك للجميع.",
    words: [
      { en: "beach", ar: "شاطئ" },
      { en: "fishing nets", ar: "شباك صيد" },
      { en: "volunteer", ar: "متطوع" },
      { en: "rubbish", ar: "قمامة" },
      { en: "sign", ar: "لافتة" },
      { en: "bin", ar: "حاوية قمامة" },
      { en: "recycling", ar: "إعادة التدوير" },
      { en: "spread", ar: "ينتشر" }
    ],
    questions: [
      { q: "What was the beach like three years ago?", qAr: "كيف كان الشاطئ قبل ثلاث سنوات؟", options: ["Full of plastic and old nets", "Covered with sand", "Full of tourists", "Closed by the council"], answer: 0, explain: "كان الشاطئ مغطى بالزجاجات البلاستيكية وشباك الصيد القديمة." },
      { q: "Why did the students start working alone?", qAr: "لماذا بدأ الطلاب العمل وحدهم؟", options: ["They did not want any help", "The council's answer was slow", "The fishermen refused to join", "They had no money for tools"], answer: 1, explain: "كتبوا إلى المجلس المحلي لكن الجواب تأخر، فبدؤوا العمل بمفردهم." },
      { q: "What did the students do every Saturday morning?", qAr: "ماذا كان الطلاب يفعلون كل صباح سبت؟", options: ["They sold fish in the market", "They built new houses", "They filled bags with rubbish", "They taught children to swim"], answer: 2, explain: "كان نحو أربعين متطوعاً يملؤون أكياساً كبيرة بالقمامة كل صباح سبت." },
      { q: "Who designed the simple bins?", qAr: "من صمّم الحاويات البسيطة؟", options: ["A teacher", "A fisherman", "A shop owner", "A young engineer"], answer: 3, explain: "النص يذكر أن مهندساً شاباً صمّم حاويات بسيطة من براميل زيت قديمة." },
      { q: "What do the students consider the real success?", qAr: "ما الذي يعتبره الطلاب النجاح الحقيقي؟", options: ["The money from the council", "The new habit of protecting the sea", "The number of tourists", "The wooden signs"], answer: 1, explain: "يقول الطلاب إن النجاح الحقيقي هو العادة الجديدة وفهم الناس أن البحر ملك للجميع." }
    ]
  },
  {
    id: "r-b1-4",
    level: "b1",
    title: "From Receptionist to Programmer",
    titleAr: "من موظفة استقبال إلى مبرمجة",
    emoji: "💻",
    text: "Five years ago, Amal was working as a receptionist in a small hotel. She answered the phone, booked rooms and wrote notes by hand. She liked her colleagues, but she felt that her salary would never change and that she was learning nothing new. One evening, while she was watching a video on the internet, she discovered free programming lessons. At first the words on the screen looked like a secret language. She decided to study for one hour every night after work, even when she was tired. Sometimes she failed the same exercise five times before she understood it. After eight months she built a simple website for the hotel, and guests started to book rooms online. The manager was impressed and asked her to take care of all the hotel technology. Two years later, Amal left the hotel and joined a small company that creates programmes for hospitals. Today she earns three times more than before, and every Friday she teaches coding to a group of women in her neighbourhood for free. She says that the most difficult step was the first one.",
    textAr: "قبل خمس سنوات كانت أمل تعمل موظفة استقبال في فندق صغير. كانت تجيب على الهاتف وتحجز الغرف وتكتب الملاحظات بيدها. كانت تحب زملاءها، لكنها شعرت أن راتبها لن يتغير أبداً وأنها لا تتعلم شيئاً جديداً. في إحدى الأمسيات، وبينما كانت تشاهد مقطع فيديو على الإنترنت، اكتشفت دروساً مجانية في البرمجة. في البداية بدت الكلمات على الشاشة كلغة سرية. قررت أن تدرس ساعة واحدة كل ليلة بعد العمل، حتى عندما تكون متعبة. أحياناً كان التمرين نفسه يفشل معها خمس مرات قبل أن تفهمه. بعد ثمانية أشهر بنت موقعاً بسيطاً للفندق، وبدأ الضيوف يحجزون الغرف عبر الإنترنت. تأثّر المدير وطلب منها أن تتولى كل تقنية الفندق. بعد سنتين تركت أمل الفندق وانضمت إلى شركة صغيرة تصنع برامج للمستشفيات. اليوم تكسب ثلاثة أضعاف ما كانت تكسبه سابقاً، وكل جمعة تعلّم البرمجة مجاناً لمجموعة من النساء في حيّها. وتقول إن أصعب خطوة كانت الخطوة الأولى.",
    words: [
      { en: "receptionist", ar: "موظف استقبال" },
      { en: "salary", ar: "راتب" },
      { en: "discover", ar: "يكتشف" },
      { en: "programming", ar: "برمجة" },
      { en: "website", ar: "موقع إلكتروني" },
      { en: "guest", ar: "ضيف / نزيل" },
      { en: "impressed", ar: "مُعجَب / متأثر" },
      { en: "neighbourhood", ar: "حيّ / جيرة" }
    ],
    questions: [
      { q: "What was Amal's job five years ago?", qAr: "ما كان عمل أمل قبل خمس سنوات؟", options: ["A programmer in a hospital", "A receptionist in a small hotel", "A teacher at a school", "A manager of a company"], answer: 1, explain: "كانت تعمل موظفة استقبال في فندق صغير." },
      { q: "Why did she want to change her situation?", qAr: "لماذا أرادت تغيير وضعها؟", options: ["Her colleagues were unfriendly", "The hotel was very far from her house", "Her salary would never change and she was learning nothing new", "She wanted to travel abroad"], answer: 2, explain: "شعرت أن راتبها لن يتغير وأنها لا تتعلم شيئاً جديداً." },
      { q: "How did she organise her study?", qAr: "كيف نظّمت دراستها؟", options: ["One hour every night after work", "All day at the weekend", "Two hours every morning", "Only during her holidays"], answer: 0, explain: "قررت أن تدرس ساعة كل ليلة بعد العمل حتى لو كانت متعبة." },
      { q: "What happened after she built the hotel website?", qAr: "ماذا حدث بعد أن بنت موقع الفندق؟", options: ["She lost her job", "The hotel closed", "She moved to another city", "The manager asked her to take care of the hotel technology"], answer: 3, explain: "تأثّر المدير وطلب منها أن تتولى كل ما يتعلق بتقنية الفندق." },
      { q: "What does Amal do every Friday now?", qAr: "ماذا تفعل أمل كل جمعة الآن؟", options: ["She teaches coding to women for free", "She visits her old hotel", "She studies a new language", "She works extra hours"], answer: 0, explain: "تعلّم البرمجة مجاناً لمجموعة من النساء في حيّها كل جمعة." }
    ]
  }
];

const FOUNDATION_READINGS = A0_READINGS.map((reading) => {
  const text = reading.lines.map((line) => line.en).join(' ');
  const textAr = reading.lines.map((line) => line.ar).join(' ');
  const normalizedText = text.toLowerCase();
  return {
    id: `r-a1-foundation-${reading.id}`,
    level: 'a1',
    title: reading.titleEn,
    titleAr: reading.titleAr,
    emoji: reading.emoji,
    text,
    textAr,
    words: A0_WORD_GROUPS.flatMap((group) => group.words)
      .filter((word) => normalizedText.includes(word.en.toLowerCase()))
      .map((word) => ({ en: word.en, ar: word.ar })),
    questions: reading.questions.map((question) => ({
      q: question.q,
      qAr: question.qAr,
      options: question.options,
      answer: question.answer,
      explain: question.explain,
    })),
  };
});

export const READINGS = [...FOUNDATION_READINGS, ...BASE_READINGS];
