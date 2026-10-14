import { Font } from '@react-pdf/renderer';
import sans400 from '@fontsource/geist/files/geist-latin-400-normal.woff?url';
import sans600 from '@fontsource/geist/files/geist-latin-600-normal.woff?url';
import sans700 from '@fontsource/geist/files/geist-latin-700-normal.woff?url';
import serif600 from '@fontsource/newsreader/files/newsreader-latin-600-normal.woff?url';
import type { BlockGroup } from '@/methodology/agitar';

/**
 * Identidade visual dos documentos PDF. Os valores espelham o tema claro de
 * src/design/tokens.css, que não pode ser lido pelo gerador de PDF. Os
 * documentos saem sempre no tema claro, adequado à impressão.
 */

export const FONT_SANS = 'Geist';
export const FONT_SERIF = 'Newsreader';

let registered = false;

export function registerFonts(): void {
  if (registered) return;
  registered = true;

  Font.register({
    family: FONT_SANS,
    fonts: [
      { src: sans400, fontWeight: 400 },
      { src: sans600, fontWeight: 600 },
      { src: sans700, fontWeight: 700 },
    ],
  });
  Font.register({ family: FONT_SERIF, fonts: [{ src: serif600, fontWeight: 600 }] });

  // Sem hifenização automática: as regras embutidas são do inglês.
  Font.registerHyphenationCallback((word) => [word]);
}

export const COLORS = {
  ink: '#11131a',
  text: '#11131a',
  muted: '#535867',
  subtle: '#676c7b',
  border: '#e6e3da',
  surface: '#ffffff',
  sunken: '#efede7',
  note: '#fffaf0',
  noteBorder: '#ece3cc',
  primary: '#3b4bf5',
} as const;

export const GROUP_COLORS: Record<BlockGroup, { main: string; soft: string; ink: string }> = {
  estrategia: { main: '#3b4bf5', soft: '#e9ebfe', ink: '#2330b8' },
  contexto: { main: '#e5533d', soft: '#fceae6', ink: '#9c3323' },
  ideias: { main: '#d99a06', soft: '#fbf0d4', ink: '#85540a' },
  recursos: { main: '#0f9d84', soft: '#ddf3ee', ink: '#0b6152' },
};

export const INSTITUTIONAL_FOOTER =
  'AGITAR Canvas · Modelo de gestão da inovação tecnológica para PMEs de TIC (Lima, 2024) · Universidade FUMEC';
