import { Address } from './../../utils/crypto';
import { ICoinDataData } from '../../utils/serialize/transaction/coinData/coinData';
import { ICoinData } from '../../utils/serialize/transaction/coinData/coin';
import { CoinInput, CoinOutput } from './coin';

export class CoinData {

  public inputs: CoinInput[] = [];
  public outputs: CoinOutput[] = [];

  static fromRawData(rawData: ICoinDataData): CoinData {

    let coinData = new CoinData();

    rawData.inputs.forEach((inputRawData: ICoinData) => {

      const input: CoinInput = CoinInput.fromRawData(inputRawData);
      coinData.inputs.push(input);

    });

    rawData.outputs.forEach((outputRawData: ICoinData) => {

      const output: CoinOutput = CoinOutput.fromRawData(outputRawData);
      coinData.outputs.push(output);

    });

    return coinData;

  }

  static toRawData(coinData: CoinData): ICoinDataData {

    let rawData: ICoinDataData = {
      inputs: [],
      outputs: []
    };

    coinData.inputs.forEach((input: CoinInput) => {

      const inputRawData: ICoinData = CoinInput.toRawData(input);
      rawData.inputs.push(inputRawData);

    });

    coinData.outputs.forEach((output: CoinOutput) => {

      const outputRawData: ICoinData = CoinOutput.toRawData(output);
      rawData.outputs.push(outputRawData);

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