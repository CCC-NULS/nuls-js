module.exports = {
	privateKeyVerify: jest.fn().mockReturnValue(true),
	publicKeyCreate: jest.fn().mockReturnValue(Buffer.from('02d772f1649c142494483e358b915573f5ba1573c71951117fc9a7db804fc3e64b', 'hex')),
	sign: jest.fn().mockReturnValue('foo'),
	verify: jest.fn().mockReturnValue('bar')
};
