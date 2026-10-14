import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const KEY = 'agitar:theme';

function systemTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

/** Aplica o tema no <html>. Chamado antes do primeiro render (main.tsx) para evitar piscar. */
export function applyInitialTheme(): void {
  document.documentElement.dataset.theme = savedTheme() ?? systemTheme();
}

/** Tema atual e alternância; a escolha do usuário prevalece sobre a do sistema. */
export function useTheme(): { theme: Theme; toggle: () => void } {
  const [theme, setTheme] = useState<Theme>(() => (document.documentElement.dataset.theme as Theme) || systemTheme());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return;
    const onChange = () => !savedTheme() && setTheme(systemTheme());
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(KEY, next);
      } catch {
        /* armazenamento indisponível: vale só nesta sessão */
      }
      return next;
    });
  }, []);

  return { theme, toggle };
}
