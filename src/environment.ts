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
  csrfBypassToken: string;
  allowNgrokRequests: boolean;
}

export const environment: Environment = {
  development: false,
  production: true,
  defaultLoginName: 'benjamin.tim@gmx.de',
  defaultLoginPassword: 'Test123',
  backendUrl: '',
  backendPath: '',
  coreWsScheme: 'wss://',
  coreWsPath: '/api/core/ws',
  websocketHost: '',
  isNative: false,
  csrfBypassToken: 'abc',
  allowNgrokRequests: false,
};
