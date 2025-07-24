export interface Environment {
  development: boolean;
  production: boolean;
  default_login_username: string;
  default_login_password: string;
  backend_url: string;
  backend_path: string;
  core_ws_sheme: string;
  core_ws_path: string;
  isCapactitorBuild: boolean;
}

export const environment: Environment = {
  development: false,
  production: true,
  default_login_username: 'nopeHeAintExistInProduction',
  default_login_password: 'aPassYouCantUse',
  backend_url: '',
  backend_path: '/app',
  core_ws_sheme: 'wss://',
  core_ws_path: '/api/core/ws',
  isCapactitorBuild: false,
};
