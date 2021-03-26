import {InteractionSystemAdapter, EventSystemAdapter, SystemPlugin} from '../../DTCD-SDK/index';

export class StyleSystem extends SystemPlugin {
	static getRegistrationMeta() {
		return {
			name: 'StyleSystem',
			type: 'core',
			title: 'Дизайн система',
			version: '0.2.0',
			priority: 3,
			withDependencies: false,
		};
	}

	constructor(guid) {
		super();
		this.guid = guid;
		this.interactionSystem = new InteractionSystemAdapter();
		this.eventSystem = new EventSystemAdapter();
		this.currentThemeName = 'light';
	}

	setTheme(name) {
		if (typeof name === 'string') {
			const theme = this.themes.find(theme => theme.name === name);
			if (theme) {
				this.currentThemeName = name;
				this.eventSystem.createAndPublish(this.guid, 'ThemeUpdate');
			} else {
				console.error(`Theme: ${name} doesn't exist`);
				throw new Error('Theme not found!');
			}
		} else {
			throw new Error('Wrong argument type!');
		}
	}

	async getThemes() {
		const {data} = await this.interactionSystem.GETRequest('/get-design-objects');
		this.themes = data;
		return data;
	}

	getCurrentTheme() {
		return this.themes.find(theme => theme.name === this.currentThemeName);
	}

	setVariablesToElement(element, obj, startPrefix = '-') {
		function setVariables(obj, prefix) {
			Object.keys(obj).forEach(key => {
				if (typeof obj[key] === 'object') {
					const newPrefix = `${prefix}-${key}`;
					setVariables(obj[key], newPrefix);
				} else {
					element.style.setProperty(`${prefix}-${key}`, obj[key]);
				}
			});
		}
		setVariables(obj.styleVariables, startPrefix);
	}
}
