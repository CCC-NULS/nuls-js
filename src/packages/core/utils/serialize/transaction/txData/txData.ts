import { TxDataContractCallSerializer, ITxDataContractCallData } from './txDataContractCall';
import { TxDataUnregisterSerializer, ITxDataUnregisterData } from './txDataUnregister';
import { TxDataWithdrawSerializer, ITxDataWithdrawData } from './txDataWithdraw';
import { TransactionType } from '../../../../../../packages/core/common';
import { TxDataRewardSerializer, ITxDataRewardData } from './txDataReward';
import { TxDataTransferSerializer, ITxDataTransferData } from './txDataTransfer';
import { TxDataAliasSerializer, ITxDataAliasData } from './txDataAlias';
import { TxDataDepositSerializer, ITxDataDepositData } from './txDataDeposit';
import { TxDataRegisterSerializer, ITxDataRegisterData } from './txDataRegister';
import { IReadData } from '../../common';
import { ITxDataYellowCardData, TxDataYellowCardSerializer } from './txDataYellowCard';
import { ITxDataRedCardData, TxDataRedCardSerializer } from './txDataRedCard';

/***
  * ### TxData
  * http://dev.nuls.io/protocol/index.html#Transaction88
  *
  * | Len  | Fields     | Data Type   | Remark             |
  * | ---- | ---------- | ----------- | ------------------ |
  * | ??   | txData     | ??          | Transaction data   |
 */

export type ITxDataData = ITxDataRewardData | ITxDataTransferData | ITxDataAliasData | ITxDataRegisterData |
  ITxDataDepositData | ITxDataWithdrawData | ITxDataUnregisterData | ITxDataContractCallData | ITxDataYellowCardData | ITxDataRedCardData;

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

      case TransactionType.Alias:
        return TxDataAliasSerializer.size(data as ITxDataAliasData);

      case TransactionType.Register:
        return TxDataRegisterSerializer.size();

      case TransactionType.Deposit:
        return TxDataDepositSerializer.size();

      case TransactionType.Withdraw:
        return TxDataWithdrawSerializer.size();

      case TransactionType.YellowCard:
        return TxDataYellowCardSerializer.size(data as ITxDataYellowCardData);

      case TransactionType.RedCard:
        return TxDataRedCardSerializer.size(data as ITxDataRedCardData);

      case TransactionType.Unregister:
        return TxDataUnregisterSerializer.size();

      case TransactionType.ContractCall:
        return TxDataContractCallSerializer.size(data as ITxDataContractCallData);

      default:
        throw new Error(`TxDataSerializer not implemented for type ${TransactionType[txType]}`);
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

      case TransactionType.Alias:
        return TxDataAliasSerializer.read(buf, offset);

      case TransactionType.Register:
        return TxDataRegisterSerializer.read(buf, offset);

      case TransactionType.Deposit:
        return TxDataDepositSerializer.read(buf, offset);

      case TransactionType.Withdraw:
        return TxDataWithdrawSerializer.read(buf, offset);

      case TransactionType.YellowCard:
        return TxDataYellowCardSerializer.read(buf, offset);

      case TransactionType.RedCard:
        return TxDataRedCardSerializer.read(buf, offset);

      case TransactionType.Unregister:
        return TxDataUnregisterSerializer.read(buf, offset);

      case TransactionType.ContractCall:
        return TxDataContractCallSerializer.read(buf, offset);

      default:
        throw new Error(`TxDataSerializer not implemented for type ${TransactionType[txType]}`);
    }

  }

  /**
   * Writes value to buf at the specified offset
   * @param value Number to be written to buf
   * @param buf Buffer object where the number will be written
   * @param offset Number of bytes to skip before starting to write. Must satisfy
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: ITxDataData, buf: Buffer, offset: number, txType: TransactionType): number {

    switch (txType) {
      case TransactionType.Reward:
        return TxDataRewardSerializer.write(buf, offset);

      case TransactionType.Transfer:
        return TxDataTransferSerializer.write(buf, offset);

      case TransactionType.Alias:
        return TxDataAliasSerializer.write(data as ITxDataAliasData, buf, offset);

      case TransactionType.Register:
        return TxDataRegisterSerializer.write(data as ITxDataRegisterData, buf, offset);

      case TransactionType.Deposit:
        return TxDataDepositSerializer.write(data as ITxDataDepositData, buf, offset);

      case TransactionType.Withdraw:
        return TxDataWithdrawSerializer.write(data as ITxDataWithdrawData, buf, offset);

      case TransactionType.YellowCard:
        return TxDataYellowCardSerializer.write(data as ITxDataYellowCardData, buf, offset);

      case TransactionType.RedCard:
        return TxDataRedCardSerializer.write(data as ITxDataRedCardData, buf, offset);

      case TransactionType.Unregister:
        return TxDataUnregisterSerializer.write(data as ITxDataWithdrawData, buf, offset);

      case TransactionType.ContractCall:
        return TxDataContractCallSerializer.write(data as ITxDataContractCallData, buf, offset);

      default:
        throw new Error(`TxDataSerializer not implemented for type ${TransactionType[txType]}`);
    }

  }

}
