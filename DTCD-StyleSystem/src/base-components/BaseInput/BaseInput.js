import html from './BaseInput.html';
import styles from './BaseInput.scss';

export default class BaseInput extends HTMLElement {

  #baseInput;
  #internalInput;
  #label;
  #message;
  #messageText;
  #resetBtn;
  #theme = [];
  #size;

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

    this.#baseInput = this.shadowRoot.querySelector('.BaseInput');
    this.#internalInput = this.shadowRoot.querySelector('.Field');
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#message = this.shadowRoot.querySelector('.Message');
    this.#resetBtn = this.shadowRoot.querySelector('.StatusIcon.type_reset');

    this.#internalInput.addEventListener('input', this.#inputHandler);
    this.#resetBtn.addEventListener('click', this.#clickResetBtnHandler);
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.#internalInput.value === '') {
      this.#messageText = 'Обязательное поле*';
      this.invalid = true;
    } else if (typeof this.validation !== 'undefined') {
      const { isValid, message } = this.validation(this.#internalInput.value);
      this.#messageText = message;
      this.invalid = !isValid;
    } else this.invalid = false;
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
        this.disabled = newValue;
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
        this.required = newValue;
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
        this.readonly = readonly;
        break;

      default:
        break;
    }
  }

  set invalid(newVal) {
    if (newVal) {
      this.#baseInput.classList.remove('with-success-fill');
      this.#baseInput.classList.add('with-error');
    } else {
      this.#baseInput.classList.remove('with-error');
    }

    this.#message.innerHTML = newVal && this.#messageText ? this.#messageText : '';
  }

  get value() {
    return this.#internalInput.value;
  }

  set value(val) {
    this.#internalInput.value = val;
    this.validate();
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
    if (value) {
      this.#label.innerHTML = value;
    } else {
      this.#label.innerHTML = '<slot name="label"></slot>';
    }
  }

  get type() {
    return this.#internalInput.getAttribute('required');
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

  #inputHandler = (e) => {
    e.stopPropagation();
    this.value = e.target.value;
  };

  #clickResetBtnHandler = (e) => {
    this.value = '';
  };

  #setThemeClasses() {
    if (this.#theme.indexOf('with-success-fill') != -1) {
      this.#baseInput.classList.add('with-success-fill');
    } else {
      this.#baseInput.classList.remove('with-success-fill');
    }

    if (this.#theme.indexOf('with-error') != -1) {
      this.#baseInput.classList.add('with-error');
    } else {
      this.#baseInput.classList.remove('with-error');
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
}
