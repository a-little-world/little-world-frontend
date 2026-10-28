import { fontFiles } from '@a-little-world/little-world-design-system-core';

// bundle fonts for native app instead of loading from web
function buildFontFaceCSS(fonts: Record<string, unknown>): string {
  return Object.entries(fonts ?? {})
    .filter(([, src]) => typeof src === 'string')
    .map(
      ([family, src]) =>
        `@font-face{font-family:'${family}';src:url(${src as string}) format('truetype');font-display:swap;}`,
    )
    .join('\n');
}

export function injectBundledFonts(): () => void {
  const css = buildFontFaceCSS(fontFiles);
  if (!css || typeof document === 'undefined') return () => {};

  const style = document.createElement('style');
  style.setAttribute('data-bundled-fonts', 'true');
  style.textContent = css;
  document.head.appendChild(style);

  return () => style.remove();
}

export default injectBundledFonts;
