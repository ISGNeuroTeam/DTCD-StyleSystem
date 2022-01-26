import html from './BaseButton.html';

export default class BaseButton extends HTMLElement {

  #button;
  #clickHandler;

  static get observedAttributes() {
    return ['disabled'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#button = this.shadowRoot.querySelector('button');

    this.#clickHandler = e => {
      this.disabled && e.stopImmediatePropagation();
    };

    this.addEventListener('click', this.#clickHandler);
  }


  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#clickHandler);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'disabled') {
      this.#button.disabled = this.disabled;
    }
  }

}
