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
import { NulsDataSerializer, INulsDataData } from '../../nulsData';
import { ITxDataContractCreateData, TxDataContractCreateSerializer } from './txDataContractCreate';
import { ITxDataContractDeleteData, TxDataContractDeleteSerializer } from './txDataContractDelete';
import { ITxDataContractTransferData, TxDataContractTransferSerializer } from './txDataContractTransfer';

/***
  * ### TxData
  * http://dev.nuls.io/protocol/index.html#Transaction88
  *
  * | Len  | Fields     | Data Type   | Remark             |
  * | ---- | ---------- | ----------- | ------------------ |
  * | ??   | txData     | ??          | Transaction data   |
 */

export type ITxDataData = INulsDataData | ITxDataRewardData | ITxDataTransferData | ITxDataAliasData | ITxDataRegisterData |
  ITxDataDepositData | ITxDataWithdrawData | ITxDataUnregisterData | ITxDataYellowCardData | ITxDataRedCardData |
  ITxDataContractCreateData | ITxDataContractCallData | ITxDataContractDeleteData | ITxDataContractTransferData;

export interface ITxDataOutput extends IReadData {
  data: ITxDataData | null;
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

    const nulsData = NulsDataSerializer.size(data);

    if (nulsData > 0) {
      return nulsData;
    }

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

      case TransactionType.ContractCreate:
        return TxDataContractCreateSerializer.size(data as ITxDataContractCreateData);

      case TransactionType.ContractCall:
        return TxDataContractCallSerializer.size(data as ITxDataContractCallData);

      case TransactionType.ContractDelete:
        return TxDataContractDeleteSerializer.size();

      case TransactionType.ContractTransfer:
        return TxDataContractTransferSerializer.size();

      default:
        throw new Error(`TxDataSerializer not implemented for type [${txType}]`);
    }

  }

  /**
   * Reads a txdata integer from buf at the specified offset
   * @param buf Buffer object from where the number will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number, txType: TransactionType): ITxDataOutput {

    const nulsData = NulsDataSerializer.read(buf, offset);

    if (nulsData.readBytes > 0) {
      return nulsData;
    }

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

      case TransactionType.ContractCreate:
        return TxDataContractCreateSerializer.read(buf, offset);

      case TransactionType.ContractCall:
        return TxDataContractCallSerializer.read(buf, offset);

      case TransactionType.ContractDelete:
        return TxDataContractDeleteSerializer.read(buf, offset);

      case TransactionType.ContractTransfer:
        return TxDataContractTransferSerializer.read(buf, offset);

      default:
        throw new Error(`TxDataSerializer not implemented for type [${txType}]`);
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

    const newOffset = NulsDataSerializer.write(data, buf, offset);

    if (newOffset > offset) {
      return newOffset;
    }

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
        return TxDataUnregisterSerializer.write(data as ITxDataUnregisterData, buf, offset);

      case TransactionType.ContractCreate:
        return TxDataContractCreateSerializer.write(data as ITxDataContractCreateData, buf, offset);

      case TransactionType.ContractCall:
        return TxDataContractCallSerializer.write(data as ITxDataContractCallData, buf, offset);

      case TransactionType.ContractDelete:
        return TxDataContractDeleteSerializer.write(data as ITxDataContractDeleteData, buf, offset);

      case TransactionType.ContractTransfer:
        return TxDataContractTransferSerializer.write(data as ITxDataContractTransferData, buf, offset);

      default:
        throw new Error(`TxDataSerializer not implemented for type [${txType}]`);
    }

  }

}
