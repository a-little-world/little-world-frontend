export interface Environment {
  development: boolean;
  production: boolean;
  defaultLoginName: string;
  defaultLoginPassword: string;
  backendUrl: string;
  backendPath: string;
  coreWsScheme: string;
  coreWsPath: string;
  isCapacitorBuild: boolean;
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
  isCapacitorBuild: false,
};
