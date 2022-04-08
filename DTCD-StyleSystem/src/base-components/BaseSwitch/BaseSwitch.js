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

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'checked') {
      this.value = newValue ? true : false;
    }

    if (attrName === 'disabled') {
      this.#checkbox.disabled = this.disabled;
    }
  }

  #handleCheckboxChange = (event) => {
    event.stopPropagation();
    this.checked = event.target.checked;
    this.dispatchEvent(new Event('change'));
  }
}
