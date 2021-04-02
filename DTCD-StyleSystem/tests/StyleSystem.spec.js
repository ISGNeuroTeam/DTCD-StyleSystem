import { StyleSystem } from '../src/StyleSystem';

global.Application = {
  getSystem: sysName => {
    if (sysName == 'EventSystem') {
      return {
        createAndPublish: (arg1, arg2) => {},
      };
    } else if (sysName == 'LogSystem') {
      return {
        info: () => {},
        debug: () => {},
        warn: () => {},
        error: () => {},
        fatal: () => {},
      };
    }
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
  test('returns proper themes array', () => {
    ss.themes = [
      { id: 1, name: 'light' },
      { id: 2, name: 'dark' },
    ];
    expect(ss.getThemes()).toEqual([
      { id: 1, name: 'light' },
      { id: 2, name: 'dark' },
    ]);
  });
});

describe('StyleSystem:getCurrentTheme', () => {
  let ss = new StyleSystem();
  ss.currentThemeName = 'light';
  ss.themes = [
    { id: 1, name: 'light' },
    { id: 2, name: 'dark' },
  ];

  test('should be defined', () => {
    expect(ss.getCurrentTheme).toBeDefined();
  });

  test('returns current theme', () => {
    const currentTheme = { id: 1, name: 'light' };
    expect(ss.getCurrentTheme()).toEqual(currentTheme);
  });

  test('try to compare to another theme', () => {
    const anotherTheme = { id: 2, name: 'dark' };
    expect(ss.getCurrentTheme()).not.toEqual(anotherTheme);
  });
});

describe('StyleSystem:setTheme', () => {
  let ss = new StyleSystem();
  ss.currentThemeName = 'light';
  ss.themes = [
    { id: 1, name: 'light' },
    { id: 2, name: 'dark' },
  ];

  test('should be defined', () => {
    expect(ss.setTheme).toBeDefined();
  });

  test('set existing theme', () => {
    ss.setTheme('dark');
    expect(ss.getCurrentTheme()).toEqual({ id: 2, name: 'dark' });
    expect(ss.currentThemeName).toEqual('dark');
  });

  test('try to set not existing theme', () => {
    expect(() => {
      ss.setTheme('dark123');
    }).toThrow();
  });

  test('try to pass wrong type argument', () => {
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
