import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * Official Capacitor 8 App plugin handles Android's physical Back key and
 * committed system Back gestures. Browser/PWA navigation remains unchanged.
 *
 * Native Back outside Home follows the same validated, app-local route history
 * as the visible mobile Back button. On Home we MINIMIZE rather than exiting,
 * clearing WebView data or navigating to a website that opened Frame One.
 */
export async function registerAndroidBack(): Promise<void> {
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return;
  await App.addListener('backButton', () => {
    // Some Android WebViews deliver a system Back event while the soft
    // keyboard is open. Never discard a lesson or storyboard editor just
    // because the learner pressed Back to close the keyboard.
    const active = document.activeElement as HTMLElement | null;
    if (active && (
      active.tagName === 'TEXTAREA' ||
      active.tagName === 'SELECT' ||
      active.tagName === 'INPUT' ||
      active.isContentEditable
    )) {
      active.blur();
      return;
    }
    const hash = window.location.hash.replace(/^#/, '');
    const isHome = hash === '' || hash === 'home';
    if (isHome) {
      // Avoid abrupt exit and preserve local notes even on direct launches.
      void App.minimizeApp().catch(() => {
        console.warn('Frame One could not minimize the Android activity.');
      });
      return;
    }
    // Reuse the existing internal route marker logic, including direct links.
    window.frameOneLegacy?.goBack();
  });
}
