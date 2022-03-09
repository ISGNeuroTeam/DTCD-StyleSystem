import html from './BaseIconButton.html';

export default class BaseIconButton extends HTMLElement {

  #colors = ['second', 'red', 'green'];
  #button;
  #clickHandler;

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

    this.#clickHandler = e => {
      this.disabled && e.stopImmediatePropagation();
    };

    this.addEventListener('click', this.#clickHandler);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get color() {
    return this.getAttribute('color');
  }

  set color(value) {
    if (value) this.setAttribute('color', value);
    else this.removeAttribute('color');
  }

  get size() {
    return this.getAttribute('size');
  }

  set size(value) {
    if (value) this.setAttribute('size', value);
    else this.removeAttribute('size');
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#clickHandler);
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
