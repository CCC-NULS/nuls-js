import { blockExtendSerializedExample, blockExtendReadExample } from '../__mocks__/examples/blockExtend';
import { BlockExtendSerializer, IBlockExtendData } from '../blockExtend';

describe('BlockSerializer integration tests', () => {

  describe('BlockExtendSerializer', () => {

    const blockBytes = Buffer.from(blockExtendSerializedExample, 'base64');

    it('should read a serialized block header and return an IBlockExtendData object', () => {
      
      const tx: IBlockExtendData = BlockExtendSerializer.read(blockBytes, 0).data;
      
      expect(tx).toEqual(blockExtendReadExample);

    });

    it('should serialize an example of read block header', () => {

      let buf = Buffer.alloc(100000);
      const offset = BlockExtendSerializer.write(blockExtendReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(blockExtendSerializedExample);

    });

    it('should return the size of a serialized block header', () => {

      const blockBytes = Buffer.from(blockExtendSerializedExample, 'base64');
      const size = BlockExtendSerializer.size(blockExtendReadExample);

      expect(size).toEqual(blockBytes.length);

    });

  });

});