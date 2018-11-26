import { address_from_hash, read_by_length, readUint64, write_with_length, writeUint64 } from '../utils/serialize';
import { ADDRESS_LENGTH, HASH_LENGTH, MAX_COIN_SIZE } from './base';

export class Coin {

  public static MAX_COIN_SIZE = HASH_LENGTH + 2 + 8 + 6;

  public static from_dict(value): Coin {

    const item = new Coin();
    item.address = value.address || null;
    item.fromHash = value.fromHash || null;
    if (item.fromHash != null) { item.fromHash = Buffer.from(item.fromHash, 'hex'); }
    item.fromIndex = value.fromIndex || 0;
    item.lockTime = value.lockTime || 0;
    item.na = value.value || null;
    item.na = Math.round(item.na);

    return item;

  }

  private address: any;
  private fromHash: any;
  private fromIndex: any;
  private na: any;
  private lockTime: any;

  public getNa() {
    return this.na;
  }

  public parse(buf, cursor) {
    // Data is expected as a buffer object.
    const { len: pos, val: owner } = read_by_length(buf, cursor);
    cursor += pos;
    if (owner.length > ADDRESS_LENGTH) {
      const val = (owner.length - HASH_LENGTH);
      if (val > 1) { throw new Error('Long int for index found'); }
      // raise ValueError("Long int for index found")
      // Not supported
      this.fromHash = owner.slice(0, HASH_LENGTH - owner.length);
      this.fromIndex = owner[owner.length - 1];
    } else {
      this.address = owner;
    }

    this.na = readUint64(buf, cursor);
    cursor += 8;
    this.lockTime = buf.readIntLE(cursor, 6); // is it really LE ?
    cursor += 6;
    return cursor;
  }

  public to_dict(): any {

    const output: any = {
      lockTime: this.lockTime,
      value: this.na,
    };

    if (this.address) {
      output.address = address_from_hash(this.address);
      output.addressHash = this.address.toString('hex'); // no hex ?
    }

    if (this.fromHash) {
      output.fromHash = this.fromHash.toString('hex');
      output.fromIndex = this.fromIndex;
    }

    return output;
  }

  public serialize() {
    let output = Buffer.alloc(MAX_COIN_SIZE);
    let cursor = 0;

    if (this.fromHash != null) {
      cursor += write_with_length(Buffer.concat([this.fromHash, new Buffer([this.fromIndex])]), output, cursor);
      // cursor += Buffer.concat([new Buffer([this.fromHash.length + 1]), this.fromHash, new Buffer([this.fromIndex])]).copy(output, cursor)
    } else if (this.address) {
      cursor += write_with_length(this.address, output, 0);
    } else { throw new Error('Coin data should have either hash or address'); }

    writeUint64(Math.round(this.na), output, cursor);
    cursor += 8;
    // output += struct.pack("Q", self.na)
    if (this.lockTime !== 0) {
      output.writeIntLE(this.lockTime, cursor, 6); // is it really LE ?
    }
    cursor += 6;

    // output += writeUint48(self.lockTime)
    output = output.slice(0, cursor);

    return output;
  }
}
