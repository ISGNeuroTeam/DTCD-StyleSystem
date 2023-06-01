import html from './BaseModalWindow.html';
import styles from './BaseModalWindow.scss';

export default class BaseModalWindow extends HTMLElement {
  #modal;
  #toggleBtn;
  #backdrop;
  #opacity;
  #opened = false;

  static get observedAttributes() {
    return [
      'opened', 
      'opacity',
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

    this.#modal = this.shadowRoot.querySelector('.BaseModalWindow');
    this.#toggleBtn = this.#modal.querySelector('.ToggleBtn');
    this.#backdrop = this.#modal.querySelector('.ModalBackdrop');
    this.#toggleBtn.addEventListener('click', this.#handleToggleBtnClick);
    
  }

  get opacity() {
      return this.getAttribute('opacity');
    }
  
    set opacity(value) {
      if (value) {
        this.setAttribute('opacity', value);
      } else {
        this.removeAttribute('opacity');
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

      case 'opened':
        this.toggle(newValue ? true : false);
        break;

      case 'opacity': 
          this.#opacity = newValue ? newValue : undefined;
          this.#setOpacity();
          break;

      default:
        break;
    }
  }

  toggle = doOpen => {
    if (doOpen !== undefined) {
      if (!!doOpen === this.#opened) {
        return;
      }
      this.#opened = !!doOpen;
    } else {
      this.#opened = !this.#opened;
    }

    if (this.#opened) {
      this.#modal.classList.add('opened');
      document.addEventListener('click', this.#handleDocumentClick);
    } else {
      this.#modal.classList.remove('opened');
      document.removeEventListener('click', this.#handleDocumentClick);
    }

    this.dispatchEvent(
      new CustomEvent('toggle', {
        bubbles: true,
        cancelable: false,
        detail: {
          opened: this.#opened,
        },
      })
    );
  };

  #handleDocumentClick = event => {
    let isDropdownContainsOriginalTarget = false;
    try {
      isDropdownContainsOriginalTarget = this.#modal.contains(event.originalTarget);
    } catch (error) {}

    let isComponentContainsTarget = this.contains(event.target);
    const resultCondition = !isDropdownContainsOriginalTarget && !isComponentContainsTarget;

    if (resultCondition) {
      this.toggle(false);
    }
  };

  #handleToggleBtnClick = () => {
    if (!this.disabled) {
      this.toggle();
    }
  };

  #setOpacity() {
    if (this.#opacity === 'light') {
      this.#backdrop.classList.add('opacity_light');
    } else {
      this.#backdrop.classList.remove('opacity_light');
    }
      
    if (this.#opacity === 'dark') {
      this.#backdrop.classList.add('opacity_dark');
    } else {
      this.#backdrop.classList.remove('opacity_dark');
    }
  }
}
  