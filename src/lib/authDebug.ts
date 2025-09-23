/* Debug utility for tracing auth flows (prod-safe, toggleable) */

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

function safeJson(value: any) {
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return value;
  }
}

export function createAuthDebug(context: string, existingTraceId?: string): AuthDebug {
  const enabled = shouldEnable();
  const traceId = existingTraceId || Math.random().toString(36).slice(2, 10);

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


