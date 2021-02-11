import {BaseAdapter} from './BaseAdapter';

export class StyleSystemAdapter extends BaseAdapter {
	/**
	 * Initialize StyleSystemAdapter instance.
	 * @constructor
	 */
	constructor() {
		super();
		this.instance = this.getSystem('StyleSystem');
	}

	/**
	 * Get object design system.
	 * @method
	 * @returns {object} current object design system.
	 */
	getCurrentTheme() {
		return this.instance.getCurrentTheme();
	}

	/**
	 * Set CSS variable for DOM element
	 * @method
	 * @param {string} element DOM element.
	 * @param {object} obj Design object.
	 * @param {string} startPrefix Prefix for CSS variable.
	 */
	setVariablesToElement(element, obj, startPrefix = '-') {
		this.instance.setVariablesToElement(element, obj, startPrefix);
	}
}
