export interface IntegrityCheckAndroid {
  platform: 'android';
  challengeId: string;
  integrityToken: string;
}

export interface IntegrityCheckIOS {
  platform: 'ios';
  keyId: string;
  challengeId: string;
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

export interface IntegrityCheckRequestDataAndroid {
  challenge_id: string;
  integrity_token: string;
}

export interface IntegrityCheckRequestDataIOS {
  key_id: string;
  challenge_id: string;
  attestation_object: string;
}

export interface IntegrityCheckRequestDataWeb {
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
      challenge_id: integrityCheck.challengeId,
      integrity_token: integrityCheck.integrityToken,
    } satisfies IntegrityCheckRequestDataAndroid;
  }
  if (integrityCheck.platform === 'ios') {
    return {
      key_id: integrityCheck.keyId,
      challenge_id: integrityCheck.challengeId,
      attestation_object: integrityCheck.attestationObject,
    } satisfies IntegrityCheckRequestDataIOS;
  }
  if (integrityCheck.platform === 'web') {
    return {
      bypass_token: integrityCheck.bypassToken,
    } satisfies IntegrityCheckRequestDataWeb;
  }
  throw new Error(`Unsupported platform for integrity check request data`);
}
