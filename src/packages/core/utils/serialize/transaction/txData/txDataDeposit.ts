import { AgentHashSerializer } from './../../agentHash';
import { HASH_LENGTH } from './../../../../common';
import { ADDRESS_LENGTH } from '../../../../common';
import { AddressSerializer } from '../../address';
import { Address, AgentHash } from '../../../crypto';
import { ITxDataOutput } from './txData';
import { readUint64LE, writeUint64LE } from '../..';

/***
  * ### TxDataDeposit
  * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-JOIN-CONSENSUS
  *
  * ### TX_TYPE_JOIN_CONSENSUS
  *
  * | 尺寸  | 字段       | 数据类型           | 说明           |
  * | ---- | ---------- | ---------------- | -------------- |
  * | 8    | deposit    | byte[] (uint64)  | 委托金额        |
  * | 23   | address    | byte[23]         | 地址            |
  * | 8    | agentHash  | NulsDigestData   | 委托节点地址     |
 */

export interface ITxDataDepositData {
  deposit: number;
  address: Address;
  agentHash: AgentHash;
}

export interface ITxDataDepositOutput extends ITxDataOutput {
  readedBytes: number;
  data: ITxDataDepositData;
}

/**
 * Class to handle the protocol TxDataDeposit type
 * http://dev.nuls.io/protocol/transaction.html#TX-TYPE-JOIN-CONSENSUS
 */
export class TxDataDepositSerializer {

  private static BYTES_LENGTH = 8 + ADDRESS_LENGTH + HASH_LENGTH;

  /**
   * Reads a txDataDeposit buf at the specified offset
   * @param buf Buffer object from where the data will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ITxDataDepositOutput {

    const deposit: number = readUint64LE(buf, offset);
    const address: Address = AddressSerializer.read(buf, offset).data;
    const agentHash: AgentHash = AgentHashSerializer.read(buf, offset).data;

    return {
      readedBytes: TxDataDepositSerializer.BYTES_LENGTH,
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
   * @returns The number of bytes that has been written
   */
  public static write(data: ITxDataDepositData, buf: Buffer, offset: number): number {

    writeUint64LE(data.deposit, buf, offset);
    AddressSerializer.write(data.address, buf, offset);
    AgentHashSerializer.write(data.agentHash, buf, offset);

    return TxDataDepositSerializer.BYTES_LENGTH;

  }

}
