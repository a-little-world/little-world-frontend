export interface IntegrityCheckAndroid {
  platform: 'android';
  integrityToken: string;
  requestHash: string;
}

export interface IntegrityCheckIOS {
  platform: 'ios';
  keyId: string;
  attestationObject: string;
}

export interface IntegrityCheckWeb {
  platform: 'web';
  bypassToken: string;
}

export type IntegrityCheck =
  | IntegrityCheckAndroid
  | IntegrityCheckIOS
  | IntegrityCheckWeb;
