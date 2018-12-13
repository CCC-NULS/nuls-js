import { Address } from './../../utils/crypto';
import { ICoinDataData } from '../../utils/serialize/transaction/coinData/coinData';
import { ICoinData } from '../../utils/serialize/transaction/coinData/coin';
import { CoinOwnerUtils, ICoinOwnerData } from '../../utils/coinOwner';
import { CoinInput, CoinOutput } from './coin';

export class CoinData {

  private inputs!: CoinInput[];
  private outputs!: CoinOutput[];

  static fromRawData(rawData: ICoinDataData): CoinData {

    let coinData = new CoinData();

    rawData.inputs.forEach((input: ICoinData) => {

      const ownerData: ICoinOwnerData = CoinOwnerUtils.parse(input.owner);

      if (ownerData.fromHash && ownerData.fromIndex) {

        coinData.addInput(ownerData.fromHash, ownerData.fromIndex, input.na, input.lockTime);

      }

    });

    rawData.outputs.forEach((ouput: ICoinData) => {

      const ownerData: ICoinOwnerData = CoinOwnerUtils.parse(ouput.owner);

      if (ownerData.address) {

        coinData.addOutput(ownerData.address, ouput.na, ouput.lockTime);

      }

    });

    return coinData;

  }

  static toRawData(coinData: CoinData): ICoinDataData {

    let rawData: ICoinDataData = {
      inputs: [],
      outputs: []
    };

    coinData.inputs.forEach((input: CoinInput) => {

      if (input.fromHash && input.fromIndex) {

        const owner: Buffer = CoinOwnerUtils.create(input);

        rawData.inputs.push({
          owner,
          na: input.na,
          lockTime: input.lockTime,
        });

      }

    });

    coinData.outputs.forEach((ouput: CoinOutput) => {

      if (ouput.address) {

        const owner: Buffer = CoinOwnerUtils.create(ouput);

        rawData.outputs.push({
          owner,
          na: ouput.na,
          lockTime: ouput.lockTime,
        });

      }

    });

    return rawData;

  }

  static fromUTXO(utxo: any) {

    return new CoinData();

  }

  addOutput(address: Address, value: number, lockTime: number = -1) {

    this.outputs.push(new CoinOutput(address, value, lockTime));

  }

  addInput(fromHash: string, fromIndex: number, value: number, lockTime: number = -1) {

    this.inputs.push(new CoinInput(fromHash, fromIndex, value, lockTime));

  }

  // https://github.com/nuls-io/nuls/blob/6e22e5ba554fae9e690faaa3797cdddb49f90c44/core-module/kernel/src/main/java/io/nuls/kernel/model/CoinData.java#L139
  getFee() {

    const inputs = this.inputs.reduce((prev: number, curr: CoinInput) => prev + curr.na, 0);
    const outputs = this.outputs.reduce((prev: number, curr: CoinOutput) => prev + curr.na, 0);

    return inputs - outputs;

  }

}