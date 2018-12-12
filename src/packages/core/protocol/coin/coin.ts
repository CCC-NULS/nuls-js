import { Address } from '../../utils/crypto';

export class Coin {

  constructor(
    public na: number,
    public lockTime: number,
    public owner?: string
  ) { }

}

export class CoinInput extends Coin {

  constructor(
    public fromHash: string,
    public fromIndex: number,
    na: number,
    lockTime: number,
    owner?: string
  ) {
    super(na, lockTime, owner);
  }

}

export class CoinOutput extends Coin {

  constructor(
    public address: Address,
    na: number,
    lockTime: number,
    owner?: string
  ) {
    super(na, lockTime, owner);
  }

}