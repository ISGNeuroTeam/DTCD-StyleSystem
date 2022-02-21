import {
  InteractionSystemAdapter,
  EventSystemAdapter,
  SystemPlugin,
  LogSystemAdapter,
} from '../../DTCD-SDK/index';

import './../fonts/fonts.css';
import baseComponentList from './base-components/components';
import { version } from './../package.json';

export class StyleSystem extends SystemPlugin {
  static getRegistrationMeta() {
    return {
      version,
      name: 'StyleSystem',
      type: 'core',
      title: 'Дизайн система',
      priority: 3,
      withDependencies: false,
    };
  }

  constructor(guid) {
    super();
    this.guid = guid;
    this.interactionSystem = new InteractionSystemAdapter('0.4.0');
    this.eventSystem = new EventSystemAdapter('0.4.0', guid);
    this.logSystem = new LogSystemAdapter('0.5.0', guid, 'StyleSystem');

    this.eventSystem.registerEvent('ThemeUpdate');
  }

  async init() {
    this.logSystem.info('Initializing system');

    baseComponentList.forEach(component => {
      const { name, baseClass } = component;
      baseClass.guid = this.guid;
      window.customElements.define(name, baseClass);
    });

    try {
      this.logSystem.debug('Requesting design object from endpoint /get-design-objects');
      const { data } = await this.interactionSystem.GETRequest(
        '/mock_server/v1/get-design-objects'
      );
      this.logSystem.debug('Setting themes received from server in system');
      this.themes = data;
      this.logSystem.debug(`Setting ${this.themes[0].name} as default theme in system`);
      this.currentThemeName = this.themes[0].name;
      this.logSystem.info('System inited successfully');
    } catch (err) {
      this.logSystem.fatal(
        `'${err.name}' occured while fetching desing object.${err.message}, ${err.stack}`
      );
    }
  }

  setTheme(name) {
    this.logSystem.debug(`setTheme method called with argument ${name}`);
    if (typeof name === 'string') {
      const theme = this.themes.find(theme => theme.name === name);
      if (theme) {
        this.currentThemeName = name;
        this.logSystem.info(`New theme '${name}' set in system`);
        this.eventSystem.publishEvent('ThemeUpdate');
      } else {
        this.logSystem.warn(`Theme '${name}' doesn't exist in system!`);
        throw new Error('Theme not found!');
      }
    } else {
      this.logSystem.debug(`argument type of '${name}' is not string `);
      throw new Error('Wrong argument type!');
    }
  }

  getThemes() {
    this.logSystem.info(`Returning all themes stored in system`);
    return this.themes;
  }

  getCurrentTheme() {
    this.logSystem.info(`Returning current theme of application`);
    return this.themes.find(theme => theme.name === this.currentThemeName);
  }

  setVariablesToElement(element, obj, startPrefix = '-') {
    const setVariables = (obj, prefix) => {
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object') {
          const newPrefix = `${prefix}-${key}`;
          setVariables(obj[key], newPrefix);
        } else {
          this.logSystem.debug(`setting '${prefix}-${key}' variable value to '${obj[key]}'`);
          element.style.setProperty(`${prefix}-${key}`, obj[key]);
        }
      });
    };
    setVariables(obj.styleVariables, startPrefix);
    this.logSystem.info(
      `CSS variables from theme '${this.currentThemeName}' are installed for element ${element}`
    );
  }
}
