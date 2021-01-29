import {InteractionSystemAdapter, EventSystemAdapter, SystemPlugin} from './../../DTCD-SDK/index';
export class Plugin extends SystemPlugin {
	static getRegistrationMeta() {
		return {
			name: 'StyleSystem',
			type: 'core',
			title: 'Дизайн система',
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
		try {
			this.getCurrentTheme(name);
			this.currentThemeName = name;
			this.eventSystem.createAndPublish(this.guid, 'ThemeUpdate');
		} catch (err) {
			console.error(`Theme: ${name} doesn't exist`);
			console.error(err);
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
