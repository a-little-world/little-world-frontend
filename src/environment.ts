export interface Environment {
  development: boolean;
  production: boolean;
  defaultLoginName: string;
  defaultLoginPassword: string;
  backendUrl: string;
  backendPath: string;
  coreWsScheme: string;
  coreWsPath: string;
  websocketHost: string;
  isNative: boolean;
}

export const environment: Environment = {
  development: true,
  production: false,
  defaultLoginName: 'benjamin.tim@gmx.de',
  defaultLoginPassword: 'Test123',
  backendUrl: '',
  backendPath: '',
  coreWsScheme: 'ws://',
  coreWsPath: '/api/core/ws',
  websocketHost: 'localhost:9000',
  isNative: false,
};
