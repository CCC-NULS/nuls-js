import * as bs58 from 'bs58';
import * as RIPEMD160 from 'ripemd160';
import * as secp256k1 from 'secp256k1';
import * as shajs from 'sha.js';
import { PRIVATE_KEY_LENGTH } from '../common';
import { isHex } from './serialize';

export type AddressHash = Buffer;
export type Address = string;
export type AgentHash = string;

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
    publicKeyFromPrivateKey(prvbuffer);
    return true;

  } catch (e) {

    return false;

  }
}

export function publicKeyFromPrivateKey(privateKey: Buffer): Buffer {
  return secp256k1.publicKeyCreate(privateKey);
}

export function getXOR(bytes: Buffer): number {
  return bytes.reduce((xor: number, value: number) => xor ^ value);
}

export function addressFromHash(hash: AddressHash): string {
  return bs58.encode(Buffer.concat([hash, Buffer.from([getXOR(hash)])]));
}

export function hashFromAddress(address: Address): AddressHash {
  const hash: number[] = bs58.decode(address);
  return Buffer.from(hash.slice(0, hash.length - 1));
}

export function hashX2(buffer: Buffer): Buffer {
  const sha = new shajs.sha256().update(buffer).digest();
  return new shajs.sha256().update(sha).digest();
}

export function hashFromPublicKey(publicKey: Buffer, { chainId = 8964, addressType = 1 } = {}): Buffer {
  const sha = new shajs.sha256().update(publicKey).digest();
  const pubkeyHash = new RIPEMD160().update(sha).digest();
  const output = Buffer.allocUnsafe(3);
  output.writeInt16LE(chainId, 0);
  output.writeInt8(addressType, 2);
  return Buffer.concat([output, pubkeyHash]);
}
