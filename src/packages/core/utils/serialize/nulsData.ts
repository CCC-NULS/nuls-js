import { IReadData, PLACE_HOLDER } from './common';

/**
  * ### NulsData
  * Checks if the serialized data is null and reads / writes a placeholder
  *
 */

export type INulsDataData = Buffer | null;

export interface INulsDataOutput extends IReadData {
  readBytes: number;
  data: INulsDataData;
}

/**
 * Class to handle if the serialized data is null
 */
export class NulsDataSerializer {

  /**
   * Size of the serialized data
   * @returns the bytes size of a serialized NulsData
   */
  public static size(data: any): number {

    const isPlaceholder: boolean = (data === null || data === undefined);

    return isPlaceholder ? PLACE_HOLDER.length : 0;

  }

  /**
   * Reads a nulsData from buf at the specified offset
   * @param buf Buffer object from where the bytes will be read
   * @param offset Number of bytes to skip before starting to read
   */
  public static read(buf: Buffer, offset: number): INulsDataOutput {

    const isPlaceholder: boolean = (buf === null || buf === undefined) || buf.length === offset || JSON.stringify(buf.slice(offset, offset + 4)) === JSON.stringify(PLACE_HOLDER);

    return {
      readBytes: isPlaceholder ? 4 : 0,
      data: isPlaceholder ? PLACE_HOLDER : null
    };

  }

  /**
   * Writes data to buf at the specified offset
   * @param data Buffer of bytes to be written to buf
   * @param buf Buffer object where the bytes will be written
   * @param offset Number of bytes to skip before starting to write.
   * @returns Offset plus the number of bytes that has been written
   */
  public static write(data: any, buf: Buffer, offset: number): number {

    if (data === null || data === undefined) {

      PLACE_HOLDER.copy(buf, offset);
      return offset + PLACE_HOLDER.length;

    } else {

      return offset;

    }

  }

}
