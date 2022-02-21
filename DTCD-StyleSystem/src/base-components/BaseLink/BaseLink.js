import html from './BaseLink.html';

export default class BaseLink extends HTMLElement {

  #link;

  static get observedAttributes() {
    return ['href', 'target'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#link = this.shadowRoot.querySelector('a');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'href') {
      return this.#link.href = newValue;
    }

    if (attrName === 'target') {
      return this.#link.target = newValue;
    }
  }

}
