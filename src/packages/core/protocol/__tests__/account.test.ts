import { Account, AddressType, ChainIdType } from '../account';

jest.unmock('crypto');
jest.unmock('secp256k1');

describe('Account integration tests', () => {

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('import an account with password', () => {

    const a = Account.import('35fded6e38ffafbe8e0d53e4289d6543b79a1c636e9bdc41be9ef0e8cd3588c137688ec8b8cde616de4c2cd45a9bcf70', '123password', AddressType.Default, ChainIdType.Testnet);
    expect(a.toObject().privateKey).toEqual('cacc494fc3fbdac39e6991b31694aee89c96894a917015b8baa27d2b21010b5b');
    expect(a.toObject().address).toEqual('TTavFTDgdQNeYgVQBaNTF6SeK54nswH5');

  });
});
