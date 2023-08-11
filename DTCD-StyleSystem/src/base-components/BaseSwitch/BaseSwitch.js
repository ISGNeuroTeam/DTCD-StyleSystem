import html from './BaseSwitch.html';
import styles from './BaseSwitch.scss';
import BaseCheckbox from '../BaseCheckbox/BaseCheckbox';

export default class BaseSwitch extends BaseCheckbox {}

class _BaseSwitch extends HTMLElement {

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

    this.#checkbox.addEventListener('change', this.#handleCheckboxChange);

  }

  get value() {
    return this.#checkbox.checked;
  }

  set value(newValue) {
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
    this.querySelectorAll('[slot="label"]').forEach((label) => {
      label.remove();
    });

    if (value) {
      this.innerHTML += `<span slot="label">${value}</span>`;
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'label': {
        this.label = newValue;
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

  #handleCheckboxChange = event => {
    event.stopPropagation();
    this.checked = event.target.checked;
    this.dispatchEvent(new Event('change'));
  };
}
