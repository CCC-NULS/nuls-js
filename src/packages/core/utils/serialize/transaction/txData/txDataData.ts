import { VarByteSerializer, IVarByteData, IVarByteOutput } from '../../varByte';

/***
  * ### TxDataData 
  *
  * ### TX_TYPE_DATA
  *
  * | 尺寸   | 字段      | 数据类型  | 说明           |
  * | ---- | ---------- | ------- | -------------- |
  * | ??   | logicData  | byte[]  | business data  |
 */

export type ITxDataDataData = IVarByteData;

export type ITxDataDataOutput = IVarByteOutput;

/**
 * Class to handle the protocol TxDataData type
 */
export class TxDataDataSerializer extends VarByteSerializer {
}