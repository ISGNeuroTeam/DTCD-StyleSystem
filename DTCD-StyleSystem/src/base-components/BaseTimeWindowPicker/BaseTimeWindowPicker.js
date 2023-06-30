import html from './BaseTimeWindowPicker.html';
import styles from './BaseTimeWindowPicker.scss';

export default class BaseTimeWindowPicker extends HTMLElement {

  #theme = [];

  #twPicker;
  #selectContainer;

  static get observedAttributes() {
    return [
      // base select
      'placeholder',
      'value',
      'required',
      'disabled',
      'label',
      'size',
      'opened',
      'invalid',
    ];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#twPicker = this.shadowRoot.querySelector('.BaseTimeWindowPicker');
    this.#selectContainer = this.shadowRoot.querySelector('.DropdownList');

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
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

  get placeholder() {
    return this.getAttribute('placeholder');
  }

  set placeholder(value) {
    value ? this.setAttribute('placeholder', value) : this.removeAttribute('placeholder');
  }

  get label() {
    return this.getAttribute('label');
  }

  set label(value) {
    value ? this.setAttribute('label', value) : this.removeAttribute('label');
  }

  get size() {
    return this.getAttribute('size');
  }

  set size(value) {
    value ? this.setAttribute('size', value) : this.removeAttribute('size');
  }

  get opened() {
    return this.getAttribute('opened');
  }

  set opened(value) {
    value ? this.setAttribute('opened', value) : this.removeAttribute('opened');
  }

  get invalid() {
    return this.getAttribute('invalid');
  }

  set invalid(value) {
    value ? this.setAttribute('invalid', value) : this.removeAttribute('invalid');
  }

  disconnectedCallback() {

  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'placeholder':
      case 'value':
      case 'required':
      case 'disabled':
      case 'label':
      case 'size':
      case 'opened':
      case 'invalid': {
        this.#selectContainer.setAttribute(attrName, newValue);
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

      default:
        break;
    }
  }

  #setThemeClasses() {
    const allThemes = [];

    const { classList } = this.#twPicker;
    
    for (const theme of allThemes) {
      if (this.#theme.indexOf(theme) != -1) {
        classList.add(theme);
      } else {
        classList.remove(theme);
      }
    }
  }
}
