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

  set invalid(newVal) {
    this.#internalInput.style.borderColor = newVal ? 'var(--danger)' : 'var(--border)';
    this.#label.style.color = newVal ? 'var(--danger)' : 'var(--text_main)';

    this.#errorMessage.style.color = newVal ? 'var(--danger)' : 'var(--text_main)';
    this.#errorMessage.innerHTML = newVal && this.#errorMessageText ? this.#errorMessageText : '';
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
      this.#errorMessageText = 'Обязательное поле*';
      this.invalid = true;
    } else if (typeof this.validation !== 'undefined') {
      const { isValid, message } = this.validation(this.#internalInput.value);
      this.#errorMessageText = message;
      this.invalid = !isValid;
    } else this.invalid = false;
  }

  connectedCallback() {
    this.#internalInput.addEventListener('input', e => {
      this.value = e.target.value;
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

      case 'value':
        this.value = newValue;
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
