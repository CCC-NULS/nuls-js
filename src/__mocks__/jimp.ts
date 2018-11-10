module.exports = {
	read: jest.fn().mockReturnValue({
		bitmap: {
			height: 2,
			width: 1
		},
		composite: jest.fn().mockReturnValue('bar'),
		getBase64Async: jest.fn().mockReturnValue('baz')
	})
};
