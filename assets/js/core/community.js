import { COMMUNITY_CONFIG, COMMUNITY_CONFIGURED } from './community-config.js';

const SDK_URL = 'https://esm.sh/@supabase/supabase-js@2.57.4';
const MESSAGE_LIMIT = 2000;
const VOICE_LIMIT = 5 * 1024 * 1024;
let clientPromise;

export function communityConfigured() {
  return COMMUNITY_CONFIGURED;
}

export async function communityClient() {
  if (!COMMUNITY_CONFIGURED) throw new Error('المجتمع غير مهيّأ بعد. أضف إعدادات Supabase العامة بعد إنشاء المشروع.');
  if (!clientPromise) {
    clientPromise = import(SDK_URL).then(({ createClient }) => createClient(
      COMMUNITY_CONFIG.supabaseUrl,
      COMMUNITY_CONFIG.publishableKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storageKey: 'lea.community.auth.v1',
        },
        realtime: { params: { eventsPerSecond: 8 } },
        global: { headers: { 'X-Client-Info': 'learn-english-community' } },
      },
    )).catch((error) => {
      clientPromise = null;
      throw new Error(`تعذر تحميل مكتبة الاتصال بالمجتمع: ${error.message}`);
    });
  }
  return clientPromise;
}

function checked(result) {
  if (result.error) throw new Error(result.error.message || 'تعذّر إكمال طلب المجتمع.');
  return result.data;
}

export async function communitySession() {
  const client = await communityClient();
  return checked(await client.auth.getSession());
}

export async function communitySignUp({ email, password, displayName }) {
  const client = await communityClient();
  const redirectTo = new URL('./', window.location.href).href;
  return checked(await client.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: redirectTo,
      data: { display_name: displayName.trim() },
    },
  }));
}

export async function communitySignIn({ email, password }) {
  const client = await communityClient();
  return checked(await client.auth.signInWithPassword({ email: email.trim(), password }));
}

export async function communitySignOut() {
  const client = await communityClient();
  checked(await client.auth.signOut());
}

export async function getMyProfile(userId) {
  const client = await communityClient();
  return checked(await client.from('community_profiles')
    .select('id,display_name,level,locale,discoverable,xp')
    .eq('id', userId).single());
}

export async function updateMyProfile(patch) {
  const client = await communityClient();
  const { data: authData } = checked(await client.auth.getUser());
  if (!authData.user) throw new Error('انتهت جلسة المجتمع؛ سجّل الدخول من جديد.');
  return checked(await client.from('community_profiles')
    .update(patch)
    .eq('id', authData.user.id)
    .select('id,display_name,level,locale,discoverable,xp')
    .single());
}

export async function loadCommunity(userId) {
  const client = await communityClient();
  const [profile, topics, membershipRows, blockRows] = await Promise.all([
    getMyProfile(userId),
    client.from('community_rooms').select('id,slug,title_en,title_ar,level,topic')
      .eq('kind', 'topic').order('level').order('title_en'),
    client.from('community_room_members').select('room_id,joined_at')
      .eq('user_id', userId).order('joined_at', { ascending: false }),
    client.from('community_blocks').select('blocked_id').eq('blocker_id', userId),
  ]);
  const topicRows = checked(topics) || [];
  const memberships = checked(membershipRows) || [];
  const blockedIds = (checked(blockRows) || []).map((row) => row.blocked_id);
  const roomIds = memberships.map((row) => row.room_id);
  let rooms = [];
  if (roomIds.length) {
    const [roomResult, participantResult] = await Promise.all([
      client.from('community_rooms').select('id,kind,created_at')
        .in('id', roomIds).eq('kind', 'direct'),
      client.from('community_room_members').select('room_id,user_id')
        .in('room_id', roomIds),
    ]);
    const directRooms = checked(roomResult) || [];
    const participants = checked(participantResult) || [];
    const profileIds = [...new Set(participants.map((row) => row.user_id).filter((id) => id !== userId))];
    let people = [];
    if (profileIds.length) {
      const peopleResult = await client.from('community_profiles')
        .select('id,display_name,level,xp').in('id', profileIds);
      people = checked(peopleResult) || [];
    }
    const personById = new Map(people.map((person) => [person.id, person]));
    rooms = directRooms.map((room) => {
      const peerId = participants.find((row) => row.room_id === room.id && row.user_id !== userId)?.user_id;
      return { ...room, peerId, peer: personById.get(peerId) || null };
    }).filter((room) => room.peer && !blockedIds.includes(room.peerId));
  }
  return { profile, topics: topicRows, rooms, joinedTopicIds: new Set(memberships.map((row) => row.room_id)), blockedIds };
}

export async function findStudyBuddies(userId, blockedIds = []) {
  const client = await communityClient();
  let query = client.from('community_profiles').select('id,display_name,level,xp')
    .eq('discoverable', true).neq('id', userId).order('xp', { ascending: false }).limit(50);
  if (blockedIds.length) query = query.not('id', 'in', `(${blockedIds.join(',')})`);
  return checked(await query);
}

export async function joinTopicRoom(roomId) {
  const client = await communityClient();
  checked(await client.rpc('community_join_topic', { p_room_id: roomId }));
}

export async function openDirectChat(targetUserId) {
  const client = await communityClient();
  return checked(await client.rpc('community_open_direct', { p_target_user_id: targetUserId }));
}

