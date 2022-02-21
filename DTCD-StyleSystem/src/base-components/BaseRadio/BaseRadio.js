import html from './BaseRadio.html';

export default class BaseRadio extends HTMLElement {

  #radio;
  #value;

  static get observedAttributes() {
    return ['value', 'checked', 'disabled'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.value = '';
    this.#radio = this.shadowRoot.querySelector('#radio');

    this.#radio.addEventListener('input', event => {
      event.stopPropagation();
      this.checked = true;
      this.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }

  connectedCallback() {
  }

  get value() {
    return this.#value;
  }

  set value(val) {
    this.#value = val !== null ? val : '';
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value) {
    if (value) this.setAttribute('checked', '')
    else this.removeAttribute('checked');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'value') {
      this.value = newValue;
    }

    if (attrName === 'checked') {
      this.#radio.checked = this.checked;
    }

    if (attrName === 'disabled') {
      this.#radio.disabled = this.disabled;
    }
  }

}
