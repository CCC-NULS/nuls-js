import { TxDataContractCallSerializer, ITxDataContractCallData } from './txDataContractCall';
import { TxDataUnregisterSerializer, ITxDataUnregisterData } from './txDataUnregister';
import { TxDataWithdrawSerializer, ITxDataWithdrawData } from './txDataWithdraw';
import { TransactionType } from '../../../../../../packages/core/common';
import { TxDataRewardSerializer, ITxDataRewardData } from './txDataReward';
import { TxDataTransferSerializer, ITxDataTransferData } from './txDataTransfer';
import { TxDataAliasedSerializer, ITxDataAliasedData } from './txDataAliased';
import { TxDataDepositSerializer, ITxDataDepositData } from './txDataDeposit';
import { TxDataRegisterSerializer, ITxDataRegisterData } from './txDataRegister';
import { IReadData } from '../../common';

/***
  * ### TxData
  * http://dev.nuls.io/protocol/index.html#Transaction
  *
  * | Len  | Fields     | Data Type   | Remark             |
  * | ---- | ---------- | ----------- | ------------------ |
  * | ??   | txData     | ??          | Transaction data   |
 */

export type ITxDataData = ITxDataRewardData | ITxDataTransferData | ITxDataAliasedData | ITxDataRegisterData |
  ITxDataDepositData | ITxDataWithdrawData | ITxDataUnregisterData | ITxDataContractCallData;

export interface ITxDataOutput extends IReadData {
  data: ITxDataData;
}

/**
 * Class to handle the protocol TxData type
 * http://dev.nuls.io/protocol/index.html#Transaction
 */
export class TxDataSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized txData
   */
  public static size(data: ITxDataData, txType: TransactionType): number {
    
    switch (txType) {
      case TransactionType.Reward:
        return TxDataRewardSerializer.size();

      case TransactionType.Transfer:
        return TxDataTransferSerializer.size();

      case TransactionType.Aliased:
        return TxDataAliasedSerializer.size(data as ITxDataAliasedData);

      case TransactionType.Register:
        return TxDataRegisterSerializer.size();

      case TransactionType.Deposit:
        return TxDataDepositSerializer.size();

      case TransactionType.Withdraw:
        return TxDataWithdrawSerializer.size();

      case TransactionType.Unregister:
        return TxDataUnregisterSerializer.size();

      case TransactionType.ContractCall:
        return TxDataContractCallSerializer.size(data as ITxDataContractCallData);

      default:
        throw new Error('Not implemented');
    }

  }
  
  /**
   * Reads a txdata integer from buf at the specified offset
   * @param buf Buffer object from where the number will be read
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
        return TxDataContractCallSerializer.read(buf, offset);

      default:
        throw new Error('Not implemented');
    }

  }

  /**
   * Writes value to buf at the specified offset
   * @param value Number to be written to buf
   * @param buf Buffer object where the number will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
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
        return TxDataContractCallSerializer.write(data, buf, offset);

      default:
        throw new Error('Not implemented');
    }

  }

}
