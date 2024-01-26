import { getBoolFromAttrVal } from '../../utils/functions';

import htmlOfInput from './BaseInput.html';
import stylesOfInput from './BaseInput.scss';

import htmlOfTextarea from '../BaseTextarea/BaseTextarea.html';
import stylesOfTextarea from '../BaseTextarea/BaseTextarea.scss';

export default class BaseInput extends HTMLElement {

  #baseInput;
  #internalInput;
  #label;
  #message;

  #invalid = null;
  #theme = [];
  #size;
  
  #messageText;
  #doValidation = false;
  #resultValidation = false;
  #autoheight = false;
  #minHeightTA;

  #iconSlots = [
    { id: 'iconLeft', theme: 'withLeftIcon', el: null },
    { id: 'iconRight', theme: 'withRightIcon', el: null },
  ];

  static get observedAttributes() {
    return [
      'placeholder',
      'type',
      'disabled',
      'label',
      'required',
      'value',
      'theme',
      'size',
      'readonly',
      'invalid',
      'maxlength',
      'minlength',
      'rows',
      'data-autoheight',
      'min',
      'max',
    ];
  }

  constructor() {
    super();

    const { tagName } = this;

    const template = document.createElement('template');
    if (tagName == 'BASE-INPUT') template.innerHTML = htmlOfInput;
    if (tagName == 'BASE-TEXTAREA') template.innerHTML = htmlOfTextarea;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    if (tagName == 'BASE-INPUT') style.appendChild(document.createTextNode(stylesOfInput));
    if (tagName == 'BASE-TEXTAREA') style.appendChild(document.createTextNode(stylesOfTextarea));

    this.#baseInput = this.shadowRoot.querySelector('.BaseInput');
    this.#internalInput = this.shadowRoot.querySelector('.Field');
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#message = this.shadowRoot.querySelector('.Message');

    this.#internalInput.addEventListener('input', this.#inputHandler);
    this.#internalInput.addEventListener('change', this.#handleInputChange);

    this.#iconSlots.forEach(slot => {
      slot.el = this.shadowRoot.getElementById(slot.id);
      slot.el && slot.el.addEventListener('slotchange', () => {
        const nodes = slot.el.assignedNodes();
        const action = nodes.length > 0 ? 'add' : 'remove';
        this.#baseInput.classList[action](slot.theme);
      });
    });
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.#internalInput.value === '') {
      this.#messageText = 'Обязательное поле*';
      this.#resultValidation = true;
    } else if (typeof this.validation !== 'undefined') {
      const { isValid, message } = this.validation(this.#internalInput.value);
      this.#messageText = message;
      this.#resultValidation = !isValid;
    } else {
      this.#resultValidation = false;
    }

    this.#setInvalidStatus(this.#resultValidation);
  }

  connectedCallback() {
    this.#doValidation = true;
    this.#minHeightTA = this.#internalInput.offsetHeight;

    // For right inizialization throw attribute 'data-autoheight'
    this.autoheight = this.#autoheight;
  }

  disconnectedCallback() {
    this.#internalInput.removeEventListener('input', this.#inputHandler);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'placeholder':
        this.placeholder = newValue;
        break;

      case 'disabled':
        this.disabled = getBoolFromAttrVal(newValue);
        break;

      case 'type':
        this.type = newValue;
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
          this.#theme = newValue.split(',').map(t => t.trim());
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

      case 'maxlength':
        this.maxlength = newValue;
        break;

      case 'minlength':
        this.minlength = newValue;
        break;
      
      case 'min':
        this.min = newValue;
        break;

      case 'max':
        this.max = newValue;
        break;

      case 'rows':
        if (oldValue !== newValue) {
          this.rows = newValue;
        }
        break;

      case 'data-autoheight':
        this.autoheight = this.hasAttribute('data-autoheight');
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
    return this.#internalInput.value;
  }

  set value(val) {
    this.#internalInput.value = val;
    if (this.#invalid == null && this.#doValidation) this.validate();
    if (this.#autoheight) this.#calcTextareaHeight();
    this.dispatchEvent(new Event('input'));
  }

  get required() {
    return this.#internalInput.hasAttribute('required');
  }

  set required(value) {
    if (value) {
      this.#internalInput.setAttribute('required', 'required');
    } else {
      this.#internalInput.removeAttribute('required');
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

  get type() {
    return this.#internalInput.getAttribute('type');
  }

  set type(value) {
    if (value) {
      this.#internalInput.setAttribute('type', value);
    }
  }

  get disabled() {
    return this.#internalInput.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.#internalInput.setAttribute('disabled', 'disabled');
      this.#baseInput.classList.add('disabled');
    } else {
      this.#internalInput.removeAttribute('disabled');
      this.#baseInput.classList.remove('disabled');
    }
  }

  get readonly() {
    return this.#internalInput.hasAttribute('readonly');
  }

  set readonly(value) {
    if (value) {
      this.#internalInput.setAttribute('readonly', 'readonly');
      this.#baseInput.classList.add('disabled');
    } else {
      this.#internalInput.removeAttribute('readonly');

      if ( ! this.disabled) {
        this.#baseInput.classList.remove('disabled');
      }
    }
  }

  get placeholder() {
    return this.#internalInput.getAttribute('placeholder');
  }

  set placeholder(value) {
    if (value) {
      this.#internalInput.setAttribute('placeholder', value);
    } else {
      this.#internalInput.removeAttribute('placeholder');
    }
  }

  get rows() {
    return this.#internalInput.getAttribute('rows');
  }

  set rows(value) {
    if (value) {
      this.#internalInput.setAttribute('rows', value);
    } else {
      this.#internalInput.removeAttribute('rows');
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

    if (!this.#internalInput.isConnected || this.tagName !== 'BASE-TEXTAREA') return;

    if (this.#autoheight) {
      this.#internalInput.style['overflow-y'] = 'hidden';
      this.#internalInput.style.height = this.#minHeightTA > this.#internalInput.scrollHeight
                                  ? this.#minHeightTA + 'px'
                                  : this.#internalInput.scrollHeight + 'px';
      this.#internalInput.addEventListener('input', this.#calcTextareaHeight);
    } else {
      this.#internalInput.style['overflow-y'] = '';
      this.#internalInput.style.height = '';
      this.#internalInput.removeEventListener('input', this.#calcTextareaHeight);
    }
  }

  get maxlength() {
    return this.#internalInput.getAttribute('maxlength');
  }

  set maxlength(value) {
    if (value) {     
      this.#internalInput.setAttribute('maxlength', value);
    } else {
      this.#internalInput.removeAttribute('maxlength');
    }
  }

  get minlength() {
    return this.#internalInput.getAttribute('minlength');
  }

  set minlength(value) {
    if (value) {     
      this.#internalInput.setAttribute('minlength', value);
    } else {
      this.#internalInput.removeAttribute('minlength');
    }
  }

  get min() {
    return this.#internalInput.getAttribute('min');
  }

  set min(value) {
    if (!isNaN(value)) {
      this.#internalInput.setAttribute('min', value);
    } else {
      this.#internalInput.removeAttribute('min');
    }
  }

  get max() {
    return this.#internalInput.getAttribute('max');
  }

  set max(value) {
    if (!isNaN(value)) {
      this.#internalInput.setAttribute('max', value);
    } else {
      this.#internalInput.removeAttribute('max');
    }
  }

  #inputHandler = (event) => {
    event.stopPropagation();
    this.value = event.target.value;
  };

  #handleInputChange = () => {
    this.dispatchEvent(new Event('change'));
  }

  #calcTextareaHeight = () => {
    this.#internalInput.style.height = 0;
    this.#internalInput.style.height = this.#minHeightTA > this.#internalInput.scrollHeight
                                ? this.#minHeightTA + 'px'
                                : this.#internalInput.scrollHeight + 'px';
  }

  #setThemeClasses() {
    const allThemes = [
      'withSuccessFill',
      'withError',
      'resize_off',
    ];

    const { classList } = this.#baseInput;

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
      this.#baseInput.classList.add('size_big');
    } else {
      this.#baseInput.classList.remove('size_big');
    }

    if (this.#size === 'small') {
      this.#baseInput.classList.add('size_small');
    } else {
      this.#baseInput.classList.remove('size_small');
    }
  }

  #setInvalidStatus (status) {
    const { classList } = this.#baseInput;

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