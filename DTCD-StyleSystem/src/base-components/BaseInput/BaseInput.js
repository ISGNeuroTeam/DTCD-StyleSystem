import html from './BaseInput.html';

export default class BaseInput extends HTMLElement {

  #internalInput;
  #inputHandler;
  #label;
  #errorMessage;
  #errorMessageText;

  static get observedAttributes() {
    return ['placeholder', 'type', 'disabled', 'label', 'required'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#internalInput = this.shadowRoot.querySelector('input');
    this.#label = this.shadowRoot.querySelector('#label');
    this.#errorMessage = this.shadowRoot.querySelector('#errorMessage');

    this.#inputHandler = e => {
      e.stopPropagation();
      this.value = e.target.value;
    };

    this.#internalInput.addEventListener('input', this.#inputHandler);
  }

  set invalid(newVal) {
    this.#internalInput.style.borderColor = newVal ? 'var(--danger)' : 'var(--border)';
    this.#label.style.color = newVal ? 'var(--danger)' : 'var(--text_main)';

    this.#errorMessage.style.color = newVal ? 'var(--danger)' : 'var(--text_secondary)';
    this.#errorMessage.innerHTML = newVal && this.#errorMessageText ? this.#errorMessageText : '';
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

  disconnectedCallback() {
    this.#internalInput.removeEventListener('input', this.#inputHandler);
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

      default:
        break;
    }
  }

}
