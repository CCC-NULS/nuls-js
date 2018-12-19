import * as bs58 from 'bs58';
import * as RIPEMD160 from 'ripemd160';
import * as secp256k1 from 'secp256k1';
import * as shajs from 'sha.js';
import { isHex } from './serialize';

export const PRIVATE_KEY_LENGTH = 66;

export type AddressHash = Buffer;
export type Address = string;
export type Hash = string;
export type AgentHash = Hash;

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

export function getPrivateKeyBuffer(privateKey: string): Buffer {

  if(!checkPrivateKey(privateKey)) {
    throw new Error('Invalid private key');
  }

  return Buffer.from(privateKey.substring(2, PRIVATE_KEY_LENGTH), 'hex');

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

export function sha256(buffer: Buffer): Buffer {
  return new shajs.sha256().update(buffer).digest();
}

export function sha256Twice(buffer: Buffer): Buffer {
  return sha256(sha256(buffer));
}

export function ripemd160(buffer: Buffer): Buffer {
  return new RIPEMD160().update(buffer).digest();
}

export function hashFromPublicKey(publicKey: Buffer, { chainId = 8964, addressType = 1 } = {}): Buffer {
  const sha = sha256(publicKey);
  const pubkeyHash = ripemd160(sha);
  const output = Buffer.allocUnsafe(3);
  output.writeInt16LE(chainId, 0);
  output.writeInt8(addressType, 2);
  return Buffer.concat([output, pubkeyHash]);
}
