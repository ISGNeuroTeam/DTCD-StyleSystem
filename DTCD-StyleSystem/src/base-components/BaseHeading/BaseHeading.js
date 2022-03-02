import html from './BaseHeading.html';
import styles from './BaseHeading.scss';

export default class BaseHeading extends HTMLElement {

  #heading;
  #theme = [];

  static get observedAttributes() {
    return ['theme'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;
    
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));
    
    this.#heading = this.shadowRoot.querySelector('.BaseHeading');
  }

  get theme() {
    return this.#theme;
  }

  set theme(value) {
    if (value) {
      if (Array.isArray(value)) {
        this.setAttribute('theme', value.join(','));
      } else {
        this.setAttribute('theme', value);
      }
    } else {
      this.removeAttribute('theme');
    }
  }
  
  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'theme':
        if (newValue) {
          this.#theme = newValue.split(',');
        } else {
          this.#theme = [];
        }
        this.#setThemeClasses();
        break;

      default:
        break;
    }
  }
  
  #setThemeClasses() {
    if (this.#theme.indexOf('theme_title-heavy') != -1) {
      this.#heading.classList.add('theme_title-heavy');
    }
    if (this.#theme.indexOf('theme_title-light') != -1) {
      this.#heading.classList.add('theme_title-light');
    }
    if (this.#theme.indexOf('theme_header-heavy') != -1) {
      this.#heading.classList.add('theme_header-heavy');
    }
    if (this.#theme.indexOf('theme_header-light') != -1) {
      this.#heading.classList.add('theme_header-light');
    }
    if (this.#theme.indexOf('theme_subheader') != -1) {
      this.#heading.classList.add('theme_subheader');
    }
    if (this.#theme.indexOf('theme_subheader-small') != -1) {
      this.#heading.classList.add('theme_subheader-small');
    }
  }
}