export async function loadMessages(roomId) {
  const client = await communityClient();
  const rows = checked(await client.from('community_messages')
    .select('id,room_id,sender_id,body,voice_path,reply_to,created_at')
    .eq('room_id', roomId).order('created_at', { ascending: false }).limit(50)) || [];
  const messages = rows.reverse();
  const senderIds = [...new Set(messages.map((message) => message.sender_id))];
  const replyIds = [...new Set(messages.map((message) => message.reply_to).filter(Boolean))];
  const [peopleResult, repliesResult, reactionsResult] = await Promise.all([
    senderIds.length ? client.from('community_profiles').select('id,display_name,level').in('id', senderIds) : Promise.resolve({ data: [], error: null }),
    replyIds.length ? client.from('community_messages').select('id,body').in('id', replyIds) : Promise.resolve({ data: [], error: null }),
    messages.length ? client.from('community_reactions').select('message_id,reaction').in('message_id', messages.map((message) => message.id)) : Promise.resolve({ data: [], error: null }),
  ]);
  const people = new Map((checked(peopleResult) || []).map((person) => [person.id, person]));
  const replies = new Map((checked(repliesResult) || []).map((reply) => [reply.id, reply]));
  const reactions = new Map();
  for (const reaction of checked(reactionsResult) || []) {
    if (reaction.reaction === 'support') reactions.set(reaction.message_id, (reactions.get(reaction.message_id) || 0) + 1);
  }
  messages.forEach((message) => {
    message.sender = people.get(message.sender_id);
    message.reply = message.reply_to ? replies.get(message.reply_to) : null;
  });
  const voicePaths = messages.map((message) => message.voice_path).filter(Boolean);
  if (voicePaths.length) {
    const signed = checked(await client.storage.from('community-voice').createSignedUrls(voicePaths, 900)) || [];
    const urls = new Map(signed.map((item) => [item.path, item.signedUrl]));
    messages.forEach((message) => { if (message.voice_path) message.voiceUrl = urls.get(message.voice_path) || ''; });
  }
  messages.forEach((message) => { message.supportCount = reactions.get(message.id) || 0; });
  return messages;
}

export async function sendCommunityMessage({ roomId, body = '', voicePath = null, replyTo = null }) {
  if (body.length > MESSAGE_LIMIT) throw new Error(`الرسالة أطول من ${MESSAGE_LIMIT} حرف.`);
  const client = await communityClient();
  return checked(await client.rpc('community_send_message', {
    p_room_id: roomId,
    p_body: body,
    p_voice_path: voicePath,
    p_reply_to: replyTo,
  }));
}

export async function uploadVoiceNote({ roomId, userId, blob, extension }) {
  if (!(blob instanceof Blob) || !blob.size || blob.size > VOICE_LIMIT) {
    throw new Error('الملاحظة الصوتية فارغة أو أكبر من الحد (5 MB).');
  }
  if (!['webm', 'm4a', 'mp4', 'ogg'].includes(extension)) throw new Error('صيغة التسجيل الصوتي غير مدعومة.');
  const client = await communityClient();
  const path = `${roomId}/${userId}/${crypto.randomUUID()}.${extension}`;
  const contentType = extension === 'webm' ? 'audio/webm' : extension === 'ogg' ? 'audio/ogg' : 'audio/mp4';
  checked(await client.storage.from('community-voice').upload(path, blob, {
    contentType,
    cacheControl: '3600',
    upsert: false,
  }));
  return path;
}

export async function removeVoiceNote(path) {
  const client = await communityClient();
  checked(await client.storage.from('community-voice').remove([path]));
}

export async function reactToMessage(messageId, reaction = 'support') {
  const client = await communityClient();
  checked(await client.rpc('community_react', { p_message_id: messageId, p_reaction: reaction }));
}

export async function blockCommunityUser(userId) {
  const client = await communityClient();
  checked(await client.from('community_blocks').insert({ blocked_id: userId }));
}

export async function unblockCommunityUser(userId) {
  const client = await communityClient();
  checked(await client.from('community_blocks').delete().eq('blocked_id', userId));
}

export async function reportCommunityContent({ messageId = null, userId = null, reason, details = '' }) {
  const client = await communityClient();
  return checked(await client.rpc('community_report', {
    p_target_user_id: userId,
    p_message_id: messageId,
    p_reason: reason,
    p_details: details,
  }));
}

export async function communityAssistant({ action, text = '', locale = 'ar', level = 'A1', topic = '' }) {
  const client = await communityClient();
  const { data: authData } = checked(await client.auth.getUser());
  if (!authData.user) throw new Error('سجّل الدخول لاستخدام أدوات Gemini.');
  const result = await client.functions.invoke(COMMUNITY_CONFIG.assistantFunction, {
    body: { action, text: text.slice(0, 1500), locale, level, topic: topic.slice(0, 100) },
  });
  return checked(result);
}

export async function subscribeToRoom(roomId, onMessage, onError = () => {}) {
  const client = await communityClient();
  const channel = client.channel(`community-room-${roomId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'community_messages',
      filter: `room_id=eq.${roomId}`,
    }, (payload) => onMessage(payload.new))
    .subscribe((status, error) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        onError(error || new Error(`Realtime connection: ${status}`));
      }
    });
  return () => { client.removeChannel(channel); };
}

export const COMMUNITY_LIMITS = Object.freeze({
  messageCharacters: MESSAGE_LIMIT,
  voiceBytes: VOICE_LIMIT,
  voiceSeconds: 45,
  signedUrlSeconds: 900,
});
