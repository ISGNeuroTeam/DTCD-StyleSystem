import html from './BaseLabel.html';

export default class BaseLabel extends HTMLElement {

  #span;
  #colors = ['accent', 'warning', 'danger', 'success'];

  static get observedAttributes() {
    return ['color'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#span = this.shadowRoot.querySelector('span');
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'color') {
      const className = this.#colors.includes(newValue) ? newValue : '';
      return this.#span.className = className;
    }
  }

}
