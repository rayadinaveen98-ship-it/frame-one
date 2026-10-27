import type { CapacitorConfig } from '@capacitor/cli';
// Temporary ID. Confirm permanent bundle ID before first public release.
const config: CapacitorConfig = {
  appId: 'com.frameone.learncinema',
  appName: 'Frame One',
  webDir: 'dist',
  android: { allowMixedContent: false },
  ios: { contentInset: 'automatic' },
};
export default config;
