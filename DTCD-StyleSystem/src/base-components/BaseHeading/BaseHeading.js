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
    const allThemes = [
      'theme_titleHeavy',
      'theme_titleLight',
      'theme_headerHeavy',
      'theme_headerLight',
      'theme_subheader',
      'theme_subheaderSmall',
    ];

    const { classList } = this.#heading;
    
    for (const theme of allThemes) {
      if (this.#theme.indexOf(theme) != -1) {
        classList.add(theme);
      } else {
        classList.remove(theme);
      }
    }
  }
}
