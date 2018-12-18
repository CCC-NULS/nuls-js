import { CoinSerializer, ICoinData } from './../../utils/serialize/transaction/coinData/coin';
import { Address } from '../../utils/crypto';
import { CoinOwnerUtils, ICoinOwnerData } from '../../utils/coinOwner';

export class Coin {

  constructor(
    public na: number,
    public lockTime: number = -1
  ) { }

}

export class CoinInput extends Coin {

  static fromRawData(rawData: ICoinData): CoinInput {

    const ownerData: ICoinOwnerData = CoinOwnerUtils.parse(rawData.owner);

    if (ownerData.fromHash && ownerData.fromIndex) {

      return new CoinInput(ownerData.fromHash, ownerData.fromIndex, rawData.na, rawData.lockTime);

    } else {

      throw new Error('Error parsing CoinInput owner');

    }

  }

  static toRawData(coin: CoinInput): ICoinData {

    const owner: Buffer = CoinOwnerUtils.create(coin);

    return {
      owner,
      na: coin.na,
      lockTime: coin.lockTime,
    };

  }

  constructor(
    public fromHash: string,
    public fromIndex: number,
    na: number,
    lockTime: number = -1
  ) {
    super(na, lockTime);
  }

  size(): number {

    const data = CoinInput.toRawData(this);
    return CoinSerializer.size(data);

  }

}

export class CoinOutput extends Coin {

  static fromRawData(rawData: ICoinData): CoinOutput {

    const ownerData: ICoinOwnerData = CoinOwnerUtils.parse(rawData.owner);

    if (ownerData.address) {

      return new CoinOutput(ownerData.address, rawData.na, rawData.lockTime);

    } else {

      throw new Error('Error parsing CoinOutput owner');

    }

  }

  static toRawData(coin: CoinOutput): ICoinData {

    const owner: Buffer = CoinOwnerUtils.create(coin);

    return {
      owner,
      na: coin.na,
      lockTime: coin.lockTime,
    };

  }

  constructor(
    public address: Address,
    na: number,
    lockTime: number = -1
  ) {
    super(na, lockTime);
  }

  size(): number {

    const data = CoinOutput.toRawData(this);
    return CoinSerializer.size(data);

  }

}