import * as bs58 from 'bs58';
import { Uint64LE } from 'int64-buffer';
import * as RIPEMD160 from 'ripemd160';
import * as secp256k1 from 'secp256k1';
import * as shajs from 'sha.js';

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

export function private_key_to_public_key(prv) {
  return secp256k1.publicKeyCreate(prv);
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

export function read_uint48(buffer, cursor) {
  // Should use buffer function readUIntLE here.
  const value = (buffer[cursor + 0] & 0xff) |
    ((buffer[cursor + 1] & 0xff) << 8) |
    ((buffer[cursor + 2] & 0xff) << 16) |
    ((buffer[cursor + 3] & 0xff) << 24) |
    ((buffer[cursor + 4] & 0xff) << 32) |
    ((buffer[cursor + 5] & 0xff) << 40);

  // "todo" here, why ?
  // cursor += 6;
  if (value === 281474976710655) { return -1; }

  return value;
}

export function format_uint48(val) {
  // Should use buffer function writeUIntLE here.
  const nval = Buffer
    .from([(0xFF & val),
    (0xFF & (val >> 8)),
    (0xFF & (val >> 16)),
    (0xFF & (val >> 24)),
    (0xFF & (val >> 32)),
    (0xFF & (val >> 40))]);
  return nval;
}

// export function format_varint(val): Buffer {

//   let ob: Buffer;

//   if ((val < 0) || (val > 0xFFFFFFFF)) {
//     // Not implemented.
//   } else if (val < 253) {
//     ob = Buffer.from([self.val]);
//   } else if (val <= 0xFFFF) {
//     ob = Buffer.allocUnsafe(3);
//     ob[0] = 253;
//     ob.writeUIntLE(val, 1, 2);
//   } else if (val <= 0xFFFFFFFF) {
//     ob = Buffer.allocUnsafe(5);
//     ob[0] = 254;
//     ob.writeUIntLE(val, 1, 4);
//   }
//   return ob;
// }

export function parse_varint(buf, offset): any {
  const first = 0xFF & buf[offset];
  let len = 1;
  let val = 0;
  if (first < 253) {
    val = first;
  } else if (first === 253) {
    val = (buf.readUIntLE(offset + 1, 2));
    len = 3;
  } else if (first === 254) {
    val = (buf.readUIntLE(offset + 1, 4));
    len = 5;
  } else {
    return null; // Not implemented. Uint64LE ?
  }

  return { val, len };
}

export function write_varint(value, buf, cursor) {
  let len = 1;
  if (value < 253) {
    // ob = new Buffer.from([self.value]);
    buf[cursor] = value;
  } else if (value <= 0xFFFF) {
    // ob = new Buffer.allocUnsafe(3);
    buf[cursor] = 253;
    buf.writeUIntLE(value, cursor + 1, 2);
    len = 3;
  } else if (value <= 0xFFFFFFFF) {
    buf[cursor] = 254;
    buf.writeUIntLE(value, cursor + 1, 4);
    len = 5;
  } else {
    throw new Error('not implemented');
  }
  return len;
}

export function read_string_by_length(buf, cursor) {
  const { val: length, len: llen } = parse_varint(buf, cursor);
  const value = buf.readstring('utf8', cursor + llen, cursor + llen + length);
  return { val: value, len: length + llen };
}

export function write_string_with_length(val, buf, cursor) {
  let llen = write_varint(val.length, buf, cursor);
  let slen = buf.write(val, cursor + llen);
  if (slen !== val.length) {
    // In case of utf-8 string with data encoded multi bytes, we have to rewrite
    llen = write_varint(slen, buf, cursor);
    slen = buf.write(val, cursor + llen);
  }
  return llen + slen;
}

export function read_by_length(buf, cursor) {
  const { val: length, len: llen } = parse_varint(buf, cursor);
  // let value = new Buffer.from(buf, cursor + llen, length)
  const value = buf.slice(cursor + llen, cursor + llen + length);
  return { val: value, len: length + llen };
}

export function write_with_length(val, buf, cursor) {
  const llen = write_varint(val.length, buf, cursor);
  const slen = val.copy(buf, cursor + llen);
  return llen + slen;
}

export function readUint64(buffer, cursor) {
  return (new Uint64LE(buffer, cursor)).toNumber();
}

export function formatUint64(val) {
  const big = new Uint64LE(val);
  return big.toBuffer();
}

export function writeUint64(val, buf, offset) {
  const formatted = formatUint64(val);
  formatted.copy(buf, offset);
  return formatted.length;
}

export function get_outputs_for_sum(targetValue, outputs) {
  let currentValue = 0;
  const selectedInputs: any = [];

  // We use biggest outputs first
  outputs.sort((a, b) => (a.value - b.value));
  outputs = outputs.reverse();

  for (const utxo of outputs) {
    currentValue += utxo.value;
    selectedInputs.push({
      fromHash: utxo.hash,
      fromIndex: utxo.idx,
      lockTime: utxo.lockTime,
      value: utxo.value,
    });
    if (currentValue >= targetValue)
      break;
  }
  return { in: selectedInputs, val: currentValue };
}
