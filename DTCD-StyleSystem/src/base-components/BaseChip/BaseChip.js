import html from './BaseChip.html';

export default class BaseChip extends HTMLElement {

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

    this.#icon = this.shadowRoot.querySelector('.icon');
    this.#iconClickHandler = () => this.dispatchEvent(new Event("remove")) || this.remove();

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
