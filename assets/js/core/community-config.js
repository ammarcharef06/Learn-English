// Supabase publishable/anon credentials are public client configuration, not secrets.
// Set these values after creating the Supabase project; never put a service-role key here.
export const COMMUNITY_CONFIG = Object.freeze({
  supabaseUrl: 'https://hcohtxlhqjvkbugimhoo.supabase.co',
  publishableKey: 'sb_publishable_QOeZiwWQY4omj3lj-EUa5A_1_cR5Jp5',
  assistantFunction: 'community-assistant',
});

export const COMMUNITY_CONFIGURED = Boolean(
  COMMUNITY_CONFIG.supabaseUrl.trim() && COMMUNITY_CONFIG.publishableKey.trim(),
);
