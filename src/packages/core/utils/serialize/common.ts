import * as bs58 from 'bs58';
import { Uint64LE } from 'int64-buffer';
import * as RIPEMD160 from 'ripemd160';
import * as shajs from 'sha.js';
import { VarIntSerializer } from './varInt';

function getxor(body) {
  // my current/simple method
  // assume 'buf1', 'buf2' & 'result' are ArrayBuffers
  let xor = 0;
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < body.length; i++) {
    xor = xor ^ body[i];
  }
  return xor;
}

const hexRegEx = new RegExp('([0-9]|[a-f])', 'gim');

export function isHex(input: string) {
  return hexRegEx.test(input);
}

export function public_key_to_hash(pub, { chain_id = 8964, address_type = 1 } = {}) {
  const sha = new shajs.sha256().update(pub).digest();
  const pubkeyHash = new RIPEMD160().update(sha).digest();
  const output = Buffer.allocUnsafe(3);
  output.writeInt16LE(chain_id, 0);
  output.writeInt8(address_type, 2);
  return Buffer.concat([output, pubkeyHash]); // .toString('hex')
}

export function address_from_hash(hash) {
  // const bytes = Buffer.from(hash, 'hex')
  const address = bs58.encode(Buffer.concat([hash, new Buffer([getxor(hash)])]));
  return address;
}

export function hash_twice(buffer) {
  let sha = new shajs.sha256().update(buffer).digest();
  sha = new shajs.sha256().update(sha).digest();
  return sha;
}

export function hash_from_address(address): Buffer {
  const hash = bs58.decode(address);
  // return hash.slice(0, hash.length - 1); // .toString('hex')
  return Buffer.from(hash.slice(0, hash.length - 1)); // .toString('hex')
}

// export function read_uint48(buffer, cursor) {
//   // Should use buffer function readUIntLE here.
//   const value = (buffer[cursor + 0] & 0xff) |
//     ((buffer[cursor + 1] & 0xff) << 8) |
//     ((buffer[cursor + 2] & 0xff) << 16) |
//     ((buffer[cursor + 3] & 0xff) << 24) |
//     ((buffer[cursor + 4] & 0xff) << 32) |
//     ((buffer[cursor + 5] & 0xff) << 40);

//   // "todo" here, why ?
//   // cursor += 6;
//   if (value === 281474976710655) { return -1; }

//   return value;
// }

// export function format_uint48(val) {
//   // Should use buffer function writeUIntLE here.
//   const nval = Buffer
//     .from([(0xFF & val),
//     (0xFF & (val >> 8)),
//     (0xFF & (val >> 16)),
//     (0xFF & (val >> 24)),
//     (0xFF & (val >> 32)),
//     (0xFF & (val >> 40))]);
//   return nval;
// }

// export function read_string_by_length(buf, cursor) {
//   const { value: length, readedBytes: llen } = VarInt.read(buf, cursor);
//   const value = buf.readstring('utf8', cursor + llen, cursor + llen + length);
//   return { val: value, len: length + llen };
// }

// export function write_string_with_length(val, buf, cursor) {
//   let llen = VarInt.write(val.length, buf, cursor);
//   let slen = buf.write(val, cursor + llen);
//   if (slen !== val.length) {
//     // In case of utf-8 string with data encoded multi bytes, we have to rewrite
//     llen = VarInt.write(slen, buf, cursor);
//     slen = buf.write(val, cursor + llen);
//   }
//   return llen + slen;
// }

export function read_by_length(buf, cursor) {
  const { value: length, readedBytes: llen } = VarIntSerializer.read(buf, cursor);
  // let value = new Buffer.from(buf, cursor + llen, length)
  const value = buf.slice(cursor + llen, cursor + llen + length);
  return { val: value, len: length + llen };
}

export function writeWithLength(val: Buffer, buf: Buffer, cursor: number) {
  const llen = VarIntSerializer.write(val.length, buf, cursor);
  const slen = val.copy(buf, cursor + llen);
  return llen + slen;
}

export function readUint64(buffer: Buffer, cursor) {
  return (new Uint64LE(buffer, cursor)).toNumber();
}

export function formatUint64(val) {
  const big = new Uint64LE(val);
  return big.toBuffer();
}

export function writeUint64(val, buf, offset): number {
  const formatted = formatUint64(val);
  formatted.copy(buf, offset);
  return formatted.length;
}

// export function get_outputs_for_sum(targetValue, outputs) {
//   let currentValue = 0;
//   const selectedInputs: any = [];

//   // We use biggest outputs first
//   outputs.sort((a, b) => (a.value - b.value));
//   outputs = outputs.reverse();

//   for (const utxo of outputs) {
//     currentValue += utxo.value;
//     selectedInputs.push({
//       fromHash: utxo.hash,
//       fromIndex: utxo.idx,
//       lockTime: utxo.lockTime,
//       value: utxo.value,
//     });
//     if (currentValue >= targetValue)
//       break;
//   }
//   return { in: selectedInputs, val: currentValue };
// }
