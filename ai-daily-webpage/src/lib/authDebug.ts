/* Debug utility for tracing auth flows (prod-safe, toggleable) */
import { supabase } from '@/integrations/supabase/client';

export type AuthDebug = {
  enabled: boolean;
  traceId: string;
  group(label: string, fn: () => void | Promise<void>): Promise<void>;
  log(label: string, data?: any): void;
  error(label: string, err: any): void;
  time<T>(label: string, fn: () => Promise<T>): Promise<T>;
};

function maskEmail(email?: string | null): string | null {
  if (!email) return null;
  const [name, domain] = email.split('@');
  const maskedName = name?.length > 2 ? name[0] + '***' + name[name.length - 1] : '***';
  return `${maskedName}@${domain}`;
}

function shouldEnable(): boolean {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.get('debug') === 'auth') return true;
  } catch {}
  try {
    if (localStorage.getItem('__auth_debug') === 'true') return true;
  } catch {}
  try {
    if (import.meta.env.VITE_DEBUG_AUTH === 'true') return true;
  } catch {}
  return false;
}

function getStoredTraceId(): string | null {
  try {
    return sessionStorage.getItem('__auth_trace_id') || localStorage.getItem('__auth_trace_id');
  } catch {}
  return null;
}

function setStoredTraceId(traceId: string) {
  try {
    sessionStorage.setItem('__auth_trace_id', traceId);
  } catch {}
  try {
    localStorage.setItem('__auth_trace_id', traceId);
  } catch {}
}

function safeJson(value: any) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

export function createAuthDebug(context: string, existingTraceId?: string): AuthDebug {
  const enabled = shouldEnable();
  let traceId = existingTraceId || getStoredTraceId() || Math.random().toString(36).slice(2, 10);

  // Persist the trace id for this flow so other modules reuse it
  if (enabled) setStoredTraceId(traceId);

  const prefix = `[auth:${context}][trace:${traceId}]`;

  return {
    enabled,
    traceId,
    async group(label: string, fn: () => void | Promise<void>) {
      if (!enabled) {
        await fn();
        return;
      }
      console.groupCollapsed(`${prefix} ${label}`);
      const t0 = performance.now();
      try {
        await fn();
      } catch (e) {
        console.error(`${prefix} ${label} error`, e);
        throw e;
      } finally {
        const dt = (performance.now() - t0).toFixed(1);
        console.log(`${prefix} ${label} done in ${dt}ms`);
        console.groupEnd();
      }
    },
    log(label: string, data?: any) {
      if (!enabled) return;
      console.log(`${prefix} ${label}`, safeJson(data));
    },
    error(label: string, err: any) {
      if (!enabled) return;
      const e = err?.error || err; // supabase often nests
      const detail = {
        message: e?.message || String(e),
        code: e?.code,
        details: e?.details,
        hint: e?.hint,
        status: e?.status,
      };
      console.error(`${prefix} ${label}`, safeJson(detail));
    },
    async time<T>(label: string, fn: () => Promise<T>): Promise<T> {
      const t0 = performance.now();
      try {
        const result = await fn();
        if (enabled) {
          const dt = (performance.now() - t0).toFixed(1);
          console.log(`${prefix} ${label} ${dt}ms`);
        }
        return result;
      } catch (e) {
        if (enabled) console.error(`${prefix} ${label} failed`, e);
        throw e;
      }
    },
  };
}

export function redactAuthContext(ctx: {
  urlParams?: Record<string, any>;
  user?: { id?: string; email?: string | null } | null;
  upsertPayload?: Record<string, any>;
}) {
  return safeJson({
    urlParams: ctx.urlParams ? { has_code: !!ctx.urlParams.code, has_state: !!ctx.urlParams.state } : undefined,
    user: ctx.user ? { id: ctx.user.id, email: maskEmail(ctx.user.email || null) } : undefined,
    upsertPayload: ctx.upsertPayload ? Object.keys(ctx.upsertPayload) : undefined,
  });
}

// Public helpers for UI and other modules
export function isAuthDebugEnabled(): boolean {
  return shouldEnable();
}

export function getCurrentAuthTraceId(): string | null {
  return getStoredTraceId();
}

// Insert a server-side breadcrumb (RLS-protected). Safe no-op if not enabled or not authed yet.
export async function insertAuthDebugEvent(params: {
  context: string;
  event: string;
  payload?: Record<string, any>;
  userId?: string | null;
}) {
  if (!isAuthDebugEnabled()) return;
  try {
    const safePayload = safeJson(params.payload ?? {});
    await supabase.from('debug_profile_events').insert({
      user_id: params.userId ?? null,
      trace_id: getStoredTraceId() || Math.random().toString(36).slice(2, 10),
      context: params.context,
      event: params.event,
      payload: safePayload,
    });
  } catch (e) {
    // Swallow errors silently to avoid impacting UX
  }
}
