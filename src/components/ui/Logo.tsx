import styles from './Logo.module.css';

/**
 * Símbolo da marca: a figura do framework (cinco colunas, Mercado/Problema
 * empilhados e a base). O bloco 1, Planejamento Estratégico, onde o método
 * começa, é o único aceso.
 */
export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden focusable="false">
      <rect width="32" height="32" rx="8" fill="#11131A" />
      <g fill="#454B5B">
        <rect x="6" y="6" width="2.6" height="12.6" rx="0.8" />
        <rect x="9.4" y="6" width="2.6" height="12.6" rx="0.8" />
        <rect x="12.8" y="6" width="2.6" height="12.6" rx="0.8" />
        <rect x="16.2" y="6" width="2.6" height="12.6" rx="0.8" />
        <rect x="19.6" y="6" width="2.6" height="12.6" rx="0.8" />
        <rect x="23" y="6" width="3" height="5.9" rx="0.8" />
        <rect x="23" y="12.7" width="3" height="5.9" rx="0.8" />
        <rect x="6" y="19.6" width="9.4" height="6.4" rx="0.8" />
      </g>
      <rect x="16.2" y="19.6" width="9.8" height="6.4" rx="0.8" fill="#C8F03C" />
    </svg>
  );
}

export function Logo({ size = 32, inverted = false }: { size?: number; inverted?: boolean }) {
  return (
    <span className={styles.logo} data-inverted={inverted || undefined}>
      <LogoMark size={size} />
      <span className={styles.word}>
        AGITAR <span className={styles.light}>Canvas</span>
      </span>
    </span>
  );
}
