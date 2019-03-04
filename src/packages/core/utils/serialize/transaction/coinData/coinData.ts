import { IReadData, VarIntSerializer } from '../..';
import { ICoinData, CoinSerializer } from './coin';
import { NulsDataSerializer } from '../../nulsData';

/**
  * ### CoinData
  * https://github.com/nuls-io/nuls/blob/master/core-module/kernel/src/main/java/io/nuls/kernel/model/CoinData.java
  *
  * | Len  | Fields      | Data Type   | Remark             |
  * | ---- | ----------- | ----------- | ------------------ |
  * | ??   | inputsSize  | VarInt      |                    |
  * | ??   | inputs      | Coin[]      | list of coins      |
  * | ??   | outputsSize | VarInt      |                    |
  * | ??   | outputs     | Coin[]      | list of coins      |
  * 
 */
export type CoinDataData = ICoinDataData | null;

export interface ICoinDataData {
  inputs: ICoinData[];
  outputs: ICoinData[];
}

export interface ICoinDataOutput extends IReadData {
  data: CoinDataData;
};

/**
 * Class to handle the protocol CoinData type
 * https://github.com/nuls-io/nuls/blob/master/core-module/kernel/src/main/java/io/nuls/kernel/model/CoinData.java
 */
export class CoinDataSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized coinData
   */
  public static size(data: CoinDataData): number {

    if (data === null || data === undefined) {

      return NulsDataSerializer.size(data);

    } else {

      let size: number = 0;

      size += VarIntSerializer.size(data.inputs.length);
      for (const input of data.inputs) {
        size += CoinSerializer.size(input);
      }

      size += VarIntSerializer.size(data.outputs.length);
      for (const output of data.outputs) {
        size += CoinSerializer.size(output);
      }

      return size;

    }

  }

  /**
   * Reads a coinData from buf at the specified offset
   * @param buf Buffer object from where the number will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): ICoinDataOutput {

    const nulsData = NulsDataSerializer.read(buf, offset);

    if (nulsData.readBytes > 0) {

      return {
        readBytes: nulsData.readBytes,
        data: null
      };

    } else {

      const initialOffset = offset;

      const { data: inputLength, readBytes } = VarIntSerializer.read(buf, offset);
      offset += readBytes;

      const inputs: ICoinData[] = [];
      for (let i = 0; i < inputLength; i++) {
        const { data: input, readBytes: inputReadBytes } = CoinSerializer.read(buf, offset);
        offset += inputReadBytes;
        inputs.push(input);
      }

      const { data: outputLength, readBytes: readBytes2 } = VarIntSerializer.read(buf, offset);
      offset += readBytes2;

      const outputs: ICoinData[] = [];
      for (let i = 0; i < outputLength; i++) {
        const { data: output, readBytes: outputReadBytes } = CoinSerializer.read(buf, offset);
        offset += outputReadBytes;
        outputs.push(output);
      }

      return {
        readBytes: offset - initialOffset,
        data: {
          inputs,
          outputs
        }
      };

    }

  }

  /**
   * Writes value to buf at the specified offset
   * @param data CoinData to be written to buf
   * @param buf Buffer object where the number will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: CoinDataData, buf: Buffer, offset: number): number {

    if (data === null || data === undefined) {

      return NulsDataSerializer.write(data, buf, offset);

    } else {

      offset = VarIntSerializer.write(data.inputs.length, buf, offset);
      for (const input of data.inputs) {
        offset = CoinSerializer.write(input, buf, offset);
      }

      offset = VarIntSerializer.write(data.outputs.length, buf, offset);
      for (const output of data.outputs) {
        offset = CoinSerializer.write(output, buf, offset);
      }

    }

    return offset;

  }

}
