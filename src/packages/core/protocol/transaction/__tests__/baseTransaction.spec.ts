import { Transaction } from '../transaction';
import { BaseTransaction } from '../baseTransaction';
import { BlockVersion } from '../../../common';

describe('BaseTransaction integration tests', () => {

  describe('::getHash()', () => {

    it('should produce a valid hash for mainnet version >= 2 (by default)', () => {

      const newTxBytes: Buffer = Buffer.from('AQAwFOnsZgEA/////wACFwUBAcwF/3oBFSS7Fl6ApWAIlmAgdHYoOMk6AAAAAACMCgEAAAAXBQEBylR/9QDCZ0wxtYW5PVlDE4lKjcuAwRgAAAAAAIwKAQAAAAA=', 'base64');
      const newTxHash: string = '0020f558cc32e2480aea8d9995f8df7cfb191a222d71fe1abf8197ec54381a518fbc';

      const transaction: BaseTransaction = Transaction.fromBytes(newTxBytes);
      expect(transaction.getHash()).toEqual(newTxHash);

    });

    it('should produce a valid hash for mainnet version < 2', () => {

      const oldTxBytes: Buffer = Buffer.from('AQCQyfvnZgEA/////wAAAA==', 'base64');
      const oldTxHash: string = '0020d2201ca2e6fa87c35540a9f336f7c1f49b2f11c01222091763550f42e8222e86';

      const transaction: BaseTransaction = Transaction.fromBytes(oldTxBytes, -1, BlockVersion.NotDefined);
      expect(transaction.getHash()).toEqual(oldTxHash);

    });

    it('should produce a valid hash when coinData is empty (yellow card tx)', () => {

      const txBytes: Buffer = Buffer.from('BwBQJGeraAEAAQUBAckF+4vmtqFM+1k/+5hQs1XOG+2m/////wA=', 'base64');
      const txHash: string = '0020d974ab5b0d098a7fc15a1b54071c5e4a56dfe5fdd53f61195f2a99189ca17172';

      const transaction: BaseTransaction = Transaction.fromBytes(txBytes);
      expect(transaction.getHash()).toEqual(txHash);

    });

  });

});