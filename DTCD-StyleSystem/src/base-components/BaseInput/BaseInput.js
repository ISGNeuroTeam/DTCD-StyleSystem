import html from './BaseInput.html';
import styles from './BaseInput.scss';

export default class BaseInput extends HTMLElement {

  #baseInput;
  #internalInput;
  #label;
  #message;
  #messageText;
  #invalid = false;
  #theme = [];
  #size;
  #doValidation = false;

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

    this.#internalInput.addEventListener('input', this.#inputHandler);
    this.#internalInput.addEventListener('change', this.#handleInputChange);

    this.#iconSlots.forEach(slot => {
      slot.el = this.shadowRoot.getElementById(slot.id);
      slot.el.addEventListener('slotchange', () => {
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
      this.invalid = true;
    } else if (typeof this.validation !== 'undefined') {
      const { isValid, message } = this.validation(this.#internalInput.value);
      this.#messageText = message;
      this.invalid = !isValid;
    } else {
      this.invalid = false;
    }
  }

  connectedCallback() {
    this.#doValidation = true;
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
        this.readonly = newValue;
        break;

      case 'invalid':
        this.invalid = newValue;
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
      this.#baseInput.classList.remove('withSuccessFill');
      this.#baseInput.classList.add('withError');
    } else {
      this.#baseInput.classList.remove('withError');
    }

    this.#message.innerHTML = this.#invalid && this.#messageText ? this.#messageText : '';
    this.#message.style.padding = this.#message.textContent.length ? '' : '0';
  }

  get value() {
    return this.#internalInput.value;
  }

  set value(val) {
    this.#internalInput.value = val;
    this.#doValidation && this.validate();
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

  #handleInputChange = () => {
    this.dispatchEvent(new Event('change'));
  }

  #setThemeClasses() {
    const allThemes = [
      'withSuccessFill',
      'withError',
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
}
