import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerOfflineWorker } from './pwa';

const el = document.getElementById('root');
if (!el) throw new Error('Application mount element is missing');
createRoot(el).render(<App />);
// Deliberately no StrictMode during the temporary legacy event-listener bridge.

registerOfflineWorker();
