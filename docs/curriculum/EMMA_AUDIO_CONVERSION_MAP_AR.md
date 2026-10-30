# خريطة تحويل بنك الصوت إلى Emma

الصوت المختار من واجهة Edge: **English - United States - Emma**.
معرّف Microsoft القياسي المطابق: `en-US-EmmaNeural` (Standard Neural، Female، en-US).

## ملفات المشروع

- خريطة النصوص الحالية (280 إدخالاً): `assets/js/data/zero-audio-map.js`
- إعدادات الحروف والفونيمات: `curriculum/literacy/audio-manifest.json`
- جذر الملفات الصوتية: `assets/audio/zero/`
- أداة الترحيل: `scripts/migrate-audio-to-emma.mjs`

## مسار الصوت الرسمي

Microsoft Learn → Azure Speech → Language and voice support → Text to speech voices → Locale `en-US` → Standard → `en-US-EmmaNeural`.

الرابط المباشر: https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=pronunciation-assessment

لا تخلط هذا الصوت مع `en-US-EmmaMultilingualNeural` أو أصوات Neural HD المسماة Emma؛ فهي إدخالات مختلفة.

## محتويات CSV

- 382 صفاً إجمالياً.
- 0 إدخالاً من AUDIO_MAP.
- 26 اسم حرف + 26 كلمة مثال + 26 خانة فونيم مستقلة غير متوفرة في manifest.
- 12 فونيم/حرف مركب + 12 كلمة مثال.

**ملاحظة:** عمود target_voice يوضح ما يجب توليده، لا يثبت أن الملف قد أُنشئ أو اختُبر. صفوف الفونيمات اليدوية لا تُولّد بقراءة IPA حرفياً؛ يجب أن يسجلها متحدث/مراجع مؤهل أو إعداد صوتي موثوق ثم تراجع سمعياً.

## صيغة التسمية

- كلمات وجمل الخريطة: `assets/audio/zero/w/<slug>.mp3`
- أسماء الحروف: `assets/audio/zero/n/name-a.mp3` إلى `name-z.mp3`
- أمثلة الحروف: `assets/audio/zero/n/word-a.mp3` إلى `word-z.mp3`
- أصوات الحروف المركبة: `assets/audio/zero/d/<id>.mp3`
- أمثلة الحروف المركبة: `assets/audio/zero/n/word-<id>.mp3`

استخدم CSV كقائمة تنفيذ، ثم حدّث الملفات نفسها داخل هذه المسارات دون تغيير المسارات التي يستدعيها التطبيق.
