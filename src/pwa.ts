/** HTTPS/localhost PWA registration.
 * On updates, offer a reload instead of silently resetting an editing session.
 * The generated service worker uses a content-hashed cache name per build.
 */
export function registerOfflineWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
  window.addEventListener('load', () => {
    // Initial worker install is not an "update available" notice.
    let hadController = Boolean(navigator.serviceWorker.controller);
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController) window.dispatchEvent(new Event('frameone:pwa-update-ready'));
      hadController = true;
    });
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).then(registration => {
      // Explicit freshness check when opening an already-installed app.
      void registration.update().catch(() => {
        // Offline or transient network errors must not block the app.
      });
    }).catch(() => {
      // Offline support is optional; the app must remain usable online.
    });
  }, { once: true });
}
