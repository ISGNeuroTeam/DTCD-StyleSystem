import html from './BaseSelect.html';
import dropDownDefaultSvg from './../icons/dropdown-default.svg';
import dropDownActiveSvg from './../icons/dropdown-active.svg';

export default class BaseSelect extends HTMLElement {
  #headerContainer;
  #header;
  #errorMessage;
  #optionsList;
  #iconEl;
  #label;
  #value;

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

    this.#header = this.shadowRoot.querySelector('#header');
    this.#headerContainer = this.shadowRoot.querySelector('#headerContainer');
    this.#optionsList = this.shadowRoot.querySelector('#optionsList');

    this.#iconEl = this.shadowRoot.querySelector('#dropDownIcon');
    this.#iconEl.innerHTML = dropDownDefaultSvg;

    this.#label = this.shadowRoot.querySelector('#label');
    this.#errorMessage = this.shadowRoot.querySelector('#errorMessage');
  }

  get required() {
    return this.hasAttribute('required');
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    this.#header.innerHTML = newValue
    this.#value = newValue;
    this.validate();
    this.dispatchEvent(new Event('input'));
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.value === '') {
      return (this.invalid = true);
    }
    return (this.invalid = false);
  }

  #optionClickCallback(evt) {
    const selectedOptionEl = evt.target.closest('[slot="item"')
    const selectEl = evt.target.closest('base-select')
    if (typeof selectedOptionEl.value !== 'undefined') {
      selectEl.value = selectedOptionEl.value
    } else if (selectedOptionEl.hasAttribute('value')) {
      selectEl.value = selectedOptionEl.getAttribute('value')
    } else {
      selectEl.value = selectedOptionEl.innerHTML
    }
  }

  connectedCallback() {
    const toZipOptionsListCallback = () => {
      this.#headerContainer.dispatchEvent(new Event('click'));
    };

    this.#headerContainer.addEventListener('click', e => {
      e.stopPropagation();

      if (this.#optionsList.getAttribute('active') === null) {
        // TO EXPAND

        this.#iconEl.innerHTML = dropDownActiveSvg;
        this.#headerContainer.style.borderColor = 'var(--button_primary)';
        document.addEventListener('click', toZipOptionsListCallback);
        this.#optionsList.setAttribute('active', true);

        // Add option select listener
        this.querySelectorAll('[slot="item"]').forEach(option => {
          option.addEventListener('click', this.#optionClickCallback);
        });

      } else {
        // TO ZIP
        this.validate();
        this.#headerContainer.style.borderColor = 'var(--border)';
        this.#iconEl.innerHTML = dropDownDefaultSvg;

        if (this.required) {
          const color = this.invalid ? 'var(--danger)' : 'var(--border)';

          this.#headerContainer.style.borderColor = color;

          this.#errorMessage.style.color = color;
          this.#errorMessage.classList.add('active');
          this.#errorMessage.innerHTML = this.invalid ? 'Это обязательное поле*' : '';
        }
        document.removeEventListener('click', toZipOptionsListCallback);
        this.#optionsList.removeAttribute('active');

        // Remove option select listener
        this.querySelectorAll('[slot="item"]').forEach(option => {
          option.removeEventListener('click', this.#optionClickCallback);
        });
      }
    });

    this.validate();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'disabled':
        if (newValue) this.#header.setAttribute('disabled', '');
        else this.#header.removeAttribute('disabled');
        break;

      case 'size':
        const sizes = ['small', 'middle', 'big'];

        if (attrName === 'size' && sizes.includes(newValue)) {
          const { classList } = this;

          for (const item of classList) {
            if (item.startsWith('size-')) {
              classList.remove(item);
              break;
            }
          }
          classList.add(`size-${newValue}`);
        }
        break;

      case 'placeholder':
        this.#header.innerHTML = newValue;
        break;

      case 'label':
        this.#label.innerHTML = newValue;
        break;

      case 'value':
        this.value = newValue;
        break;

      default:
        break;
    }
  }
}
