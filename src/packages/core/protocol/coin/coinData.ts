import { Address } from './../../utils/crypto';
import { ICoinDataData } from '../../utils/serialize/transaction/coinData/coinData';
import { ICoinData } from '../../utils/serialize/transaction/coinData/coin';
import { CoinInput, CoinOutput, CoinInputObject, CoinOutputObject, Coin } from './coin';

export interface CoinDataObject {
  inputs: CoinInputObject[];
  outputs: CoinOutputObject[];
}

export class CoinData {

  protected _inputs: CoinInput[] = [];
  protected _outputs: CoinOutput[] = [];

  static toObject(coinData: CoinData): CoinDataObject {

    return {
      inputs: coinData._inputs.map((input: CoinInput) => input.toObject()),
      outputs: coinData._outputs.map((output: CoinOutput) => output.toObject()),
    };

  }

  static fromRawData(rawData: ICoinDataData): CoinData {

    let coinData = new CoinData();

    rawData.inputs.forEach((inputRawData: ICoinData) => {

      const input: CoinInput = CoinInput.fromRawData(inputRawData);
      coinData._inputs.push(input);

    });

    rawData.outputs.forEach((outputRawData: ICoinData) => {

      const output: CoinOutput = CoinOutput.fromRawData(outputRawData);
      coinData._outputs.push(output);

    });

    return coinData;

  }

  static toRawData(coinData: CoinData): ICoinDataData {

    let rawData: ICoinDataData = {
      inputs: [],
      outputs: []
    };

    coinData._inputs.forEach((input: CoinInput) => {

      const inputRawData: ICoinData = CoinInput.toRawData(input);
      rawData.inputs.push(inputRawData);

    });

    coinData._outputs.forEach((output: CoinOutput) => {

      const outputRawData: ICoinData = CoinOutput.toRawData(output);
      rawData.outputs.push(outputRawData);

    });

    return rawData;

  }

  addOutput(output: CoinOutput): number;
  addOutput(address: Address, value: number, lockTime?: number): number;
  addOutput(address: Address | CoinOutput, value?: number, lockTime?: number): number {

    let output: CoinOutput = address instanceof CoinOutput
      ? address
      : new CoinOutput(address, value as number, lockTime as number)

    this._outputs.push(output);
    this.orderCoins(this._outputs);
    return this._outputs.indexOf(output);

  }
  
  addInput(input: CoinInput): number;
  addInput(fromHash: string, fromIndex: number, value: number, lockTime?: number): number;
  addInput(fromHash: string | CoinInput, fromIndex?: number, value?: number, lockTime?: number): number {

    let input: CoinInput = fromHash instanceof CoinInput
      ? fromHash
      : new CoinInput(fromHash, fromIndex as number, value as number, lockTime as number)

    this._inputs.push(input);
    this.orderCoins(this._inputs);
    return this._inputs.indexOf(input);

  }

  // Outputs should be ordered by lockTime
  orderCoins(coins: Coin[]) {
    coins.sort((a: Coin, b: Coin) => a.lockTime - b.lockTime);
  }

  getInputsTotalValue(): number {

    return this._inputs.reduce((prev: number, curr: CoinInput) => prev + curr.na, 0);

  }

  getOutputsTotalValue(): number {

    return this._outputs.reduce((prev: number, curr: CoinOutput) => prev + curr.na, 0);

  }

  // https://github.com/nuls-io/nuls/blob/6e22e5ba554fae9e690faaa3797cdddb49f90c44/core-module/kernel/src/main/java/io/nuls/kernel/model/CoinData.java#L139
  getFee(): number {

    const inputs = this.getInputsTotalValue();
    const outputs = this.getOutputsTotalValue();

    return inputs - outputs;

  }

  inputs(inputs: CoinInput[]) {
    this._inputs = inputs;
  }

  outputs(outputs: CoinOutput[]) {
    this._outputs = outputs;
  }

  getUnspent(): number {
    return this.getFee();
  }

  getInputs(): CoinInput[] {
    return this._inputs;
  }

  getOutputs(): CoinOutput[] {
    return this._outputs;
  }

  removeInput(index?: number): void;
  removeInput(item?: CoinInput): void;
  removeInput(arg: number | CoinInput | undefined): void {

    if (arg !== undefined) {

      let index: number = typeof arg !== 'number'
        ? this._inputs.indexOf(arg)
        : arg;

      this._inputs.splice(index, 1);

    }

  }

  removeOutput(index?: number): void;
  removeOutput(item?: CoinOutput): void;
  removeOutput(arg: number | CoinOutput | undefined): void {

    if (arg !== undefined) {

      let index: number = typeof arg !== 'number'
        ? this._outputs.indexOf(arg)
        : arg;

      this._outputs.splice(index, 1);

    }

  }

  toObject(): CoinDataObject {
    return CoinData.toObject(this);
  }

}