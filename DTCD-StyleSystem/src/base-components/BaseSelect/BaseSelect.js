import html from './BaseSelect.html';
import styles from './BaseSelect.scss';

export default class BaseSelect extends HTMLElement {
  #selectContainer;
  #fieldWrapper;
  #header;
  #searchInput;
  #label;
  #message;
  #messageText;
  #invalid = false;
  #value;
  #itemSlot;
  #opened = false;
  #doValidation = false;

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
      'invalid',
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
    this.#itemSlot = this.shadowRoot.querySelector('slot[name="item"]');

    this.#label = this.shadowRoot.querySelector('.Label');
    this.#message = this.shadowRoot.querySelector('.Message');
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
    
    const optionValues = this.#getAllOptionValues();
    const selectedOption = optionValues.find((optionItem) => {
      return optionItem.value === newValue;
    });

    this.#value = selectedOption?.value || '';
    this.#header.innerHTML = selectedOption?.visibleValue || '';
    this.#searchInput.setAttribute('placeholder', selectedOption?.visibleValue || '');

    this.#doValidation && this.validate();

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

  get invalid() {
    return this.#invalid;
  }

  set invalid(newVal) {
    this.#invalid = Boolean(newVal);

    if (this.#invalid) {
      this.#selectContainer.classList.remove('withSuccessFill');
      this.#selectContainer.classList.add('withError');
    } else {
      this.#selectContainer.classList.remove('withError');
    }

    this.#message.innerHTML = this.#invalid && this.#messageText ? this.#messageText : '';
    this.#message.style.padding = this.#message.textContent.length ? '' : '0';
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.value === '') {
      this.#messageText = 'Это обязательное поле*';
      return (this.invalid = true);
    } else {
      this.#messageText = '';
      return (this.invalid = false);
    }
  }

  #optionClickCallback = (e) => {
    e.stopPropagation();
    const selectedOption = e.target.closest('[slot="item"]');

    const optionValues = this.#getAllOptionValues();
    const findedOption = optionValues.find((optionItem) => {
      return optionItem.nodeOption === selectedOption;
    });

    this.value = findedOption?.value || '';
    this.#header.innerHTML = findedOption?.visibleValue || '';
    this.#searchInput.setAttribute('placeholder', findedOption?.visibleValue || '');
  }

  #documentClickCallback = (event) => {
    // this condition is written to support nested web-components
    const eventPath = event.composedPath();
    const originalTarget = eventPath[0];
    const isSelectContainsOriginalTarget = this.#selectContainer.contains(originalTarget);
    const isComponentContainsTarget = this.contains(event.target);
    if (!isSelectContainsOriginalTarget && !isComponentContainsTarget) {
      this.toggle(false);
    }
  };

  toggle(doOpen) {
    if (doOpen !== undefined) {
      if (!!doOpen === this.#opened) {
        return;
      }
      this.#opened = !!doOpen;
    } else {
      this.#opened = !this.#opened;
    }

    if (this.#opened) {
      this.#selectContainer.classList.add('opened');
      document.addEventListener('click', this.#documentClickCallback);
      if (this.hasAttribute('search')) {
        this.#searchInput.focus();
      }
    } else {
      this.#selectContainer.classList.remove('opened');
      document.removeEventListener('click', this.#documentClickCallback);

      if (this.hasAttribute('search')) {
        this.#searchInput.blur();
        this.#searchInput.value = '';
      }

      this.#doValidation && this.validate();
    }

    return this.#opened;
  }

  connectedCallback() {
    this.#doValidation = true;

    this.#fieldWrapper.addEventListener('click', this.#handleFieldWrapperClick);
    this.#searchInput.addEventListener('input', this.#handleSearchFieldInput);
  }

  disconnectedCallback() {
    this.#fieldWrapper.removeEventListener('click', this.#handleFieldWrapperClick);
    this.#searchInput.removeEventListener('input', this.#handleSearchFieldInput);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'disabled':
        if (this.disabled) {
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

      case 'invalid':
        this.invalid = newValue;
        break;

      default:
        break;
    }
  }

  #getAllOptionValues = () => {
    const optionValues = [];
    const nodes = this.#itemSlot.assignedNodes();

    nodes.forEach((nodeOption) => {
      optionValues.push({
        nodeOption,
        value: nodeOption.value
            || nodeOption.getAttribute('value')
            || nodeOption.getAttribute('data-visible-value')
            || nodeOption.textContent
            || '',
        visibleValue: nodeOption.getAttribute('data-visible-value')
                  || nodeOption.textContent
                  || nodeOption.value
                  || nodeOption.getAttribute('value')
                  || '',
      });
    });

    return optionValues;
  };

  #handleFieldWrapperClick = (e) => {
    e.preventDefault();
    const action = this.toggle() ? 'add' : 'remove';
    const method = action + 'EventListener';
    this.#itemSlot.assignedNodes().forEach(
      option => option[method]('click', this.#optionClickCallback)
    );
  }

  #handleSearchFieldInput = (e) => {
    const subString = e.target.value.toLowerCase();
    this.#itemSlot.assignedNodes().forEach(item => {
      const isValueExist = typeof item.value !== 'undefined';
      const value = isValueExist ? item.value.toLowerCase() : item.textContent.toLowerCase();
      item.style.display = value.includes(subString) ? '' : 'none';
    });
  }
}
