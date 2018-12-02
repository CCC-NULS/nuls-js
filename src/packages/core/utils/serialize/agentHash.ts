import { IReadedData } from '.';
import { HASH_LENGTH } from '../../common';
import { AgentHash } from '../crypto';

/***
  * ### AgentHash
 */

export interface IAgentHashOutput extends IReadedData {
  readedBytes: number;
  data: AgentHash;
}

/**
 * Class to handle the protocol AgentHash type
 */
export class AgentHashSerializer {

  /**
   * Reads a AgentHash from buf at the specified offset
   * @param buf Buffer object from where the bytes will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): IAgentHashOutput {

    const data = buf.slice(offset, offset + HASH_LENGTH).toString('hex');

    return { data, readedBytes: HASH_LENGTH };

  }

  /**
   * Writes AgentHash to buf at the specified offset
   * @param data The address to be written to buf
   * @param buf Buffer object where the bytes will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns The number of bytes that has been written
   */
  public static write(data: AgentHash, buf: Buffer, offset: number): number {

    const writtenBytes = Buffer.from(data, 'hex').copy(buf, offset);

    return writtenBytes;

  }

}
