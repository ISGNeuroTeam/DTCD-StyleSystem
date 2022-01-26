import html from './BaseCheckbox.html';

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

    this.#label = this.shadowRoot.querySelector('#label');
    this.#checkbox = this.shadowRoot.querySelector('input');

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

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'label') {
      this.#label.textContent = newValue ? newValue : '';
    }

    if (attrName === 'checked') {
      this.#checkbox.checked = this.checked;
    }

    if (attrName === 'disabled') {
      this.#checkbox.disabled = this.disabled;
    }
  }
}
