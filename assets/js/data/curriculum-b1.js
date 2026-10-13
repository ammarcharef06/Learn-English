export const LEVEL_B1 = {
  id: "b1",
  label: "B1 — المتوسط",
  labelEn: "Intermediate (B1)",
  icon: "🌳",
  color: "#8b5cf6",
  summary: "مستوى متوسط يطوّر قدرتك على الحديث عن العمل والصحة والمجتمع والإعلام والمستقبل والعلاقات بثقة ودقة.",
  units: [
    {
      id: "b1u1",
      title: "العمل والمقابلات والاجتماعات",
      titleEn: "Work, Interviews and Meetings",
      icon: "💼",
      goal: "أن تتحدث عن خبرتك العملية وتجيب بثقة في مقابلات العمل وتشارك بفاعلية في اجتماعات الفريق.",
      grammar: [
        {
          title: "المضارع التام مقابل الماضي البسيط",
          explain: "نستخدم المضارع التام عندما نتحدث عن حدث وقع في الماضي وما زال له أثر أو نتيجة في الوقت الحاضر، أو عندما لا نحدد وقت وقوعه. أما الماضي البسيط فنستخدمه عندما نذكر وقتاً محدداً انتهى في الماضي. القاعدة العملية بسيطة: إذا ذكرت الوقت المحدد فاستخدم الماضي البسيط، وإذا كانت النتيجة هي الأهم فاستخدم المضارع التام.",
          table: { headers: ["الزمن", "متى نستخدمه"], rows: [["المضارع التام", "حدث في الماضي ونتيجته أو أثره ما زال ظاهراً الآن"], ["المضارع التام", "حدث وقع في وقت غير محدد ولا يهمنا تحديده"], ["الماضي البسيط", "حدث انتهى في الماضي مع ذكر وقت محدد"], ["الماضي البسيط", "سؤال عن حدث وقع في وقت معروف ومنته"] ] },
          examples: [
            { en: "I have worked in this company for five years.", ar: "أعمل في هذه الشركة منذ خمس سنوات." },
            { en: "She has just finished the interview.", ar: "لقد أنهت المقابلة للتو." },
            { en: "We discussed the budget yesterday.", ar: "ناقشنا الميزانية أمس." },
            { en: "He has never attended a meeting like this one.", ar: "لم يحضر اجتماعاً كهذا قط." },
            { en: "Did you apply for that job last week?", ar: "هل تقدمت بطلب لتلك الوظيفة الأسبوع الماضي؟" }
          ],
          tips: [
            "لا تذكر وقتاً محدداً مع المضارع التام، فلا نستخدم معه أمس أو في العام الماضي.",
            "استخدم كلمة منذ مع المضارع التام للحديث عن مدة بدأت في الماضي وما زالت مستمرة.",
            "في المقابلات استخدم المضارع التام لوصف خبرتك المتراكمة حتى اليوم."
          ]
        },
        {
          title: "الأسئلة الذيلية لتأكيد الكلام",
          explain: "السؤال الذي نضيفه في نهاية الجملة نسميه السؤال الذيلي، ونستخدمه لتأكيد الكلام أو لطلب موافقة المستمع. إذا كانت الجملة مثبتة جعلنا نهايتها منفية، وإذا كانت الجملة منفية جعلنا نهايتها مثبتة. نكرر الفعل المساعد نفسه الذي في الجملة، ونستخدم ضمير الفاعل المناسب.",
          table: { headers: ["نوع الجملة", "صيغة النهاية"], rows: [["جملة مثبتة", "نهاية منفية"], ["جملة منفية", "نهاية مثبتة"], ["جملة فيها فعل مساعد", "نكرر الفعل المساعد نفسه"], ["جملة بلا فعل مساعد", "نستخدم الفعل المساعد المناسب للزمن"] ] },
          examples: [
            { en: "You have sent the report, haven't you?", ar: "لقد أرسلت التقرير، أليس كذلك؟" },
            { en: "She isn't coming to the meeting, is she?", ar: "إنها لن تحضر الاجتماع، أليس كذلك؟" },
            { en: "They worked hard on the project, didn't they?", ar: "لقد عملوا بجد في المشروع، أليس كذلك؟" },
            { en: "We can start now, can't we?", ar: "يمكننا أن نبدأ الآن، أليس كذلك؟" },
            { en: "He doesn't know the client, does he?", ar: "إنه لا يعرف العميل، أليس كذلك؟" }
          ],
          tips: [
            "استخدم نبرة هابطة في نهاية السؤال الذيلي عندما تكون متأكداً وتنتظر موافقة المستمع.",
            "بعد جملة الأمر نستخدم صيغة مؤدبة في النهاية للطلب أو الدعوة.",
            "تأكد من أن الضمير في النهاية يعود على فاعل الجملة نفسها."
          ]
        }
      ],
      vocab: [
        { en: "opportunity", ar: "فرصة", pos: "noun", emoji: "🚪", example: { en: "This job is a great opportunity for me.", ar: "هذه الوظيفة فرصة رائعة لي." } },
        { en: "interview", ar: "مقابلة عمل", pos: "noun", emoji: "🎤", example: { en: "I have a job interview on Monday morning.", ar: "لدي مقابلة عمل صباح يوم الاثنين." } },
        { en: "experience", ar: "خبرة", pos: "noun", emoji: "📋", example: { en: "She has five years of experience in marketing.", ar: "لديها خمس سنوات من الخبرة في التسويق." } },
        { en: "colleague", ar: "زميل في العمل", pos: "noun", emoji: "👥", example: { en: "My colleague helped me finish the report.", ar: "ساعدني زميلي في إنهاء التقرير." } },
        { en: "deadline", ar: "موعد نهائي", pos: "noun", emoji: "⏰", example: { en: "We must meet the deadline for this project.", ar: "علينا الالتزام بالموعد النهائي لهذا المشروع." } },
        { en: "responsibility", ar: "مسؤولية", pos: "noun", emoji: "🧭", example: { en: "Looking after clients is my main responsibility.", ar: "رعاية العملاء هي مسؤوليتي الأساسية." } },
        { en: "achieve", ar: "يحقق", pos: "verb", emoji: "🎯", example: { en: "You can achieve your goals with hard work.", ar: "يمكنك أن تحقق أهدافك بالعمل الجاد." } },
        { en: "apply", ar: "يتقدم بطلب", pos: "verb", emoji: "📝", example: { en: "I decided to apply for a new position.", ar: "قررت أن أتقدم بطلب لوظيفة جديدة." } },
        { en: "skill", ar: "مهارة", pos: "noun", emoji: "🛠️", example: { en: "Communication is an important skill at work.", ar: "التواصل مهارة مهمة في العمل." } },
        { en: "salary", ar: "راتب", pos: "noun", emoji: "💰", example: { en: "The salary in this company is quite good.", ar: "الراتب في هذه الشركة جيد جداً." } },
        { en: "schedule", ar: "جدول مواعيد", pos: "noun", emoji: "🗓️", example: { en: "My schedule is full of meetings today.", ar: "جدول مواعيدي مليء بالاجتماعات اليوم." } },
        { en: "attend", ar: "يحضر", pos: "verb", emoji: "🙋", example: { en: "All managers must attend the meeting on Friday.", ar: "على جميع المديرين حضور اجتماع يوم الجمعة." } },
        { en: "promote", ar: "يرقي إلى منصب أعلى", pos: "verb", emoji: "📈", example: { en: "They decided to promote her to team leader.", ar: "قرروا ترقيتها إلى قائدة فريق." } },
        { en: "confident", ar: "واثق", pos: "adjective", emoji: "💪", example: { en: "She felt confident during the interview.", ar: "شعرت بالثقة أثناء المقابلة." } },
        { en: "take on", ar: "يتولى أو يتحمل", pos: "phrase", emoji: "🧱", example: { en: "He decided to take on more tasks this year.", ar: "قرر أن يتولى مهام أكثر هذا العام." } }
      ],
      sentences: [
        { en: "I have already sent my application to three companies.", ar: "لقد أرسلت طلبي إلى ثلاث شركات بالفعل." },
        { en: "She has worked as a project manager since 2019.", ar: "تعمل مديرة مشاريع منذ عام ألفين وتسعة عشر." },
        { en: "Did you attend the meeting about the new budget yesterday?", ar: "هل حضرت اجتماع الميزانية الجديدة أمس؟" },
        { en: "My colleague and I prepared the report before the deadline.", ar: "أعددت التقرير مع زميلي قبل الموعد النهائي." },
        { en: "He has never been late for an important interview.", ar: "لم يتأخر قط عن مقابلة عمل مهمة." },
        { en: "We discussed the schedule and agreed on a new plan.", ar: "ناقشنا الجدول واتفقنا على خطة جديدة." },
        { en: "If you want to achieve your goals, you must work hard.", ar: "إذا أردت تحقيق أهدافك فعليك أن تعمل بجد." },
        { en: "The company offered him a better salary last month.", ar: "عرضت عليه الشركة راتباً أفضل الشهر الماضي." },
        { en: "I am confident that we can finish this project on time.", ar: "أنا واثق من أننا نستطيع إنهاء هذا المشروع في الوقت المحدد." },
        { en: "She applied for the job and got an interview immediately.", ar: "تقدمت بطلب للوظيفة وحصلت على مقابلة فوراً." },
        { en: "Our team has completed every task on the list this week.", ar: "أنجز فريقنا كل مهمة في القائمة هذا الأسبوع." },
        { en: "They promoted him because he took on extra responsibility.", ar: "رقّوه لأنه تولى مسؤولية إضافية." }
      ],
      dialogue: [
        { who: "A", en: "Good morning, please tell me about your experience.", ar: "صباح الخير، حدثني عن خبرتك من فضلك." },
        { who: "B", en: "I have worked in sales for six years.", ar: "عملت في مجال المبيعات ست سنوات." },
        { who: "A", en: "Why do you want to leave your current job?", ar: "لماذا تريد ترك وظيفتك الحالية؟" },
        { who: "B", en: "I am looking for a new challenge and a better salary.", ar: "أبحث عن تحد جديد وراتب أفضل." },
        { who: "A", en: "When can you start working with us?", ar: "متى يمكنك أن تبدأ العمل معنا؟" },
        { who: "B", en: "I can start at the beginning of next month.", ar: "أستطيع أن أبدأ في بداية الشهر القادم." }
      ]
    },
    {
      id: "b1u2",
      title: "الصحة النفسية والعادات اليومية",
      titleEn: "Mental Health and Daily Habits",
      icon: "🌿",
      goal: "أن تصف عاداتك اليومية ومشاعرك وتتحدث عن خططك لتحسين صحتك النفسية وتوازنك في الحياة.",
      grammar: [
        {
          title: "المضارع التام المستمر",
          explain: "نستخدم المضارع التام المستمر للحديث عن فعل بدأ في الماضي وما زال مستمراً حتى اللحظة، ونركز فيه على المدة والاستمرارية أكثر من النتيجة. يتكون هذا الزمن من الفعل المساعد المناسب للفاعل، ثم كلمة الاستمرار التي تعني كان، ثم الفعل الأساسي مضافاً إليه النهاية المناسبة. نستخدم معه غالباً تعبيرات المدة مثل: لمدة ساعتين، ومنذ الصباح.",
          table: { headers: ["التركيب", "الاستخدام"], rows: [["الفعل المساعد ثم كلمة الاستمرار ثم الفعل مع النهاية", "فعل بدأ في الماضي وما زال مستمراً"], ["منذ ثم نقطة زمنية", "تحديد بداية الفعل المستمر"], ["لمدة ثم مدة زمنية", "تحديد طول الفعل المستمر"], ["السؤال بأداة الاستفهام ثم الفعل المساعد", "السؤال عن مدة استمرار الفعل"] ] },
          examples: [
            { en: "I have been reading about mental health all week.", ar: "أقرأ عن الصحة النفسية طوال هذا الأسبوع." },
            { en: "She has been working here since January.", ar: "تعمل هنا منذ شهر يناير." },
            { en: "They have been waiting for the doctor for an hour.", ar: "ينتظرون الطبيب منذ ساعة." },
            { en: "How long have you been learning English?", ar: "منذ متى تتعلم الإنجليزية؟" },
            { en: "He has not been sleeping well recently.", ar: "لم يكن ينام جيداً في الآونة الأخيرة." }
          ],
          tips: [
            "استخدم هذا الزمن عندما يكون استمرار الفعل هو المهم، لا نتيجته النهائية.",
            "لا تستخدمه مع الأفعال التي لا تدل على حركة أو استمرار، مثل أفعال المشاعر والمعرفة.",
            "لاحظ الفرق: المضارع التام يسأل عن النتيجة، والمضارع التام المستمر يسأل عن المدة."
          ]
        },
        {
          title: "التعبير عن العادات القديمة والاعتياد الحالي",
          explain: "نستخدم صيغة الاعتياد في الماضي للحديث عن عادة أو حالة كانت موجودة في السابق ولم تعد الآن. أما عبارة الاعتياد في الحاضر فتتكون من الفعل يكون ثم كلمة معتاد ثم حرف الجر المناسب، ومعناها أن الأمر أصبح مألوفاً لك. الفرق مهم: الأولى تتحدث عن الماضي فقط، والثانية تصف حالة مستمرة في الحاضر.",
          table: { headers: ["العبارة", "المعنى"], rows: [["الاعتياد في الماضي", "عادة أو حالة كانت في السابق ولم تستمر"], ["الاعتياد في الحاضر", "شيء أصبح مألوفاً لك الآن"], ["نفي الاعتياد في الماضي", "أداة النفي ثم كلمة الاعتياد ثم الفعل الأصلي"], ["بعد الاعتياد في الحاضر", "فعل مع النهاية المضافة أو اسم"] ] },
          examples: [
            { en: "I used to drink a lot of coffee, but now I prefer tea.", ar: "كنت أشرب كثيراً من القهوة، لكنني أفضل الشاي الآن." },
            { en: "She did not use to exercise in the morning.", ar: "لم تكن تمارس الرياضة في الصباح." },
            { en: "He is used to working long hours every day.", ar: "لقد اعتاد العمل ساعات طويلة كل يوم." },
            { en: "They are used to the cold weather in winter.", ar: "لقد اعتادوا الطقس البارد في الشتاء." },
            { en: "Did you use to live near the sea?", ar: "هل كنت تعيش قرب البحر؟" }
          ],
          tips: [
            "صيغة الاعتياد في الماضي تصف عادة متكررة أو حالة قديمة، ولا نستخدمها مع مدة محددة.",
            "بعد كلمة معتاد في الحاضر يأتي الفعل مع النهاية المضافة أو اسم، ولا يأتي الفعل في صيغته الأصلية.",
            "من الأخطاء الشائعة نسيان الفعل يكون مع عبارة الاعتياد في الحاضر."
          ]
        }
      ],
      vocab: [
        { en: "stress", ar: "ضغط نفسي", pos: "noun", emoji: "😰", example: { en: "Too much stress can affect your sleep.", ar: "الضغط النفسي الشديد قد يؤثر في نومك." } },
        { en: "anxiety", ar: "قلق", pos: "noun", emoji: "😟", example: { en: "Anxiety can stop you from sleeping well at night.", ar: "القلق قد يمنعك من النوم جيداً في الليل." } },
        { en: "habit", ar: "عادة", pos: "noun", emoji: "🔁", example: { en: "Reading before bed is a good habit.", ar: "القراءة قبل النوم عادة جيدة." } },
        { en: "routine", ar: "روتين يومي", pos: "noun", emoji: "⏳", example: { en: "A regular routine makes my day easier.", ar: "الروتين المنتظم يجعل يومي أسهل." } },
        { en: "improve", ar: "يحسن", pos: "verb", emoji: "📈", example: { en: "Small habits can improve your mental health.", ar: "العادات الصغيرة قد تحسن صحتك النفسية." } },
        { en: "balance", ar: "توازن", pos: "noun", emoji: "⚖️", example: { en: "It is hard to find a balance between work and rest.", ar: "من الصعب إيجاد توازن بين العمل والراحة." } },
        { en: "motivated", ar: "متحمس", pos: "adjective", emoji: "🔥", example: { en: "I feel motivated when I write a daily plan.", ar: "أشعر بالحماس عندما أكتب خطة يومية." } },
        { en: "mood", ar: "مزاج", pos: "noun", emoji: "🙂", example: { en: "Her mood improved after a long walk in the park.", ar: "تحسن مزاجها بعد مشي طويل في الحديقة." } },
        { en: "overcome", ar: "يتغلب على", pos: "verb", emoji: "🧗", example: { en: "He managed to overcome his fear of speaking in public.", ar: "تمكن من التغلب على خوفه من التحدث أمام الناس." } },
        { en: "aware", ar: "مدرك", pos: "adjective", emoji: "👀", example: { en: "I try to be aware of my feelings during busy days.", ar: "أحاول أن أكون مدركاً لمشاعري في الأيام المزدحمة." } },
        { en: "meditation", ar: "تأمل", pos: "noun", emoji: "🕯️", example: { en: "Meditation helps me calm down after a long day.", ar: "يساعدني التأمل على الهدوء بعد يوم طويل." } },
        { en: "suffer", ar: "يعاني", pos: "verb", emoji: "😔", example: { en: "Many students suffer from stress before exams.", ar: "يعاني كثير من الطلاب من الضغط النفسي قبل الامتحانات." } },
        { en: "reduce", ar: "يقلل", pos: "verb", emoji: "📉", example: { en: "Walking every day can reduce stress and anxiety.", ar: "المشي كل يوم قد يقلل الضغط والقلق." } },
        { en: "concentrate", ar: "يركز", pos: "verb", emoji: "🎧", example: { en: "It is difficult to concentrate when you are tired.", ar: "من الصعب أن تركز عندما تكون متعباً." } },
        { en: "give up", ar: "يتخلى عن", pos: "phrase", emoji: "🚫", example: { en: "She decided to give up coffee late at night.", ar: "قررت أن تتخلى عن القهوة في وقت متأخر من الليل." } }
      ],
      sentences: [
        { en: "I have been practicing meditation for twenty minutes every morning.", ar: "أتدرب على التأمل عشرين دقيقة كل صباح." },
        { en: "She has been trying to reduce stress since last month.", ar: "تحاول تقليل الضغط النفسي منذ الشهر الماضي." },
        { en: "He has not been sleeping well because of too much anxiety.", ar: "لم يكن ينام جيداً بسبب كثرة القلق." },
        { en: "I used to eat fast food, but now I cook healthy meals.", ar: "كنت آكل الوجبات السريعة، لكنني الآن أطبخ وجبات صحية." },
        { en: "They are used to waking up early for their new routine.", ar: "لقد اعتادوا الاستيقاظ مبكراً من أجل روتينهم الجديد." },
        { en: "How long have you been working on this project?", ar: "منذ متى تعمل على هذا المشروع؟" },
        { en: "A good habit can improve your mood and your energy.", ar: "العادة الجيدة قد تحسن مزاجك وطاقتك." },
        { en: "We have been talking about mental health for two hours.", ar: "نتحدث عن الصحة النفسية منذ ساعتين." },
        { en: "She did not use to enjoy sports when she was younger.", ar: "لم تكن تحب الرياضة عندما كانت أصغر سناً." },
        { en: "Being aware of your feelings is the first step.", ar: "إدراك مشاعرك هو الخطوة الأولى." },
        { en: "Many people suffer from stress at the end of the year.", ar: "يعاني كثير من الناس من الضغط النفسي في نهاية العام." },
        { en: "He has been learning to concentrate during busy days.", ar: "يتعلم كيف يركز في الأيام المزدحمة." }
      ],
      dialogue: [
        { who: "A", en: "You look tired today. Have you been sleeping well?", ar: "تبدو متعباً اليوم. هل تنام جيداً؟" },
        { who: "B", en: "Not really. I have been working late every night.", ar: "ليس تماماً. كنت أعمل حتى وقت متأخر كل ليلة." },
        { who: "A", en: "You should find a balance between work and rest.", ar: "ينبغي أن تجد توازناً بين العمل والراحة." },
        { who: "B", en: "I know, and I want to improve my daily routine.", ar: "أعرف ذلك، وأريد أن أحسن روتيني اليومي." },
        { who: "A", en: "What about a short walk before bed?", ar: "ما رأيك بنزهة قصيرة قبل النوم؟" },
        { who: "B", en: "That sounds helpful. I will try it tonight.", ar: "تبدو فكرة مفيدة. سأجربها الليلة." }
      ]
    },
    {
      id: "b1u3",
      title: "البيئة والمجتمع",
      titleEn: "Environment and Society",
      icon: "🌍",
      goal: "أن تناقش قضايا البيئة والمجتمع وتقدم اقتراحات وتعبّر عن رأيك بأسلوب موضوعي ومترابط.",
      grammar: [
        {
          title: "المبني للمجهول",
          explain: "نستخدم المبني للمجهول عندما نريد التركيز على الحدث نفسه أو على من وقع عليه الفعل، لا على من قام به. نبنيه بوضع الفعل يكون في الزمن المناسب ثم التصريف الثالث للفعل الرئيسي. وإذا أردنا ذكر من قام بالفعل أضفنا حرف الجر المناسب ثم الفاعل في نهاية الجملة.",
          table: { headers: ["الحالة", "الصيغة"], rows: [["المضارع البسيط", "الفعل يكون في المضارع ثم التصريف الثالث للفعل الرئيسي"], ["الماضي البسيط", "الفعل يكون في الماضي ثم التصريف الثالث للفعل الرئيسي"], ["ذكر من قام بالفعل", "حرف الجر المناسب ثم الفاعل في نهاية الجملة"], ["عدم ذكر من قام بالفعل", "نحذف الفاعل إذا كان مجهولاً أو غير مهم"] ] },
          examples: [
            { en: "Plastic is recycled in many countries.", ar: "يعاد تدوير البلاستيك في بلدان كثيرة." },
            { en: "The new hospital was built last year.", ar: "بني المستشفى الجديد في العام الماضي." },
            { en: "Millions of trees have been cut down in this area.", ar: "قطعت ملايين الأشجار في هذه المنطقة." },
            { en: "The park will be cleaned by volunteers next Saturday.", ar: "سينظف المتنزه على أيدي متطوعين السبت القادم." },
            { en: "English is spoken all over the world.", ar: "تتحدث الإنجليزية في كل أنحاء العالم." }
          ],
          tips: [
            "لا تستخدم المبني للمجهول مع الأفعال اللازمة التي لا تحتاج إلى مفعول به.",
            "استخدم المبني للمجهول في الأخبار والتقارير عندما لا يكون الفاعل معروفاً.",
            "إذا كان من قام بالفعل مهماً فاذكره في نهاية الجملة بعد حرف الجر المناسب."
          ]
        },
        {
          title: "أدوات الربط في الكتابة والكلام",
          explain: "تساعدنا أدوات الربط على تنظيم الأفكار وإظهار العلاقة بين الجمل. بعضها يعبر عن التناقض، وبعضها عن السبب والنتيجة، وبعضها عن الإضافة. انتبه إلى أن بعض الأدوات يتبعها اسم أو فعل مع النهاية المضافة، وبعضها يتبعه جملة كاملة. اختيار الأداة الصحيحة يجعل كلامك أكثر وضوحاً وإقناعاً.",
          table: { headers: ["نوع الأداة", "وظيفتها"], rows: [["أداة التناقض", "تضيف فكرة مخالفة للفكرة السابقة"], ["أداة النتيجة", "تقدم نتيجة لما ذكره المتحدث قبلاً"], ["أداة السبب", "توضح سبب وقوع الحدث"], ["أداة الإضافة", "تضيف فكرة جديدة إلى الفكرة السابقة"] ] },
          examples: [
            { en: "Although the weather was cold, we cleaned the beach.", ar: "رغم أن الطقس كان بارداً فقد نظفنا الشاطئ." },
            { en: "The city is noisy. However, I enjoy living here.", ar: "المدينة صاخبة. ومع ذلك أستمتع بالعيش هنا." },
            { en: "Public transport is cheap. Therefore, many people use it.", ar: "النقل العام رخيص. لذلك يستخدمه كثير من الناس." },
            { en: "Despite the heavy rain, the volunteers continued their work.", ar: "رغم المطر الغزير واصل المتطوعون عملهم." },
            { en: "He studied hard, so he passed the exam easily.", ar: "درس بجد، لذلك نجح في الامتحان بسهولة." }
          ],
          tips: [
            "بعد الأداة التي يتبعها اسم نستخدم الفعل مع النهاية المضافة، لا جملة كاملة.",
            "لا تجمع بين أداتين للتناقض في الجملة نفسها لتفادي الخطأ.",
            "استخدم أداة النتيجة في بداية الجملة الثانية لتوضح العلاقة بين الفكرتين."
          ]
        }
      ],
      vocab: [
        { en: "environment", ar: "البيئة", pos: "noun", emoji: "🌍", example: { en: "We must protect the environment for future generations.", ar: "علينا حماية البيئة للأجيال القادمة." } },
        { en: "pollution", ar: "تلوث", pos: "noun", emoji: "🏭", example: { en: "Air pollution is a serious problem in big cities.", ar: "تلوث الهواء مشكلة خطيرة في المدن الكبيرة." } },
        { en: "recycle", ar: "يعيد التدوير", pos: "verb", emoji: "♻️", example: { en: "We recycle paper and glass at home.", ar: "نعيد تدوير الورق والزجاج في المنزل." } },
        { en: "climate", ar: "مناخ", pos: "noun", emoji: "🌡️", example: { en: "Climate change affects the whole planet.", ar: "تغير المناخ يؤثر في الكوكب كله." } },
        { en: "waste", ar: "يهدر", pos: "verb", emoji: "🗑️", example: { en: "Factories waste a lot of energy every day.", ar: "تهدر المصانع كثيراً من الطاقة كل يوم." } },
        { en: "society", ar: "مجتمع", pos: "noun", emoji: "🏙️", example: { en: "Every society needs clear rules to live in peace.", ar: "كل مجتمع يحتاج قواعد واضحة ليعيش في سلام." } },
        { en: "community", ar: "مجتمع محلي", pos: "noun", emoji: "🤝", example: { en: "Our community organized a day to clean the park.", ar: "نظم مجتمعنا المحلي يوماً لتنظيف الحديقة." } },
        { en: "volunteer", ar: "يتطوع", pos: "verb", emoji: "🙌", example: { en: "Many students volunteer to help older people.", ar: "يتطوع كثير من الطلاب لمساعدة كبار السن." } },
        { en: "damage", ar: "يضر", pos: "verb", emoji: "💥", example: { en: "Plastic bags damage the ocean and sea animals.", ar: "تضر الأكياس البلاستيكية بالمحيط وحيوانات البحر." } },
        { en: "government", ar: "حكومة", pos: "noun", emoji: "🏛️", example: { en: "The government promised to build more bike lanes.", ar: "وعدت الحكومة ببناء مزيد من مسارات الدراجات." } },
        { en: "public transport", ar: "نقل عام", pos: "phrase", emoji: "🚌", example: { en: "Public transport is cheaper than driving a car.", ar: "النقل العام أرخص من قيادة السيارة." } },
        { en: "issue", ar: "قضية", pos: "noun", emoji: "❗", example: { en: "Housing is an important issue in many cities.", ar: "الإسكان قضية مهمة في مدن كثيرة." } },
        { en: "however", ar: "مع ذلك", pos: "adverb", emoji: "🔄", example: { en: "The plan is expensive; however, it may solve the problem.", ar: "الخطة مكلفة؛ ومع ذلك قد تحل المشكلة." } },
        { en: "despite", ar: "رغم", pos: "preposition", emoji: "🌧️", example: { en: "Despite the rain, we cleaned the whole beach.", ar: "رغم المطر نظفنا الشاطئ كله." } },
        { en: "energy", ar: "طاقة", pos: "noun", emoji: "🔋", example: { en: "Solar energy is clean and cheap.", ar: "الطاقة الشمسية نظيفة ورخيصة." } }
      ],
      sentences: [
        { en: "Plastic bottles are recycled in many countries around the world.", ar: "يعاد تدوير القوارير البلاستيكية في بلدان كثيرة حول العالم." },
        { en: "The new library was built with money from the government.", ar: "بنيت المكتبة الجديدة بمال من الحكومة." },
        { en: "Millions of trees have been cut down in the last ten years.", ar: "قطعت ملايين الأشجار في السنوات العشر الماضية." },
        { en: "Although the air is dirty, the city is trying to improve it.", ar: "رغم أن الهواء ملوث فإن المدينة تحاول تحسينه." },
        { en: "Public transport is cheap; therefore, many people use it daily.", ar: "النقل العام رخيص؛ لذلك يستخدمه كثير من الناس يومياً." },
        { en: "Despite the cold weather, volunteers cleaned the whole park.", ar: "رغم الطقس البارد نظف المتطوعون الحديقة كلها." },
        { en: "Our community has organized a project to protect the river.", ar: "نظم مجتمعنا المحلي مشروعاً لحماية النهر." },
        { en: "The government should spend more money on clean energy.", ar: "على الحكومة أن تنفق مزيداً من المال على الطاقة النظيفة." },
        { en: "Climate change is an issue that affects every country.", ar: "تغير المناخ قضية تؤثر في كل بلد." },
        { en: "We should not waste water, even in winter.", ar: "لا ينبغي أن نهدر الماء حتى في الشتاء." },
        { en: "A healthy society depends on education and honest work.", ar: "المجتمع السليم يعتمد على التعليم والعمل الجاد." },
        { en: "The problem of pollution will be discussed at the meeting.", ar: "ستناقش مشكلة التلوث في الاجتماع." }
      ],
      dialogue: [
        { who: "A", en: "Have you heard about the new recycling project?", ar: "هل سمعت عن مشروع إعادة التدوير الجديد؟" },
        { who: "B", en: "Yes, it was started by a group of students.", ar: "نعم، بدأه مجموعة من الطلاب." },
        { who: "A", en: "That is great. Our street needs more green spaces too.", ar: "هذا رائع. يحتاج شارعنا إلى مساحات خضراء أكثر أيضاً." },
        { who: "B", en: "I agree. However, the government must support such ideas.", ar: "أوافق. ومع ذلك على الحكومة أن تدعم مثل هذه الأفكار." },
        { who: "A", en: "Why don't we join the next volunteer day?", ar: "لماذا لا نشارك في يوم التطوع القادم؟" },
        { who: "B", en: "Good idea. I will invite our neighbors as well.", ar: "فكرة جيدة. سأدعو جيراننا أيضاً." }
      ]
    },
    {
      id: "b1u4",
      title: "الإعلام والأخبار والرأي",
      titleEn: "Media, News and Opinion",
      icon: "📰",
      goal: "أن تتابع الأخبار وتنقل كلام الآخرين وتعبّر عن رأيك وتتحقق من مصداقية المصادر.",
      grammar: [
        {
          title: "الكلام المنقول",
          explain: "نستخدم الكلام المنقول لنقل ما قاله شخص آخر دون استخدام كلماته الحرفية. عند النقل نرجع الزمن خطوة واحدة إلى الوراء، ونغير الضمائر بحسب المعنى، ونغير تعبيرات الزمان والمكان إذا لزم الأمر. وإذا كان الفعل الناقل في الماضي وجب علينا إرجاع الزمن، أما إذا كان في المضارع فيبقى الزمن كما هو.",
          table: { headers: ["الزمن في الكلام الأصلي", "الزمن بعد النقل"], rows: [["المضارع البسيط", "يصبح ماضياً بسيطاً"], ["المضارع المستمر", "يصبح ماضياً مستمراً"], ["الماضي البسيط", "يصبح ماضياً تاماً"], ["المضارع التام", "يصبح ماضياً تاماً"], ["صيغة المستقبل", "تصبح صيغة المستقبل في الماضي"] ] },
          examples: [
            { en: "She said that she was very tired.", ar: "قالت إنها كانت متعبة جداً." },
            { en: "He told me he had finished the article.", ar: "أخبرني أنه أنهى المقال." },
            { en: "They said they would send the photos later.", ar: "قالوا إنهم سيرسلون الصور لاحقاً." },
            { en: "The journalist asked if the story was true.", ar: "سأل الصحفي إن كانت القصة صحيحة." },
            { en: "She asked me where I had found that information.", ar: "سألتني من أين حصلت على تلك المعلومة." }
          ],
          tips: [
            "الضمائر تتغير بحسب المعنى، لا بحسب شكل الجملة الأصلية.",
            "إذا كان الفعل الناقل في المضارع فلا حاجة إلى إرجاع الزمن خطوة إلى الوراء.",
            "في الأسئلة المنقولة نحوّل السؤال إلى جملة عادية ونستخدم أداة الربط المناسبة."
          ]
        },
        {
          title: "أفعال الترجيح والاستنتاج",
          explain: "نستخدم هذه الأفعال للتعبير عن درجة تأكدنا من معلومة ما. عندما نكون متأكدين تماماً نستخدم فعل التأكيد القوي، وعندما نستبعد شيئاً استبعاداً تاماً نستخدم فعل النفي القوي، وعندما نرجح احتمالاً نستخدم فعل الاحتمال. الفرق بينها هو درجة اليقين فقط، ويأتي بعدها الفعل في صيغته الأصلية.",
          table: { headers: ["درجة اليقين", "الأداة المناسبة"], rows: [["متأكد تماماً", "فعل التأكيد القوي ثم الفعل في صيغته الأصلية"], ["مستبعد تماماً", "فعل النفي القوي ثم الفعل في صيغته الأصلية"], ["احتمال ممكن", "فعل الاحتمال ثم الفعل في صيغته الأصلية"], ["حديث عن الماضي", "فعل الترجيح ثم صيغة تدل على اكتمال الحدث"] ] },
          examples: [
            { en: "You must be tired after such a long flight.", ar: "لا بد أنك متعب بعد رحلة طويلة كهذه." },
            { en: "She cannot be the writer of this article; she is only fifteen.", ar: "لا يمكن أن تكون كاتبة هذا المقال؛ فهي في الخامسة عشرة فقط." },
            { en: "He might be late because of the heavy traffic.", ar: "قد يتأخر بسبب الزحام الشديد." },
            { en: "This story must be true; three sources reported it.", ar: "لا بد أن هذه القصة صحيحة؛ فقد نقلتها ثلاثة مصادر." },
            { en: "They may not know about the new evidence.", ar: "قد لا يعرفون بالأدلة الجديدة." }
          ],
          tips: [
            "استخدم فعل النفي القوي عندما تكون المعلومة مستحيلة منطقياً.",
            "للحديث عن الماضي أضف صيغة تدل على اكتمال الحدث بعد فعل الترجيح.",
            "فعل الاحتمال يعبر عن احتمال حقيقي، فلا تستخدمه عندما تكون متأكداً."
          ]
        }
      ],
      vocab: [
        { en: "opinion", ar: "رأي", pos: "noun", emoji: "💭", example: { en: "In my opinion, the news is sometimes too dramatic.", ar: "في رأيي أن الأخبار مبالغ فيها أحياناً." } },
        { en: "headline", ar: "عنوان رئيسي", pos: "noun", emoji: "📰", example: { en: "The headline on the front page was shocking.", ar: "كان العنوان الرئيسي في الصفحة الأولى صادماً." } },
        { en: "article", ar: "مقال", pos: "noun", emoji: "📄", example: { en: "I read an interesting article about healthy eating.", ar: "قرأت مقالاً شيقاً عن الأكل الصحي." } },
        { en: "journalist", ar: "صحفي", pos: "noun", emoji: "🎙️", example: { en: "The journalist interviewed the mayor about the new hospital.", ar: "قابل الصحفي رئيس البلدية للحديث عن المستشفى الجديد." } },
        { en: "source", ar: "مصدر", pos: "noun", emoji: "🔎", example: { en: "Always check the source of the information you share.", ar: "تحقق دائماً من مصدر المعلومة التي تنشرها." } },
        { en: "reliable", ar: "موثوق", pos: "adjective", emoji: "✅", example: { en: "This website is not always a reliable source of news.", ar: "هذا الموقع ليس دائماً مصدراً موثوقاً للأخبار." } },
        { en: "broadcast", ar: "يبث", pos: "verb", emoji: "📡", example: { en: "They broadcast the match live on television.", ar: "بثوا المباراة مباشرة على التلفاز." } },
        { en: "audience", ar: "جمهور المشاهدين", pos: "noun", emoji: "🎭", example: { en: "The audience asked many questions after the show.", ar: "طرح الجمهور أسئلة كثيرة بعد البرنامج." } },
        { en: "advertise", ar: "يعلن عن", pos: "verb", emoji: "📢", example: { en: "Companies advertise their products on social media.", ar: "تعلن الشركات عن منتجاتها على وسائل التواصل." } },
        { en: "influence", ar: "يؤثر في", pos: "verb", emoji: "🌐", example: { en: "Social media can influence the way we think.", ar: "قد تؤثر وسائل التواصل في طريقة تفكيرنا." } },
        { en: "actually", ar: "في الحقيقة", pos: "adverb", emoji: "💡", example: { en: "I actually prefer reading the news online.", ar: "أنا في الحقيقة أفضل قراءة الأخبار على الإنترنت." } },
        { en: "rumor", ar: "شائعة", pos: "noun", emoji: "🗣️", example: { en: "The rumor about the factory closing was not true.", ar: "كانت الشائعة عن إغلاق المصنع غير صحيحة." } },
        { en: "convince", ar: "يقنع", pos: "verb", emoji: "🤔", example: { en: "He tried to convince me with facts and numbers.", ar: "حاول أن يقنعني بالوقائع والأرقام." } },
        { en: "comment", ar: "تعليق", pos: "noun", emoji: "💬", example: { en: "She left a long comment under the video.", ar: "كتبت تعليقاً طويلاً تحت الفيديو." } },
        { en: "consider", ar: "يعتبر أو يدرس", pos: "verb", emoji: "🧠", example: { en: "Please consider other opinions before you decide.", ar: "خذ في الاعتبار آراء أخرى قبل أن تقرر." } }
      ],
      sentences: [
        { en: "The journalist said that the report had been written quickly.", ar: "قال الصحفي إن التقرير قد كتب بسرعة." },
        { en: "She told me she would publish the article on Friday.", ar: "أخبرتني أنها ستنشر المقال يوم الجمعة." },
        { en: "He asked me if I had read the headline that morning.", ar: "سألني إن كنت قد قرأت العنوان الرئيسي في ذلك الصباح." },
        { en: "You must be joking; that story cannot be true.", ar: "لا بد أنك تمزح؛ لا يمكن أن تكون تلك القصة صحيحة." },
        { en: "The audience might not agree with the speaker's opinion.", ar: "قد لا يوافق الجمهور على رأي المتحدث." },
        { en: "Many people consider social media a reliable source of news.", ar: "يعتبر كثير من الناس وسائل التواصل مصدراً موثوقاً للأخبار." },
        { en: "The interview was broadcast live on national television.", ar: "بثت المقابلة مباشرة على التلفاز الوطني." },
        { en: "We should check the source before we share any comment.", ar: "علينا التحقق من المصدر قبل نشر أي تعليق." },
        { en: "Although the article was long, it was actually very interesting.", ar: "رغم أن المقال كان طويلاً فقد كان شيقاً جداً في الحقيقة." },
        { en: "Companies often advertise products that nobody really needs.", ar: "تعلن الشركات غالباً عن منتجات لا يحتاجها أحد حقاً." },
        { en: "He might have forgotten to send the photos yesterday.", ar: "قد يكون نسي إرسال الصور أمس." },
        { en: "In my opinion, everyone should compare at least two sources.", ar: "في رأيي ينبغي أن يقارن كل شخص مصدرين على الأقل." }
      ],
      dialogue: [
        { who: "A", en: "Did you see the headline about the new train line?", ar: "هل رأيت العنوان الرئيسي عن خط القطار الجديد؟" },
        { who: "B", en: "Yes, but I am not sure the story is reliable.", ar: "نعم، لكنني لست متأكداً من أن الخبر موثوق." },
        { who: "A", en: "Why do you say that? It was on the main news.", ar: "لماذا تقول ذلك؟ لقد ظهر في نشرة الأخبار الرئيسية." },
        { who: "B", en: "The journalist did not mention any clear source.", ar: "لم يذكر الصحفي أي مصدر واضح." },
        { who: "A", en: "Then I will check another website before I share it.", ar: "إذن سأتحقق من موقع آخر قبل أن أنشره." },
        { who: "B", en: "Good idea. Rumors spread very quickly online.", ar: "فكرة جيدة. تنتشر الشائعات بسرعة كبيرة على الإنترنت." }
      ]
    },
    {
      id: "b1u5",
      title: "التخطيط للمستقبل والدراسة",
      titleEn: "Future Plans and Study",
      icon: "🎓",
      goal: "أن تخطط لمستقبلك الدراسي والمهني وتتحدث عن الشروط والاحتمالات والخطط البديلة بوضوح.",
      grammar: [
        {
          title: "الجملة الشرطية الأولى والثانية",
          explain: "نستخدم الجملة الشرطية الأولى للحديث عن موقف ممكن الحدوث في المستقبل، فيكون الشرط في المضارع البسيط والنتيجة في المستقبل. أما الجملة الشرطية الثانية فتستخدم لموقف خيالي أو غير محتمل في الحاضر، فيكون الشرط في الماضي البسيط والنتيجة بصيغة المستقبل في الماضي ثم الفعل في صيغته الأصلية.",
          table: { headers: ["نوع الشرط", "التركيب والمعنى"], rows: [["الشرطية الأولى", "شرط في المضارع البسيط ونتيجة في المستقبل، لموقف ممكن"], ["الشرطية الثانية", "شرط في الماضي البسيط ونتيجة في المستقبل من الماضي، لموقف خيالي"], ["في الشرطية الثانية", "نستخدم صيغة الماضي مع جميع الضمائر في جملة الشرط"], ["ترتيب الجملتين", "يمكن تقديم النتيجة على الشرط مع وضع فاصلة بينهما"] ] },
          examples: [
            { en: "If it rains tomorrow, we will study at home.", ar: "إذا أمطرت غداً فسندرس في المنزل." },
            { en: "If I had more free time, I would learn another language.", ar: "لو كان لدي وقت فراغ أكثر لتعلمت لغة أخرى." },
            { en: "She will pass the exam if she revises every day.", ar: "ستنجح في الامتحان إذا راجعت دروسها كل يوم." },
            { en: "If we lived near the university, we would save money.", ar: "لو كنا نسكن قرب الجامعة لوفرنا المال." },
            { en: "What would you study if you could choose again?", ar: "ماذا كنت ستدرس لو استطعت الاختيار مرة أخرى؟" }
          ],
          tips: [
            "لا تستخدم صيغة المستقبل بعد أداة الشرط في الجملة الشرطية الأولى.",
            "في الجملة الشرطية الثانية نستخدم صيغة الماضي مع جميع الضمائر حتى مع المفرد الغائب.",
            "إذا بدأت بجملة النتيجة فضع فاصلة بينها وبين جملة الشرط."
          ]
        },
        {
          title: "الصيغة الاسمية للفعل والمصدر",
          explain: "بعض الأفعال يتبعها الفعل بصيغة اسمية تنتهي بنهاية تدل على الاسمية، وبعضها يتبعه الفعل في صيغته الأصلية، وبعضها يقبل الصيغتين. كما أن حروف الجر يتبعها الفعل بالصيغة الاسمية دائماً. حفظ الأفعال الشائعة مع الصيغة التي تتبعها يوفر عليك كثيراً من الأخطاء.",
          table: { headers: ["الحالة", "الصيغة المطلوبة"], rows: [["فعل يتبع بصيغة اسمية", "الفعل مع النهاية الدالة على الاسمية"], ["فعل يتبع بمصدر", "الفعل في صيغته الأصلية"], ["بعد حرف الجر", "الفعل مع النهاية الدالة على الاسمية دائماً"], ["بعد بعض الصفات", "الفعل في صيغته الأصلية"] ] },
          examples: [
            { en: "I enjoy learning new languages.", ar: "أستمتع بتعلم لغات جديدة." },
            { en: "She decided to study abroad next year.", ar: "قررت أن تدرس في الخارج العام القادم." },
            { en: "He is good at solving difficult problems.", ar: "إنه بارع في حل المشكلات الصعبة." },
            { en: "They want to open their own business.", ar: "يريدون أن يفتحوا مشروعهم الخاص." },
            { en: "Thank you for helping me with my homework.", ar: "شكراً لك على مساعدتي في واجبي." },
            { en: "It is important to plan your future early.", ar: "من المهم أن تخطط لمستقبلك مبكراً." }
          ],
          tips: [
            "بعد حروف الجر استخدم الصيغة الاسمية دائماً، ولا تستخدم الفعل في صيغته الأصلية.",
            "احفظ الأفعال الشائعة مع الصيغة التي تتبعها، فهذا أسرع طريق إلى الإتقان.",
            "بعض الأفعال يتغير معناها بحسب الصيغة التي تتبعها، فانتبه إلى السياق."
          ]
        }
      ],
      vocab: [
        { en: "decision", ar: "قرار", pos: "noun", emoji: "🧩", example: { en: "Moving abroad was the biggest decision of my life.", ar: "كان الانتقال إلى الخارج أكبر قرار في حياتي." } },
        { en: "goal", ar: "هدف", pos: "noun", emoji: "🥅", example: { en: "My main goal is to speak English fluently.", ar: "هدفي الأساسي أن أتحدث الإنجليزية بطلاقة." } },
        { en: "career", ar: "مسار مهني", pos: "noun", emoji: "🚀", example: { en: "She wants a career in computer science.", ar: "تريد مساراً مهنياً في علوم الحاسوب." } },
        { en: "university", ar: "جامعة", pos: "noun", emoji: "🎓", example: { en: "I plan to study economics at university next year.", ar: "أخطط لدراسة الاقتصاد في الجامعة العام القادم." } },
        { en: "degree", ar: "شهادة جامعية", pos: "noun", emoji: "📜", example: { en: "She is studying for a degree in engineering.", ar: "تدرس لنيل شهادة جامعية في الهندسة." } },
        { en: "course", ar: "دورة تدريبية", pos: "noun", emoji: "📚", example: { en: "This online course takes six months to finish.", ar: "تستغرق هذه الدورة على الإنترنت ستة أشهر لإنهائها." } },
        { en: "qualification", ar: "مؤهل", pos: "noun", emoji: "🏅", example: { en: "You need a teaching qualification for this job.", ar: "تحتاج إلى مؤهل في التعليم لهذه الوظيفة." } },
        { en: "graduate", ar: "يتخرج", pos: "verb", emoji: "🎉", example: { en: "He will graduate from university next summer.", ar: "سيتخرج من الجامعة في الصيف القادم." } },
        { en: "register", ar: "يسجل", pos: "verb", emoji: "✍️", example: { en: "You must register for the exam before Friday.", ar: "عليك أن تسجل في الامتحان قبل يوم الجمعة." } },
        { en: "afford", ar: "يستطيع تحمل التكلفة", pos: "verb", emoji: "💸", example: { en: "We cannot afford a long holiday this year.", ar: "لا نستطيع تحمل تكلفة عطلة طويلة هذا العام." } },
        { en: "prepare", ar: "يستعد أو يحضر", pos: "verb", emoji: "🧰", example: { en: "It is wise to prepare for the interview early.", ar: "من الحكمة أن تستعد للمقابلة مبكراً." } },
        { en: "abroad", ar: "في الخارج", pos: "adverb", emoji: "✈️", example: { en: "Many students want to study abroad for a year.", ar: "يريد كثير من الطلاب الدراسة في الخارج لمدة سنة." } },
        { en: "determined", ar: "مصمم", pos: "adjective", emoji: "🔒", example: { en: "She is determined to finish her studies this year.", ar: "إنها مصممة على إنهاء دراستها هذا العام." } },
        { en: "flexible", ar: "مرن", pos: "adjective", emoji: "🔄", example: { en: "Online courses are flexible and fit around my job.", ar: "الدورات على الإنترنت مرنة وتناسب وقتي مع العمل." } },
        { en: "revise", ar: "يراجع الدروس", pos: "verb", emoji: "📖", example: { en: "I need to revise my notes before the test.", ar: "أحتاج إلى مراجعة ملاحظاتي قبل الاختبار." } }
      ],
      sentences: [
        { en: "If you revise every day, you will pass the final exam.", ar: "إذا راجعت دروسك كل يوم فستنجح في الامتحان النهائي." },
        { en: "If I had more money, I would study at a foreign university.", ar: "لو كان لدي مال أكثر لدرست في جامعة أجنبية." },
        { en: "She has decided to register for an online course in design.", ar: "قررت أن تسجل في دورة على الإنترنت في التصميم." },
        { en: "We are determined to finish this project before the deadline.", ar: "نحن مصممون على إنهاء هذا المشروع قبل الموعد النهائي." },
        { en: "If they offered me a scholarship, I would accept it immediately.", ar: "لو عرضوا علي منحة دراسية لقبلتها فوراً." },
        { en: "He wants to graduate and find a good job abroad.", ar: "يريد أن يتخرج ويجد عملاً جيداً في الخارج." },
        { en: "Do you think you can afford a course like this one?", ar: "هل تعتقد أنك تستطيع تحمل تكلفة دورة كهذه؟" },
        { en: "Learning a new skill is easier when you have a clear goal.", ar: "تعلم مهارة جديدة أسهل عندما يكون لديك هدف واضح." },
        { en: "I am used to preparing my lessons the night before.", ar: "لقد اعتدت تحضير دروسي في الليلة السابقة." },
        { en: "What would you do if you failed the first exam?", ar: "ماذا ستفعل لو رسبت في الامتحان الأول؟" },
        { en: "She is good at planning her time and meeting deadlines.", ar: "إنها بارعة في تنظيم وقتها والالتزام بالمواعيد النهائية." },
        { en: "If we start early, we will have more time to prepare.", ar: "إذا بدأنا مبكراً سيكون لدينا وقت أكثر للاستعداد." }
      ],
      dialogue: [
        { who: "A", en: "Have you decided what you will study next year?", ar: "هل قررت ماذا ستدرس العام القادم؟" },
        { who: "B", en: "Yes, I want to study computer science abroad.", ar: "نعم، أريد أن أدرس علوم الحاسوب في الخارج." },
        { who: "A", en: "That sounds exciting. Can you afford the tuition fees?", ar: "يبدو ذلك مشوقاً. هل تستطيع تحمل الرسوم الدراسية؟" },
        { who: "B", en: "I have applied for a scholarship, and I am quite determined.", ar: "تقدمت بطلب لمنحة دراسية، وأنا مصمم تماماً." },
        { who: "A", en: "If you get it, will you live on campus?", ar: "إذا حصلت عليها، هل ستعيش داخل الحرم الجامعي؟" },
        { who: "B", en: "Probably yes, and I would share a flat with a friend.", ar: "على الأرجح نعم، وسأشارك شقة مع صديق." }
      ]
    },
    {
      id: "b1u6",
      title: "العلاقات والتواصل وحل المشكلات",
      titleEn: "Relationships, Communication and Problem Solving",
      icon: "🤗",
      goal: "أن تتحدث عن علاقاتك الاجتماعية وتصف المشكلات وتقترح حلولاً وتعتذر وتتفاوض بلباقة.",
      grammar: [
        {
          title: "الجملة الشرطية الثالثة",
          explain: "نستخدم الجملة الشرطية الثالثة للحديث عن موقف خيالي في الماضي لم يحدث، وغالباً ما نستخدمها للتعبير عن الأسف أو اللوم. تكون جملة الشرط في الماضي التام، وتكون جملة النتيجة بصيغة المستقبل في الماضي ثم التصريف الثالث للفعل الرئيسي. أي أن الشرط لم يتحقق، ولذلك لم تتحقق النتيجة.",
          table: { headers: ["جزء الجملة", "التركيب"], rows: [["جملة الشرط", "الفعل المساعد في الماضي ثم التصريف الثالث للفعل"], ["جملة النتيجة", "صيغة المستقبل في الماضي ثم التصريف الثالث للفعل"], ["المعنى", "شرط لم يتحقق في الماضي ونتيجة لم تحدث"], ["الاستخدام الشائع", "التعبير عن الأسف أو نقد قرار قديم"] ] },
          examples: [
            { en: "If I had studied harder, I would have passed the exam.", ar: "لو درست بجد أكثر لنجحت في الامتحان." },
            { en: "If she had known the truth, she would have told us.", ar: "لو عرفت الحقيقة لأخبرتنا." },
            { en: "We would have arrived earlier if we had left on time.", ar: "لو خرجنا في الوقت المحدد لوصلنا أبكر." },
            { en: "If he had apologized, she would have forgiven him.", ar: "لو اعتذر لسامحته." },
            { en: "I would not have said that if I had been calmer.", ar: "لم أكن لأقول ذلك لو كنت أكثر هدوءاً." }
          ],
          tips: [
            "الشرط الثالث يتحدث عن الماضي دائماً، فلا تستخدمه للخطط المستقبلية.",
            "يمكن تقديم جملة النتيجة على جملة الشرط مع بقاء التركيب نفسه.",
            "نستخدم هذا الشرط كثيراً للتعبير عن الأسف على ما لم يحدث."
          ]
        },
        {
          title: "الجمل الوصلية لوصف الأشخاص والأشياء",
          explain: "نستخدم الجملة الوصلية لإضافة معلومة عن اسم سبقها دون أن نبدأ جملة جديدة. نختار ضمير الوصل بحسب الاسم الذي نصفه: فضمير خاص بالعاقل، وضمير خاص بغير العاقل، وضمير يدل على الملكية. وإذا كانت المعلومة ضرورية لفهم الجملة فلا نضع فاصلة، وإذا كانت إضافة غير ضرورية وضعناها بين فاصلتين.",
          table: { headers: ["نوع الاسم", "ضمير الوصل المناسب"], rows: [["اسم عاقل", "ضمير الوصل الخاص بالعاقل"], ["اسم غير عاقل", "ضمير الوصل الخاص بغير العاقل"], ["اسم يدل على الملكية", "ضمير الوصل الدال على الملكية"], ["معلومة ضرورية", "بدون فاصلة لأنها تحدد الاسم"], ["معلومة إضافية", "بين فاصلتين لأن الاسم معروف"] ] },
          examples: [
            { en: "The friend who helped me yesterday is a doctor.", ar: "الصديق الذي ساعدني أمس طبيب." },
            { en: "This is the book which changed my opinion.", ar: "هذا هو الكتاب الذي غير رأيي." },
            { en: "She has a neighbour whose garden is full of flowers.", ar: "لديها جار حديقته مليئة بالأزهار." },
            { en: "The city where I grew up is near the sea.", ar: "المدينة التي نشأت فيها قريبة من البحر." },
            { en: "My brother, who lives in Cairo, is visiting us.", ar: "أخي، الذي يعيش في القاهرة، يزورنا الآن." }
          ],
          tips: [
            "استخدم ضمير الوصل الخاص بالعاقل مع الأشخاص، وضمير غير العاقل مع الأشياء.",
            "لا تكرر الفاعل أو المفعول بعد ضمير الوصل، فالجملة الوصلية تكفي عنه.",
            "الأفعال المركبة شائعة في الجمل الوصلية، مثل أن تتفق مع شخص أو أن تتطلع إلى شيء."
          ]
        }
      ],
      vocab: [
        { en: "relationship", ar: "علاقة", pos: "noun", emoji: "💞", example: { en: "A good relationship needs trust and honest talks.", ar: "العلاقة الجيدة تحتاج إلى ثقة وحديث صادق." } },
        { en: "trust", ar: "ثقة", pos: "noun", emoji: "🔐", example: { en: "Trust is the most important part of any friendship.", ar: "الثقة أهم جزء في أي صداقة." } },
        { en: "argue", ar: "يتجادل", pos: "verb", emoji: "💥", example: { en: "They sometimes argue about small things at home.", ar: "يتجادلان أحياناً حول أمور صغيرة في البيت." } },
        { en: "apologize", ar: "يعتذر", pos: "verb", emoji: "🙏", example: { en: "He decided to apologize for his rude words.", ar: "قرر أن يعتذر عن كلماته الجارحة." } },
        { en: "support", ar: "يدعم", pos: "verb", emoji: "🫂", example: { en: "My friends always support me when I have problems.", ar: "يساندني أصدقائي دائماً عندما أواجه مشكلات." } },
        { en: "honest", ar: "صادق", pos: "adjective", emoji: "🔍", example: { en: "Please be honest with me about this problem.", ar: "كن صادقاً معي في هذه المشكلة من فضلك." } },
        { en: "misunderstand", ar: "يسيء الفهم", pos: "verb", emoji: "❓", example: { en: "People often misunderstand each other in text messages.", ar: "كثيراً ما يسيء الناس فهم بعضهم في الرسائل النصية." } },
        { en: "forgive", ar: "يسامح", pos: "verb", emoji: "🕊️", example: { en: "It is not easy to forgive a close friend.", ar: "ليس سهلاً أن تسامح صديقاً مقرباً." } },
        { en: "solve", ar: "يحل", pos: "verb", emoji: "🧩", example: { en: "We need to solve this problem together.", ar: "علينا أن نحل هذه المشكلة معاً." } },
        { en: "compromise", ar: "تسوية", pos: "noun", emoji: "⚖️", example: { en: "Every good friendship needs a little compromise.", ar: "كل صداقة جيدة تحتاج إلى قليل من التسوية." } },
        { en: "get on with", ar: "يتفق مع أو ينسجم مع", pos: "phrase", emoji: "😊", example: { en: "I get on with my sister very well.", ar: "أنا منسجم مع أختي تماماً." } },
        { en: "look forward to", ar: "يتطلع إلى", pos: "phrase", emoji: "🌟", example: { en: "I look forward to meeting your family.", ar: "أتطلع إلى لقاء عائلتك." } },
        { en: "make up", ar: "يتصالح", pos: "phrase", emoji: "💫", example: { en: "They had a fight but decided to make up.", ar: "تخاصما لكنهما قررا أن يتصالحا." } },
        { en: "kindness", ar: "لطف", pos: "noun", emoji: "💛", example: { en: "Thank you for your kindness during a hard week.", ar: "شكراً لك على لطفك في أسبوع صعب." } },
        { en: "patient", ar: "صبور", pos: "adjective", emoji: "🧘", example: { en: "You must be patient when you teach children.", ar: "عليك أن تكون صبوراً عندما تعلم الأطفال." } }
      ],
      sentences: [
        { en: "If I had apologized earlier, we would not have argued.", ar: "لو اعتذرت مبكراً لما تجادلنا." },
        { en: "She would have forgiven him if he had told the truth.", ar: "لو قال الحقيقة لسامحته." },
        { en: "The friend who always supports me is my old classmate.", ar: "الصديق الذي يساندني دائماً هو زميلي القديم." },
        { en: "We need to solve this problem before it becomes bigger.", ar: "علينا حل هذه المشكلة قبل أن تكبر." },
        { en: "They argued for an hour, but they made up in the end.", ar: "تجادلا لمدة ساعة، لكنهما تصالحا في النهاية." },
        { en: "If you had listened carefully, you would have understood her.", ar: "لو استمعت بتركيز لفهمتها." },
        { en: "A good relationship is built on trust and honest words.", ar: "العلاقة الجيدة تبنى على الثقة والكلام الصادق." },
        { en: "I look forward to meeting your family next weekend.", ar: "أتطلع إلى لقاء عائلتك في نهاية الأسبوع القادم." },
        { en: "He apologized for the mistake and promised to be careful.", ar: "اعتذر عن الخطأ ووعد بأن يكون حريصاً." },
        { en: "It is not easy to forgive someone who lied to you.", ar: "ليس سهلاً أن تسامح شخصاً كذب عليك." },
        { en: "We should talk calmly instead of arguing about small things.", ar: "علينا أن نتحدث بهدوء بدلاً من الجدال حول أمور صغيرة." },
        { en: "If they had compromised, everyone would have been happier.", ar: "لو توصلا إلى تسوية لكان الجميع أكثر سعادة." }
      ],
      dialogue: [
        { who: "A", en: "You look upset. What happened with your brother?", ar: "تبدو منزعجاً. ماذا حدث مع أخيك؟" },
        { who: "B", en: "We argued about money, and now we are not talking.", ar: "تجادلنا بشأن المال، والآن لا نتحدث." },
        { who: "A", en: "If I were you, I would apologize first.", ar: "لو كنت مكانك لاعتذرت أولاً." },
        { who: "B", en: "Maybe you are right. I was not very patient with him.", ar: "ربما أنت محق. لم أكن صبوراً معه." },
        { who: "A", en: "A short honest talk can solve most problems.", ar: "حديث صادق قصير قد يحل معظم المشكلات." },
        { who: "B", en: "I will call him tonight and try to make up.", ar: "سأتصل به الليلة وأحاول أن أصالحه." }
      ]
    }
  ]
};
