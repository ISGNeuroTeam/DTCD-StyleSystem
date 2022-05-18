import html from './BaseSelect.html';
import styles from './BaseSelect.scss';

export default class BaseSelect extends HTMLElement {
  #selectContainer;
  #fieldWrapper;
  #header;
  #searchInput;
  #label;
  #errorMessage;
  #value;
  #opened;

  static get observedAttributes() {
    return [
      'placeholder',
      'value',
      'required',
      'disabled',
      'label',
      'size',
      'search',
      'opened',
    ];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.#selectContainer = this.shadowRoot.querySelector('.BaseSelect');
    this.#header = this.shadowRoot.querySelector('.SelectedValue');
    this.#fieldWrapper = this.shadowRoot.querySelector('.FieldWrapper');
    this.#searchInput = this.shadowRoot.querySelector('.SearchInput');

    this.#label = this.shadowRoot.querySelector('.Label');
    this.#errorMessage = this.shadowRoot.querySelector('.Message');
  }

  get required() {
    return this.hasAttribute('required');
  }

  set required(newValue) {
    if (newValue) {
      this.setAttribute('required', true);
    } else {
      this.removeAttribute('required');
    }
  }

  get value() {
    return this.#value;
  }

  set value(newValue) {
    const oldValue = this.value;
    this.#value = newValue;
    this.#header.innerHTML = newValue;
    this.#searchInput.setAttribute('placeholder', newValue);

    this.validate();

    this.dispatchEvent(new Event('input'));
    if (oldValue !== this.value) {
      this.dispatchEvent(new Event('change'));
    }
  }

  get search() {
    return this.hasAttribute('search');
  }

  set search(newValue) {
    if (newValue) {
      this.setAttribute('search', true);
    } else {
      this.removeAttribute('search');
    }
  }

  get opened() {
    return this.#opened;
  }

  set opened(newValue) {
    if (newValue) {
      this.setAttribute('opened', true);
    } else {
      this.removeAttribute('opened');
    }
  }

  get size() {
    return this.getAttribute('size');
  }

  set size(newValue) {
    if (newValue) {
      this.setAttribute('size', newValue);
    } else {
      this.removeAttribute('size');
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(newValue) {
    if (newValue) {
      this.setAttribute('disabled', true);
    } else {
      this.removeAttribute('disabled');
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

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.value === '') {
      return (this.invalid = true);
    }
    return (this.invalid = false);
  }

  #optionClickCallback = (evt) => {
    const selectedOptionEl = evt.target.closest('[slot="item"]');

    if (typeof selectedOptionEl.value !== 'undefined') {
      this.value = selectedOptionEl.value;
    } else if (selectedOptionEl.hasAttribute('value')) {
      this.value = selectedOptionEl.getAttribute('value');
    } else {
      this.value = selectedOptionEl.innerHTML;
    }
  }

  #documentClickCallback = (event) => {
    // this condition is written to support nested web-components
    let isSelectContainsOriginalTarget = false;
    try {
      isSelectContainsOriginalTarget = this.#selectContainer.contains(event.originalTarget);
    } catch (error) {}

    let isComponentContainsTarget = this.contains(event.target);
    const resultCondition = !isSelectContainsOriginalTarget && !isComponentContainsTarget;

    if (resultCondition) {
      this.toggle(false);
    }
  };

  toggle = (doOpen) => {
    if (doOpen !== undefined) {
      if (!!doOpen === this.#opened) {
        return;
      }
      this.#opened = !!doOpen;
    } else {
      this.#opened = !this.#opened;
    }

    if (this.#opened) {
      // TO EXPAND
      this.#selectContainer.classList.add('opened');
      document.addEventListener('click', this.#documentClickCallback);

      // Focus searchInput if it active
      if (this.hasAttribute('search')) {
        this.#searchInput.focus();
      }
    } else {
      // TO ZIP
      this.#selectContainer.classList.remove('opened');
      this.validate();

      if (this.required && this.invalid) {
        this.#selectContainer.classList.add('withError');
        this.#errorMessage.innerHTML = 'Это обязательное поле*';
      } else {
        this.#selectContainer.classList.remove('withError');
        this.#errorMessage.innerHTML = '';
      }

      document.removeEventListener('click', this.#documentClickCallback);

      // Unfocus searchInput if it active
      if (this.hasAttribute('search')) {
        this.#searchInput.blur();
        this.#searchInput.value = '';
      }
    }
  }

  connectedCallback() {
    this.#fieldWrapper.addEventListener('click', this.#handleFieldWrapperClick);

    // Search items
    this.#searchInput.addEventListener('input', this.#handleSearchFieldInput);
    
    // this.validate();
  }

  disconnectedCallback() {
    this.#fieldWrapper.removeEventListener('click', this.#handleFieldWrapperClick);
    this.#searchInput.removeEventListener('input', this.#handleSearchFieldInput);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'disabled':
        if (newValue) {
          this.#searchInput.setAttribute('disabled', true);
          this.#selectContainer.classList.add('disabled');
        } else {
          this.#searchInput.removeAttribute('disabled');
          this.#selectContainer.classList.remove('disabled');
        }
        break;

      case 'size':
        const sizes = ['small', 'big'];

        if (sizes.includes(newValue)) {
          const { classList } = this.#selectContainer;

          for (const item of classList) {
            if (item.startsWith('size_')) {
              classList.remove(item);
              break;
            }
          }
          classList.add(`size_${newValue}`);
        }
        break;

      case 'placeholder':
        this.#header.innerHTML = newValue;
        break;

      case 'label':
        this.label = newValue;
        break;

      case 'search':
        if (this.hasAttribute('search')) {
          this.#header.style.display = 'none';
          this.#searchInput.style.display = '';
        }
        break;

      case 'value':
        if (oldValue !== newValue) {
          this.value = newValue;
        }
        break;

      case 'opened':
        this.toggle(newValue ? true : false);
        break;

      default:
        break;
    }
  }

  #handleFieldWrapperClick = (e) => {
    e.preventDefault();
    this.toggle();

    if (this.#opened) {
      // Add option select listener
      this.querySelectorAll('[slot="item"]').forEach((optionItem) => {
        optionItem.addEventListener('click', this.#optionClickCallback);
      });
    } else {
      // Remove option select listener
      this.querySelectorAll('[slot="item"]').forEach((optionItem) => {
        optionItem.removeEventListener('click', this.#optionClickCallback);
      });
    }
  }

  #handleSearchFieldInput = (e) => {
    const subString = e.target.value.toLowerCase();

    this.querySelectorAll('[slot="item"]').forEach(item => {
      const target = typeof item.value !== 'undefined' ? item.value.toLowerCase() : item.textContent.toLowerCase();
      item.style.display = target.includes(subString) ? '' : 'none';
    });
  }
}
