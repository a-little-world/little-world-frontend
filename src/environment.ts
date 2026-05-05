export interface Environment {
  defaultLoginName: string;
  defaultLoginPassword: string;
  backendUrl: string;
  coreWsPath: string;
  websocketHost: string;
  isNative: boolean;
  csrfBypassToken: string;
  allowNgrokRequests: boolean;
}

export const environment: Environment = {
  defaultLoginName: 'benjamin.tim@gmx.de',
  defaultLoginPassword: 'Test123',
  backendUrl: '',
  coreWsPath: '/api/core/ws',
  websocketHost: '',
  isNative: false,
  csrfBypassToken: 'abc',
  allowNgrokRequests: false,
};
