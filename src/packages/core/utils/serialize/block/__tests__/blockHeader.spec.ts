import { blockHeaderSerializedExample, blockHeaderReadExample } from '../__mocks__/examples/blockHeader';
import { BlockHeaderSerializer, IBlockHeaderData } from '../blockHeader';

describe('BlockSerializer integration tests', () => {

  describe('BlockHeaderSerializer', () => {

    const blockBytes = Buffer.from(blockHeaderSerializedExample, 'base64');

    it('should read a serialized block header and return an IBlockHeaderData object', () => {

      const blockHeader: IBlockHeaderData = BlockHeaderSerializer.read(blockBytes, 0).data;

      expect(blockHeader.preHash).toEqual(blockHeaderReadExample.preHash);
      expect(blockHeader.merkleHash).toEqual(blockHeaderReadExample.merkleHash);
      expect(blockHeader.time).toEqual(blockHeaderReadExample.time);
      expect(blockHeader.height).toEqual(blockHeaderReadExample.height);
      expect(blockHeader.txCount).toEqual(blockHeaderReadExample.txCount);
      expect(blockHeader.extend).toEqual(blockHeaderReadExample.extend);
      expect(blockHeader.signature).toEqual(blockHeaderReadExample.signature);

    });

    it('should serialize an example of read block header', () => {

      let buf = Buffer.alloc(100000);
      const offset = BlockHeaderSerializer.write(blockHeaderReadExample, buf, 0);
      const blockHeader: string = buf.slice(0, offset).toString('base64');

      expect(blockHeader).toEqual(blockHeaderSerializedExample);

    });

    it('should return the size of a serialized block header', () => {

      const blockBytes = Buffer.from(blockHeaderSerializedExample, 'base64');
      const size = BlockHeaderSerializer.size(blockHeaderReadExample);

      expect(size).toEqual(blockBytes.length);

    });

  });

});