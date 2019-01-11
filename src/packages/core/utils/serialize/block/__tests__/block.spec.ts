import { blockSerializedExample, blockReadExample } from '../__mocks__/examples/block';
import { BlockSerializer, IBlockData } from '../block';

describe('BlockSerializer integration tests', () => {

  describe('BlockSerializer', () => {

    const blockBytes = Buffer.from(blockSerializedExample, 'base64');

    it('should read a serialized block and return an IBlockData object', () => {

      const tx: IBlockData = BlockSerializer.read(blockBytes, 0).data;

      expect(tx.header).toEqual(blockReadExample.header);
      expect(tx.transactions).toEqual(blockReadExample.transactions);

    });

    it('should serialize an example of read block', () => {

      let buf = Buffer.alloc(100000);
      const offset = BlockSerializer.write(blockReadExample, buf, 0);
      const tx: string = buf.slice(0, offset).toString('base64');

      expect(tx).toEqual(blockSerializedExample);

    });

    it('should return the size of a serialized block', () => {

      const blockBytes = Buffer.from(blockSerializedExample, 'base64');
      const size = BlockSerializer.size(blockReadExample);

      expect(size).toEqual(blockBytes.length);

    });

  });

});