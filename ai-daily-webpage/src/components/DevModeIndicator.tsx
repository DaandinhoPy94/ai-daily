import { getCurrentAuthTraceId, isAuthDebugEnabled } from "@/lib/authDebug";

const USE_MOCK_AUTH = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

export function DevModeIndicator() {
  const debugOn = isAuthDebugEnabled();
  const traceId = getCurrentAuthTraceId();

  if (!USE_MOCK_AUTH && !debugOn) return null;

  try {
    const containerId = 'auth-debug-banner';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.position = 'fixed';
      container.style.left = '1rem';
      container.style.bottom = '1rem';
      container.style.zIndex = '9999';
      container.className = 'flex flex-col gap-2';
      document.body.appendChild(container);
    }
    container.innerHTML = '';

    if (USE_MOCK_AUTH) {
      const badge = document.createElement('div');
      badge.className = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      badge.textContent = '🔧 Mock Auth Actief';
      container.appendChild(badge);
    }

    if (debugOn) {
      const badge = document.createElement('div');
      badge.className = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-700 border-blue-500/20';
      badge.textContent = `🐛 Auth debug is ON ${traceId ? `(trace: ${traceId})` : ''}`;
      container.appendChild(badge);
    }
  } catch {}

  return null as any;
}