import { getBoolFromAttrVal } from '../../utils/functions';

import html from './BaseTextarea.html';
import styles from './BaseTextarea.scss';

export default class BaseTextarea extends HTMLElement {

  #block;
  #label;
  #textarea;
  #message;

  #invalid = null;
  #theme = [];
  #size;
  #autoheight = false;
  
  #messageText;
  #doValidation = false;
  #resultValidation = false;
  #minHeightTA;

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
      'data-autoheight',
      'maxlength',
      'minlength',
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

    this.#textarea.addEventListener('input', this.#handleTextareaInput);
    this.#textarea.addEventListener('change', this.#handleTextareaChange);
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.#textarea.value === '') {
      this.#messageText = 'Обязательное поле*';
      this.#resultValidation = true;
    } else if (typeof this.validation !== 'undefined') {
      const { isValid, message } = this.validation(this.#textarea.value);
      this.#messageText = message;
      this.#resultValidation = !isValid;
    } else {
      this.#resultValidation = false;
    }

    this.#setInvalidStatus(this.#resultValidation);
  }

  connectedCallback() {
    this.#doValidation = true;
    this.#minHeightTA = this.#textarea.offsetHeight;

    // For right inizialization throw attribute 'data-autoheight'
    this.autoheight = this.#autoheight;
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
        if (oldValue !== newValue) {
          this.rows = newValue;
        }
        break;

      case 'data-autoheight':
        this.autoheight = this.hasAttribute('data-autoheight');
        break;

      case 'maxlength':
        this.maxlength = newValue;
        break;  

      case 'minlength':
        this.maxlength = newValue;
        break;

      default:
        break;
    }
  }

  get invalid() {
    if (this.#invalid == true) return true;
    if (this.#resultValidation == true) return true;
    return false;
  }

  set invalid(newVal) {
    if (newVal == 'false' || newVal == false || newVal == 0 || newVal == '0') {
      this.#invalid = false;
    } else if (newVal == 'true' || newVal == true || newVal == 1 || newVal == '1') {
      this.#invalid = true;
    } else {
      this.#invalid = null;
    }

    this.#setInvalidStatus(this.#invalid);
  }

  get value() {
    return this.#textarea.value;
  }

  set value(val) {
    this.#textarea.value = val;
    if (this.#invalid == null && this.#doValidation) this.validate();
    if (this.#autoheight) this.#calcTextareaHeight();
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

  get autoheight() {
    return this.#autoheight;
  }

  set autoheight(value) {
    this.#autoheight = Boolean(value);

    if (!this.#textarea.isConnected) return;

    if (this.#autoheight) {
      this.#textarea.style['overflow-y'] = 'hidden';
      this.#textarea.style.height = this.#minHeightTA > this.#textarea.scrollHeight
                                  ? this.#minHeightTA + 'px'
                                  : this.#textarea.scrollHeight + 'px';
      this.#textarea.addEventListener('input', this.#calcTextareaHeight);
    } else {
      this.#textarea.style['overflow-y'] = '';
      this.#textarea.style.height = '';
      this.#textarea.removeEventListener('input', this.#calcTextareaHeight);
    }
  }

  get maxlength() {
    return this.#textarea.getAttribute('maxlength');
  }

  set maxlength(value) {
    if (value) {     
      this.#textarea.setAttribute('maxlength', value);
    } else {
      this.#textarea.removeAttribute('maxlength');
    }
  }

  get minlength() {
    return this.#textarea.getAttribute('minlength');
  }

  set minlength(value) {
    if (value) {     
      this.#textarea.setAttribute('minlength', value);
    } else {
      this.#textarea.removeAttribute('minlength');
    }
  }

  #handleTextareaInput = (event) => {
    event.stopPropagation();
    this.value = event.target.value;
  }

  #handleTextareaChange = () => {
    this.dispatchEvent(new Event('change'));
  }

  #calcTextareaHeight = () => {
    this.#textarea.style.height = 0;
    this.#textarea.style.height = this.#minHeightTA > this.#textarea.scrollHeight
                                ? this.#minHeightTA + 'px'
                                : this.#textarea.scrollHeight + 'px';
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

  #setInvalidStatus (status) {
    const { classList } = this.#block;

    if (status) {
      classList.remove('withSuccessFill');
      classList.add('withError');
    } else {
      classList.remove('withError');
    }

    this.#message.innerHTML = status && this.#messageText ? this.#messageText : '';
    this.#message.style.padding = this.#message.textContent.length ? '' : '0';
  }
}
