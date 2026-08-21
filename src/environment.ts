export interface Environment {
  backendUrl: string;
  coreWsPath: string;
  isNative: boolean;
  csrfBypassToken: string;
  allowNgrokRequests: boolean;
}

export const environment: Environment = {
  backendUrl: '',
  coreWsPath: '/api/core/ws',
  isNative: false,
  csrfBypassToken: 'abc',
  allowNgrokRequests: false,
};
