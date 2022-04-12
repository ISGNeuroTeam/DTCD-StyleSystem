import html from './BaseDropdown.html';
import styles from './BaseDropdown.scss';

export default class BaseDropdown extends HTMLElement {

  #dropdown;
  #toggleBtn;
  #theme = [];
  #opened = false;

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
    
    this.#dropdown = this.shadowRoot.querySelector('.BaseDropdown');
    this.#toggleBtn = this.#dropdown.querySelector('.ToggleBtn');
    this.#toggleBtn.addEventListener('click', this.#handleToggleBtnClick);
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

  toggle = (doOpen) => {
    if (doOpen !== undefined) {
      if (!!doOpen === this.#opened) {
        return;
      }
      this.#opened = !!doOpen;
    } else {
      this.#opened = !this.#opened;
    }

    if (this.#opened) {
      this.#dropdown.classList.add('opened');
      document.addEventListener('click', this.#handleDocumentClick);
    } else {
      this.#dropdown.classList.remove('opened');
      document.removeEventListener('click', this.#handleDocumentClick);
    }
  }
  
  #setThemeClasses() {
    const allThemes = [
      'theme_alfa',
    ];

    const { classList } = this.#dropdown;
    
    for (const theme of allThemes) {
      if (this.#theme.indexOf(theme) != -1) {
        classList.add(theme);
      } else {
        classList.remove(theme);
      }
    }
  }

  #handleDocumentClick = (event) => {
    let isPickerContainsOriginalTarget = false;
    try {
      isPickerContainsOriginalTarget = this.#dropdown.contains(event.originalTarget);
    } catch (error) {}

    let isComponentContainsTarget = this.contains(event.target);
    const resultCondition = !isPickerContainsOriginalTarget && !isComponentContainsTarget;

    if (resultCondition) {
      this.toggle(false);
    }
  }

  #handleToggleBtnClick = () => {
    if (!this.disabled) {
      this.toggle();
    }
  };
}
