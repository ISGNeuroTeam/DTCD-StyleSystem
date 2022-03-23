import html from './BaseButton.html';
import styles from './BaseButton.scss';

export default class BaseButton extends HTMLElement {

  #button;
  #theme = [];
  #size;

  static get observedAttributes() {
    return ['disabled', 'theme', 'width', 'size', 'type'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#button = this.shadowRoot.querySelector('button');

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.addEventListener('click', this.#clickHandler);
  }


  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
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

  get type() {
    return this.getAttribute('type');
  }

  set type(value) {
    if (value) {
      this.setAttribute('type', value);
    } else {
      this.removeAttribute('type');
    }
  }

  get size() {
    return this.getAttribute('size');
  }

  set size(value) {
    if (value) {
      this.setAttribute('size', value);
    } else {
      this.removeAttribute('size');
    }
  }

  get width() {
    return this.getAttribute('width');
  }

  set width(value) {
    if (value) {
      this.setAttribute('width', value);
    } else {
      this.removeAttribute('width');
    }
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.#clickHandler);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'disabled': {
        this.#button.disabled = this.disabled;
        break;
      }
      case 'theme': {
        if (newValue) {
          this.#theme = newValue.split(',');
        } else {
          this.#theme = [];
        }
        this.#setThemeClasses();
        break;
      }
      case 'type': {
        this.#button.type = this.type;
        break;
      }
      case 'size': {
        this.#size = newValue ? newValue : undefined;
        this.#setSizeClasses();
        break;
      }

      default:
        break;
    }
  }

  #clickHandler = (e) => {
    this.disabled && e.stopImmediatePropagation();
  };

  #setThemeClasses() {
    const allThemes = [
      'theme_secondary',
      'theme_green',
      'theme_blueSec',
      'theme_red',
      'theme_with-plus',
    ];

    const { classList } = this.#button;
    
    for (const theme of allThemes) {
      if (this.#theme.indexOf(theme) != -1) {
        classList.add(theme);
      } else {
        classList.remove(theme);
      }
    }
  }

  #setSizeClasses() {
    if (this.#size === 'big') {
      this.#button.classList.add('size_big');
    } else {
      this.#button.classList.remove('size_big');
    }

    if (this.#size === 'middle') {
      this.#button.classList.add('size_middle');
    } else {
      this.#button.classList.remove('size_middle');
    }

    if (this.#size === 'small') {
      this.#button.classList.add('size_small');
    } else {
      this.#button.classList.remove('size_small');
    }
  }
}
