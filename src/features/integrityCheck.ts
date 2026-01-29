export interface IntegrityCheckAndroid {
  platform: 'android';
  integrityToken: string;
  keyId: string;
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

interface IntegrityCheckRequestDataAndroid {
  key_id: string;
  integrity_token: string;
}

interface IntegrityCheckRequestDataIOS {
  key_id: string;
  attestation_object: string;
}

interface IntegrityCheckRequestDataWeb {
  bypass_token: string;
}

export type IntegrityCheckRequestData =
  | IntegrityCheckRequestDataAndroid
  | IntegrityCheckRequestDataIOS
  | IntegrityCheckRequestDataWeb;

export function getIntegrityCheckRequestData(
  integrityCheck: IntegrityCheck,
): IntegrityCheckRequestData {
  if (integrityCheck.platform === 'android') {
    return {
      key_id: integrityCheck.keyId,
      integrity_token: integrityCheck.integrityToken,
    };
  }
  if (integrityCheck.platform === 'ios') {
    return {
      key_id: integrityCheck.keyId,
      attestation_object: integrityCheck.attestationObject,
    };
  }
  if (integrityCheck.platform === 'web') {
    return {
      bypass_token: integrityCheck.bypassToken,
    };
  }
  throw new Error(`Unsupported platform for integrity check request data`);
}
