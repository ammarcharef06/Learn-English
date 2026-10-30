# خريطة تحويل بنك الصوت إلى Emma

الصوت المحدد في واجهة المستخدم: **English - United States - Emma**.
معرّف Microsoft الرسمي المطابق: `en-US-EmmaNeural` — Standard Neural، Female، `en-US`.

## المصدر الرسمي للصوت

المسار داخل توثيق Microsoft:
**Microsoft Learn → Azure Speech → Language and voice support → Text to speech voices → en-US → Standard → en-US-EmmaNeural**

الرابط المباشر:
https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=pronunciation-assessment

لا تخلط هذا الصوت مع `en-US-EmmaMultilingualNeural` أو `en-US-Emma:DragonHDLatestNeural`؛ إنها أصوات/نماذج منفصلة.

## ملفات المشروع ومساراتها

- خريطة النصوص الحالية: `assets/js/data/zero-audio-map.js`
- قائمة أصول الحروف والفونيمات: `curriculum/literacy/audio-manifest.json`
- مرجع التهجئة والفونيم: `curriculum/literacy/phoneme-grapheme-reference.json`
- جذر الصوت: `assets/audio/zero/`
- كلمات وجمل الخريطة: `assets/audio/zero/w/<slug>.mp3`
- أسماء الحروف: `assets/audio/zero/n/name-a.mp3` إلى `name-z.mp3`
- أمثلة الحروف: `assets/audio/zero/n/word-a.mp3` إلى `word-z.mp3`
- أصوات الحروف المركبة: `assets/audio/zero/d/<id>.mp3`
- أمثلة الحروف المركبة: `assets/audio/zero/n/word-<id>.mp3`

## ما في ملف CSV

- 280 مدخلاً فعلياً في AUDIO_MAP (تعليق الملف يقول 280، لكن العدّ الفعلي للمفاتيح في النسخة الحالية هو 280).
- 26 اسم حرف + 26 كلمة مثال مقترحة + 26 تنبيه فونيمي.
- 12 تسجيلاً لأصوات الحروف المركبة + 12 كلمة مثال.

إجمالي الصفوف: 382.

**تمييز مهم:** لا يوجد فونيم واحد ثابت لكل حرف إنجليزي؛ الحرف الواحد قد يمثل أصواتاً متعددة، والفونيم الواحد قد تكتبه تهجئات متعددة. لذلك لا تنشئ 26 ملفاً على أنها "صوت الحرف" الواحد. ملف `phoneme-grapheme-reference.json` يحتوي حالياً 22 مثالاً ساكناً، لكن سياسة الحركات فيه غير نهائية. راجع الأصوات والسياق واللهجة قبل تسجيل أي فونيم.

قيم الكلمات في صفوف أمثلة الحروف اقتراحات عملية للمراجعة، وليست نصوصاً حالية مؤكدة من المنهج. صفوف الفونيمات اليدوية ليست مخصصة لتوليد TTS بقراءة IPA.

CSV قائمة تنفيذ: أنشئ الملفات في المسارات المذكورة ثم اختبر كل ملف استماعاً، وتحقق من عدم الصمت أو القصّ أو اختلاف النص عن الصوت.
