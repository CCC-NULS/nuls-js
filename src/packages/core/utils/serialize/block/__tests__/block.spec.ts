import { blockSerializedExample2, blockReadExample2 } from './../__mocks__/examples/block';
import { blockSerializedExample, blockReadExample } from '../__mocks__/examples/block';
import { BlockSerializer, IBlockData } from '../block';

describe('BlockSerializer integration tests', () => {

  describe('BlockSerializer', () => {

    const blockBytes = Buffer.from(blockSerializedExample, 'base64');
    const blockBytes2 = Buffer.from(blockSerializedExample2, 'base64');

    it('should read a serialized block and return an IBlockData object', () => {

      const block: IBlockData = BlockSerializer.read(blockBytes, 0).data;

      expect(block.header).toEqual(blockReadExample.header);
      expect(block.transactions).toEqual(blockReadExample.transactions);

    });

    it('should serialize an example of read block', () => {

      let buf = Buffer.alloc(100000);
      const offset = BlockSerializer.write(blockReadExample, buf, 0);
      const block: string = buf.slice(0, offset).toString('base64');

      expect(block).toEqual(blockSerializedExample);

    });

    it('should read a serialized block 2 and return an IBlockData object', () => {

      const block: IBlockData = BlockSerializer.read(blockBytes2, 0).data;

      expect(block.header).toEqual(blockReadExample2.header);
      expect(block.transactions).toEqual(blockReadExample2.transactions);

    });

    it('should serialize an example of read block 2', () => {

      let buf = Buffer.alloc(100000);
      const offset = BlockSerializer.write(blockReadExample2, buf, 0);
      const block: string = buf.slice(0, offset).toString('base64');

      expect(block).toEqual(blockSerializedExample2);

    });

    it('should return the size of a serialized block', () => {

      const blockBytes = Buffer.from(blockSerializedExample, 'base64');
      const size = BlockSerializer.size(blockReadExample);

      expect(size).toEqual(blockBytes.length);

    });

    it('should return the size of a serialized block 2', () => {

      const blockBytes = Buffer.from(blockSerializedExample2, 'base64');
      const size = BlockSerializer.size(blockReadExample2);

      expect(size).toEqual(blockBytes.length);

    });

  });

});