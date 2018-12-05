import { IReadedData } from '.';
import { HASH_LENGTH } from '../../common';
import { Hash } from '../crypto';

/***
  * ### Hash
 */

export interface IHashOutput extends IReadedData {
  readedBytes: number;
  data: Hash;
}

/**
 * Class to handle the protocol Hash type
 */
export class HashSerializer {

  /**
   * Reads a Hash from buf at the specified offset
   * @param buf Buffer object from where the bytes will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IHashOutput {

    const data = buf.slice(offset, offset + HASH_LENGTH).toString('hex');

    return { data, readedBytes: HASH_LENGTH };

  }

  /**
   * Writes Hash to buf at the specified offset
   * @param data The address to be written to buf
   * @param buf Buffer object where the bytes will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: Hash, buf: Buffer, offset: number): number {

    offset += Buffer.from(data, 'hex').copy(buf, offset);

    return offset;

  }

}
