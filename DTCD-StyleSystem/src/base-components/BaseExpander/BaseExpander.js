import html from './BaseExpander.html';
import styles from './BaseExpander.scss';

export default class BaseExpander extends HTMLElement {
  #container
  #expander;

  static get observedAttributes() {
    return ['open'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    this.#container = this.shadowRoot.querySelector('.container');
    const style = document.createElement('style');
    this.#container.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.#expander = this.shadowRoot.querySelector('.BaseExpander');
    this.#expander.addEventListener('toggle', this.#expanderToggleHandler);
  }

  connectedCallback() {
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'open':
        if (newValue) this.#expander.setAttribute('open', '');
        else this.#expander.removeAttribute('open');
        break;

      default:
        break;
    }
  }

  #expanderToggleHandler = (event) => {
    const isExpanderOpened = event.currentTarget.hasAttribute('open');

    if (isExpanderOpened) {
      this.setAttribute('open', 'open');
    } else {
      this.removeAttribute('open');
    }
  }
}
