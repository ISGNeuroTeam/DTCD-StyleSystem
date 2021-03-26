import {StyleSystem} from '../src/StyleSystem';

global.Application = {
	getSystem: sysName => {
		return {
			createAndPublish: (arg1, arg2) => {},
		};
	},
};

describe('StyleSystem:getRegistrationMeta', () => {
	test('should be defined', () => {
		expect(StyleSystem.getRegistrationMeta).toBeDefined();
	});
});

describe('StyleSystem:getThemes', () => {
	let ss = new StyleSystem();
	test('should be defined', () => {
		expect(ss.getThemes).toBeDefined();
	});
	test('returns proper themes array', async () => {
		ss.interactionSystem.GETRequest = jest.fn(url => {
			return {
				data: [
					{id: 1, name: 'light'},
					{id: 2, name: 'dark'},
				],
			};
		});
		expect(await ss.getThemes()).toEqual(expect.any(Array));
	});
});

describe('StyleSystem:getCurrentTheme', () => {
	let ss = new StyleSystem();
	ss.interactionSystem.GETRequest = jest.fn(url => {
		return {
			data: [
				{id: 1, name: 'light'},
				{id: 2, name: 'dark'},
			],
		};
	});

	beforeEach(async () => {
		await ss.getThemes();
	});

	test('should be defined', () => {
		expect(ss.getCurrentTheme).toBeDefined();
	});

	test('returns current theme', async () => {
		const currentTheme = {id: 1, name: 'light'};
		expect(ss.getCurrentTheme()).toEqual(currentTheme);
	});

	test('try to compare to another theme', async () => {
		const anotherTheme = {id: 2, name: 'dark'};
		expect(ss.getCurrentTheme()).not.toEqual(anotherTheme);
	});
});

describe('StyleSystem:setTheme', () => {
	let ss = new StyleSystem();
	ss.interactionSystem.GETRequest = jest.fn(url => {
		return {
			data: [
				{id: 1, name: 'light'},
				{id: 2, name: 'dark'},
			],
		};
	});

	beforeEach(async () => {
		await ss.getThemes();
	});

	test('should be defined', () => {
		expect(ss.setTheme).toBeDefined();
	});

	test('set existing theme', async () => {
		ss.setTheme('dark');
		expect(ss.getCurrentTheme()).toEqual({id: 2, name: 'dark'});
		expect(ss.currentThemeName).toEqual('dark');
	});

	test('try to set not existing theme', async () => {
		expect(() => {
			ss.setTheme('dark123');
		}).toThrow();
	});

	test('try to pass wrong type argument', async () => {
		expect(() => {
			ss.setTheme({});
		}).toThrow();
		expect(() => {
			ss.setTheme(1);
		}).toThrow();
		expect(() => {
			ss.setTheme(null);
		}).toThrow();
		expect(() => {
			ss.setTheme([]);
		}).toThrow();
	});
});
