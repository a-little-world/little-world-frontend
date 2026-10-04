import { useEffect } from 'react';

const CAL_EMBED_SCRIPT_ID = 'cal-embed';

const CAL_EMBED_SNIPPET = `
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", {origin:"https://cal.com"});
Cal("ui", {"styles":{"branding":{"brandColor":"#000000"}},"hideEventTypeDetails":false,"layout":"month_view"});
`;

/**
 * Injects the Cal.com embed snippet into <head> once. The snippet defines the
 * `Cal` queue and pulls in embed.js, which wires clicks on `[data-cal-link]`.
 */
export function ensureCalEmbed(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(CAL_EMBED_SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = CAL_EMBED_SCRIPT_ID;
  script.type = 'text/javascript';
  script.text = CAL_EMBED_SNIPPET;
  document.head.appendChild(script);
}

const CAL_READY_TIMEOUT_MS = 15000;

// embed.js sets `window.Cal.instance` when it has run; the snippet's own
// `Cal.loaded` flips synchronously and is useless as a readiness signal.
const isCalReady = (): boolean => {
  const { Cal } = window as { Cal?: { instance?: unknown } };
  return Boolean(Cal?.instance);
};

/** Runs `callback` once embed.js has actually loaded and wired its click handler. */
export function whenCalReady(callback: () => void): () => void {
  if (isCalReady()) {
    callback();
    return () => {};
  }

  const deadline = Date.now() + CAL_READY_TIMEOUT_MS;
  const interval = window.setInterval(() => {
    if (isCalReady()) {
      window.clearInterval(interval);
      callback();
    } else if (Date.now() > deadline) {
      window.clearInterval(interval);
    }
  }, 100);

  return () => window.clearInterval(interval);
}

// embed.js intercepts clicks on `[data-cal-link]`; without it those buttons
// silently do nothing. Fall back to opening the booking page directly. Runs in
// the capture phase and only when cal is not ready, so it never double-opens.
function installFallbackClickHandler(): () => void {
  const onClick = (event: MouseEvent) => {
    if (isCalReady()) return;

    const target = event.target as Element | null;
    const trigger = target?.closest?.('[data-cal-link]');
    const calLink = trigger?.getAttribute('data-cal-link');
    if (!calLink) return;

    window.open(`https://cal.com/${calLink}`, '_blank', 'noopener');
  };

  document.addEventListener('click', onClick, true);
  return () => document.removeEventListener('click', onClick, true);
}

export default function useCalEmbed(): void {
  useEffect(() => {
    ensureCalEmbed();
    return installFallbackClickHandler();
  }, []);
}
