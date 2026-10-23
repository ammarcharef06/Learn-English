import { COMMUNITY_LIMITS, blockCommunityUser, communityAssistant, communityConfigured, communitySession, communitySignIn, communitySignOut, communitySignUp, findStudyBuddies, joinTopicRoom, loadCommunity, loadMessages, openDirectChat, reactToMessage, removeVoiceNote, reportCommunityContent, sendCommunityMessage, subscribeToRoom, unblockCommunityUser, updateMyProfile, uploadVoiceNote } from '../core/community.js';
import { settings } from '../core/store.js';
import { containsBlockedLanguage } from '../core/community-safety.js';
import { esc } from '../core/utils.js';
import { pageHead } from './shell.js';
import { navigate } from '../core/router.js';

const startersFallback = [
  'What do you enjoy learning in English?',
  'What is one place you would like to visit?',
  'What did you learn this week?',
];
const ui = {
  ar: {
    subtitle: 'تدرّب مع متعلمين آخرين، بأمان وباسم تختاره.',
    notConfigured: 'المجتمع جاهز للربط لكنه غير مفعّل بعد.',
    configureHelp: 'أنشئ مشروع Supabase، ثم طبّق الترحيل الموجود في supabase/migrations واربط العنوان والمفتاح العام في community-config.js. لا تضع service-role أو مفاتيح Gemini في الواجهة.',
    signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', email: 'البريد الإلكتروني', password: 'كلمة المرور',
    displayName: 'الاسم الظاهر', submit: 'متابعة', noAccount: 'جديد في المجتمع؟', hasAccount: 'لديك حساب بالفعل؟',
    verifyEmail: 'تحقق من بريدك الإلكتروني لتأكيد الحساب ثم سجّل الدخول.', welcome: 'مرحباً',
    signOut: 'تسجيل الخروج', rooms: 'الغرف الموضوعية', direct: 'شركاء الدراسة', find: 'اعثر على شريك',
    settings: 'الإعدادات', settingsTitle: 'إعدادات المجتمع', backToChats: 'العودة إلى المحادثات',
    searchChats: 'ابحث عن محادثة أو موضوع…', startConversation: 'اختر محادثة لبدء التعلّم',
    profileSettings: 'الملف الشخصي والخصوصية', account: 'الحساب', communityProfile: 'ملف المجتمع',
    chatTitle: 'المحادثات', appHome: 'العودة إلى الأكاديمية', details: 'معلومات المحادثة',
    learnerDetails: 'ملف المتعلّم', roomDetails: 'تفاصيل الغرفة', directMessage: 'محادثة خاصة',
    noDirect: 'ابدأ بالتعرّف إلى شريك دراسة.', noRoom: 'اختر غرفة أو ابدأ محادثة مع شريك.',
    join: 'انضم', joined: 'منضم', level: 'المستوى', xp: 'نقطة XP', messages: 'الرسائل',
    send: 'إرسال', placeholder: 'اكتب رسالة تعليمية محترمة…', filtered: 'عدّل العبارة قبل الإرسال حتى تبقى المحادثة محترمة.',
    voiceStart: 'تسجيل ملاحظة صوتية', voiceStop: 'إنهاء وإرسال التسجيل', recording: 'جارٍ التسجيل…',
    voiceUnavailable: 'التسجيل الصوتي غير متاح في هذا المتصفح أو دون HTTPS.',
    messageLimit: 'الحد الأقصى 2000 حرف.', aiDisclosure: 'عند طلب الترجمة أو التصحيح، يُرسل النص المحدد إلى Gemini لمعالجته ولا يُحفظ لدى خدمة الذكاء الاصطناعي.',
    translate: 'ترجم', correct: 'راجع لغتي', starters: 'اقترح موضوعاً', useSuggestion: 'استخدم التصحيح',
    report: 'إبلاغ', block: 'حظر', unblock: 'إلغاء الحظر', support: 'أحسنت',
    reportReason: 'سبب الإبلاغ',     reportSent: 'تم تسجيل البلاغ لمراجعته.',
    blocked: 'تم حظر المستخدم وإخفاء رسائله.', unblocked: 'تم إلغاء الحظر.',
    buddyPrivacy: 'يظهر ملفك للشركاء فقط إذا فعّلت خيار «السماح للآخرين بالعثور عليّ».',
    discoverable: 'السماح للمتعلمين بالعثور عليّ', saveProfile: 'حفظ الملف الشخصي',
    emptyMessages: 'ابدأ المحادثة بتحية لطيفة أو بسؤال عن هدف التعلّم.',
    connection: 'جارٍ الاتصال بالمجتمع…', sendFailed: 'تعذّر الإرسال. تحقّق من الاتصال وحاول مجدداً.',
    reportReasons: { spam: 'رسائل مزعجة', harassment: 'مضايقة', inappropriate: 'محتوى غير مناسب', other: 'سبب آخر' },
    userBlocked: 'لا يمكن إرسال هذه الرسالة؛ راجعها وفق إرشادات الاحترام.',
    blockedList: 'المستخدمون المحظورون', noBuddies: 'لا يوجد متعلمون متاحون حالياً.',
    topic: 'الموضوع', online: 'محادثة خاصة', reply: 'ردّ على رسالة', audio: 'ملاحظة صوتية',
    assistantError: 'تعذّر استخدام المساعد الآن. تحقق من إعداد Gemini في Supabase.',
    badges: 'شارات المجتمع', badgeFirst: 'أول مساهمة', badgeHelper: 'متعلّم نشيط', badgeEncourager: 'مشجّع المجتمع',
    correctFriend: 'اقترح تصحيحاً لطيفاً',
  },
  en: {
    subtitle: 'Practice with other learners in a safer, learner-focused space.',
    notConfigured: 'The community is ready to connect but has not been enabled yet.',
    configureHelp: 'Create a Supabase project, apply the migration in supabase/migrations, then set the project URL and publishable key in community-config.js. Never put service-role or Gemini keys in the client.',
    signIn: 'Sign in', signUp: 'Create account', email: 'Email address', password: 'Password',
    displayName: 'Display name', submit: 'Continue', noAccount: 'New to the community?', hasAccount: 'Already have an account?',
    verifyEmail: 'Check your email to confirm your account, then sign in.', welcome: 'Welcome',
    signOut: 'Sign out', rooms: 'Topic rooms', direct: 'Study buddies', find: 'Find a buddy',
    settings: 'Settings', settingsTitle: 'Community settings', backToChats: 'Back to chats',
    searchChats: 'Search chats or topics…', startConversation: 'Choose a chat to start learning',
    profileSettings: 'Profile & privacy', account: 'Account', communityProfile: 'Community profile',
    chatTitle: 'Chats', appHome: 'Back to academy', details: 'Chat information',
    learnerDetails: 'Learner profile', roomDetails: 'Room details', directMessage: 'Direct message',
    noDirect: 'Start by finding a study buddy.', noRoom: 'Choose a room or start a buddy chat.',
    join: 'Join', joined: 'Joined', level: 'Level', xp: 'XP', messages: 'Messages',
    send: 'Send', placeholder: 'Write a kind, learning-focused message…', filtered: 'Please rephrase that before sending so the conversation stays respectful.',
    voiceStart: 'Record a voice note', voiceStop: 'Stop and send note', recording: 'Recording…',
    voiceUnavailable: 'Voice recording is unavailable in this browser or without HTTPS.',
    messageLimit: 'Maximum length is 2000 characters.', aiDisclosure: 'When you request a translation or correction, the selected text is sent to Gemini for processing and is not stored by the AI service.',
    translate: 'Translate', correct: 'Check my English', starters: 'Suggest a topic', useSuggestion: 'Use correction',
    report: 'Report', block: 'Block', unblock: 'Unblock', support: 'Support',
    reportReason: 'Report reason', reportSent: 'Your report was submitted for review.',
    blocked: 'User blocked; their messages are hidden.', unblocked: 'User unblocked.',
    buddyPrivacy: 'Your profile is discoverable only when you enable “Let learners find me”.',
    discoverable: 'Let learners find me', saveProfile: 'Save profile',
    emptyMessages: 'Start with a kind hello or ask about a learning goal.',
    connection: 'Connecting to the community…', sendFailed: 'Could not send. Check your connection and try again.',
    reportReasons: { spam: 'Spam', harassment: 'Harassment', inappropriate: 'Inappropriate content', other: 'Other' },
    userBlocked: 'This message could not be sent. Please follow the community guidelines.',
    blockedList: 'Blocked learners', noBuddies: 'No learners are available right now.',
    topic: 'Topic', online: 'Direct message', reply: 'Reply to a message', audio: 'Voice note',
    assistantError: 'The assistant is unavailable. Check Gemini configuration in Supabase.',
    badges: 'Community badges', badgeFirst: 'First contribution', badgeHelper: 'Active learner', badgeEncourager: 'Community encourager',
    correctFriend: 'Suggest a kind correction',
  },
};

