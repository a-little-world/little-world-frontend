import { fontFiles } from '@a-little-world/little-world-design-system-core';

// The DOM-component WebView never loads public/index.html, so the Google Fonts <link> the
// web app uses is absent there. Metro emits the design-system .ttf files as WebView-relative
// asset URLs (Expo rewrites them to sit beside www.bundle on export), so declaring @font-face
// against those keeps the fonts bundled instead of fetched from the network on every launch.
export function buildFontFaceCSS(fonts: Record<string, unknown>): string {
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
