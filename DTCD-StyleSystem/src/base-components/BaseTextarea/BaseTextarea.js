import { getBoolFromAttrVal } from '../../utils/functions';

import html from './BaseTextarea.html';
import styles from './BaseTextarea.scss';

export default class BaseTextarea extends HTMLElement {

  #block;
  #label;
  #textarea;
  #message;
  #messageText;
  #invalid = false;
  #theme = [];
  #size;
  #doValidation = false;

  static get observedAttributes() {
    return [
      'placeholder',
      'disabled',
      'label',
      'required',
      'value',
      'theme',
      'size',
      'readonly',
      'rows',
      'invalid',
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

    this.#block = this.shadowRoot.querySelector('.BaseInput');
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#textarea = this.shadowRoot.querySelector('.Field');
    this.#message = this.shadowRoot.querySelector('.Message');

    this.#textarea.addEventListener('change', this.#handleTextareaChange);
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.#textarea.value === '') {
      this.#messageText = 'Обязательное поле*';
      this.invalid = true;
    } else if (typeof this.validation !== 'undefined') {
      const { isValid, message } = this.validation(this.#textarea.value);
      this.#messageText = message;
      this.invalid = !isValid;
    } else {
      this.invalid = false;
    }
  }

  connectedCallback() {
    this.#doValidation = true;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'placeholder':
        this.placeholder = newValue;
        break;

      case 'disabled':
        this.disabled = getBoolFromAttrVal(newValue);
        break;

      case 'label':
        this.label = newValue;
        break;

      case 'value':
        this.value = newValue;
        break;

      case 'required':
        this.required = getBoolFromAttrVal(newValue);
        break;

      case 'theme':
        if (newValue) {
          this.#theme = newValue.split(',');
        } else {
          this.#theme = [];
        }
        this.#setThemeClasses();
        break;

      case 'size':
        this.#size = newValue ? newValue : undefined;
        this.#setSizeClasses();
        break;

      case 'readonly':
        this.readonly = getBoolFromAttrVal(newValue);
        break;
      
      case 'invalid':
        this.invalid = newValue;
        break;

      case 'rows':
        this.#textarea.rows = newValue;
        break;

      default:
        break;
    }
  }

  get invalid() {
    return this.#invalid;
  }

  set invalid(newVal) {
    this.#invalid = Boolean(newVal);

    if (this.#invalid) {
      this.#block.classList.remove('withSuccessFill');
      this.#block.classList.add('withError');
    } else {
      this.#block.classList.remove('withError');
    }

    this.#message.innerHTML = this.#invalid && this.#messageText ? this.#messageText : '';
    this.#message.style.padding = this.#message.textContent.length ? '' : '0';
  }

  get value() {
    return this.#textarea.value;
  }

  set value(val) {
    this.#textarea.value = val;
    this.#doValidation && this.validate();
    this.dispatchEvent(new Event('input'));
  }

  get required() {
    return this.#textarea.hasAttribute('required');
  }

  set required(value) {
    if (value) {
      this.#textarea.setAttribute('required', 'required');
    } else {
      this.#textarea.removeAttribute('required');
    }
  }

  get label() {
    return this.#label.innerHTML;
  }

  set label(value) {
    this.querySelectorAll('[slot="label"]').forEach((label) => {
      label.remove();
    });

    if (value) {
      this.innerHTML += `<span slot="label">${value}</span>`;
    }
  }

  get disabled() {
    return this.#textarea.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.#textarea.setAttribute('disabled', 'disabled');
      this.#block.classList.add('disabled');
    } else {
      this.#textarea.removeAttribute('disabled');
      this.#block.classList.remove('disabled');
    }
  }

  get readonly() {
    return this.#textarea.hasAttribute('readonly');
  }

  set readonly(value) {
    if (value) {
      this.#textarea.setAttribute('readonly', 'readonly');
      this.#block.classList.add('disabled');
    } else {
      this.#textarea.removeAttribute('readonly');
      
      if ( ! this.disabled) {
        this.#block.classList.remove('disabled');
      }
    }
  }

  get placeholder() {
    return this.#textarea.getAttribute('placeholder');
  }

  set placeholder(value) {
    if (value) {
      this.#textarea.setAttribute('placeholder', value);
    } else {
      this.#textarea.removeAttribute('placeholder');
    }
  }

  get rows() {
    return this.#textarea.getAttribute('rows');
  }

  set rows(value) {
    if (value) {
      this.#textarea.setAttribute('rows', value);
    } else {
      this.#textarea.removeAttribute('rows');
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

  #handleTextareaChange = () => {
    this.dispatchEvent(new Event('change'));
  }

  #setThemeClasses() {
    const allThemes = [
      'withSuccessFill',
      'withError',
      'resize_off',
    ];

    const { classList } = this.#block;
    
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
      this.#block.classList.add('size_big');
    } else {
      this.#block.classList.remove('size_big');
    }

    if (this.#size === 'small') {
      this.#block.classList.add('size_small');
    } else {
      this.#block.classList.remove('size_small');
    }
  }

}
