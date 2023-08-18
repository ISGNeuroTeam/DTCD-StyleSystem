import htmlOfCheckbox from './BaseCheckbox.html';
import stylesOfCheckbox from './BaseCheckbox.scss';

import htmOflSwitcher from '../BaseSwitch/BaseSwitch.html';
import stylesOfSwitcher from '../BaseSwitch/BaseSwitch.scss';

export default class BaseCheckbox extends HTMLElement {

  #label;
  #checkbox;

  static get observedAttributes() {
    return ['label', 'checked', 'disabled'];
  }

  constructor() {
    super();

    const { tagName } = this;

    const template = document.createElement('template');
    if (tagName == 'BASE-CHECKBOX') template.innerHTML = htmlOfCheckbox;
    if (tagName == 'BASE-SWITCH') template.innerHTML = htmOflSwitcher; 

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    if (tagName == 'BASE-CHECKBOX') style.appendChild(document.createTextNode(stylesOfCheckbox));
    if (tagName == 'BASE-SWITCH') style.appendChild(document.createTextNode(stylesOfSwitcher)); 
    
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#checkbox = this.shadowRoot.querySelector('.Input');
    
    this.#checkbox.addEventListener('change', this.#handleCheckboxChange);
  }

  get value() {
    return this.#checkbox.value;
  }

  set value(newValue) {
    this.#checkbox.value = newValue;
  }

  get checked() {
    return this.#checkbox.checked;
  }

  set checked(newValue) {
    const oldValue = this.checked;
    this.#checkbox.checked = Boolean(newValue);

    if (oldValue !== Boolean(newValue)) {
      this.dispatchEvent(new Event('change'));
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get label() {
    return this.#label.innerHTML;
  }

  set label(newValue) {
    if (this.tagName === 'BASE-CHECKBOX') {
      this.innerHTML = newValue ? newValue : '';
    }
    if (this.tagName === 'BASE-SWITCH') {
      this.querySelectorAll('[slot="label"]').forEach((label) => {
        label.remove();
      });
  
      if (newValue) {
        this.innerHTML += `<span slot="label">${newValue}</span>`;
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'label': {
        this.label = newValue;
        break;
      }
  
      case 'checked': {
        this.checked = newValue;
        break;
      }

      case 'value': {
        this.value = newValue;
        break;
      }
  
      case 'disabled': {
        this.#checkbox.disabled = this.disabled;
        break;
      }

      default:
        break;
    }
  }

  #handleCheckboxChange = (event) => {
    event.stopPropagation();
    this.dispatchEvent(new Event('change'));
  }
}
