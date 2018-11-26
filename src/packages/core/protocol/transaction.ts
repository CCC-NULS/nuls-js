import {
  address_from_hash, hash_from_address,
  hash_twice, parse_varint,
  private_key_to_public_key,
  read_by_length,
  readUint64,
  write_varint, write_with_length,
  writeUint64
} from '../utils/serialize';
import { ADDRESS_LENGTH, CHEAP_UNIT_FEE, HASH_LENGTH, KB, MAX_COIN_SIZE, PLACE_HOLDER, UNIT_FEE } from './base';
import { Coin } from './coin';

const secp256k1 = require('secp256k1');

export class Transaction {

  public static from_dict(value) {

    const item = new Transaction();
    item.type = value.type;
    item.time = value.time || null;
    if (item.time === null) { item.time = (new Date().getTime()); }
    item.height = value.blockHeight || null;
    item.remark = value.remark
      ? Buffer.from(value.remark, 'utf8')
      : Buffer.from([]);
    item.scriptSig = value.scriptSig
      ? Buffer.from(value.scriptSig, 'hex')
      : Buffer.from([]);
    item.size = value.size || null;
    item.moduleData = value.info || {};

    for (const input of (value.inputs || [])) {
      item.inputs.push(Coin.from_dict(input));
    }

    for (const output of (value.outputs || [])) {
      item.outputs.push(Coin.from_dict(output));
    }

    return item;
  }

  private type: number = -1;
  private time: number = -1;
  private hash = null;
  private height = null;
  private remark: Buffer = Buffer.from([]);
  private scriptSig: Buffer = Buffer.from([]);
  private moduleData: any = {};
  private inputs: Coin[] = [];
  private outputs: Coin[] = [];
  private size = 0;

  public parse(buffer, cursor) {

    const stCursor = cursor;
    this.type = buffer.readUIntLE(buffer, cursor, 2);
    cursor += 2;
    this.time = buffer.readUIntLE(buffer, cursor, 6);
    cursor += 6;

    const st2Cursor = cursor;

    const { len: pos, val: remark } = read_by_length(buffer, cursor);
    cursor += pos;
    this.remark = remark;

    cursor = this.parse_data(buffer, cursor);

    const { len: icpos, val: inputCount } = parse_varint(buffer, cursor);
    cursor += icpos;

    for (let i = 0; i < inputCount; i++) {
      const coin = new Coin();
      cursor = coin.parse(buffer, cursor);
      this.inputs.push(coin);
    }

    const { len: ocpos, val: outputCount } = parse_varint(buffer, cursor);
    cursor += ocpos;
    for (let i = 0; i < outputCount; i++) {
      const coin = new Coin();
      cursor = coin.parse(buffer, cursor);
      this.outputs.push(coin);
    }
    // this.coin_data = CoinData()
    // cursor = self.coin_data.parse(buffer, cursor)
    const medCursor = cursor;

    /* let values = bytes((self.type,)) \
               + bytes((255,)) + writeUint64(self.time) \
               + buffer.slice(st2Cursor, medCursor) */

    // self.hash_bytes = hash_twice(values)
    // self.hash = NulsDigestData(data=self.hash_bytes, alg_type=0)

    const { len: scpos, val: ssig } = read_by_length(buffer, cursor);
    this.scriptSig = ssig;
    cursor += scpos;
    const endCursor = cursor;
    this.size = endCursor - stCursor;

    return cursor;
  }

  public serialize() {

    // let output = new Buffer.alloc(this.get_max_size()) // 1mb max size ?
    let output = Buffer.alloc(300000); // max size 300kb...
    let cursor = 0;
    output.writeUIntLE(this.type, cursor, 2);
    cursor += 2;
    output.writeUIntLE(this.time, cursor, 6);
    cursor += 6;
    cursor += write_with_length(this.remark, output, cursor);
    cursor = this.write_data(output, cursor);

    cursor = this.write_coin_data(output, cursor);

    if (!(this.scriptSig === null)) {
      cursor += write_with_length(this.scriptSig, output, cursor);
    }

    output = output.slice(0, cursor);
    return output;
  }

