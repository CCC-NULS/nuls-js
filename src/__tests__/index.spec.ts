// import pink, { calc } from '@/pink';
import * as client from '@/index';

// test('pink is foo', () =>
// {
// 	expect(pink).toBe('foo');
// });

// test('core description text', () =>
// {
// 	expect(client.moduleDescription).toBe('core description');
// });

test('core name text', () =>
{
	expect(client.moduleName).toBe('core');
});

test('calc', () =>
{
	expect(client.calc(1)).toBe(2);
	expect(client.calc(2)).toBe(3);
	expect(client.calc(1 + 2)).toBe(4);
	expect(client.calc(parseInt('a', 10))).toBe(NaN);
});
