import html from './BaseRange.html';

export default class BaseRange extends HTMLElement {

  #range;
  #inputHandler;

  static get observedAttributes() {
    return ['min', 'max', 'step', 'value'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#range = this.shadowRoot.querySelector('#range');

    this.max = 100;
    this.min = 0;
    this.step = 1;
    this.value = 0;

    this.#inputHandler = () => this.#syncProgressColorAndValue();

    this.#range.addEventListener('input', this.#inputHandler);
  }

  get max() {
    return this.#range.max;
  }

  set max(val) {
    this.#range.max = val;
  }

  get min() {
    return this.#range.min;
  }

  set min(val) {
    this.#range.min = val;
  }

  get step() {
    return this.#range.step;
  }

  set step(val) {
    this.#range.step = val;
  }

  get value() {
    return this.#range.value;
  }

  set value(val) {
    this.#range.value = Number(val);
    this.#syncProgressColorAndValue();
  }

  #syncProgressColorAndValue() {
    const { min, max, value } = this;
    const size = (value - min) * 100 / (max - min);
    this.#range.style.backgroundSize = `${size}%`;
  }

  connectedCallback() {
    this.#syncProgressColorAndValue();
  }

  disconnectedCallback() {
    this.#range.removeEventListener('input', this.#inputHandler);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    this[attrName] = newValue;
  }

}
