import { IReadedData, VarIntSerializer } from '..';
import { ICoinData, CoinSerializer } from './coin';

/***
  * ### CoinData
  * https://github.com/nuls-io/nuls/blob/master/core-module/kernel/src/main/java/io/nuls/kernel/model/CoinData.java
  *
  * | Len  | Fields     | Data Type   | Remark             |
  * | ---- | ---------- | ----------- | ------------------ |
  * | ??   | inputs     | Coin[]      | list of coins      |
  * | ??   | outputs    | Coin[]      | list of coins      |
  * 
 */
export interface ICoinDataData {
  inputs: ICoinData[];
  outputs: ICoinData[];
}

export interface ICoinDataOutput extends IReadedData {
  data: ICoinDataData;
};

/**
 * Class to handle the protocol CoinData type
 * https://github.com/nuls-io/nuls/blob/master/core-module/kernel/src/main/java/io/nuls/kernel/model/CoinData.java
 */
export class CoinDataSerializer {

  /**
   * Reads a coinData from buf at the specified offset
   * @param buf Buffer object from where the number will be readed
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ICoinDataOutput {

    const initialOffset = offset;

    const { data: inputLength, readedBytes } = VarIntSerializer.read(buf, offset);
    offset += readedBytes;
    
    const inputs: ICoinData[] = [];
    for (let i = 0; i < inputLength; i++) {
      const { data: input, readedBytes: inputReadedBytes } = CoinSerializer.read(buf, offset);
      offset += inputReadedBytes;
      inputs.push(input);
    }

    const { data: outputLength, readedBytes: readedBytes2 } = VarIntSerializer.read(buf, offset);
    offset += readedBytes2;

    const outputs: ICoinData[] = [];
    for (let i = 0; i < outputLength; i++) {
      const { data: output, readedBytes: outputReadedBytes } = CoinSerializer.read(buf, offset);
      offset += outputReadedBytes;
      outputs.push(output);
    }

    return {
      readedBytes: offset - initialOffset,
      data: {
        inputs,
        outputs
      }
    };

  }

  /**
   * Writes value to buf at the specified offset
   * @param data CoinData to be written to buf
   * @param buf Buffer object where the number will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns The number of bytes that has been written
   */
  public static write(data: ICoinDataData, buf: Buffer, offset: number): number {

    const initialOffset = offset;

    offset += VarIntSerializer.write(data.inputs.length, buf, offset);
    for (const input of data.inputs) {
      offset += CoinSerializer.write(input, buf, offset);
    }

    offset += VarIntSerializer.write(data.outputs.length, buf, offset);
    for (const output of data.inputs) {
      offset += CoinSerializer.write(output, buf, offset);
    }

    return offset - initialOffset;

  }

}
