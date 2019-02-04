import { BlockHeader, BlockHex, BlockHash, BlockHeaderObject } from './blockHeader';
import { BlockSerializer, IBlockData } from '../../utils/serialize/block/block';
import { BaseTransaction, TransactionObject, Transaction } from '../transaction';
import { ITransactionData } from '../../utils/serialize/transaction/transaction';
import { TransactionType } from '../../common';

export interface BlockObject {
  hash: string;
  preHash: string;
  merkleHash: string;
  time: number;
  height: number;
  txCount: number;
  consensusMemberCount: number;
  currentVersion?: number;
  delay?: number;
  mainVersion?: number;
  packingIndexOfRound: number;
  percent?: number;
  roundIndex: number;
  roundStartTime: number;
  stateRoot?: string;
  signature: string;
  transactions: TransactionObject[];
}

export class Block {

  protected _header!: BlockHeader;
  protected _transactions!: BaseTransaction[];

  static fromBytes(bytes: string): Block;
  static fromBytes(bytes: Buffer): Block;
  static fromBytes(bytes: Buffer | string): Block {

    if (typeof bytes === 'string') {
      bytes = Buffer.from(bytes, 'base64');
    }

    const block = new Block();
    const rawData: IBlockData = BlockSerializer.read(bytes, 0).data;
    return this._fromRawData(rawData, block);

  }

  static fromRawData(rawData: IBlockData): Block {

    const block = new Block();
    return this._fromRawData(rawData, block);

  }

  protected static _fromRawData<B extends Block>(rawData: IBlockData, block: B): B {

    block._header = BlockHeader.fromRawData(rawData.header);

    const transactions: BaseTransaction[] = [];

    for (let i = 0; i < rawData.header.txCount; i++) {

      const tx: BaseTransaction = Transaction.fromRawData(rawData.transactions[i], block._header.getHeight(), block._header.getMainVersion());
      transactions.push(tx);

    }

    block._transactions = transactions;

    const internalTxCount: number = transactions.reduce(
      (prev: number, curr: BaseTransaction) => prev + (curr.getType() === TransactionType.ContractTransfer ? 1 : 0), 0);

    block._header.setInternalTxCount(internalTxCount);

    return block;

  }

  toBytes(): Buffer {

    const rawData: IBlockData = this.toRawData();
    const bytesLength: number = BlockSerializer.size(rawData);
    const bytes = Buffer.allocUnsafe(bytesLength);
    BlockSerializer.write(rawData, bytes, 0);

    return bytes;

  }

  toRawData(): IBlockData {

    const rawTransactions: ITransactionData[] = [];

    for (let i = 0; i < this._header.getTxCount(); i++) {

      const rawTx: ITransactionData = this._transactions[i].toRawData();
      rawTransactions.push(rawTx);

    }

    return {
      header: this._header.toRawData(),
      transactions: rawTransactions
    };

  }

  toObject(): BlockObject {

    const blockHeader: BlockHeaderObject = this._header.toObject();

    return {
      ...blockHeader,
      transactions: this._transactions.map((tx: BaseTransaction) => tx.toObject()),
    };

  }

  getHash(): BlockHash {
    return this._header.getHash();
  }

  sign(privateKey: string): this {

    this._header.sign(privateKey);
    return this;

  }

  serialize(): BlockHex {

    return this.toBytes().toString('hex');

  }

  size(): number {

    const transactionData: IBlockData = this.toRawData();
    return BlockSerializer.size(transactionData);

  }

}