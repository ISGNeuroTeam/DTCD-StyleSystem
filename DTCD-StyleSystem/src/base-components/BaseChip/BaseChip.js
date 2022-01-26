import html from './BaseChip.html';

export default class BaseChip extends HTMLElement {

  #chip;
  #icon;
  #iconClickHandler;

  static get observedAttributes() {
    return ['close'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#iconClickHandler = () => this.dispatchEvent(new Event("remove")) || this.remove();

    this.#chip = this.shadowRoot.querySelector('div');
    this.#icon = this.shadowRoot.querySelector('.icon');

    this.#icon.addEventListener('click', this.#iconClickHandler);
  }

  disconnectedCallback() {
    this.#icon.removeEventListener('click', this.#iconClickHandler);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'close') {
      const action = newValue ? 'add' : 'remove';
      return this.#icon.classList[action]('show');
    }
  }

}