let activeInstance = null;
const lang = () => settings.uiLang === 'en' ? 'en' : 'ar';
const copy = () => ui[lang()];
const bilingual = (en, ar) => lang() === 'en' ? en : ar;

function timeLabel(value) {
  return new Intl.DateTimeFormat(lang() === 'en' ? 'en' : 'ar', { hour: 'numeric', minute: '2-digit' })
    .format(new Date(value));
}

function earnedBadges(xp) {
  return [
    xp >= 1 && copy().badgeFirst,
    xp >= 10 && copy().badgeHelper,
    xp >= 30 && copy().badgeEncourager,
  ].filter(Boolean);
}

function messageHTML(message, currentUserId, profile, translations, reactions) {
  const own = message.sender_id === currentUserId;
  const person = own ? profile : message.sender || {};
  const translated = translations.get(message.id);
  const supportCount = message.supportCount || reactions.get(message.id) || 0;
  const hasContent = Boolean(message.body || message.voiceUrl || message.voice_path);
  return `<article class="community-message ${own ? 'is-own' : ''}" data-message-id="${esc(message.id)}">
    <header><b>${esc(person.display_name || bilingual('Learner', 'متعلّم'))}</b>
      ${person.level ? `<span class="chip">${esc(person.level)}</span>` : ''}
      <time datetime="${esc(message.created_at)}">${esc(timeLabel(message.created_at))}</time>
    </header>
    ${message.reply?.body ? `<blockquote>${esc(copy().reply)}: ${esc(message.reply.body)}</blockquote>` : ''}
    ${message.body ? `<p lang="en" dir="auto">${esc(message.body)}</p>` : ''}
    ${message.voiceUrl ? `<audio controls preload="none" src="${esc(message.voiceUrl)}" aria-label="${esc(copy().audio)}"></audio>` : ''}
    ${translated ? `<p class="community-translation" role="status"><b>${esc(bilingual('Translation', 'الترجمة'))}:</b> ${esc(translated)}</p>` : ''}
    ${hasContent ? `<div class="community-message__actions">
      ${message.body ? `<button type="button" class="btn btn--sm" data-action="translate" data-id="${esc(message.id)}">${esc(copy().translate)}</button>` : ''}
      ${message.body && !own ? `<button type="button" class="btn btn--sm" data-action="correct-message" data-id="${esc(message.id)}">${esc(copy().correctFriend)}</button>` : ''}
      ${!own ? `<button type="button" class="btn btn--sm" data-action="support" data-id="${esc(message.id)}">👏 ${esc(copy().support)}${supportCount ? ` (${supportCount})` : ''}</button>` : ''}
      ${!own ? `<button type="button" class="btn btn--sm" data-action="reply" data-id="${esc(message.id)}">${esc(copy().reply)}</button>` : ''}
      ${!own ? `<button type="button" class="btn btn--sm btn--bad" data-action="block" data-id="${esc(message.sender_id)}">${esc(copy().block)}</button>` : ''}
      ${!own ? `<button type="button" class="btn btn--sm" data-action="report" data-id="${esc(message.id)}">${esc(copy().report)}</button>` : ''}
    </div>` : ''}
  </article>`;
}

function screenMessage(host, text, error = false) {
  const node = host.querySelector('[data-community-status]');
  if (node) {
    node.textContent = text;
    node.classList.toggle('is-error', error);
  }
}

