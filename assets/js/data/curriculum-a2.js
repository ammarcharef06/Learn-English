export const LEVEL_A2 = {
  id: "a2",
  label: "A2 — ما قبل المتوسط",
  labelEn: "Elementary (A2)",
  icon: "🌿",
  color: "#f59e0b",
  summary: "منهج المستوى الثاني لتعلم الإنجليزية: ست وحدات عملية تغطي العمل والدراسة والتسوق والمال والسفر والصحة والطقس والتكنولوجيا مع قواعد أساسية ومفردات شائعة.",
  units: [
    {
      id: "a2u1",
      title: "العمل والدراسة والروتين اليومي",
      titleEn: "Work, Study and Daily Routine",
      icon: "🎒",
      goal: "أن يتحدث المتعلم عن عمله ودراسته وروتينه اليومي باستخدام المضارع البسيط والماضي البسيط.",
      grammar: [
        {
          title: "المضارع البسيط وظروف التكرار",
          explain: "<p>نستخدم <b>المضارع البسيط</b> للتحدث عن العادات والروتين اليومي والحقائق الثابتة.</p><ul><li>مع الضمائر أنا وأنت ونحن وهم يبقى الفعل في صورته الأساسية.</li><li>مع هو وهي يضاف حرف السين إلى نهاية الفعل.</li><li>ظروف التكرار مثل دائمًا وعادةً وغالبًا وأحيانًا ونادرًا تأتي قبل الفعل الأساسي.</li><li>مع فعل الكون تأتي هذه الظروف بعده مباشرة.</li></ul>",
          table: {
            headers: ["الحالة", "المثال"],
            rows: [
              ["مع أنا وأنت ونحن وهم", "I start work at nine."],
              ["مع هو وهي", "She starts work at nine."],
              ["ظرف التكرار مع فعل عادي", "We usually take a break at eleven."],
              ["ظرف التكرار مع فعل الكون", "He is always late on Mondays."]
            ]
          },
          examples: [
            { en: "I usually get up at six o'clock.", ar: "عادةً أستيقظ في السادسة." },
            { en: "She works in a small office near the station.", ar: "تعمل في مكتب صغير قرب المحطة." },
            { en: "We do not work on Fridays.", ar: "لا نعمل أيام الجمعة." },
            { en: "Does he study English every evening?", ar: "هل يدرس الإنجليزية كل مساء؟" },
            { en: "My brother is never late for meetings.", ar: "أخي لا يتأخر أبدًا عن الاجتماعات." }
          ],
          tips: [
            "ضع ظرف التكرار قبل الفعل الأساسي وليس بعده.",
            "لا تنسَ إضافة حرف السين إلى الفعل مع هو وهي.",
            "استخدم فعل المساعدة في السؤال والنفي مع أنا وأنت ونحن وهم."
          ]
        },
        {
          title: "الماضي البسيط: الأفعال المنتظمة وغير المنتظمة",
          explain: "<p>نستخدم <b>الماضي البسيط</b> للحديث عن أفعال بدأت وانتهت في وقت ماضٍ محدد.</p><ul><li>الفعل المنتظم يأخذ نهاية الماضي المعروفة.</li><li>الفعل غير المنتظم له شكل خاص يجب حفظه.</li><li>في النفي والسؤال نستخدم فعل المساعدة في الماضي مع الفعل الأساسي.</li></ul>",
          table: {
            headers: ["الفعل", "الماضي"],
            rows: [
              ["work", "worked"],
              ["study", "studied"],
              ["go", "went"],
              ["see", "saw"],
              ["buy", "bought"],
              ["have", "had"]
            ]
          },
          examples: [
            { en: "I finished my assignment yesterday evening.", ar: "أنهيت واجبي مساء أمس." },
            { en: "She went to the market with her colleague.", ar: "ذهبت إلى السوق مع زميلتها." },
            { en: "We saw a good film last weekend.", ar: "شاهدنا فيلمًا جيدًا نهاية الأسبوع الماضي." },
            { en: "He did not attend the meeting on Monday.", ar: "لم يحضر الاجتماع يوم الاثنين." },
            { en: "Did you prepare the report last night?", ar: "هل أعددت التقرير الليلة الماضية؟" },
            { en: "They bought a new computer for the office.", ar: "اشتروا حاسوبًا جديدًا للمكتب." }
          ],
          tips: [
            "احفظ الأفعال الشاذة مثل ذهب ورأى واشترى لأنها لا تأخذ نهاية الماضي المنتظمة.",
            "بعد فعل المساعدة في النفي أو السؤال يبقى الفعل في صورته الأساسية.",
            "أضف ظرف زمان ماضٍ مثل أمس أو الأسبوع الماضي لتوضيح الزمن."
          ]
        }
      ],
      vocabulary: [
        { en: "deadline", ar: "موعد نهائي", pos: "noun", emoji: "⏰", example: { en: "The deadline for the report is Friday.", ar: "الموعد النهائي للتقرير هو يوم الجمعة." } },
        { en: "meeting", ar: "اجتماع", pos: "noun", emoji: "🗣️", example: { en: "Our team meeting starts at nine.", ar: "يبدأ اجتماع فريقنا في التاسعة." } },
        { en: "colleague", ar: "زميل عمل", pos: "noun", emoji: "🤝", example: { en: "My colleague helped me with the project.", ar: "ساعدني زميلي في المشروع." } },
        { en: "schedule", ar: "جدول مواعيد", pos: "noun", emoji: "📅", example: { en: "My schedule is very busy this week.", ar: "جدول مواعيدي مزدحم جدًا هذا الأسبوع." } },
        { en: "task", ar: "مهمة", pos: "noun", emoji: "📌", example: { en: "This task is easy to finish today.", ar: "هذه المهمة سهلة الإنجاز اليوم." } },
        { en: "attend", ar: "يحضر", pos: "verb", emoji: "🙋", example: { en: "I attend an English class every Tuesday.", ar: "أحضر درس إنجليزية كل ثلاثاء." } },
        { en: "prepare", ar: "يُعِدّ", pos: "verb", emoji: "📝", example: { en: "I prepare my lessons the night before.", ar: "أُعِدّ دروسي في الليلة السابقة." } },
        { en: "organise", ar: "ينظّم", pos: "verb", emoji: "🗂️", example: { en: "We organise a meeting every Monday.", ar: "ننظّم اجتماعًا كل يوم اثنين." } },
        { en: "commute", ar: "يتنقل بين المنزل والعمل", pos: "verb", emoji: "🚌", example: { en: "I commute to work by train.", ar: "أتنقل إلى العمل بالقطار." } },
        { en: "routine", ar: "روتين", pos: "noun", emoji: "🔁", example: { en: "My daily routine starts at six o'clock.", ar: "يبدأ روتيني اليومي في السادسة." } },
        { en: "alarm", ar: "منبّه", pos: "noun", emoji: "⏱️", example: { en: "My alarm rings at half past six.", ar: "يرنّ منبّهي في السادسة والنصف." } },
        { en: "take a break", ar: "يأخذ استراحة", pos: "phrase", emoji: "☕", example: { en: "We take a break at eleven o'clock every day.", ar: "نأخذ استراحة في الحادية عشرة كل يوم." } },
        { en: "assignment", ar: "واجب دراسي", pos: "noun", emoji: "📚", example: { en: "I finished my assignment before midnight.", ar: "أنهيت واجبي قبل منتصف الليل." } },
        { en: "lecturer", ar: "محاضر", pos: "noun", emoji: "🧑‍🏫", example: { en: "The lecturer spoke about the final exam.", ar: "تحدث المحاضر عن الامتحان النهائي." } },
        { en: "concentrate", ar: "يركّز", pos: "verb", emoji: "🎯", example: { en: "I cannot concentrate with the television on.", ar: "لا أستطيع التركيز والتلفاز مفتوح." } },
        { en: "improve", ar: "يحسّن", pos: "verb", emoji: "📈", example: { en: "I want to improve my English quickly.", ar: "أريد تحسين إنجليزيتي بسرعة." } }
      ],
      sentences: [
        { en: "I usually start my working day at eight.", ar: "عادةً أبدأ يوم عملي في الثامنة." },
        { en: "My colleague sent me the report this morning.", ar: "أرسل لي زميلي التقرير هذا الصباح." },
        { en: "We do not work at the weekend.", ar: "لا نعمل في نهاية الأسبوع." },
        { en: "She prepared everything before the deadline.", ar: "أعدّت كل شيء قبل الموعد النهائي." },
        { en: "Did you finish your homework last night?", ar: "هل أنهيت واجبك الليلة الماضية؟" },
        { en: "The lecturer explained the lesson very clearly.", ar: "شرح المحاضر الدرس بوضوح شديد." },
        { en: "I commute to the office by bus every day.", ar: "أنتقل إلى المكتب بالحافلة كل يوم." },
        { en: "He attended a long meeting yesterday afternoon.", ar: "حضر اجتماعًا طويلًا بعد ظهر أمس." },
        { en: "My alarm rings at half past six.", ar: "يرنّ منبّهي في السادسة والنصف." },
        { en: "They are going to change the schedule soon.", ar: "سيغيّرون الجدول قريبًا." },
        { en: "I have improved my writing since September.", ar: "تحسّنت كتابتي منذ سبتمبر." },
        { en: "We always take a short break at eleven.", ar: "نأخذ دائمًا استراحة قصيرة في الحادية عشرة." }
      ],
      dialogue: [
        { who: "A", en: "How was your weekend?", ar: "كيف كانت نهاية أسبوعك؟" },
        { who: "B", en: "It was busy but very interesting.", ar: "كانت مزدحمة لكنها ممتعة جدًا." },
        { who: "A", en: "What did you do on Saturday?", ar: "ماذا فعلت يوم السبت؟" },
        { who: "B", en: "I visited my colleague and helped him move.", ar: "زرت زميلي وساعدته في الانتقال." },
        { who: "A", en: "Did you finish your assignment too?", ar: "هل أنهيت واجبك أيضًا؟" },
        { who: "B", en: "Yes, I finished it on Sunday evening.", ar: "نعم، أنهيته مساء الأحد." }
      ]
    },
    {
      id: "a2u2",
      title: "التسوق والمال",
      titleEn: "Shopping and Money",
      icon: "🛒",
      goal: "أن يتسوّق المتعلم ويصف الأسعار والكميات ويقارن بين المنتجات بثقة.",
      grammar: [
        {
          title: "الأسماء المعدودة وغير المعدودة وأدوات الكمية",
          explain: "<p>تنقسم الأسماء في الإنجليزية إلى <b>معدودة</b> و<b>غير معدودة</b>.</p><ul><li>الاسم المعدود له مفرد وجمع ويمكن عدّه بالأرقام.</li><li>الاسم غير المعدود لا يُعدّ بالأرقام ولا يأخذ جمعًا.</li><li>نستخدم أداة استفهام خاصة بالعدد مع الاسم المعدود، وأداة كمية خاصة مع غير المعدود.</li><li>عبارة الكمية الكبيرة تصلح للنوعين معًا.</li></ul>",
          table: {
            headers: ["الحالة", "المثال"],
            rows: [
              ["اسم معدود", "There are many customers in the shop."],
              ["اسم غير معدود", "We do not have much time today."],
              ["كمية كبيرة مع النوعين", "She spends a lot of money on clothes."],
              ["سؤال عن العدد", "How many receipts do you need?"]
            ]
          },
          examples: [
            { en: "There are too many people in this shop.", ar: "يوجد عدد كبير جدًا من الناس في هذا المتجر." },
            { en: "I do not have much cash with me.", ar: "ليس معي نقود كثيرة." },
            { en: "We need a lot of time to compare prices.", ar: "نحتاج وقتًا كثيرًا لمقارنة الأسعار." },
            { en: "How much does this jacket cost?", ar: "كم يكلّف هذا المعطف؟" },
            { en: "She bought three bags and some fruit.", ar: "اشترت ثلاث حقائب وبعض الفاكهة." }
          ],
          tips: [
            "لا تستخدم أداة العدد مع الأسماء غير المعدودة.",
            "استخدم عبارة الكمية الكبيرة مع النوعين بأمان.",
            "اسأل عن السعر بعبارة خاصة، وعن العدد بعبارة تصلح للمعدود."
          ]
        },
        {
          title: "صيغة المقارنة وصيغة التفضيل",
          explain: "<p>نستخدم <b>صيغة المقارنة</b> للمقارنة بين شيئين، و<b>صيغة التفضيل</b> للمقارنة بين شيء ومجموعة كاملة.</p><ul><li>الصفات القصيرة تأخذ نهاية خاصة في المقارنة ونهاية أخرى في التفضيل.</li><li>الصفات الطويلة تأخذ كلمة مساعدة قبلها.</li><li>بعد صيغة المقارنة نستخدم أداة الربط المناسبة.</li><li>بعض الصفات لها صيغ شاذة تُحفظ حفظًا.</li></ul>",
          table: {
            headers: ["الصفة", "المقارنة", "التفضيل"],
            rows: [
              ["cheap", "cheaper", "the cheapest"],
              ["expensive", "more expensive", "the most expensive"],
              ["good", "better", "the best"],
              ["bad", "worse", "the worst"]
            ]
          },
          examples: [
            { en: "This shop is cheaper than the one near my house.", ar: "هذا المتجر أرخص من المتجر القريب من بيتي." },
            { en: "Gold is more expensive than silver.", ar: "الذهب أغلى من الفضة." },
            { en: "That was the best bargain of the day.", ar: "كانت تلك أفضل صفقة في اليوم." },
            { en: "My old wallet is worse than this new one.", ar: "محفظتي القديمة أسوأ من هذه الجديدة." },
            { en: "This is the cheapest coat in the shop.", ar: "هذا أرخص معطف في المتجر." }
          ],
          tips: [
            "أضف نهاية المقارنة إلى الصفات القصيرة، واستخدم الكلمة المساعدة مع الصفات الطويلة.",
            "لا تجمع بين الصيغتين معًا في الصفة نفسها.",
            "احفظ الصيغ الشاذة لأنها لا تتبع القاعدة العامة."
          ]
        }
      ],
      vocabulary: [
        { en: "discount", ar: "خصم", pos: "noun", emoji: "🏷️", example: { en: "There is a big discount on shoes today.", ar: "يوجد خصم كبير على الأحذية اليوم." } },
        { en: "receipt", ar: "إيصال", pos: "noun", emoji: "🧾", example: { en: "Please keep the receipt in your bag.", ar: "من فضلك احتفظ بالإيصال في حقيبتك." } },
        { en: "refund", ar: "استرداد المال", pos: "noun", emoji: "💸", example: { en: "I asked for a full refund yesterday.", ar: "طلبت استرداد المال كاملًا أمس." } },
        { en: "bargain", ar: "صفقة رابحة", pos: "noun", emoji: "🎁", example: { en: "This jacket was a real bargain.", ar: "كان هذا المعطف صفقة رابحة حقًا." } },
        { en: "customer", ar: "زبون", pos: "noun", emoji: "🧑‍💼", example: { en: "The customer paid in cash.", ar: "دفع الزبون نقدًا." } },
        { en: "cash", ar: "نقود سائلة", pos: "noun", emoji: "💵", example: { en: "I paid in cash at the market.", ar: "دفعت نقدًا في السوق." } },
        { en: "afford", ar: "يستطيع تحمّل التكلفة", pos: "verb", emoji: "🪙", example: { en: "We cannot afford a new car this year.", ar: "لا نستطيع تحمّل تكلفة سيارة جديدة هذا العام." } },
        { en: "spend", ar: "ينفق", pos: "verb", emoji: "🛍️", example: { en: "I spend too much money on coffee.", ar: "أنفق مالًا كثيرًا جدًا على القهوة." } },
        { en: "borrow", ar: "يستعير", pos: "verb", emoji: "🤲", example: { en: "Can I borrow ten dollars from you?", ar: "هل يمكنني استعارة عشرة دولارات منك؟" } },
        { en: "lend", ar: "يعير", pos: "verb", emoji: "🤝", example: { en: "My brother will lend me his bike.", ar: "سيعيرني أخي دراجته." } },
        { en: "expensive", ar: "غالي الثمن", pos: "adjective", emoji: "💎", example: { en: "This watch is too expensive for me.", ar: "هذه الساعة غالية جدًا بالنسبة لي." } },
        { en: "cheap", ar: "رخيص", pos: "adjective", emoji: "🪧", example: { en: "The vegetables are cheap in this market.", ar: "الخضروات رخيصة في هذا السوق." } },
        { en: "queue", ar: "طابور انتظار", pos: "noun", emoji: "🚶", example: { en: "There was a long queue outside the shop.", ar: "كان هناك طابور طويل خارج المتجر." } },
        { en: "change", ar: "الباقي من النقود", pos: "noun", emoji: "🪙", example: { en: "The assistant gave me the wrong change.", ar: "أعطاني البائع الباقي الخطأ." } },
        { en: "price", ar: "سعر", pos: "noun", emoji: "🔖", example: { en: "The price of bread went up again.", ar: "ارتفع سعر الخبز مرة أخرى." } },
        { en: "bill", ar: "فاتورة", pos: "noun", emoji: "📄", example: { en: "We paid the bill after dinner.", ar: "دفعنا الفاتورة بعد العشاء." } },
        { en: "wallet", ar: "محفظة", pos: "noun", emoji: "👛", example: { en: "I lost my wallet on the bus.", ar: "فقدت محفظتي في الحافلة." } }
      ],
      sentences: [
        { en: "I paid the bill with my credit card.", ar: "دفعت الفاتورة ببطاقتي البنكية." },
        { en: "This supermarket offers a discount every weekend.", ar: "يمنح هذا المتجر خصمًا كل نهاية أسبوع." },
        { en: "The customer asked for a full refund.", ar: "طلب الزبون استرداد المال كاملًا." },
        { en: "We cannot afford a new washing machine.", ar: "لا نستطيع تحمّل تكلفة غسالة جديدة." },
        { en: "How much money did you spend yesterday?", ar: "كم من المال أنفقت أمس؟" },
        { en: "There was a long queue at the entrance.", ar: "كان هناك طابور طويل عند المدخل." },
        { en: "Please keep the receipt in your wallet.", ar: "من فضلك احتفظ بالإيصال في محفظتك." },
        { en: "My brother borrowed ten dollars from me.", ar: "استعار أخي عشرة دولارات مني." },
        { en: "This phone is more expensive than that one.", ar: "هذا الهاتف أغلى من ذاك." },
        { en: "She is going to buy a cheaper laptop.", ar: "ستشتري حاسوبًا محمولًا أرخص." },
        { en: "I have never found such a good bargain.", ar: "لم أجد صفقة بهذه الجودة من قبل." },
        { en: "The price of vegetables has gone up again.", ar: "ارتفع سعر الخضروات مرة أخرى." }
      ],
      dialogue: [
        { who: "A", en: "Can I help you find something?", ar: "هل أساعدك في العثور على شيء؟" },
        { who: "B", en: "Yes, I am looking for a warm coat.", ar: "نعم، أبحث عن معطف دافئ." },
        { who: "A", en: "These coats are on sale this week.", ar: "هذه المعاطف معروضة بخصم هذا الأسبوع." },
        { who: "B", en: "How much does the blue one cost?", ar: "كم يكلّف المعطف الأزرق؟" },
        { who: "A", en: "It costs eighty dollars with the discount.", ar: "يكلّف ثمانين دولارًا بعد الخصم." },
        { who: "B", en: "Great, I will pay in cash.", ar: "رائع، سأدفع نقدًا." }
      ]
    },
    {
      id: "a2u3",
      title: "السفر والمواصلات",
      titleEn: "Travel and Transport",
      icon: "✈️",
      goal: "أن يخطط المتعلم لرحلة ويتحدث عن المواصلات والأماكن التي زارها.",
      grammar: [
        {
          title: "الماضي المستمر",
          explain: "<p>نستخدم <b>الماضي المستمر</b> لوصف فعل كان جاريًا في لحظة معينة في الماضي.</p><ul><li>يتكوّن من فعل الكون في الماضي مع الفعل مضافًا إليه نهاية خاصة.</li><li>غالبًا نستخدمه مع فعل ماضٍ قصير يقطعه، ونربط بينهما بأداة الربط المناسبة.</li><li>نستخدمه أيضًا لوصف الأجواء والخلفية في الحكاية.</li></ul>",
          table: {
            headers: ["الضمير", "الصيغة"],
            rows: [
              ["I, he, she, it", "was travelling"],
              ["you, we, they", "were travelling"],
              ["النفي", "was not waiting"],
              ["السؤال", "Were you sleeping?"]
            ]
          },
          examples: [
            { en: "I was waiting for the train when it started to rain.", ar: "كنت أنتظر القطار عندما بدأ المطر." },
            { en: "They were travelling to the coast all night.", ar: "كانوا يسافرون إلى الساحل طوال الليل." },
            { en: "She was reading the timetable when I called her.", ar: "كانت تقرأ جدول المواعيد عندما هاتفتها." },
            { en: "We were not sleeping when the plane landed.", ar: "لم نكن نائمين عندما هبطت الطائرة." },
            { en: "What were you doing at the station yesterday?", ar: "ماذا كنت تفعل في المحطة أمس؟" }
          ],
          tips: [
            "استخدم الماضي المستمر للفعل الطويل، والماضي البسيط للفعل القصير الذي يقطعه.",
            "انتبه إلى اختلاف فعل الكون في الماضي مع الضمائر المختلفة.",
            "لا تضع الفعل الأساسي في الماضي بعد فعل الكون في هذه الصيغة."
          ]
        },
        {
          title: "حروف الجر للحركة والزمن",
          explain: "<p>تساعدنا <b>حروف الجر</b> على تحديد الاتجاه والزمن بدقة.</p><ul><li>بعضها يدل على الحركة نحو مكان أو إلى داخله أو عبره.</li><li>بعضها يدل على الزمن مثل الشهر والسنة وأجزاء اليوم.</li><li>الاختيار الصحيح يعتمد على نوع الكلمة التي تأتي بعد حرف الجر.</li></ul>",
          table: {
            headers: ["الاستخدام", "المثال"],
            rows: [
              ["الحركة إلى مكان", "We drove to the airport."],
              ["الدخول إلى مكان", "She walked into the terminal."],
              ["المرور عبر مكان", "The bus went through the tunnel."],
              ["الزمن مع الشهر والسنة", "We travelled in July."],
              ["الزمن مع اليوم والتاريخ", "The flight leaves on Monday."],
              ["الزمن مع الساعة", "The train arrives at six."]
            ]
          },
          examples: [
            { en: "We walked through the old market in the evening.", ar: "مشينا عبر السوق القديم في المساء." },
            { en: "She flew to Berlin in August.", ar: "سافرت جوًا إلى برلين في أغسطس." },
            { en: "The bus stopped at the corner of the street.", ar: "توقفت الحافلة عند زاوية الشارع." },
            { en: "They arrived in Paris on Friday morning.", ar: "وصلوا إلى باريس صباح يوم الجمعة." },
            { en: "He jumped into the boat very quickly.", ar: "قفز داخل القارب بسرعة كبيرة." }
          ],
          tips: [
            "استخدم حرف الجر الزمني المناسب مع الساعة أو اليوم أو الشهر.",
            "لا تترجم حروف الجر حرفيًا من العربية إلى الإنجليزية.",
            "احفظ العبارات الشائعة مع حروف الجر كوحدة واحدة."
          ]
        }
      ],
      vocabulary: [
        { en: "luggage", ar: "أمتعة", pos: "noun", emoji: "🧳", example: { en: "Our luggage was too heavy for the plane.", ar: "كانت أمتعتنا ثقيلة جدًا على الطائرة." } },
        { en: "passport", ar: "جواز سفر", pos: "noun", emoji: "🛂", example: { en: "Show your passport at the airport gate.", ar: "أظهر جواز سفرك عند بوابة المطار." } },
        { en: "departure", ar: "مغادرة", pos: "noun", emoji: "🛫", example: { en: "The departure time is eight in the morning.", ar: "وقت المغادرة هو الثامنة صباحًا." } },
        { en: "arrival", ar: "وصول", pos: "noun", emoji: "🛬", example: { en: "Our arrival was delayed by two hours.", ar: "تأخر وصولنا ساعتين." } },
        { en: "platform", ar: "رصيف القطار", pos: "noun", emoji: "🚉", example: { en: "The train leaves from platform three.", ar: "يغادر القطار من الرصيف الثالث." } },
        { en: "fare", ar: "أجرة المواصلات", pos: "noun", emoji: "🎫", example: { en: "The bus fare is two dollars.", ar: "أجرة الحافلة دولاران." } },
        { en: "reserve", ar: "يحجز مسبقًا", pos: "verb", emoji: "📌", example: { en: "I want to reserve a seat by the window.", ar: "أريد حجز مقعد بجانب النافذة." } },
        { en: "delay", ar: "تأخير", pos: "noun", emoji: "⌛", example: { en: "The delay lasted forty minutes.", ar: "استمر التأخير أربعين دقيقة." } },
        { en: "abroad", ar: "في الخارج", pos: "adverb", emoji: "🌍", example: { en: "She works abroad for six months.", ar: "تعمل في الخارج ستة أشهر." } },
        { en: "sightseeing", ar: "زيارة المعالم", pos: "noun", emoji: "📷", example: { en: "We went sightseeing in the old city.", ar: "ذهبنا لزيارة معالم المدينة القديمة." } },
        { en: "guide", ar: "مرشد سياحي", pos: "noun", emoji: "🧭", example: { en: "Our guide showed us the old castle.", ar: "أرانا مرشدنا القلعة القديمة." } },
        { en: "souvenir", ar: "تذكار", pos: "noun", emoji: "🎀", example: { en: "I bought a small souvenir for my sister.", ar: "اشتريت تذكارًا صغيرًا لأختي." } },
        { en: "destination", ar: "وجهة", pos: "noun", emoji: "📍", example: { en: "Our final destination was Rome.", ar: "كانت وجهتنا الأخيرة روما." } },
        { en: "board", ar: "يصعد إلى الطائرة", pos: "verb", emoji: "🚪", example: { en: "We board the plane in twenty minutes.", ar: "نصعد إلى الطائرة بعد عشرين دقيقة." } },
        { en: "crowded", ar: "مزدحم", pos: "adjective", emoji: "👥", example: { en: "The metro was very crowded this morning.", ar: "كان المترو مزدحمًا جدًا هذا الصباح." } },
        { en: "journey", ar: "رحلة", pos: "noun", emoji: "🧭", example: { en: "The journey took three hours by car.", ar: "استغرقت الرحلة ثلاث ساعات بالسيارة." } },
        { en: "traffic", ar: "حركة المرور", pos: "noun", emoji: "🚗", example: { en: "The traffic was terrible near the bridge.", ar: "كانت حركة المرور سيئة قرب الجسر." } }
      ],
      sentences: [
        { en: "Our flight departs from the new terminal.", ar: "تنطلق رحلتنا من الصالة الجديدة." },
        { en: "I reserved a seat next to the window.", ar: "حجزت مقعدًا بجانب النافذة." },
        { en: "The train was late because of heavy snow.", ar: "تأخر القطار بسبب الثلوج الكثيفة." },
        { en: "We left our luggage at the hotel reception.", ar: "تركنا أمتعتنا في استقبال الفندق." },
        { en: "She showed her passport at the gate.", ar: "أظهرت جواز سفرها عند البوابة." },
        { en: "How long does the journey take by car?", ar: "كم تستغرق الرحلة بالسيارة؟" },
        { en: "They were waiting on platform four.", ar: "كانوا ينتظرون على الرصيف الرابع." },
        { en: "I have never travelled abroad alone.", ar: "لم أسافر إلى الخارج وحدي من قبل." },
        { en: "The traffic was terrible during the morning.", ar: "كانت حركة المرور سيئة خلال الصباح." },
        { en: "We are going to visit three cities next month.", ar: "سنزور ثلاث مدن الشهر القادم." },
        { en: "He bought a souvenir for his parents.", ar: "اشترى تذكارًا لوالديه." },
        { en: "The delay lasted more than two hours.", ar: "استمر التأخير أكثر من ساعتين." }
      ],
      dialogue: [
        { who: "A", en: "Excuse me, where is platform six?", ar: "عفوًا، أين الرصيف السادس؟" },
        { who: "B", en: "Go through the main hall and turn left.", ar: "اعبر القاعة الرئيسية ثم انعطف يسارًا." },
        { who: "A", en: "Is the train to York delayed today?", ar: "هل قطار يورك متأخر اليوم؟" },
        { who: "B", en: "Yes, it is twenty minutes late.", ar: "نعم، إنه متأخر عشرين دقيقة." },
        { who: "A", en: "Thank you, I will wait near the cafe.", ar: "شكرًا، سأنتظر قرب المقهى." },
        { who: "B", en: "Have a good journey!", ar: "أتمنى لك رحلة سعيدة!" }
      ]
    },
    {
      id: "a2u4",
      title: "الصحة والجسم والمشاعر",
      titleEn: "Health, Body and Feelings",
      icon: "🩺",
      goal: "أن يصف المتعلم حالته الصحية ومشاعره ويقدّم النصيحة ويعبّر عن الالتزام.",
      grammar: [
        {
          title: "النصيحة والضرورة والالتزام",
          explain: "<p>نستخدم أفعالًا مساعدة للتعبير عن <b>النصيحة</b> و<b>الضرورة</b> و<b>الالتزام</b>.</p><ul><li>فعل النصيحة يعني أن من الأفضل فعل شيء ما.</li><li>فعل الإلزام القوي يعبّر عن قاعدة صارمة أو ضرورة شخصية.</li><li>عبارة الالتزام تدل على إلزام يأتي من الخارج مثل القانون أو العمل.</li><li>بعد هذه الأفعال يأتي الفعل في صورته الأساسية دائمًا.</li></ul>",
          table: {
            headers: ["الاستخدام", "المثال"],
            rows: [
              ["النصيحة", "You should drink more water."],
              ["الإلزام القوي", "You must take this medicine."],
              ["الالتزام الخارجي", "I have to see the doctor today."],
              ["النفي مع النصيحة", "You should not eat late at night."],
              ["السؤال عن الالتزام", "Do you have to work on Sunday?"]
            ]
          },
          examples: [
            { en: "You should see a doctor about that cough.", ar: "ينبغي أن ترى طبيبًا بشأن تلك الكحة." },
            { en: "Patients must take the medicine after meals.", ar: "يجب على المرضى تناول الدواء بعد الطعام." },
            { en: "I have to make an appointment this week.", ar: "عليّ أن أحجز موعدًا هذا الأسبوع." },
            { en: "She should not carry that heavy bag.", ar: "لا ينبغي لها أن تحمل تلك الحقيبة الثقيلة." },
            { en: "Do we have to pay for the treatment?", ar: "هل علينا أن ندفع مقابل العلاج؟" }
          ],
          tips: [
            "بعد الأفعال المساعدة الثلاثة يأتي الفعل الأساسي دون أي إضافة.",
            "استخدم فعل النصيحة للمشورة، وفعل الإلزام للقواعد الصارمة.",
            "استخدم عبارة الالتزام للقواعد الخارجية مثل قوانين العمل."
          ]
        },
        {
          title: "ضمائر الملكية والضمائر الانعكاسية",
          explain: "<p>ضمائر الملكية تدل على أن شيئًا يخص شخصًا ما، والضمائر الانعكاسية ترجع إلى الفاعل نفسه.</p><ul><li>بعض ضمائر الملكية تأتي قبل الاسم، وبعضها يأتي وحدها.</li><li>الضمير الانعكاسي يعود على فاعل الجملة.</li><li>نستخدم العبارة الثابتة للتعبير عن الاعتناء بالنفس.</li></ul>",
          table: {
            headers: ["الضمير", "الملكية مع اسم", "الملكية وحدها"],
            rows: [
              ["I", "my", "mine"],
              ["you", "your", "yours"],
              ["he", "his", "his"],
              ["she", "her", "hers"],
              ["we", "our", "ours"],
              ["they", "their", "theirs"]
            ]
          },
          examples: [
            { en: "This is my appointment card and that is yours.", ar: "هذه بطاقة موعدي وتلك بطاقتك." },
            { en: "She hurt herself while she was running.", ar: "أصابت نفسها أثناء الجري." },
            { en: "We prepared ourselves for the long treatment.", ar: "هيّأنا أنفسنا للعلاج الطويل." },
            { en: "Their doctor is more experienced than ours.", ar: "طبيبهم أكثر خبرة من طبيبنا." },
            { en: "He looked after himself during the illness.", ar: "اعتنى بنفسه أثناء المرض." }
          ],
          tips: [
            "ضمير الملكية الذي يأتي وحده لا يحتاج إلى اسم بعده.",
            "تأكد من أن الضمير الانعكاسي يعود على فاعل الجملة نفسه.",
            "احفظ صيغة الجمع الانعكاسية لأنها تختلف عن صيغة المفرد."
          ]
        }
      ],
      vocabulary: [
        { en: "headache", ar: "صداع", pos: "noun", emoji: "🤕", example: { en: "I have a terrible headache today.", ar: "عندي صداع شديد اليوم." } },
        { en: "medicine", ar: "دواء", pos: "noun", emoji: "💊", example: { en: "Take this medicine after lunch.", ar: "تناول هذا الدواء بعد الغداء." } },
        { en: "appointment", ar: "موعد مع الطبيب", pos: "noun", emoji: "📆", example: { en: "I made an appointment with the dentist.", ar: "حجزت موعدًا مع طبيب الأسنان." } },
        { en: "pharmacy", ar: "صيدلية", pos: "noun", emoji: "🏥", example: { en: "The pharmacy is next to the bank.", ar: "الصيدلية بجانب المصرف." } },
        { en: "symptom", ar: "عَرَض مرضي", pos: "noun", emoji: "🌡️", example: { en: "A high temperature is a common symptom.", ar: "ارتفاع الحرارة عَرَض شائع." } },
        { en: "recover", ar: "يتعافى", pos: "verb", emoji: "💪", example: { en: "She will recover from the flu soon.", ar: "ستتعافى من الإنفلونزا قريبًا." } },
        { en: "injury", ar: "إصابة جسدية", pos: "noun", emoji: "🩹", example: { en: "He got a small injury during the match.", ar: "تعرّض لإصابة صغيرة خلال المباراة." } },
        { en: "breathe", ar: "يتنفس", pos: "verb", emoji: "🌬️", example: { en: "It is difficult to breathe in this heat.", ar: "من الصعب التنفس في هذه الحرارة." } },
        { en: "healthy", ar: "صحي", pos: "adjective", emoji: "🥗", example: { en: "Eating vegetables keeps you healthy.", ar: "أكل الخضروات يبقيك صحيحًا." } },
        { en: "exhausted", ar: "منهك", pos: "adjective", emoji: "😩", example: { en: "I felt exhausted after the long trip.", ar: "شعرت بالإنهاك بعد الرحلة الطويلة." } },
        { en: "nervous", ar: "متوتر", pos: "adjective", emoji: "😰", example: { en: "She was nervous before the interview.", ar: "كانت متوترة قبل المقابلة." } },
        { en: "confident", ar: "واثق", pos: "adjective", emoji: "😌", example: { en: "He feels confident about the test.", ar: "يشعر بالثقة بشأن الاختبار." } },
        { en: "lonely", ar: "يشعر بالوحدة", pos: "adjective", emoji: "🥺", example: { en: "My grandfather feels lonely in winter.", ar: "يشعر جدي بالوحدة في الشتاء." } },
        { en: "worried", ar: "قلق", pos: "adjective", emoji: "😟", example: { en: "My parents were worried about my health.", ar: "كان والداي قلقين على صحتي." } },
        { en: "treatment", ar: "علاج", pos: "noun", emoji: "🩺", example: { en: "The treatment lasted three weeks.", ar: "استمر العلاج ثلاثة أسابيع." } },
        { en: "dizzy", ar: "يشعر بدوار", pos: "adjective", emoji: "😵", example: { en: "I felt dizzy in the hot sun.", ar: "شعرت بالدوار تحت الشمس الحارة." } }
      ],
      sentences: [
        { en: "I have a bad headache and a sore throat.", ar: "عندي صداع شديد والتهاب في الحلق." },
        { en: "She made an appointment with the doctor.", ar: "حجزت موعدًا مع الطبيب." },
        { en: "You should take this medicine twice a day.", ar: "ينبغي أن تتناول هذا الدواء مرتين يوميًا." },
        { en: "He felt nervous before the medical test.", ar: "شعر بالتوتر قبل الفحص الطبي." },
        { en: "We were waiting in the pharmacy for ten minutes.", ar: "انتظرنا في الصيدلية عشر دقائق." },
        { en: "My sister recovered from the flu quickly.", ar: "تعافت أختي من الإنفلونزا بسرعة." },
        { en: "They must wear masks inside the hospital.", ar: "يجب عليهم وضع الكمامات داخل المستشفى." },
        { en: "I have never felt so exhausted before.", ar: "لم أشعر بهذا الإنهاك من قبل." },
        { en: "The treatment will last about three weeks.", ar: "سيستمر العلاج نحو ثلاثة أسابيع." },
        { en: "Do you have to pay for the check-up?", ar: "هل عليك أن تدفع مقابل الفحص الشامل؟" },
        { en: "She was disappointed with the test results.", ar: "كانت خائبة الأمل في نتائج الفحص." },
        { en: "He is going to see a specialist next week.", ar: "سيزور طبيبًا مختصًا الأسبوع القادم." }
      ],
      dialogue: [
        { who: "A", en: "You look tired today, what is wrong?", ar: "تبدو متعبًا اليوم، ما الأمر؟" },
        { who: "B", en: "I have a headache and a high temperature.", ar: "عندي صداع ودرجة حرارة مرتفعة." },
        { who: "A", en: "You should rest and drink hot drinks.", ar: "ينبغي أن ترتاح وتشرب مشروبات ساخنة." },
        { who: "B", en: "Do I have to see a doctor?", ar: "هل عليّ أن أرى طبيبًا؟" },
        { who: "A", en: "Yes, you must visit the clinic today.", ar: "نعم، يجب أن تزور العيادة اليوم." },
        { who: "B", en: "Thank you, I will make an appointment now.", ar: "شكرًا، سأحجز موعدًا الآن." }
      ]
    },
    {
      id: "a2u5",
      title: "الطقس والفصول والهوايات",
      titleEn: "Weather, Seasons and Hobbies",
      icon: "🌦️",
      goal: "أن يتحدث المتعلم عن الطقس والفصول وهواياته وخططه المستقبلية.",
      grammar: [
        {
          title: "التعبير عن المستقبل: الصيغتان",
          explain: "<p>نتحدث عن المستقبل بطريقتين مختلفتين ولكل طريقة استخدام خاص.</p><ul><li>الصيغة الأولى نستخدمها للقرار اللحظي والتوقع والوعد.</li><li>الصيغة الثانية نستخدمها للخطة المسبقة والنية الواضحة.</li><li>الدليل الموجود في الجملة يساعدك على اختيار الصيغة الأنسب.</li></ul>",
          table: {
            headers: ["الاستخدام", "المثال"],
            rows: [
              ["قرار لحظي", "It is cold, I will close the window."],
              ["توقع", "It will rain tomorrow."],
              ["خطة مسبقة", "We are going to go hiking on Saturday."],
              ["نية واضحة", "She is going to learn photography."],
              ["النفي", "I will not stay at home all weekend."]
            ]
          },
          examples: [
            { en: "Look at those clouds, it is going to rain.", ar: "انظر إلى تلك السحب، إنها ستمطر." },
            { en: "I will call you when the forecast changes.", ar: "سأهاتفك عندما يتغير توقّع الطقس." },
            { en: "We are going to plant flowers in the garden.", ar: "سنزرع أزهارًا في الحديقة." },
            { en: "They will visit us during the summer holiday.", ar: "سيزوروننا خلال العطلة الصيفية." },
            { en: "She is not going to buy a new camera.", ar: "لن تشتري كاميرا جديدة." }
          ],
          tips: [
            "استخدم الصيغة الأولى للقرار السريع والتوقع البسيط.",
            "استخدم الصيغة الثانية للخطة التي قررتها مسبقًا.",
            "ابحث عن الدليل الحاضر في الجملة قبل اختيار الصيغة."
          ]
        },
        {
          title: "التعبير عن العادات الماضية",
          explain: "<p>نستخدم هذه الصيغة للحديث عن عادة أو حالة كانت موجودة في الماضي ثم توقفت.</p><ul><li>تأتي قبل الفعل في صورته الأساسية.</li><li>نفيها وسؤالها يشبهان الماضي البسيط.</li><li>لا نستخدمها مع الأحداث التي وقعت مرة واحدة فقط.</li></ul>",
          table: {
            headers: ["الاستخدام", "المثال"],
            rows: [
              ["عادة قديمة", "I used to play tennis every Sunday."],
              ["حالة قديمة", "She used to live near the sea."],
              ["النفي", "He did not use to like cold weather."],
              ["السؤال", "Did you use to collect stamps?"]
            ]
          },
          examples: [
            { en: "I used to go hiking with my uncle.", ar: "كنت أذهب للمشي الجبلي مع عمي." },
            { en: "They used to spend every summer by the lake.", ar: "كانوا يقضون كل صيف بجانب البحيرة." },
            { en: "She did not use to enjoy gardening.", ar: "لم تكن تستمتع بالبستنة." },
            { en: "Did you use to collect old coins?", ar: "هل كنت تجمع العملات القديمة؟" },
            { en: "We used to watch the lightning from the window.", ar: "كنا نشاهد البرق من النافذة." }
          ],
          tips: [
            "بعد هذه الصيغة يأتي الفعل في صورته الأساسية دائمًا.",
            "في النفي والسؤال تُحذف النهاية الماضية من الصيغة نفسها.",
            "استخدمها للعادات المتكررة قديمًا لا لحدث وقع مرة واحدة."
          ]
        }
      ],
      vocabulary: [
        { en: "forecast", ar: "توقّع الطقس", pos: "noun", emoji: "📡", example: { en: "The forecast says rain for tomorrow.", ar: "يقول توقّع الطقس إن غدًا ممطر." } },
        { en: "temperature", ar: "درجة الحرارة", pos: "noun", emoji: "🌡️", example: { en: "The temperature dropped below zero last night.", ar: "انخفضت درجة الحرارة تحت الصفر ليلة أمس." } },
        { en: "thunder", ar: "رعد", pos: "noun", emoji: "⛈️", example: { en: "The thunder woke the whole village.", ar: "أيقظ الرعد القرية كلها." } },
        { en: "lightning", ar: "برق", pos: "noun", emoji: "⚡", example: { en: "Lightning hit the tall tree near the river.", ar: "أصاب البرق الشجرة الطويلة قرب النهر." } },
        { en: "fog", ar: "ضباب", pos: "noun", emoji: "🌫️", example: { en: "Thick fog covered the airport this morning.", ar: "غطى الضباب الكثيف المطار هذا الصباح." } },
        { en: "shower", ar: "زخة مطر", pos: "noun", emoji: "🌧️", example: { en: "A heavy shower started during the match.", ar: "بدأت زخة مطر قوية خلال المباراة." } },
        { en: "freezing", ar: "متجمد البرودة", pos: "adjective", emoji: "🥶", example: { en: "It is freezing outside, wear a warm coat.", ar: "الجو متجمد في الخارج، البس معطفًا دافئًا." } },
        { en: "mild", ar: "معتدل", pos: "adjective", emoji: "🍃", example: { en: "The winter was mild this year.", ar: "كان الشتاء معتدلًا هذا العام." } },
        { en: "hiking", ar: "المشي الجبلي", pos: "noun", emoji: "🥾", example: { en: "We go hiking in the mountains every summer.", ar: "نذهب للمشي الجبلي في الجبال كل صيف." } },
        { en: "gardening", ar: "البستنة", pos: "noun", emoji: "🪴", example: { en: "My aunt enjoys gardening at weekends.", ar: "تستمتع عمتي بالبستنة في نهاية الأسبوع." } },
        { en: "photography", ar: "التصوير الفوتوغرافي", pos: "noun", emoji: "📸", example: { en: "Photography is his favourite hobby.", ar: "التصوير الفوتوغرافي هوايته المفضلة." } },
        { en: "collect", ar: "يجمع", pos: "verb", emoji: "🪙", example: { en: "I collect old coins from many countries.", ar: "أجمع عملات قديمة من بلدان كثيرة." } },
        { en: "painting", ar: "الرسم", pos: "noun", emoji: "🎨", example: { en: "Painting helps me relax after work.", ar: "يساعدني الرسم على الاسترخاء بعد العمل." } },
        { en: "season", ar: "فصل من السنة", pos: "noun", emoji: "🗓️", example: { en: "Spring is my favourite season.", ar: "الربيع فصلي المفضل." } },
        { en: "umbrella", ar: "مظلة", pos: "noun", emoji: "☂️", example: { en: "Take an umbrella, it may rain later.", ar: "خذ مظلة، فقد تمطر لاحقًا." } },
        { en: "sunshine", ar: "أشعة الشمس", pos: "noun", emoji: "☀️", example: { en: "The sunshine made everyone happy.", ar: "جعلت أشعة الشمس الجميع سعداء." } },
        { en: "cycling", ar: "ركوب الدراجة", pos: "noun", emoji: "🚲", example: { en: "Cycling is good exercise for everyone.", ar: "ركوب الدراجة تمرين جيد للجميع." } }
      ],
      sentences: [
        { en: "The forecast says it will be sunny tomorrow.", ar: "يقول توقّع الطقس إن غدًا سيكون مشمسًا." },
        { en: "We are going to have a picnic this weekend.", ar: "سنقيم نزهة في نهاية هذا الأسبوع." },
        { en: "It was freezing outside, so we stayed home.", ar: "كان الجو متجمدًا في الخارج، لذلك بقينا في البيت." },
        { en: "My favourite season is spring because of the mild weather.", ar: "فصلي المفضل هو الربيع بسبب الجو المعتدل." },
        { en: "Thunder and lightning frightened the little dog.", ar: "أخاف الرعد والبرق الكلب الصغير." },
        { en: "She is going to take up photography next year.", ar: "ستبدأ تعلم التصوير الفوتوغرافي العام القادم." },
        { en: "I used to go cycling every morning.", ar: "كنت أذهب لركوب الدراجة كل صباح." },
        { en: "The temperature dropped quickly after the storm.", ar: "انخفضت درجة الحرارة بسرعة بعد العاصفة." },
        { en: "Will you join our hiking group on Friday?", ar: "هل ستنضم إلى مجموعة المشي الجبلي يوم الجمعة؟" },
        { en: "Thick fog covered the road this morning.", ar: "غطى الضباب الكثيف الطريق هذا الصباح." },
        { en: "They have enjoyed gardening since they moved here.", ar: "استمتعوا بالبستنة منذ أن انتقلوا إلى هنا." },
        { en: "Take an umbrella because a shower is coming.", ar: "خذ مظلة لأن زخة مطر قادمة." }
      ],
      dialogue: [
        { who: "A", en: "What is the weather like in your city?", ar: "كيف الطقس في مدينتك؟" },
        { who: "B", en: "It is mild in spring but freezing in winter.", ar: "الجو معتدل في الربيع لكنه متجمد في الشتاء." },
        { who: "A", en: "What do you usually do in cold weather?", ar: "ماذا تفعل عادةً في الطقس البارد؟" },
        { who: "B", en: "I stay at home and do some gardening inside.", ar: "أبقى في البيت وأقوم ببعض البستنة في الداخل." },
        { who: "A", en: "Are you going to join a hobby club?", ar: "هل ستنضم إلى نادي هوايات؟" },
        { who: "B", en: "Yes, I will start photography classes next month.", ar: "نعم، سأبدأ دروس التصوير الشهر القادم." }
      ]
    },
    {
      id: "a2u6",
      title: "التكنولوجيا والهاتف والإنترنت",
      titleEn: "Technology, Phones and the Internet",
      icon: "📱",
      goal: "أن يستخدم المتعلم الهاتف والإنترنت ويتحدث عن تجاربه التقنية ويشرح الأسباب.",
      grammar: [
        {
          title: "المضارع التام للتجارب",
          explain: "<p>نستخدم <b>المضارع التام</b> للحديث عن تجارب حدثت في الماضي دون تحديد وقتها.</p><ul><li>يتكوّن من فعل المساعدة مع التصريف الثالث للفعل.</li><li>نستخدم أداتي السؤال والنفي للحديث عن التجارب.</li><li>لا نذكر وقتًا ماضيًا محددًا مع هذه الصيغة.</li><li>يمكن استخدامها مع كلمة منذ للدلالة على مدة مستمرة.</li></ul>",
          table: {
            headers: ["الاستخدام", "المثال"],
            rows: [
              ["تجربة في السؤال", "Have you ever used this application?"],
              ["تجربة منفية", "I have never shared my password."],
              ["خبرة مكتسبة", "She has created three websites."],
              ["مع كلمة منذ", "We have used this device since March."]
            ]
          },
          examples: [
            { en: "Have you ever downloaded a film online?", ar: "هل حمّلت فيلمًا عبر الإنترنت من قبل؟" },
            { en: "I have never forgotten my password before.", ar: "لم أنسَ كلمة المرور من قبل أبدًا." },
            { en: "She has uploaded all the photos already.", ar: "لقد رفعت كل الصور بالفعل." },
            { en: "We have used this website for two years.", ar: "استخدمنا هذا الموقع لمدة سنتين." },
            { en: "He has never broken his phone screen.", ar: "لم يكسر شاشة هاتفه أبدًا." }
          ],
          tips: [
            "استخدم التصريف الثالث للفعل بعد فعل المساعدة.",
            "لا تذكر زمنًا ماضيًا محددًا مع هذه الصيغة.",
            "أداتا السؤال والنفي مناسبتان للحديث عن التجارب."
          ]
        },
        {
          title: "أدوات الربط: السبب والنتيجة والتناقض",
          explain: "<p>أدوات الربط توضح العلاقة بين <b>السبب</b> و<b>النتيجة</b> و<b>التناقض</b>.</p><ul><li>أداة السبب تشرح لماذا حدث الشيء.</li><li>أداة النتيجة تقدّم النتيجة المترتبة على السبب.</li><li>أداة التناقض تقارن بين فكرتين متعارضتين.</li></ul>",
          table: {
            headers: ["الأداة", "الوظيفة", "المثال"],
            rows: [
              ["because", "السبب", "I updated the application because it was slow."],
              ["so", "النتيجة", "The battery was empty, so I charged it."],
              ["although", "التناقض", "Although the phone is old, it works well."]
            ]
          },
          examples: [
            { en: "I turned off notifications because I needed to study.", ar: "أوقفت الإشعارات لأنني كنت بحاجة إلى الدراسة." },
            { en: "The wifi was weak, so we moved to another room.", ar: "كانت الشبكة ضعيفة، لذلك انتقلنا إلى غرفة أخرى." },
            { en: "Although she has a new laptop, she uses the old one.", ar: "رغم أن لديها حاسوبًا محمولًا جديدًا، فإنها تستخدم القديم." },
            { en: "He bought a new charger because his old one broke.", ar: "اشترى شاحنًا جديدًا لأن شاحنه القديم تعطّل." },
            { en: "The application is free, so everyone can download it.", ar: "التطبيق مجاني، لذلك يمكن للجميع تنزيله." }
          ],
          tips: [
            "أداة السبب تأتي قبل السبب، وأداة النتيجة تأتي قبل النتيجة.",
            "يمكن أن تأتي أداة التناقض في بداية الجملة أو في وسطها.",
            "ضع فاصلة قبل أداة النتيجة عندما تربط بين جملتين."
          ]
        }
      ],
      vocabulary: [
        { en: "device", ar: "جهاز", pos: "noun", emoji: "📲", example: { en: "This device charges in about one hour.", ar: "يُشحن هذا الجهاز في نحو ساعة." } },
        { en: "screen", ar: "شاشة", pos: "noun", emoji: "🖥️", example: { en: "The screen of my phone is broken.", ar: "شاشة هاتفي مكسورة." } },
        { en: "charger", ar: "شاحن", pos: "noun", emoji: "🔌", example: { en: "I forgot my charger at the office.", ar: "نسيت شاحني في المكتب." } },
        { en: "battery", ar: "بطارية", pos: "noun", emoji: "🔋", example: { en: "My battery dies very quickly.", ar: "تنفد بطاريتي بسرعة كبيرة." } },
        { en: "download", ar: "ينزّل من الإنترنت", pos: "verb", emoji: "⬇️", example: { en: "I download podcasts before long trips.", ar: "أنزّل ملفات صوتية قبل الرحلات الطويلة." } },
        { en: "upload", ar: "يرفع إلى الإنترنت", pos: "verb", emoji: "⬆️", example: { en: "She will upload the photos tonight.", ar: "سترفع الصور الليلة." } },
        { en: "password", ar: "كلمة المرور", pos: "noun", emoji: "🔑", example: { en: "Never share your password with anyone.", ar: "لا تشارك كلمة مرورك مع أي شخص." } },
        { en: "account", ar: "حساب إلكتروني", pos: "noun", emoji: "👤", example: { en: "I created a new account yesterday.", ar: "أنشأت حسابًا جديدًا أمس." } },
        { en: "message", ar: "رسالة", pos: "noun", emoji: "✉️", example: { en: "He sent me a short message.", ar: "أرسل لي رسالة قصيرة." } },
        { en: "browse", ar: "يتصفح", pos: "verb", emoji: "🔍", example: { en: "I browse the internet for new recipes.", ar: "أتصفح الإنترنت بحثًا عن وصفات جديدة." } },
        { en: "website", ar: "موقع إلكتروني", pos: "noun", emoji: "🌐", example: { en: "This website has useful exercises.", ar: "هذا الموقع فيه تمارين مفيدة." } },
        { en: "keyboard", ar: "لوحة مفاتيح", pos: "noun", emoji: "⌨️", example: { en: "My keyboard has a broken key.", ar: "في لوحة مفاتيحي زر مكسور." } },
        { en: "headphones", ar: "سماعات رأس", pos: "noun", emoji: "🎧", example: { en: "I listen to music with my headphones.", ar: "أستمع إلى الموسيقى بسماعات رأسي." } },
        { en: "update", ar: "يحدّث", pos: "verb", emoji: "🔄", example: { en: "Please update the application tonight.", ar: "من فضلك حدّث التطبيق الليلة." } },
        { en: "connect", ar: "يتصل بالشبكة", pos: "verb", emoji: "📶", example: { en: "I cannot connect to the internet here.", ar: "لا أستطيع الاتصال بالإنترنت هنا." } },
        { en: "privacy", ar: "الخصوصية", pos: "noun", emoji: "🔒", example: { en: "Privacy is important on social media.", ar: "الخصوصية مهمة في وسائل التواصل." } },
        { en: "notification", ar: "إشعار", pos: "noun", emoji: "🔔", example: { en: "I turned off every notification on my phone.", ar: "أوقفت كل إشعار على هاتفي." } }
      ],
      sentences: [
        { en: "My phone battery dies very quickly these days.", ar: "تنفد بطارية هاتفي بسرعة كبيرة هذه الأيام." },
        { en: "Have you ever changed your email password?", ar: "هل غيّرت كلمة مرور بريدك من قبل؟" },
        { en: "She uploads her photos to a private website.", ar: "ترفع صورها إلى موقع خاص." },
        { en: "I cannot connect to the internet in this room.", ar: "لا أستطيع الاتصال بالإنترنت في هذه الغرفة." },
        { en: "He bought new headphones with a long cable.", ar: "اشترى سماعات جديدة بسلك طويل." },
        { en: "We have used this device for three years.", ar: "استخدمنا هذا الجهاز ثلاث سنوات." },
        { en: "The screen broke because the phone fell down.", ar: "انكسرت الشاشة لأن الهاتف سقط." },
        { en: "Although the update was slow, it worked well.", ar: "رغم أن التحديث كان بطيئًا، فقد عمل جيدًا." },
        { en: "I will download the application tomorrow morning.", ar: "سأنزّل التطبيق صباح الغد." },
        { en: "They are going to create a new account today.", ar: "سينشئون حسابًا جديدًا اليوم." },
        { en: "She never shares her private messages online.", ar: "لا تشارك رسائلها الخاصة عبر الإنترنت أبدًا." },
        { en: "You should protect your privacy on social media.", ar: "ينبغي أن تحمي خصوصيتك في وسائل التواصل." }
      ],
      dialogue: [
        { who: "A", en: "My phone is very slow today.", ar: "هاتفي بطيء جدًا اليوم." },
        { who: "B", en: "You should update the system, it helps a lot.", ar: "ينبغي أن تحدّث النظام، فهو يساعد كثيرًا." },
        { who: "A", en: "I have already downloaded the update.", ar: "لقد نزّلت التحديث بالفعل." },
        { who: "B", en: "Then restart the device and check the battery.", ar: "إذن أعد تشغيل الجهاز وافحص البطارية." },
        { who: "A", en: "Good idea, where can I find my password?", ar: "فكرة جيدة، أين أجد كلمة المرور؟" },
        { who: "B", en: "It is saved in your account settings.", ar: "إنها محفوظة في إعدادات حسابك." }
      ]
    }
  ]
};

