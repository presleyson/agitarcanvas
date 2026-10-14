import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { applyInitialTheme, useTheme } from './theme';

function mockSystem(dark: boolean) {
  const listeners = new Set<() => void>();
  const media = {
    matches: dark,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  };
  vi.stubGlobal('matchMedia', vi.fn(() => media));
  return {
    change(next: boolean) {
      media.matches = next;
      listeners.forEach((listener) => listener());
    },
  };
}

describe('tema', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it('segue o sistema quando não há escolha salva', () => {
    mockSystem(true);
    applyInitialTheme();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('a escolha salva prevalece sobre o sistema', () => {
    mockSystem(true);
    localStorage.setItem('agitar:theme', 'light');
    applyInitialTheme();
    expect(document.documentElement.dataset.theme).toBe('light');
  });

  it('alterna, aplica no documento e guarda a escolha', () => {
    mockSystem(false);
    applyInitialTheme();
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    act(() => result.current.toggle());
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('agitar:theme')).toBe('dark');
  });

  it('acompanha a mudança do sistema só enquanto não há escolha salva', () => {
    const system = mockSystem(false);
    applyInitialTheme();
    const { result } = renderHook(() => useTheme());
    act(() => system.change(true));
    expect(result.current.theme).toBe('dark');
    act(() => result.current.toggle());
    act(() => system.change(true));
    expect(result.current.theme).toBe('light');
  });
});
