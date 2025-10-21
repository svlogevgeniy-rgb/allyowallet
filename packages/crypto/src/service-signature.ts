import { SignJWT, jwtVerify } from 'jose';

export interface ServiceKey {
  kid: string;
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

export interface ServiceSignaturePayload {
  batchId: string;
  entriesHash: string;
  issuedAt: number;
}

export async function signBatch(payload: ServiceSignaturePayload, key: ServiceKey): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'EdDSA', kid: key.kid })
    .setIssuedAt(payload.issuedAt)
    .sign(key.privateKey);
}

export async function verifyBatchSignature(token: string, key: ServiceKey) {
  return jwtVerify(token, key.publicKey, { algorithms: ['EdDSA'], audience: undefined });
}