  public get_fee() {
    let initialValue = 0;
    const inputs = this.inputs.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.getNa();
    }, initialValue);
    initialValue = 0;
    const outputs = this.outputs.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.getNa();
    }, initialValue);
    return inputs - outputs;
  }

  public calculate_fee() {
    const maxSize = this.get_max_size();
    let unitFee = UNIT_FEE;
    if ((this.type === 2) || (this.type === 101)) {
      unitFee = CHEAP_UNIT_FEE;
    }

    let fee = unitFee * Math.floor(maxSize / KB); // per kb

    if (maxSize % KB > 0) {
      // why is it needed, to be sure we have at least the fee ?
      // or am I doing a bad port from java, where they work with int and not mutable ?
      fee += unitFee;
    }

    return fee;
  }

  public get_max_size() {
    let dataSize = 4;
    if (this.type === 3) { // alias
      dataSize = (ADDRESS_LENGTH * 2) + 2;
    } else if (this.type === 4) { // register agent
      dataSize = 8 + (ADDRESS_LENGTH * 3) + 8;
    } else if (this.type === 5) { // join consensus
      dataSize = 8 + ADDRESS_LENGTH + HASH_LENGTH;
    } else if (this.type === 6) { // cancel consensus
      dataSize = HASH_LENGTH;
    } else if (this.type === 9) { // stop agent
      dataSize = HASH_LENGTH;
    } else if (this.type === 101) { // call contract
      dataSize = ADDRESS_LENGTH + ADDRESS_LENGTH + 8 + 8 + 8 +
        5 + this.moduleData.methodName.length +
        5 + this.moduleData.methodDesc.length + 1;
      for (const arg of this.moduleData.args) {
        dataSize += 1;
        for (const argitem of arg) {
          dataSize += 5 + argitem.length;
        }
      }
    }
    const size = 2 + 6 + 1 + this.remark.length + dataSize +
      5 + (this.inputs.length * MAX_COIN_SIZE) +
      5 + (this.outputs.length * MAX_COIN_SIZE) +
      5 + this.scriptSig.length;
    return size;
  }

  public get_digest(hashVarint = false) {
    let buf = Buffer.alloc(this.get_max_size());
    let cursor = 0;
    if (hashVarint) {
      buf[0] = this.type;
      buf[1] = 255;
      cursor += 2;

      writeUint64(Math.round(this.time), buf, cursor);
      cursor += 8;
    } else {
      buf.writeUIntLE(this.type, cursor, 2);
      cursor += 2;
      buf.writeUIntLE(this.time, cursor, 6);
      cursor += 6;
    }

    cursor += write_with_length(this.remark, buf, cursor);
    cursor = this.write_data(buf, cursor);

    cursor = this.write_coin_data(buf, cursor);

    buf = buf.slice(0, cursor);

    const digest = hash_twice(buf);
    return digest;
  }

  public get_hash(hashVarint = false) {
    const digest = this.get_digest(hashVarint);
    const buf = Buffer.concat([Buffer.from([0, digest.length]), digest]);
    return buf;
  }

  public sign(prvKey, hashVarint = false) {
    const digest = this.get_digest(hashVarint);

    const pubKey = private_key_to_public_key(prvKey);
    const pubKey2 = secp256k1.publicKeyCreate(prvKey);

    const sigObj = secp256k1.sign(digest, prvKey);
    const signed = secp256k1.signatureExport(sigObj.signature);

    const buf = Buffer.alloc(3 + pubKey.length + signed.length);
    let cursor = write_with_length(pubKey, buf, 0);
    cursor += 1; // we let a zero there for alg ECC type
    cursor += write_with_length(signed, buf, cursor);

    this.scriptSig = buf;
  }

  public to_dict() {
    let remark = '';
    if (this.remark) {
      try {
        remark = this.remark.toString('utf8');
      } catch (error) {
        console.error(error);
        remark = this.remark.toString('base64');
      }
    }

    return {
      blockHeight: this.height,
      fee: (this.type !== 1) ? this.get_fee() : 0, // fix this
      hash: this.get_hash().toString('hex'),
      info: this.moduleData,
      inputs: this.inputs.map((utxo) => utxo.to_dict()),
      outputs: this.outputs.map((utxo) => utxo.to_dict()),
      remark,
      scriptSig: this.scriptSig ? this.scriptSig.toString('hex') : null,
      size: this.size,
      time: this.time,
      type: this.type,
    };
  }

  private write_data(buffer, cursor) {
    const md = this.moduleData;
    if (this.type === 1) { // consensus reward
      PLACE_HOLDER.copy(buffer, cursor);
      cursor += PLACE_HOLDER.length;
    } else if (this.type === 2) { // transfer
      PLACE_HOLDER.copy(buffer, cursor);
      cursor += PLACE_HOLDER.length;
    } else if (this.type === 3) { // alias
      cursor += write_with_length(hash_from_address(md.address), buffer, cursor);
      cursor += write_with_length(hash_from_address(md.alias), buffer, cursor);
    } else if (this.type === 4) { // register agent
      writeUint64(md.deposit, buffer, cursor);
      cursor += 8;
      cursor += hash_from_address(md.agentAddress).copy(buffer, cursor);
      cursor += hash_from_address(md.packingAddress).copy(buffer, cursor);
      cursor += hash_from_address(md.rewardAddress).copy(buffer, cursor);
      buffer.writeDoubleLE(md.commissionRate, cursor);
      cursor += 8;
    } else if (this.type === 5) { // join consensus
      writeUint64(md.deposit, buffer, cursor);
      cursor += 8;
      cursor += hash_from_address(md.address).copy(buffer, cursor);
      cursor += Buffer.from(md.agentHash, 'hex').copy(buffer, cursor);
    } else if (this.type === 6) { // cancel consensus
      cursor += Buffer.from(md.joinTxHash, 'hex').copy(buffer, cursor);
    } else if (this.type === 9) { // stop agent
      cursor += Buffer.from(md.createTxHash, 'hex').copy(buffer, cursor);
    } else if (this.type === 101) { // call contract
      cursor += hash_from_address(md.sender).copy(buffer, cursor);
      cursor += hash_from_address(md.contractAddress).copy(buffer, cursor);
      writeUint64(Math.round(md.value), buffer, cursor);
      cursor += 8;
      writeUint64(Math.round(md.gasLimit), buffer, cursor);
      cursor += 8;
      writeUint64(Math.round(md.price), buffer, cursor);
      cursor += 8;
      cursor += write_with_length(Buffer.from(md.methodName, 'utf8'),
        buffer, cursor);
      cursor += write_with_length(Buffer.from(md.methodDesc, 'utf8'),
        buffer, cursor);
      buffer[cursor] = md.args.length;
      cursor += 1;
      for (const arg of md.args) {
        buffer[cursor] = arg.length;
        cursor += 1;
        for (const argitem of arg) {
          cursor += write_with_length(Buffer.from(argitem, 'utf8'),
            buffer, cursor);
        }
      }
    } else {
      throw new Error('Not implemented');
    }

    return cursor;
  }

  private parse_data(buffer, cursor) {

    const md = this.moduleData;

    if (this.type === 1) { // consensus reward
      cursor += PLACE_HOLDER.length;

    } else if (this.type === 2) { // transfer

      cursor += PLACE_HOLDER.length;

    } else if (this.type === 3) { // alias

      cursor += PLACE_HOLDER.length;
      const { len: pos, val: address } = read_by_length(buffer, cursor);
      cursor += pos;
      md.address = address_from_hash(address);
      const { len: pos2, val: alias } = read_by_length(buffer, cursor);
      cursor += pos;
      md.alias = alias;

    } else if (this.type === 4) { // register agent

      md.deposit = readUint64(buffer, cursor);
      cursor += 8;
      md.agentAddress = buffer.slice(cursor, cursor + ADDRESS_LENGTH);
      cursor += ADDRESS_LENGTH;
      md.agentAddress = address_from_hash(md.agentAddress);
      md.packingAddress = buffer.slice(cursor, cursor + ADDRESS_LENGTH);
      cursor += ADDRESS_LENGTH;
      md.packingAddress = address_from_hash(md.packingAddress);
      md.rewardAddress = buffer.slice(cursor, cursor + ADDRESS_LENGTH);
      cursor += ADDRESS_LENGTH;
      md.rewardAddress = address_from_hash(md.rewardAddress);
      md.commissionRate = buffer.readDoubleLE(cursor); // LE ?
      cursor += 8;

    } else if (this.type === 5) { // join consensus

      md.deposit = readUint64(buffer, cursor);
      cursor += 8;
      md.address = buffer.slice(cursor, cursor + ADDRESS_LENGTH);
      cursor += ADDRESS_LENGTH;
      md.address = address_from_hash(md.address);
      md.agentHash = buffer.slice(cursor, cursor + HASH_LENGTH).toString('hex');
      cursor += HASH_LENGTH;

    } else if (this.type === 6) { // cancel consensus

      md.joinTxHash = buffer.slice(cursor, cursor + HASH_LENGTH).toString('hex');
      cursor += HASH_LENGTH;

    } else if (this.type === 9) { // cancel consensus

      md.createTxHash = buffer.slice(cursor, cursor + HASH_LENGTH).toString('hex');
      cursor += HASH_LENGTH;

    } else if (this.type === 101) {

      md.sender = buffer.slice(cursor, cursor + ADDRESS_LENGTH);
      cursor += ADDRESS_LENGTH;
      md.sender = address_from_hash(md.sender);

      md.contractAddress = buffer.slice(cursor, cursor + ADDRESS_LENGTH);
      cursor += ADDRESS_LENGTH;
      md.contractAddress = address_from_hash(md.contractAddress);

      md.value = readUint64(buffer, cursor);
      cursor += 8;
      md.gasLimit = readUint64(buffer, cursor);
      cursor += 8;
      md.price = readUint64(buffer, cursor);
      cursor += 8;

      const { len: pos, val: methodName } = read_by_length(buffer, cursor);
      cursor += pos;
      md.methodName = methodName.toString('utf8');

      const { len: pos2, val: methodDesc } = read_by_length(buffer, cursor);
      cursor += pos2;
      md.methodDesc = methodDesc.toString('utf8');

      const argslen = buffer[cursor];
      cursor += 1;

      const args: any[] = [];
      for (let i = 0; i <= argslen; i++) {
        const arglen = buffer[cursor];
        cursor += 1;
        const arg: any[] = [];
        for (let j = 0; j <= arglen; j++) {
          const { len: pos3, val: argcontent } = read_by_length(buffer, cursor);
          cursor += pos3;
          arg.push(argcontent.toString('utf8'));
        }
        args.push(arg);
      }
      md.args = args;

    } else {
      throw new Error('Not implemented');
    }

    return cursor;
  }

  private write_coin_data(output, cursor) {

    cursor += write_varint(this.inputs.length, output, cursor);
    for (const cinput of this.inputs) {
      const serialized = cinput.serialize();
      serialized.copy(output, cursor);
      cursor += serialized.length;
    }

    if (this.outputs.length > 0) {
      cursor += write_varint(this.outputs.length, output, cursor);
      for (const coutput of this.outputs) {
        cursor += coutput.serialize().copy(output, cursor);
      }
    }
    return cursor;
  }

}

export default Transaction;
