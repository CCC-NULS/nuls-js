import { blockHeaderSerializedExample, blockHeaderReadExample } from '../__mocks__/examples/blockHeight';
import { BlockHeaderSerializer, IBlockHeaderData } from '../blockHeader';

describe('BlockSerializer integration tests', () => {

  describe('BlockHeaderSerializer', () => {

    const blockBytes = Buffer.from(blockHeaderSerializedExample, 'base64');

    it('should read a serialized block header and return an IBlockHeaderData object', () => {

      const tx: IBlockHeaderData = BlockHeaderSerializer.read(blockBytes, 0).data;

      expect(tx.preHash).toEqual(blockHeaderReadExample.preHash);
      expect(tx.merkleHash).toEqual(blockHeaderReadExample.merkleHash);
      expect(tx.time).toEqual(blockHeaderReadExample.time);
      expect(tx.height).toEqual(blockHeaderReadExample.height);
      expect(tx.txCount).toEqual(blockHeaderReadExample.txCount);
      expect(tx.extend).toEqual(blockHeaderReadExample.extend);
      expect(tx.signature).toEqual(blockHeaderReadExample.signature);

    });

    it('should serialize an example of read block header', () => {

      let buf = Buffer.alloc(100000);
      const offset = BlockHeaderSerializer.write(blockHeaderReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(blockHeaderSerializedExample);

    });

    it('should return the size of a serialized block header', () => {

      const blockBytes = Buffer.from(blockHeaderSerializedExample, 'base64');
      const size = BlockHeaderSerializer.size(blockHeaderReadExample);

      expect(size).toEqual(blockBytes.length);

    });

  });

});