function disposeInstance() {
  if (!activeInstance) return;
  activeInstance.disposed = true;
  activeInstance.unsubscribe?.();
  activeInstance.unsubscribe = null;
  clearInterval(activeInstance.liveTimer);
  activeInstance.discardRecording = true;
  activeInstance.recorder?.stopIfActive?.();
  activeInstance.stream?.getTracks().forEach((track) => track.stop());
  activeInstance.stream = null;
  activeInstance = null;
}

export function disposeCommunity() {
  disposeInstance();
}

export function renderCommunity(host) {
  disposeInstance();
  const state = {
    host, session: null, user: null, profile: null, topics: [], directRooms: [],
    joinedTopicIds: new Set(), blockedIds: [], selectedRoom: null,
    messages: [], translations: new Map(), reactions: new Map(),
    showBuddies: false, buddies: [], busy: false, stream: null, recorder: null,
    screen: 'chats', searchQuery: '', detailsOpen: false,
    unsubscribe: null, disposed: false, liveSeconds: 0, liveTimer: null,
    subscriptionGeneration: 0,
  };
  activeInstance = state;

  if (!communityConfigured()) {
    host.innerHTML = `
      ${pageHead({ icon: '🌐', title: bilingual('Learning community', 'المجتمع التعليمي'), subtitle: copy().subtitle })}
      <section class="card community-setup" aria-labelledby="communitySetupTitle">
        <span aria-hidden="true">🔌</span>
        <h2 id="communitySetupTitle">${esc(copy().notConfigured)}</h2>
        <p>${esc(copy().configureHelp)}</p>
        <ol><li>أنشئ مشروع Supabase مجانيّاً.</li><li>طبّق مخطط قاعدة البيانات وسياسات RLS.</li><li>أضف عنوان المشروع ومفتاحه العام في إعدادات العميل.</li><li>اضبط GEMINI_API_KEY سرّاً على Edge Function ثم انشرها.</li></ol>
      </section>`;
    return;
  }
  host.innerHTML = `
    ${pageHead({ icon: '🌐', title: bilingual('Learning community', 'المجتمع التعليمي'), subtitle: copy().subtitle })}
    <div class="community-root" data-community-root>
      <p class="community-status" data-community-status role="status" aria-live="polite">${esc(copy().connection)}</p>
    </div>`;
  boot().catch((error) => screenMessage(host, error.message || copy().sendFailed, true));

  async function boot() {
    const { session } = await communitySession();
    if (state.disposed) return;
    state.session = session;
    state.user = session?.user || null;
    if (!state.user) return renderAuth();
    await refreshData();
    renderMain();
  }

  async function refreshData() {
    const data = await loadCommunity(state.user.id);
    if (state.disposed) return;
    Object.assign(state, {
      profile: data.profile,
      topics: data.topics,
      directRooms: data.rooms,
      joinedTopicIds: data.joinedTopicIds,
      blockedIds: data.blockedIds,
    });
  }

  function renderAuth() {
    state.authMode = state.authMode || 'signin';
    const signUp = state.authMode === 'signup';
    host.innerHTML = `
      ${pageHead({ icon: '🌐', title: bilingual('Learning community', 'المجتمع التعليمي'), subtitle: copy().subtitle })}
      <section class="card community-auth" aria-labelledby="communityAuthTitle">
        <span class="community-kicker">Supabase · Email</span>
        <h2 id="communityAuthTitle">${esc(signUp ? copy().signUp : copy().signIn)}</h2>
        <form id="communityAuthForm">
          ${signUp ? `<label class="field"><span>${esc(copy().displayName)}</span><input class="input" name="displayName" autocomplete="nickname" minlength="2" maxlength="40" required /></label>` : ''}
          <label class="field"><span>${esc(copy().email)}</span><input class="input" name="email" type="email" autocomplete="email" maxlength="254" required /></label>
          <label class="field"><span>${esc(copy().password)}</span><input class="input" name="password" type="password" autocomplete="${signUp ? 'new-password' : 'current-password'}" minlength="8" maxlength="72" required /></label>
          <button class="btn btn--primary" type="submit">${esc(copy().submit)}</button>
          <p class="community-status" data-community-status role="status" aria-live="polite"></p>
        </form>
        <button class="btn btn--sm" type="button" data-action="auth-toggle">${esc(signUp ? copy().hasAccount : copy().noAccount)}</button>
        <p class="small muted">${esc(bilingual('Your existing local lessons, progress and local app lock stay separate and remain on this device.', 'يبقى تعلّمك وتقدّمك وقفل التطبيق المحلي منفصلاً ومحفوظاً على هذا الجهاز.'))}</p>
      </section>`;
  }

  function renderMain() {
    const settingsScreen = state.screen === 'settings';
    host.innerHTML = `
      <div class="community-messenger ${state.selectedRoom && !settingsScreen ? 'has-selected-room' : ''}">
        <nav class="community-rail" aria-label="${esc(copy().chatTitle)}">
          <a class="community-rail__brand" href="#/" aria-label="${esc(copy().appHome)}" title="${esc(copy().appHome)}">📖</a>
          <button class="community-rail__button ${!settingsScreen ? 'is-active' : ''}" type="button" data-action="chats-home" aria-label="${esc(copy().chatTitle)}" aria-current="${!settingsScreen ? 'page' : 'false'}"><span aria-hidden="true">☏</span><small>${esc(copy().chatTitle)}</small></button>
          <button class="community-rail__button" type="button" data-action="find-buddies" aria-label="${esc(copy().find)}" title="${esc(copy().find)}"><span aria-hidden="true">＋</span><small>${esc(copy().find)}</small></button>
          <span class="community-rail__spacer"></span>
          <button class="community-rail__button ${settingsScreen ? 'is-active' : ''}" type="button" data-action="settings" aria-label="${esc(copy().settings)}" aria-current="${settingsScreen ? 'page' : 'false'}"><span aria-hidden="true">⚙</span><small>${esc(copy().settings)}</small></button>
          <span class="community-avatar community-avatar--rail" aria-label="${esc(state.profile.display_name)}">${esc([...state.profile.display_name][0] || 'L')}</span>
        </nav>
        <main class="community-messenger__main">
          ${settingsScreen ? renderSettingsScreen() : renderChatScreen()}
        </main>
        <p class="community-status" data-community-status role="status" aria-live="polite"></p>
      </div>`;
    if (!settingsScreen) attachRoomSubscription();
  }

  function renderSettingsScreen() {
    return `<section class="community-settings card" aria-labelledby="communitySettingsTitle">
      <header class="community-settings__head">
        <div><span class="community-kicker">${esc(copy().communityProfile)}</span><h2 id="communitySettingsTitle">${esc(copy().settingsTitle)}</h2></div>
        <button class="btn btn--sm" type="button" data-action="back-to-chats">${lang() === 'en' ? '←' : '→'} ${esc(copy().backToChats)}</button>
      </header>
      <div class="community-settings__summary">
        <span class="community-avatar community-avatar--large" aria-hidden="true">${esc([...state.profile.display_name][0] || 'L')}</span>
        <div><b>${esc(state.profile.display_name)}</b><span>${esc(state.profile.level)} · ⭐ ${state.profile.xp} ${esc(copy().xp)}</span></div>
      </div>
      <div class="community-badges" aria-label="${esc(copy().badges)}"><b>${esc(copy().badges)}:</b>
        ${earnedBadges(state.profile.xp).map((badge) => `<span class="chip">${esc(badge)}</span>`).join('') || `<span class="small muted">${esc(bilingual('Keep contributing to earn your first badge.', 'شارك بمساهمة مفيدة لتحصل على أول شارة.'))}</span>`}
      </div>
      <form class="community-profile__form" id="communityProfileForm">
        <label class="field"><span>${esc(copy().displayName)}</span><input class="input" name="displayName" autocomplete="nickname" minlength="2" maxlength="40" value="${esc(state.profile.display_name)}" required /></label>
        <label class="field"><span>${esc(copy().level)}</span><select class="input" name="level">
          ${['A0', 'A1', 'A2', 'B1'].map((level) => `<option value="${level}" ${state.profile.level === level ? 'selected' : ''}>${level}</option>`).join('')}
        </select></label>
        <label class="switch"><input type="checkbox" name="discoverable" ${state.profile.discoverable ? 'checked' : ''} /><span>${esc(copy().discoverable)}</span></label>
        <small>${esc(copy().buddyPrivacy)}</small>
        <button class="btn btn--primary" type="submit">${esc(copy().saveProfile)}</button>
      </form>
      ${state.blockedIds.length ? `<section class="community-settings__blocked"><h3>${esc(copy().blockedList)}</h3>
        ${state.blockedIds.map((id) => `<div class="community-blocked-row"><span>${esc(id.slice(0, 8))}…</span><button type="button" class="btn btn--sm" data-action="unblock" data-id="${esc(id)}">${esc(copy().unblock)}</button></div>`).join('')}
      </section>` : ''}
      <footer class="community-settings__foot"><span>${esc(copy().account)}</span><button class="btn btn--sm btn--bad" type="button" data-action="sign-out">${esc(copy().signOut)}</button></footer>
    </section>`;
  }

  function renderChatScreen() {
    const search = state.searchQuery.trim().toLocaleLowerCase();
    const matchesSearch = (value) => !search || String(value).toLocaleLowerCase().includes(search);
    const topicRows = state.topics.map((room) => {
      const name = lang() === 'en' ? room.title_en : room.title_ar;
      return `<li data-room-search="${esc(`${name} ${room.level || ''}`.toLocaleLowerCase())}" ${matchesSearch(`${name} ${room.level || ''}`) ? '' : 'hidden'}>
        <button type="button" class="community-room ${state.selectedRoom?.id === room.id ? 'is-active' : ''}" data-action="topic" data-id="${esc(room.id)}" aria-current="${state.selectedRoom?.id === room.id ? 'page' : 'false'}">
          <span class="community-avatar community-avatar--topic" aria-hidden="true">#</span><span class="community-room__copy"><b>${esc(name)}</b><small>${esc(room.level || copy().topic)} · ${esc(state.joinedTopicIds.has(room.id) ? copy().joined : copy().join)}</small></span>
        </button></li>`;
    }).join('');
    const directRows = state.directRooms.map((room) => `<li data-room-search="${esc(`${room.peer.display_name} ${room.peer.level}`.toLocaleLowerCase())}" ${matchesSearch(`${room.peer.display_name} ${room.peer.level}`) ? '' : 'hidden'}>
      <button type="button" class="community-room ${state.selectedRoom?.id === room.id ? 'is-active' : ''}" data-action="direct" data-id="${esc(room.id)}" aria-current="${state.selectedRoom?.id === room.id ? 'page' : 'false'}">
        <span class="community-avatar" aria-hidden="true">${esc([...room.peer.display_name][0] || 'L')}</span><span class="community-room__copy"><b>${esc(room.peer.display_name)}</b><small>${esc(room.peer.level)} · ⭐ ${room.peer.xp} ${esc(copy().xp)}</small></span>
      </button></li>`).join('');
    const buddyRows = state.buddies.map((person) => `<li data-room-search="${esc(`${person.display_name} ${person.level}`.toLocaleLowerCase())}" ${matchesSearch(`${person.display_name} ${person.level}`) ? '' : 'hidden'}>
      <button type="button" class="community-room" data-action="start-direct" data-id="${esc(person.id)}">
        <span class="community-avatar" aria-hidden="true">${esc([...person.display_name][0] || 'L')}</span><span class="community-room__copy"><b>${esc(person.display_name)}</b><small>${esc(person.level)} · ⭐ ${person.xp} ${esc(copy().xp)}</small></span>
      </button></li>`).join('');
    return `<div class="community-workspace ${state.selectedRoom ? 'has-selected-room' : ''} ${state.selectedRoom && state.detailsOpen ? 'has-details' : ''}">
      <aside class="community-inbox" aria-label="${esc(copy().messages)}">
        <header class="community-inbox__head">
          <div class="community-inbox__title"><h1>${esc(copy().chatTitle)}</h1><span>${esc(copy().subtitle)}</span></div>
          <div class="community-inbox__tools"><span class="community-avatar" aria-label="${esc(state.profile.display_name)}">${esc([...state.profile.display_name][0] || 'L')}</span>
            <button class="community-icon-button" type="button" data-action="settings" aria-label="${esc(copy().settings)}" title="${esc(copy().settings)}">⚙</button></div>
        </header>
        <label class="community-search"><span aria-hidden="true">⌕</span><input type="search" data-chat-search aria-label="${esc(copy().searchChats)}" value="${esc(state.searchQuery)}" placeholder="${esc(copy().searchChats)}" /></label>
        <div class="community-inbox__scroll">
          <section class="community-inbox__section" data-list-section>
            <h2>${esc(copy().direct)}</h2>
            ${directRows ? `<ul class="community-room-list">${directRows}</ul>` : `<p class="community-inbox__hint">${esc(copy().noDirect)}</p>`}
          </section>
          <section class="community-inbox__section" data-list-section>
            <h2>${esc(copy().rooms)}</h2>
            <ul class="community-room-list">${topicRows || `<li class="community-inbox__hint">${esc(copy().noRoom)}</li>`}</ul>
          </section>
          <section class="community-inbox__section">
            <button class="community-find-buddy" type="button" data-action="find-buddies">${esc(copy().find)} <span aria-hidden="true">＋</span></button>
            ${state.showBuddies ? (buddyRows ? `<ul class="community-room-list">${buddyRows}</ul>` : `<p class="community-inbox__hint">${esc(copy().noBuddies)}</p>`) : ''}
          </section>
        </div>
        <footer class="community-inbox__foot">${esc(copy().aiDisclosure)}</footer>
      </aside>
      <section class="community-chat ${state.selectedRoom ? 'has-room' : ''}" aria-label="${esc(copy().messages)}">
        ${state.selectedRoom ? renderRoomPanel() : `<div class="community-empty community-empty--welcome"><span aria-hidden="true">💬</span><h2>${esc(copy().startConversation)}</h2><p>${esc(copy().noRoom)}</p></div>`}
      </section>
      ${state.selectedRoom && state.detailsOpen ? renderChatDetails() : ''}
    </div>`;
  }

  function renderChatDetails() {
    const room = state.selectedRoom;
    return `<aside class="community-details" aria-label="${esc(copy().details)}">
      <header class="community-details__head"><h2>${esc(copy().details)}</h2><button class="community-icon-button" type="button" data-action="toggle-details" aria-label="${esc(copy().details)}">×</button></header>
      <span class="community-avatar community-avatar--details" aria-hidden="true">${esc(room.kind === 'topic' ? '#' : [...roomName(room)][0] || 'L')}</span>
      <h3>${esc(roomName(room))}</h3>
      <p>${esc(room.kind === 'topic' ? `${copy().roomDetails} · ${room.level || copy().topic}` : copy().directMessage)}</p>
      ${room.kind === 'direct' ? `<div class="community-details__stats"><b>${esc(room.peer.level)}</b><span>${esc(copy().level)}</span><b>⭐ ${room.peer.xp}</b><span>${esc(copy().xp)}</span></div>
        <button type="button" class="btn btn--bad community-details__block" data-action="block" data-id="${esc(room.peerId)}">${esc(copy().block)}</button>` : `<div class="community-details__stats"><b>${esc(room.level || copy().topic)}</b><span>${esc(copy().level)}</span></div>`}
      <p class="community-details__disclosure">${esc(copy().aiDisclosure)}</p>
    </aside>`;
  }

  function roomName(room) {
    if (room.kind === 'direct') return room.peer?.display_name || bilingual('Study buddy', 'شريك الدراسة');
    return lang() === 'en' ? room.title_en : room.title_ar;
  }

  function renderRoomPanel() {
    const room = state.selectedRoom;
    return `<header class="community-chat__head">
      <button type="button" class="community-icon-button community-back-button" data-action="back-to-inbox" aria-label="${esc(copy().backToChats)}">${lang() === 'en' ? '←' : '→'}</button>
      <span class="community-avatar" aria-hidden="true">${esc(room.kind === 'topic' ? '#' : [...roomName(room)][0] || 'L')}</span>
      <div class="community-chat__identity"><h2>${esc(roomName(room))}</h2><span>${room.kind === 'direct' ? esc(copy().online) : esc(room.level || copy().topic)}</span></div>
      <button type="button" class="community-icon-button community-details-toggle" data-action="toggle-details" aria-label="${esc(copy().details)}" title="${esc(copy().details)}">ⓘ</button>
      ${room.kind === 'direct' ? `<button type="button" class="btn btn--sm btn--bad" data-action="block" data-id="${esc(room.peerId)}">${esc(copy().block)}</button>` : ''}
    </header>
    <div class="community-messages" id="communityMessages" aria-live="polite" aria-relevant="additions text">
      ${state.messages.length ? state.messages.map((message) => messageHTML(message, state.user.id, state.profile, state.translations, state.reactions)).join('') : `<p class="community-empty">${esc(copy().emptyMessages)}</p>`}
    </div>
    <div class="community-assistant">
      <button type="button" class="btn btn--sm" data-action="starters">${esc(copy().starters)}</button>
      <span class="community-status" data-assistant-status role="status" aria-live="polite"></span>
      <ul class="community-starters" data-starters></ul>
    </div>
    <div class="community-correction" data-correction hidden></div>
    ${state.replyTo ? `<p class="community-replying">${esc(copy().reply)} <button type="button" class="btn btn--sm" data-action="cancel-reply">${esc(bilingual('Cancel', 'إلغاء'))}</button></p>` : ''}
    <form id="communityCompose" class="community-compose">
      <label class="sr-only" for="communityDraft">${esc(copy().placeholder)}</label>
      <textarea id="communityDraft" class="input" name="body" rows="2" maxlength="${COMMUNITY_LIMITS.messageCharacters}" placeholder="${esc(copy().placeholder)}"></textarea>
      <div class="community-compose__actions">
        <span class="community-counter" data-counter>0/${COMMUNITY_LIMITS.messageCharacters}</span>
        <button type="button" class="btn btn--sm" data-action="correct">${esc(copy().correct)}</button>
        <button type="button" class="btn btn--sm" data-action="record">${esc(copy().voiceStart)}</button>
        <button type="submit" class="btn btn--primary">${esc(copy().send)}</button>
      </div>
    </form>`;
  }

  async function attachRoomSubscription() {
    const generation = ++state.subscriptionGeneration;
    state.unsubscribe?.();
    state.unsubscribe = null;
    state.messages = [];
    state.reactions = new Map();
    if (!state.selectedRoom || state.disposed) return;
    const roomId = state.selectedRoom.id;
    try {
      const messages = await loadMessages(roomId);
      if (state.disposed || state.selectedRoom?.id !== roomId || generation !== state.subscriptionGeneration) return;
      state.messages = messages;
      const clientMessages = document.getElementById('communityMessages');
      if (!clientMessages || state.disposed) return;
      clientMessages.innerHTML = state.messages.length
        ? state.messages.map((message) => messageHTML(message, state.user.id, state.profile, state.translations, state.reactions)).join('')
        : `<p class="community-empty">${esc(copy().emptyMessages)}</p>`;
      clientMessages.scrollTop = clientMessages.scrollHeight;
      const unsubscribe = await subscribeToRoom(roomId, async (newMessage) => {
        if (state.disposed || state.selectedRoom?.id !== roomId || generation !== state.subscriptionGeneration
          || state.messages.some((item) => item.id === newMessage.id)) return;
        try {
          const latestMessages = await loadMessages(roomId);
          if (state.disposed || state.selectedRoom?.id !== roomId || generation !== state.subscriptionGeneration) return;
          state.messages = latestMessages;
          const target = document.getElementById('communityMessages');
          if (!target) return;
          target.innerHTML = state.messages.map((message) =>
            messageHTML(message, state.user.id, state.profile, state.translations, state.reactions)).join('');
          target.scrollTop = target.scrollHeight;
        } catch (error) {
          screenMessage(host, error.message || copy().sendFailed, true);
        }
      }, (error) => screenMessage(host, error.message || copy().sendFailed, true));
      if (state.disposed || state.selectedRoom?.id !== roomId || generation !== state.subscriptionGeneration) unsubscribe();
      else state.unsubscribe = unsubscribe;
    } catch (error) {
      screenMessage(host, error.message || copy().sendFailed, true);
    }
  }

  async function selectRoom(room) {
    if (!room) return;
    if (state.recorder) {
      state.discardRecording = true;
      state.recorder.stopIfActive?.();
    }
    state.selectedRoom = room;
    state.messages = [];
    state.translations = new Map();
    state.showBuddies = false;
    renderMain();
    host.querySelector('#communityDraft')?.focus();
  }

  async function handleAction(action, element) {
    const id = element.dataset.id;
    if (action === 'auth-toggle') {
      state.authMode = state.authMode === 'signup' ? 'signin' : 'signup';
      renderAuth();
      return;
    }
    if (action === 'sign-out') {
      disposeInstance();
      await communitySignOut();
      return renderCommunity(host);
    }
    if (action === 'settings') {
      state.screen = 'settings';
      return renderMain();
    }
    if (action === 'chats-home') {
      state.screen = 'chats';
      state.selectedRoom = null;
      state.detailsOpen = false;
      state.showBuddies = false;
      return renderMain();
    }
    if (action === 'toggle-details') {
      state.detailsOpen = !state.detailsOpen;
      return renderMain();
    }
    if (action === 'back-to-inbox') {
      state.selectedRoom = null;
      state.detailsOpen = false;
      return renderMain();
    }
    if (action === 'back-to-chats') {
      state.screen = 'chats';
      renderMain();
      host.querySelector('.community-room.is-active')?.focus();
      return;
    }
    if (action === 'topic') {
      const room = state.topics.find((item) => item.id === id);
      if (!room) return;
      if (!state.joinedTopicIds.has(id)) await joinTopicRoom(id);
      const joined = {
        ...room,
        kind: 'topic',
        peerId: null,
      };
      state.joinedTopicIds.add(id);
      return selectRoom(joined);
    }
    if (action === 'direct') {
      return selectRoom(state.directRooms.find((room) => room.id === id));
    }
    if (action === 'find-buddies') {
      state.showBuddies = !state.showBuddies;
      if (state.showBuddies) {
        state.buddies = await findStudyBuddies(state.user.id, state.blockedIds);
      }
      return renderMain();
    }
    if (action === 'start-direct') {
      const roomId = await openDirectChat(id);
      await refreshData();
      const room = state.directRooms.find((item) => item.id === roomId);
      if (!room) throw new Error('تعذر فتح محادثة الشريك.');
      return selectRoom(room);
    }
    if (action === 'block') {
      if (!window.confirm(bilingual('Block this learner? Their messages will be hidden and they cannot start a direct chat with you.', 'حظر هذا المستخدم؟ ستُخفى رسائله ولن يتمكن من بدء محادثة خاصة معك.'))) return;
      await blockCommunityUser(id);
      await refreshData();
      state.selectedRoom = null;
      screenMessage(host, copy().blocked);
      return renderMain();
    }
    if (action === 'unblock') {
      await unblockCommunityUser(id);
      await refreshData();
      screenMessage(host, copy().unblocked);
      return renderMain();
    }
    if (action === 'report') {
      const choice = window.prompt(`${copy().reportReason}: spam, harassment, inappropriate, other`, 'other');
      if (!choice) return;
      const reason = ['spam', 'harassment', 'inappropriate', 'other'].includes(choice) ? choice : 'other';
      await reportCommunityContent({ messageId: id, reason });
      screenMessage(host, copy().reportSent);
      return;
    }
    if (action === 'support') {
      await reactToMessage(id);
      state.messages = await loadMessages(state.selectedRoom.id);
      const list = host.querySelector('#communityMessages');
      if (list) list.innerHTML = state.messages.map((message) =>
        messageHTML(message, state.user.id, state.profile, state.translations, state.reactions)).join('');
      screenMessage(host, copy().support);
      return;
    }
    if (action === 'reply') {
      state.replyTo = id;
      renderMain();
      host.querySelector('#communityDraft')?.focus();
      return;
    }
    if (action === 'cancel-reply') {
      state.replyTo = null;
      renderMain();
      host.querySelector('#communityDraft')?.focus();
      return;
    }
    if (action === 'translate') {
      const message = state.messages.find((item) => item.id === id);
      if (!message?.body) return;
      const status = host.querySelector('[data-assistant-status]');
      if (status) status.textContent = copy().connection;
      try {
        const result = await communityAssistant({ action: 'translate', text: message.body, locale: lang(), level: state.profile.level });
        state.translations.set(id, result.translation);
        const target = [...(host.querySelectorAll('#communityMessages [data-message-id]') || [])]
          .find((node) => node.dataset.messageId === id);
        if (target) {
          const translated = document.createElement('p');
          translated.className = 'community-translation';
          translated.setAttribute('role', 'status');
          translated.textContent = `${bilingual('Translation', 'الترجمة')}: ${result.translation}`;
          target.append(translated);
        }
        if (status) status.textContent = '';
      } catch (error) {
        if (status) status.textContent = error.message || copy().assistantError;
      }
      return;
    }
    if (action === 'correct-message') {
      const message = state.messages.find((item) => item.id === id);
      if (!message?.body) return;
      const output = host.querySelector('[data-assistant-status]');
      if (output) output.textContent = copy().connection;
      try {
        const result = await communityAssistant({
          action: 'correct', text: message.body, locale: lang(), level: state.profile.level,
        });
        state.correction = result.corrected;
        showCorrection(result.corrected, result.explanation);
        if (output) output.textContent = '';
      } catch (error) {
        if (output) output.textContent = error.message || copy().assistantError;
      }
      return;
    }
    if (action === 'correct') return correctDraft();
    if (action === 'use-correction') {
      const draft = host.querySelector('#communityDraft');
      if (draft && state.correction) {
        draft.value = state.correction;
        draft.dispatchEvent(new Event('input', { bubbles: true }));
        draft.focus();
      }
      return;
    }
    if (action === 'starters') return generateStarters();
    if (action === 'record') return toggleRecording();
    throw new Error('إجراء غير معروف في المجتمع.');
  }

  async function correctDraft() {
    const draft = host.querySelector('#communityDraft');
    const text = draft?.value.trim();
    if (!text) { screenMessage(host, bilingual('Write a sentence first.', 'اكتب جملة أولاً.'), true); return; }
    const output = host.querySelector('[data-assistant-status]');
    if (output) output.textContent = copy().connection;
    try {
      const result = await communityAssistant({ action: 'correct', text, locale: lang(), level: state.profile.level });
      state.correction = result.corrected;
      showCorrection(result.corrected, result.explanation);
      if (output) output.textContent = '';
    } catch (error) {
      if (output) output.textContent = error.message || copy().assistantError;
    }
  }

  function showCorrection(corrected, explanation) {
    const panel = host.querySelector('[data-correction]');
    if (!panel) return;
    panel.hidden = false;
    panel.innerHTML = `<p><b lang="en" dir="ltr">${esc(corrected)}</b></p><p>${esc(explanation)}</p>
      <button type="button" class="btn btn--sm" data-action="use-correction">${esc(copy().useSuggestion)}</button>`;
  }

  async function generateStarters() {
    const output = host.querySelector('[data-assistant-status]');
    const list = host.querySelector('[data-starters]');
    if (!list) return;
    if (output) output.textContent = copy().connection;
    let starters = startersFallback;
    try {
      const result = await communityAssistant({
        action: 'starters',
        locale: lang(),
        level: state.profile.level,
        topic: state.selectedRoom?.topic || state.selectedRoom?.title_en || 'everyday English',
      });
      starters = result.starters;
    } catch (error) {
      if (output) output.textContent = error.message || copy().assistantError;
    }
    list.innerHTML = starters.map((item, index) => `<li><button type="button" class="btn btn--sm" data-action="insert-starter" data-index="${index}">${esc(item)}</button></li>`).join('');
    state.generatedStarters = starters;
  }

  async function toggleRecording() {
    if (state.recorder) {
      state.recorder.stop();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined' || !window.isSecureContext) {
      screenMessage(host, copy().voiceUnavailable, true);
      return;
    }
    const button = host.querySelector('[data-action="record"]');
    let stream;
    const recordingRoomId = state.selectedRoom?.id;
    const recordingUserId = state.user.id;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      if (state.disposed || state.selectedRoom?.id !== recordingRoomId) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      const preferred = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus']
        .find((type) => MediaRecorder.isTypeSupported?.(type));
      const recorder = preferred ? new MediaRecorder(stream, { mimeType: preferred }) : new MediaRecorder(stream);
      const chunks = [];
      let recordedBytes = 0;
      let stopAfterRecord = false;
      state.stream = stream;
      state.recorder = recorder;
      const startedAt = Date.now();
      recorder.ondataavailable = (event) => {
        if (!event.data?.size) return;
        recordedBytes += event.data.size;
        if (recordedBytes <= COMMUNITY_LIMITS.voiceBytes) chunks.push(event.data);
        else stopAfterRecord = true;
        if (stopAfterRecord && recorder.state === 'recording') recorder.stop();
      };
      recorder.onstop = async () => {
        clearInterval(state.liveTimer);
        button.textContent = copy().voiceStart;
        button.disabled = true;
        stream.getTracks().forEach((track) => track.stop());
        state.stream = null;
        state.recorder = null;
        if (state.disposed || state.discardRecording) {
          state.discardRecording = false;
          return;
        }
        const duration = (Date.now() - startedAt) / 1000;
        if (!chunks.length) {
          button.disabled = false;
          screenMessage(host, copy().voiceUnavailable, true);
          return;
        }
        if (duration > COMMUNITY_LIMITS.voiceSeconds + 1 || recordedBytes > COMMUNITY_LIMITS.voiceBytes) {
          button.disabled = false;
          screenMessage(host, bilingual('Voice note limit is 45 seconds or 5 MB.', 'الحد الأقصى للتسجيل 45 ثانية أو 5 MB.'), true);
          return;
        }
        try {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          const extension = blob.type.includes('mp4') ? 'm4a' : blob.type.includes('ogg') ? 'ogg' : 'webm';
          const path = await uploadVoiceNote({ roomId: recordingRoomId, userId: recordingUserId, blob, extension });
          try {
            await sendCommunityMessage({ roomId: recordingRoomId, voicePath: path });
          } catch (error) {
            await removeVoiceNote(path);
            throw error;
          }
          if (state.selectedRoom?.id === recordingRoomId) {
            state.messages = await loadMessages(recordingRoomId);
            renderMain();
          }
        } catch (error) {
          screenMessage(host, error.message || copy().sendFailed, true);
        } finally {
          button.disabled = false;
        }
      };
      recorder.onerror = () => {
        stream.getTracks().forEach((track) => track.stop());
        state.stream = null;
        state.recorder = null;
        clearInterval(state.liveTimer);
        button.disabled = false;
        screenMessage(host, copy().voiceUnavailable, true);
      };
      recorder.stopIfActive = () => { if (recorder.state === 'recording') recorder.stop(); };
      recorder.start(1000);
      button.textContent = `${copy().recording} 0:00`;
      button.disabled = false;
      state.liveTimer = setInterval(() => {
        state.liveSeconds = Math.floor((Date.now() - startedAt) / 1000);
        if (button.isConnected) button.textContent = `${copy().recording} 0:${String(state.liveSeconds).padStart(2, '0')}`;
        if (state.liveSeconds >= COMMUNITY_LIMITS.voiceSeconds) recorder.stop();
      }, 1000);
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      screenMessage(host, error.message || copy().voiceUnavailable, true);
    }
  }

  host.onclick = async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    event.preventDefault();
    button.disabled = true;
    try {
      if (button.dataset.action === 'insert-starter') {
        const draft = host.querySelector('#communityDraft');
        if (draft) {
          draft.value = state.generatedStarters?.[Number(button.dataset.index)] || '';
          draft.dispatchEvent(new Event('input', { bubbles: true }));
          draft.focus();
        }
      } else {
        await handleAction(button.dataset.action, button);
      }
    } catch (error) {
      screenMessage(host, error.message || copy().sendFailed, true);
    } finally {
      if (button.isConnected) button.disabled = false;
    }
  };

  host.oninput = (event) => {
    if (event.target?.id === 'communityDraft') {
      const counter = host.querySelector('[data-counter]');
      if (counter) counter.textContent = `${event.target.value.length}/${COMMUNITY_LIMITS.messageCharacters}`;
    }
    if (event.target?.matches('[data-chat-search]')) {
      state.searchQuery = event.target.value;
      const query = state.searchQuery.trim().toLocaleLowerCase();
      host.querySelectorAll('.community-inbox__section').forEach((section) => {
        let visibleRows = 0;
        section.querySelectorAll('[data-room-search]').forEach((row) => {
          row.hidden = query !== '' && !row.dataset.roomSearch.includes(query);
          if (!row.hidden) visibleRows++;
        });
        const hasRows = section.querySelector('[data-room-search]');
        section.hidden = query !== '' && hasRows && visibleRows === 0;
      });
    }
  };

  host.onsubmit = async (event) => {
    if (event.target.id === 'communityAuthForm') {
      event.preventDefault();
      if (state.busy) return;
      const form = new FormData(event.target);
      const email = String(form.get('email') || '');
      const password = String(form.get('password') || '');
      state.busy = true;
      const submit = event.target.querySelector('[type="submit"]');
      submit.disabled = true;
      try {
        if (state.authMode === 'signup') {
          const result = await communitySignUp({
            email, password, displayName: String(form.get('displayName') || ''),
          });
          if (!result.session) {
            const status = host.querySelector('[data-community-status]');
            if (status) status.textContent = copy().verifyEmail;
          } else {
            await boot();
          }
        } else {
          await communitySignIn({ email, password });
          await boot();
        }
      } catch (error) {
        screenMessage(host, error.message || copy().sendFailed, true);
      } finally {
        state.busy = false;
        if (submit?.isConnected) submit.disabled = false;
      }
      return;
    }
    if (event.target.id === 'communityProfileForm') {
      event.preventDefault();
      try {
        const form = new FormData(event.target);
        state.profile = await updateMyProfile({
          display_name: String(form.get('displayName') || state.profile.display_name).trim(),
          discoverable: form.get('discoverable') === 'on',
          level: String(form.get('level') || 'A1'),
        });
        screenMessage(host, bilingual('Profile saved.', 'تم حفظ الملف الشخصي.'));
        renderMain();
      } catch (error) {
        screenMessage(host, error.message || copy().sendFailed, true);
      }
      return;
    }
    if (event.target.id === 'communityCompose') {
      event.preventDefault();
      const textarea = event.target.elements.body;
      const body = textarea.value.trim();
      if (!body) return;
      if (containsBlockedLanguage(body)) {
        screenMessage(host, copy().filtered, true);
        textarea.focus();
        return;
      }
      if (body.length > COMMUNITY_LIMITS.messageCharacters) {
        screenMessage(host, copy().messageLimit, true);
        return;
      }
      const sendButton = event.target.querySelector('[type="submit"]');
      sendButton.disabled = true;
      try {
        await sendCommunityMessage({ roomId: state.selectedRoom.id, body, replyTo: state.replyTo });
        state.replyTo = null;
        textarea.value = '';
        const counter = host.querySelector('[data-counter]');
        if (counter) counter.textContent = `0/${COMMUNITY_LIMITS.messageCharacters}`;
        state.messages = await loadMessages(state.selectedRoom.id);
        const list = host.querySelector('#communityMessages');
        if (list) {
          list.innerHTML = state.messages.map((message) =>
            messageHTML(message, state.user.id, state.profile, state.translations, state.reactions)).join('');
          list.scrollTop = list.scrollHeight;
        }
      } catch (error) {
        screenMessage(host, error.message || copy().userBlocked, true);
      } finally {
        if (sendButton.isConnected) sendButton.disabled = false;
      }
    }
  };
}
