import html from './BaseModalWindow.html';
import styles from './BaseModalWindow.scss';

export default class BaseModalWindow extends HTMLElement {
  #modal;
  #toggleBtn;
  #backdrop;
  #closeIcon;
  #opacity;
  #opened = false;
  #header;

  static get observedAttributes() {
    return [
      'opened', 
      'opacity',
      'header'
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
    this.#closeIcon = this.#modal.querySelector('.CloseIcon');
    this.#header = this.shadowRoot.querySelector('.Header');

    this.#toggleBtn.addEventListener('click', this.#handleToggleBtnClick);
    this.#backdrop.addEventListener('click', this.#handleBackdropClick);
    this.#closeIcon.addEventListener('click', this.#handleCloseIconClick);
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

  get header() {
    return this.#header.innerHTML;
  }

  set header(value) {
    this.querySelectorAll('[slot="header"]').forEach((header) => {
      header.remove();
    });

    if (value) {
      this.innerHTML += `<span slot="header">${value}</span>`;
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

      case 'header':
        this.header = newValue;
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

  #handleBackdropClick = () => {
    this.toggle(false);
  };

  #handleCloseIconClick = () => {
    this.toggle(false);
  };

  #setOpacity() {
    this.#backdrop.classList.toggle('opacity_light', this.#opacity === 'light');
    this.#backdrop.classList.toggle('opacity_dark', this.#opacity === 'dark');
  }
}
  