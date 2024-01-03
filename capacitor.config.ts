import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.littleworld',
  appName: 'littleworld',
  webDir: 'build',
  server: {
    // androidScheme: 'https',
    hostname: '10.0.2.2',
    cleartext: true
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    CapacitorCookies: {
      enabled: true
    }
  },
  android: {
    allowMixedContent: true
  },
  bundledWebRuntime: false,
};

export default config;
