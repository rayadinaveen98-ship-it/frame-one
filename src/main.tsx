import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerOfflineWorker } from './pwa';
import { registerAndroidBack } from './android-back';

const el = document.getElementById('root');
if (!el) throw new Error('Application mount element is missing');
createRoot(el).render(<App />);
// Deliberately no StrictMode during the temporary legacy event-listener bridge.

registerOfflineWorker();
// Android-native only. The web/PWA does not intercept browser Back.
void registerAndroidBack().catch(() => {
  console.warn('Frame One native Back handler was unavailable.');
});
