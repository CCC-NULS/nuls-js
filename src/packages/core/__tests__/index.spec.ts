import * as core from '@/packages/core/';

test('core name text', () =>
{
	expect(core.moduleName).toBe('core');
});

test('calc', () =>
{
	expect(core.calc(1)).toBe(2);
	expect(core.calc(2)).toBe(3);
	expect(core.calc(1 + 2)).toBe(4);
	expect(core.calc(parseInt('a', 10))).toBe(NaN);
});
