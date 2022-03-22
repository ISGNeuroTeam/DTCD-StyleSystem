import html from './BaseExpander.html';
import styles from './BaseExpander.scss';

export default class BaseExpander extends HTMLElement {

  #expander;
  #theme = [];

  static get observedAttributes() {
    return ['open', 'theme'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.#expander = this.shadowRoot.querySelector('.BaseExpander');
    this.#expander.addEventListener('toggle', this.#expanderToggleHandler);
  }

  get open() {
    return this.hasAttribute('open');
  }

  set open(value) {
    if (value) {
      this.setAttribute('open', 'open');
    } else {
      this.removeAttribute('open');
    }
  }

  get theme() {
    return this.#theme;
  }

  set theme(value) {
    if (value) {
      this.setAttribute('theme', value.join(','));
    } else {
      this.removeAttribute('theme');
    }
  }

  connectedCallback() {
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'open':
        if (newValue) this.#expander.setAttribute('open', '');
        else this.#expander.removeAttribute('open');
        break;

      case 'theme':
        if (newValue) {
          this.#theme = newValue.split(',');
        } else {
          this.#theme = [];
          this.removeAttribute('theme');
        }
        this.#setThemeClasses();
        break;

      default:
        break;
    }
  }

  #expanderToggleHandler = (event) => {
    this.open = event.currentTarget.hasAttribute('open') ? true : false;
  }

  #setThemeClasses() {
    if (this.#theme.indexOf('with_borderBottom') != -1) {
      this.#expander.classList.add('with_borderBottom');
    }
  }
}
