import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createRepository } from './data';
import { applyInitialTheme } from './lib/theme';
import './design/base.css';

applyInitialTheme();

const repository = createRepository();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App repository={repository} />
  </StrictMode>,
);
