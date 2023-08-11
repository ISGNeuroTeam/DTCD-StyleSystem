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
    console.log(tagName);

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
    return this.#checkbox.checked;
  }

  set value(newValue) {
    console.log(newValue);
    const oldValue = this.value;
    this.#checkbox.checked = Boolean(newValue);

    if (oldValue !== Boolean(newValue)) {
      this.dispatchEvent(new Event('change'));
    }
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value) {
    if (value) this.setAttribute('checked', true);
    else this.removeAttribute('checked');
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

  set label(value) {
    if (value) this.setAttribute('label', value);
    else this.removeAttribute('label');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'label': {
        this.#label.innerHTML = newValue ? newValue : '';
        break;
      }
  
      case 'checked': {
        this.value = newValue ? true : false;
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
    this.checked = event.target.checked;
    this.dispatchEvent(new Event('change'));
  }
}
