import { TxDataUnregisterSerializer } from './txDataUnregister';
import { TxDataWithdrawSerializer } from './txDataWithdraw';
import { IReadedData } from '../..';
import { TransactionType } from '../../../../../../packages/core/common';
import { TxDataRewardSerializer } from './txDataReward';
import { TxDataTransferSerializer } from './txDataTransfer';
import { TxDataAliasedSerializer } from './txDataAliased';
import { TxDataDepositSerializer } from './txDataDeposit';
import { TxDataRegisterSerializer } from './txDataRegister';

/***
  * ### TxData
  * http://dev.nuls.io/protocol/index.html#Transaction
  *
  * | Len  | Fields     | Data Type   | Remark             |
  * | ---- | ---------- | ----------- | ------------------ |
  * | ??   | txData     | ??          | Transaction data   |
 */

export type ITxDataOutput = IReadedData;

/**
 * Class to handle the protocol TxData type
 * http://dev.nuls.io/protocol/index.html#Transaction
 */
export class TxDataSerializer {

  /**
   * Reads a txdata integer from buf at the specified offset
   * @param buf Buffer object from where the number will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number, txType: TransactionType): ITxDataOutput {

    switch (txType) {
      case TransactionType.Reward:
        return TxDataRewardSerializer.read(buf, offset);

      case TransactionType.Transfer:
        return TxDataTransferSerializer.read(buf, offset);

      case TransactionType.Aliased:
        return TxDataAliasedSerializer.read(buf, offset);

      case TransactionType.Register:
        return TxDataRegisterSerializer.read(buf, offset);

      case TransactionType.Deposit:
        return TxDataDepositSerializer.read(buf, offset);

      case TransactionType.Withdraw:
        return TxDataWithdrawSerializer.read(buf, offset);

      case TransactionType.Unregister:
        return TxDataUnregisterSerializer.read(buf, offset);

      case TransactionType.ContractCall:
        return TxDataUnregisterSerializer.read(buf, offset);

      default:
        throw new Error('Not implemented');
    }

  }

  /**
   * Writes value to buf at the specified offset
   * @param value Number to be written to buf
   * @param buf Buffer object where the number will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns The number of bytes that has been written
   */
  public static write(data: any, buf: Buffer, offset: number, txType: TransactionType): number {

    switch (txType) {
      case TransactionType.Reward:
        return TxDataRewardSerializer.write(buf, offset);

      case TransactionType.Transfer:
        return TxDataTransferSerializer.write(buf, offset);

      case TransactionType.Aliased:
        return TxDataAliasedSerializer.write(data, buf, offset);

      case TransactionType.Register:
        return TxDataRegisterSerializer.write(data, buf, offset);

      case TransactionType.Deposit:
        return TxDataDepositSerializer.write(data, buf, offset);

      case TransactionType.Withdraw:
        return TxDataWithdrawSerializer.write(data, buf, offset);

      case TransactionType.Unregister:
        return TxDataUnregisterSerializer.write(data, buf, offset);

      case TransactionType.ContractCall:
        return TxDataUnregisterSerializer.write(data, buf, offset);

      default:
        throw new Error('Not implemented');
    }

  }

}
