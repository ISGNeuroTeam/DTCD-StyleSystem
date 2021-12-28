import html from './BaseIconButton.html';

export default class BaseIconButton extends HTMLElement {

  #button;
  #colors = ['second', 'red', 'green'];

  #clickHandler(e) {
    this.disabled && e.stopImmediatePropagation();
  }

  static get observedAttributes() {
    return ['size', 'color', 'disabled'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#button = this.shadowRoot.querySelector('button');

    this.addEventListener('click', this.#clickHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#clickHandler);
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

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'size') {
      return this.#button.style.setProperty(`--size`, newValue);
    }

    if (attrName === 'disabled') {
      return this.#button.disabled = this.disabled;
    }

    if (attrName === 'color') {
      const className = this.#colors.includes(newValue) ? newValue : '';
      return this.#button.className = className;
    }
  }

}