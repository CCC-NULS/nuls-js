// import 'jest';

(process as any).browser = false;
process.env.NODE_ENV = 'test';

global.console = {
	debug: jest.fn(),
	error: jest.fn(),
	info: jest.fn(),
	log: jest.fn()
} as any;
