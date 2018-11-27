import * as secp256k1 from 'secp256k1';
import { PRIVATE_KEY_LENGTH } from '../common';
import { isHex } from './serialize';

export function checkPrivateKey(privateKey: string): boolean {

  if (!isHex(privateKey)) {
    return false;
  }

  if (!privateKey) {
    return false;
  }

  if (privateKey.length !== PRIVATE_KEY_LENGTH) {
    return false;
  }

  if (privateKey.substring(0, 2) !== '00') {
    return false;
  }

  try {

    const prvbuffer = Buffer.from(privateKey.substring(2, PRIVATE_KEY_LENGTH), 'hex');
    privateKeyToPublicKey(prvbuffer);
    return true;

  } catch (e) {

    return false;

  }
}

export function privateKeyToPublicKey(prv: Buffer): Buffer {
  return secp256k1.publicKeyCreate(prv);
}
