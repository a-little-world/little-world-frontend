import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.littleworld',
  appName: 'littleworld',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
