import html from './BaseInput.html';

export default class BaseInput extends HTMLElement {
  #internalInput;
  #label;
  #errorMessage;

  static get observedAttributes() {
    return ['placeholder', 'value', 'disabled', 'label', 'size', 'required'];
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

  get required() {
    return this.hasAttribute('required');
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.#internalInput.value === '') {
      return (this.invalid = true);
    }
    return (this.invalid = false);
  }

  connectedCallback() {
    this.validate();

    this.#internalInput.addEventListener('input', e => {
      this.validate();
      if (!this.invalid) this.value = e.target.value;
    });

    this.#internalInput.addEventListener('blur', () => {
      if (this.required) {
        const color = this.invalid ? 'var(--danger)' : 'var(--success)';

        this.#internalInput.style.borderColor = color;
        this.#label.style.color = color;

        this.#errorMessage.style.color = color;
        this.#errorMessage.innerHTML = this.invalid ? 'Это обязательное поле*' : '';
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

      case 'label':
        this.#label.innerHTML = newValue;
        break;

      case 'size':
        const sizes = ['small', 'middle', 'big'];

        if (attrName === 'size' && sizes.includes(newValue)) {
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

      case 'value':
        this.#internalInput.value = newValue;
        this.#internalInput.dispatchEvent(new Event('input'));
        break;

      default:
        break;
    }
  }
}
