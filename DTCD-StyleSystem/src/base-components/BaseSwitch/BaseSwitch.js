import html from './BaseSwitch.html';

export default class BaseSwitch extends HTMLElement {

  #checkbox;

  static get observedAttributes() {
    return ['checked', 'disabled'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#checkbox = this.shadowRoot.querySelector('#check');

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
    if (attrName === 'checked') {
      this.#checkbox.checked = this.checked;
    }

    if (attrName === 'disabled') {
      this.#checkbox.disabled = this.disabled;
    }
  }
}
