export const privateKeyVerify = jest.fn().mockReturnValue(true);
export const publicKeyCreate = jest.fn().mockReturnValue(Buffer.from('02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b', 'hex'));
export const sign = jest.fn().mockReturnValue({ signature: 'foo' });
export const verify = jest.fn().mockReturnValue('bar');