const A2_UNIT_ENRICHMENT = {
  a2u1: {
    phonetics: [
      { id: "deadline", en: "deadline", ipa: "/ˈdedlaɪn/", ar: "موعد نهائي", contrastPairs: [{ en: "work / walk", ar: "تدرّب على الحركة في work /ɜː/ مقابل walk /ɔː/." }], connectedSpeech: [{ en: "take a break", ar: "تُختزل أداة a غالباً إلى /ə/ في الكلام الطبيعي." }], intonation: [{ en: "When is the deadline? ↘", ar: "تنغيم هابط شائع في سؤال أداة الاستفهام." }] },
      { id: "schedule", en: "schedule", ipa: "/ˈʃedjuːl/ (UK), /ˈskedʒuːl/ (US)", ar: "جدول مواعيد", contrastPairs: [{ en: "she / see", ar: "ميّز /ʃ/ عن /s/ في بداية الكلمة." }], connectedSpeech: [{ en: "I usually start work at eight.", ar: "قد يضعف صوت usually غير المنبور؛ حافظ على مقاطع الكلمة." }], intonation: [{ en: "I usually study after work. ↘", ar: "هبوط النبرة في الجملة الخبرية." }] },
    ],
    arabic_l1_transfers: [
      { id: "third-person", incorrect: "She work every day.", corrected: "She works every day.", pattern: "إغفال علامة المفرد الغائب", explanationAr: "في المضارع البسيط نضيف -s غالباً إلى الفعل مع he/she/it." },
      { id: "past-question", incorrect: "Did you went to work?", corrected: "Did you go to work?", pattern: "تكرار علامة الماضي", explanationAr: "بعد did يعود الفعل إلى صورته الأساسية؛ did يحمل علامة الماضي." },
    ],
    academic_focus: [
      { id: "routine", term: "routine", meaningAr: "روتين أو تسلسل معتاد", example: { en: "The survey describes students' morning routines.", ar: "يصف الاستطلاع روتين الطلاب الصباحي." }, paraphrasing: [{ original: "I do the same tasks every morning.", paraphrase: "I follow the same morning routine." }] },
      { id: "organise", term: "organise", meaningAr: "ينظّم", example: { en: "Organise your tasks by deadline.", ar: "نظّم مهامك حسب الموعد النهائي." }, readingAnalysis: [{ term: "sequence", meaningAr: "ترتيب الأحداث أو المهام" }] },
    ],
    vocabulary: { deadline: { collocations: [{ en: "meet a deadline", ar: "يلتزم بموعد نهائي" }] }, commute: { phrasalVerbs: [{ en: "get to work", ar: "يصل إلى العمل", example: { en: "I get to work by bus.", ar: "أصل إلى العمل بالحافلة." } }] } },
  },
  a2u2: {
    phonetics: [
      { id: "receipt", en: "receipt", ipa: "/rɪˈsiːt/", ar: "إيصال", contrastPairs: [{ en: "price / prize", ar: "ميّز /s/ المهموسة عن /z/ المجهورة." }], connectedSpeech: [{ en: "How much is it?", ar: "تُوصل الكلمات في سؤال السعر، مع بقاء much مسموعة." }], intonation: [{ en: "Could I have a receipt, please? ↘", ar: "هبوط لطيف في نهاية الطلب المهذب." }] },
      { id: "cheap", en: "cheap", ipa: "/tʃiːp/", ar: "رخيص", contrastPairs: [{ en: "cheap / sheep", ar: "ميّز /tʃ/ المركب عن /ʃ/." }], connectedSpeech: [{ en: "a cheap pair of shoes", ar: "حافظ على وضوح /p/ قبل بداية pair." }], intonation: [{ en: "Is this cheaper? ↗", ar: "تنغيم صاعد في سؤال نعم/لا." }] },
    ],
    arabic_l1_transfers: [
      { id: "much-many", incorrect: "much customers", corrected: "many customers", pattern: "الخلط بين much وmany", explanationAr: "استخدم many مع الأسماء المعدودة الجمع، وmuch مع الأسماء غير المعدودة." },
      { id: "lend-borrow", incorrect: "Can you borrow me some money?", corrected: "Can you lend me some money?", pattern: "الخلط بين lend وborrow", explanationAr: "lend يعني أن تعطي شيئاً مؤقتاً، وborrow يعني أن تأخذه مؤقتاً." },
    ],
    academic_focus: [
      { id: "compare", term: "compare", meaningAr: "يقارن", example: { en: "Compare the prices of the two products.", ar: "قارن أسعار المنتجين." }, paraphrasing: [{ original: "The blue bag costs less than the red bag.", paraphrase: "The blue bag is cheaper than the red one." }] },
      { id: "amount", term: "amount", meaningAr: "كمية", example: { en: "The receipt shows the total amount.", ar: "يوضح الإيصال المبلغ الإجمالي." }, readingAnalysis: [{ term: "total", meaningAr: "مجموع القيم أو الأسعار" }] },
    ],
    vocabulary: { discount: { collocations: [{ en: "get a discount", ar: "يحصل على خصم" }] }, afford: { phrasalVerbs: [{ en: "pay for", ar: "يدفع ثمن شيء", example: { en: "I will pay for the groceries.", ar: "سأدفع ثمن حاجات البقالة." } }] } },
  },
  a2u3: {
    phonetics: [
      { id: "departure", en: "departure", ipa: "/dɪˈpɑːtʃə(r)/", ar: "مغادرة", contrastPairs: [{ en: "ship / sheep", ar: "ميّز /ɪ/ القصيرة عن /iː/ الطويلة." }], connectedSpeech: [{ en: "The train was leaving when I arrived.", ar: "حافظ على نطق was الخفيف عند وصله بالفعل." }], intonation: [{ en: "What time does the train depart? ↘", ar: "تنغيم هابط في سؤال أداة الاستفهام." }] },
      { id: "journey", en: "journey", ipa: "/ˈdʒɜːni/", ar: "رحلة", contrastPairs: [{ en: "journey / sherry", ar: "ميّز /dʒ/ عن /ʃ/ في البداية." }], connectedSpeech: [{ en: "We arrived at the station on time.", ar: "لا تحذف at عند وصلها بالكلمات المحيطة." }], intonation: [{ en: "Did you enjoy the journey? ↗", ar: "تنغيم صاعد في سؤال نعم/لا." }] },
    ],
    arabic_l1_transfers: [
      { id: "did-base", incorrect: "We didn't took the train.", corrected: "We didn't take the train.", pattern: "إبقاء الفعل في الماضي بعد did", explanationAr: "بعد didn't أو did يأتي الفعل بصورته الأساسية." },
      { id: "travel-preposition", incorrect: "I arrived to the airport.", corrected: "I arrived at the airport.", pattern: "نقل حرف الجر مع فعل الوصول", explanationAr: "نستخدم arrive at لمكان محدد، وarrive in مع مدينة أو بلد." },
    ],
    academic_focus: [
      { id: "route", term: "route", meaningAr: "مسار أو طريق", example: { en: "The map shows the route to the station.", ar: "تعرض الخريطة المسار إلى المحطة." }, paraphrasing: [{ original: "The bus goes from the hotel to the airport.", paraphrase: "The bus route connects the hotel and airport." }] },
      { id: "sequence", term: "sequence", meaningAr: "تسلسل أو ترتيب", example: { en: "The travel guide lists the stops in sequence.", ar: "يسرد دليل السفر المحطات بالترتيب." }, readingAnalysis: [{ term: "first / next / finally", meaningAr: "روابط توضّح ترتيب الأحداث" }] },
    ],
    vocabulary: { departure: { collocations: [{ en: "departure time", ar: "وقت المغادرة" }] }, board: { phrasalVerbs: [{ en: "get on", ar: "يصعد إلى وسيلة نقل", example: { en: "We get on the bus at the next stop.", ar: "نصعد إلى الحافلة في المحطة التالية." } }] } },
  },
  a2u4: {
    phonetics: [
      { id: "medicine", en: "medicine", ipa: "/ˈmedɪsən/", ar: "دواء", contrastPairs: [{ en: "breathe / breath", ar: "breathe ينتهي بصوت /ð/ مجهور، وbreath بصوت /θ/ مهموس." }], connectedSpeech: [{ en: "You should see a doctor.", ar: "قد تختصر should في الكلام المتصل، لكن لا تخلطها بـshouldn't." }], intonation: [{ en: "You should get some rest. ↘", ar: "هبوط النبرة في نصيحة مباشرة." }] },
      { id: "nervous", en: "nervous", ipa: "/ˈnɜːvəs/", ar: "متوتر", contrastPairs: [{ en: "very / wary", ar: "انتبه لاختلاف الحركة الأولى وموقع النبر." }], connectedSpeech: [{ en: "I feel nervous about the appointment.", ar: "اربط about بالكلمة التالية مع وضوح المقطع المنبور." }], intonation: [{ en: "Are you feeling better? ↗", ar: "تنغيم صاعد في سؤال نعم/لا." }] },
    ],
    arabic_l1_transfers: [
      { id: "advice-count", incorrect: "an advice", corrected: "some advice", pattern: "معاملة advice كاسم معدود", explanationAr: "advice غير معدود؛ لا يسبقه a/an ولا يجمع عادةً، ويمكن قول a piece of advice." },
      { id: "modal-base", incorrect: "You should to rest.", corrected: "You should rest.", pattern: "إضافة to بعد الفعل المساعد", explanationAr: "يأتي الفعل بصورته الأساسية مباشرة بعد should وmust." },
    ],
    academic_focus: [
      { id: "symptom", term: "symptom", meaningAr: "عَرَض صحي", example: { en: "The patient described each symptom.", ar: "وصف المريض كل عَرَض." }, paraphrasing: [{ original: "My head hurts.", paraphrase: "I have a headache." }] },
      { id: "recommend", term: "recommend", meaningAr: "يوصي أو ينصح", example: { en: "The doctor recommends regular exercise.", ar: "يوصي الطبيب بممارسة الرياضة بانتظام." }, readingAnalysis: [{ term: "cause and effect", meaningAr: "علاقة السبب بالنتيجة" }] },
    ],
    vocabulary: { symptom: { collocations: [{ en: "common symptom", ar: "عَرَض شائع" }] }, recover: { phrasalVerbs: [{ en: "get over", ar: "يتعافى من مرض أو تجربة صعبة", example: { en: "She got over the flu last week.", ar: "تعافت من الإنفلونزا الأسبوع الماضي." } }] } },
  },
  a2u5: {
    phonetics: [
      { id: "weather", en: "weather", ipa: "/ˈweðə(r)/", ar: "طقس", contrastPairs: [{ en: "weather / whether", ar: "الكلمتان متطابقتان غالباً في النطق؛ يحدد السياق المعنى." }], connectedSpeech: [{ en: "It is going to rain.", ar: "غالباً تُختصر going to إلى gonna في الحديث غير الرسمي، لا في الكتابة الرسمية." }], intonation: [{ en: "Will it rain tomorrow? ↗", ar: "تنغيم صاعد في سؤال نعم/لا." }] },
      { id: "thunder", en: "thunder", ipa: "/ˈθʌndə(r)/", ar: "رعد", contrastPairs: [{ en: "thin / tin", ar: "ميّز /θ/ عن /t/ في بداية الكلمة." }], connectedSpeech: [{ en: "The forecast says it will be sunny.", ar: "اربط says it دون إسقاط ضمير it." }], intonation: [{ en: "It may be windy this afternoon. ↘", ar: "هبوط النبرة عند إكمال التوقع." }] },
    ],
    arabic_l1_transfers: [
      { id: "weather-spelling", incorrect: "The whether is cold today.", corrected: "The weather is cold today.", pattern: "الخلط بين weather وwhether", explanationAr: "weather تعني الطقس، أما whether فتُستخدم غالباً بمعنى ما إذا؛ وهما متطابقتان في النطق." },
      { id: "will-plan", incorrect: "I will visit my friend yesterday.", corrected: "I visited my friend yesterday.", pattern: "عدم اتساق الزمن مع ظرفه", explanationAr: "استخدم الماضي مع yesterday، ولا تجمعه مع will الدال على المستقبل." },
    ],
    academic_focus: [
      { id: "forecast", term: "forecast", meaningAr: "توقع أو تنبؤ", example: { en: "The forecast predicts rain in the afternoon.", ar: "تتوقع النشرة هطول المطر بعد الظهر." }, paraphrasing: [{ original: "It will probably be sunny.", paraphrase: "The forecast suggests sunshine." }] },
      { id: "trend", term: "trend", meaningAr: "اتجاه أو نمط متكرر", example: { en: "The chart shows a rising temperature trend.", ar: "يعرض المخطط اتجاهاً تصاعدياً في درجات الحرارة." }, readingAnalysis: [{ term: "increase / decrease", meaningAr: "ارتفاع / انخفاض في قيمة أو كمية" }] },
    ],
    vocabulary: { forecast: { collocations: [{ en: "weather forecast", ar: "نشرة الطقس" }] }, hiking: { phrasalVerbs: [{ en: "go out", ar: "يخرج لممارسة نشاط", example: { en: "We go out hiking when the weather is mild.", ar: "نخرج للمشي عندما يكون الطقس معتدلاً." } }] } },
  },
  a2u6: {
    phonetics: [
      { id: "device", en: "device", ipa: "/dɪˈvaɪs/", ar: "جهاز", contrastPairs: [{ en: "save / safe", ar: "ميّز /v/ المجهورة في save عن /f/ المهموسة في safe." }], connectedSpeech: [{ en: "Have you updated the app?", ar: "قد يختزل have في الكلام، مع إبقاء بنية المضارع التام." }], intonation: [{ en: "Have you ever used this app? ↗", ar: "تنغيم صاعد في سؤال نعم/لا." }] },
      { id: "privacy", en: "privacy", ipa: "/ˈprɪvəsi/", ar: "خصوصية", contrastPairs: [{ en: "fan / van", ar: "ميّز /f/ المهموسة عن /v/ المجهورة." }], connectedSpeech: [{ en: "I have already changed my password.", ar: "اربط have already مع المحافظة على النبر في already." }], intonation: [{ en: "You should protect your account. ↘", ar: "هبوط النبرة في النصيحة." }] },
    ],
    arabic_l1_transfers: [
      { id: "present-perfect-time", incorrect: "I have downloaded it yesterday.", corrected: "I downloaded it yesterday.", pattern: "الجمع بين المضارع التام ووقت ماضٍ محدد", explanationAr: "استخدم الماضي البسيط مع yesterday؛ المضارع التام لا يحدد وقتاً ماضياً منتهياً." },
      { id: "privacy-preposition", incorrect: "I depend in this app.", corrected: "I depend on this app.", pattern: "ترجمة حرف الجر حرفياً", explanationAr: "الفعل depend يتطلب حرف الجر on في هذا المعنى." },
    ],
    academic_focus: [
      { id: "privacy", term: "privacy", meaningAr: "خصوصية", example: { en: "Privacy settings control who can see your information.", ar: "تحدد إعدادات الخصوصية من يمكنه رؤية معلوماتك." }, paraphrasing: [{ original: "Do not share your password.", paraphrase: "Keep your password private." }] },
      { id: "function", term: "function", meaningAr: "وظيفة أو خاصية", example: { en: "The search function helps users find information.", ar: "تساعد وظيفة البحث المستخدمين على إيجاد المعلومات." }, readingAnalysis: [{ term: "feature", meaningAr: "خاصية يقدمها التطبيق أو الجهاز" }] },
    ],
    vocabulary: { password: { collocations: [{ en: "strong password", ar: "كلمة مرور قوية" }] }, update: { phrasalVerbs: [{ en: "log in", ar: "يسجل الدخول", example: { en: "Log in to your account to check the update.", ar: "سجّل الدخول إلى حسابك للتحقق من التحديث." } }] } },
  },
};

for (const unit of LEVEL_A2.units) {
  const enrichment = A2_UNIT_ENRICHMENT[unit.id];
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
