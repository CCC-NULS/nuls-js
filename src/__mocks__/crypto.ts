// const mockDigestFn = jest.fn().mockReturnValue('hello world');
// const mockUpdateFn = jest.fn();

// export const mockPlaySoundFile = jest.fn();
// const mock = jest.fn().mockImplementation(() => {
// 	return {playSoundFile: mockPlaySoundFile};
// });
//
// export default mock;
// module.exports = {
// 	sha256: jest.fn(() =>
// 	{
// 		return {
// 			update: jest.fn(() =>
// 			{
// 				return {
// 					digest: mockDigestFn
// 				};
// 			})
// 		};
// 	})
// };

module.exports = {
	randomBytes: jest.fn().mockReturnValue(Buffer.from('889bba933b77da1360e1fc6314552f3d777a099cca82dcf594c6f3e3287b3c97', 'hex'))
};
