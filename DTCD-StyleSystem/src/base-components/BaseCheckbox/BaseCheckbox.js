import html from './BaseCheckbox.html';
import styles from './BaseCheckbox.scss';

export default class BaseCheckbox extends HTMLElement {

  #label;
  #checkbox;

  static get observedAttributes() {
    return ['label', 'checked', 'disabled'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));
    
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#checkbox = this.shadowRoot.querySelector('.Input');

    this.value = false;
  }

  get value() {
    return this.#checkbox.checked;
  }

  set value(val) {
    this.#checkbox.checked = Boolean(val);
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value) {
    if (value) this.setAttribute('checked', '');
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
        this.#checkbox.checked = this.checked;
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
}
