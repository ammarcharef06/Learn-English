import { exportCloudProgress, isEshSandbox, KEYS } from './store.js';

export const SYNC_QUEUE_KEY = KEYS.K_SYNC_QUEUE;
let configuredTransport = null;
let onlineHandlerRegistered = false;

function readQueue() {
  const raw = localStorage.getItem(SYNC_QUEUE_KEY);
  if (!raw) return null;
  const queue = JSON.parse(raw);
  if (!queue || queue.schemaVersion !== 1 || !queue.payload) {
    throw new Error('Stored cloud sync queue has an unsupported format.');
  }
  return queue;
}

function validatePayload(payload) {
  if (payload?.app !== 'learn-english' || payload.schemaVersion !== 1
    || payload.srs?.algorithm !== 'sm2' || !Array.isArray(payload.srs.cards)
    || !payload.learner || typeof payload.learner !== 'object') {
    throw new TypeError('Cloud progress payload does not match schema version 1.');
  }
}

export function getSyncQueueStatus() {
  if (isEshSandbox) return { pending: false, queuedAt: '', lastError: '', cardCount: 0 };
  const queue = readQueue();
  return {
    pending: Boolean(queue),
    queuedAt: queue?.queuedAt || '',
    lastError: queue?.lastError || '',
    cardCount: queue?.payload?.srs?.cards?.length || 0,
  };
}

export function queueSyncProgress(payload = exportCloudProgress()) {
  if (isEshSandbox) throw new Error('Cloud sync is disabled in the ESH curriculum sandbox.');
  validatePayload(payload);
  const queue = {
    schemaVersion: 1,
    queuedAt: new Date().toISOString(),
    lastError: '',
    payload: JSON.parse(JSON.stringify(payload)),
  };
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  return getSyncQueueStatus();
}

export async function flushSyncQueue(transport) {
  if (isEshSandbox) return { status: 'disabled' };
  const queue = readQueue();
  if (!queue) return { status: 'empty' };
  if (typeof transport !== 'function') return { status: 'queued', ...getSyncQueueStatus() };
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { status: 'offline', ...getSyncQueueStatus() };
  }

  try {
    await transport(queue.payload);
    localStorage.removeItem(SYNC_QUEUE_KEY);
    return { status: 'synced' };
  } catch (error) {
    queue.lastError = String(error?.message || error);
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
    return { status: 'queued', error, ...getSyncQueueStatus() };
  }
}

export function configureSyncTransport(transport) {
  if (isEshSandbox) return Promise.resolve({ status: 'disabled' });
  if (typeof transport !== 'function') throw new TypeError('Sync transport must be a function.');
  configuredTransport = transport;
  if (!onlineHandlerRegistered && typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      if (!configuredTransport) return;
      flushSyncQueue(configuredTransport).catch((error) => {
        console.error('Could not retry queued progress sync after reconnecting', error);
      });
    });
    onlineHandlerRegistered = true;
  }
  return flushSyncQueue(configuredTransport);
}
