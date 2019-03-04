import { HASH_LENGTH } from '../../../../common';
import { ADDRESS_LENGTH } from '../../../../common';
import { AddressSerializer } from '../../address';
import { Address, AgentHash } from '../../../crypto';
import { readUint64LE, writeUint64LE, HashSerializer, IReadData } from '../..';

/**
  * ### TxDataDeposit
  * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-JOIN-CONSENSUS
  * 
  * ### TX_TYPE_JOIN_CONSENSUS
  *
  * | 尺寸  | 字段       | 数据类型           | 说明           |
  * | ---- | ---------- | ---------------- | -------------- |
  * | 8    | deposit    | byte[] (uint64)  | 委托金额        |
  * | 23   | address    | byte[23]         | 地址            |
  * | ??   | agentHash  | NulsDigestData   | 委托节点地址     |
 */

export interface ITxDataDepositData {
  deposit: number;
  address: Address;
  agentHash: AgentHash;
}

export interface ITxDataDepositOutput extends IReadData {
  readBytes: number;
  data: ITxDataDepositData;
}

/**
 * Class to handle the protocol TxDataDeposit type
 * https://github.com/nuls-io/nuls/blob/4436795eabe864437de013b83aee0dca0d5400bf/consensus-module/poc/consensus-poc-protocol/src/main/java/io/nuls/consensus/poc/protocol/entity/Deposit.java#L42
 */
export class TxDataDepositSerializer {

  private static BYTES_LENGTH = 8 + ADDRESS_LENGTH + HASH_LENGTH;

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txDataDeposit
   */
  public static size(): number {
    
    return TxDataDepositSerializer.BYTES_LENGTH;

  }

  /**
   * Reads a txDataDeposit buf at the specified offset
   * @param buf Buffer object from where the data will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataDepositOutput {

    const deposit: number = readUint64LE(buf, offset);
    offset += 8;

    const address: Address = AddressSerializer.read(buf, offset).data;
    offset += ADDRESS_LENGTH;

    const agentHash: AgentHash = HashSerializer.read(buf, offset).data;

    return {
      readBytes: TxDataDepositSerializer.BYTES_LENGTH,
      data: {
        deposit,
        address,
        agentHash
      }
    };

  }

  /**
   * Writes txDataDeposit to buf at the specified offset
   * @param data txDataDeposit to be written to buf
   * @param buf Buffer object where the txDataDeposit will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataDepositData, buf: Buffer, offset: number): number {

    offset = writeUint64LE(data.deposit, buf, offset);
    offset = AddressSerializer.write(data.address, buf, offset);
    offset = HashSerializer.write(data.agentHash, buf, offset);

    return offset;

  }

}
