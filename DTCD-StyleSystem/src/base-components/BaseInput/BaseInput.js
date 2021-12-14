import html from './BaseInput.html';

export default class BaseInput extends HTMLElement {
  #internalInput;
  #label;
  #errorMessage;
  #errorMessageText;

  static get observedAttributes() {
    return ['placeholder', 'type', 'disabled', 'label', 'size', 'required'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    this.#internalInput = this.shadowRoot.querySelector('input');
    this.#label = this.shadowRoot.querySelector('#label');
    this.#errorMessage = this.shadowRoot.querySelector('#errorMessage');
  }

  set value(val) {
    this.#internalInput.value = val;
    this.validate();
  }

  get value() {
    return this.#internalInput.value;
  }

  get required() {
    return this.hasAttribute('required');
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.#internalInput.value === '') {
      this.invalid = true;
      this.#errorMessageText = 'Обязательное поле*';
    } else if (typeof this.validation !== 'undefined') {
      const { isValid, message } = this.validation(this.#internalInput.value);
      this.invalid = !isValid;
      this.#errorMessageText = message;
    } else this.invalid = false;
  }

  connectedCallback() {
    this.validate();

    this.#internalInput.addEventListener('input', e => {
      this.validate();
      this.value = e.target.value;
    });

    this.#internalInput.addEventListener('blur', () => {
      if (this.required || this.validation) {
        const color = this.invalid ? 'var(--danger)' : 'var(--success)';

        this.#internalInput.style.borderColor = color;
        this.#label.style.color = color;

        this.#errorMessage.style.color = color;
        this.#errorMessage.innerHTML = this.invalid ? this.#errorMessageText : '';
      }
    });
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'placeholder':
        this.#internalInput.placeholder = newValue;
        break;

      case 'disabled':
        if (newValue) this.#internalInput.setAttribute('disabled', '');
        else this.#internalInput.removeAttribute('disabled');
        break;

      case 'type':
        this.#internalInput.setAttribute('type', newValue);
        break;

      case 'label':
        this.#label.innerHTML = newValue;
        break;

      case 'size':
        const sizes = ['small', 'middle', 'big'];

        if (sizes.includes(newValue)) {
          const { classList } = this.#internalInput;

          for (const item of classList) {
            if (item.startsWith('size-')) {
              classList.remove(item);
              break;
            }
          }
          classList.add(`size-${newValue}`);
        }
        break;

      default:
        break;
    }
  }
}
