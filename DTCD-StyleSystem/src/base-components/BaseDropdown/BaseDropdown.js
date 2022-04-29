import html from './BaseDropdown.html';
import styles from './BaseDropdown.scss';

export default class BaseDropdown extends HTMLElement {

  #dropdown;
  #toggleBtn;
  #theme = [];
  #opened = false;
  #alignment;
  #placement;

  static get observedAttributes() {
    return [
      'theme',
      'alignment',
      'opened',
      'placement'
    ];
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

  get alignment() {
    return this.#alignment;
  }

  set alignment (newValue) {
    if (newValue) {
      this.setAttribute('alignment', newValue);
    } else {
      this.removeAttribute('alignment');
    }
  }

  set placement (newValue) {
    if (newValue) {
      this.setAttribute('placement', newValue);
    } else {
      this.removeAttribute('placement');
    }
  }

  get opened() {
    return this.#opened;
  }

  set opened(newValue) {
    if (newValue) {
      this.setAttribute('opened', true);
    } else {
      this.removeAttribute('opened');
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

      case 'alignment':
        this.#alignment = newValue ? newValue : undefined;
        this.#setAlignmentClasses();
        break;

      case 'placement':
        this.#placement = newValue ? newValue : undefined;
        this.#setPlacementClasses();
        break;

      case 'opened':
        this.toggle(newValue ? true : false);
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

    this.dispatchEvent(new CustomEvent('toggle', {
      bubbles: true,
      cancelable: false,
      detail: {
        opened: this.#opened,
      },
    }));
  }
  
  #setThemeClasses() {
    const allThemes = [];

    const { classList } = this.#dropdown;
    
    for (const theme of allThemes) {
      if (this.#theme.indexOf(theme) != -1) {
        classList.add(theme);
      } else {
        classList.remove(theme);
      }
    }
  }

  #setAlignmentClasses() {
    const { classList } = this.#dropdown;

    if (this.#alignment === 'right') {
      classList.add('alignment_right');
    } else {
      classList.remove('alignment_right');
    }

    if (this.#alignment === 'center') {
      classList.add('alignment_center');
    } else {
      classList.remove('alignment_center');
    }
  }

  #setPlacementClasses() {
    const { classList } = this.#dropdown;

    if (this.#placement === 'rightTop') {
      classList.add('placement_rightTop');
    } else {
      classList.remove('placement_rightTop');
    }
  }

  #handleDocumentClick = (event) => {
    let isDropdownContainsOriginalTarget = false;
    try {
      isDropdownContainsOriginalTarget = this.#dropdown.contains(event.originalTarget);
    } catch (error) {}

    let isComponentContainsTarget = this.contains(event.target);
    const resultCondition = !isDropdownContainsOriginalTarget && !isComponentContainsTarget;

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
