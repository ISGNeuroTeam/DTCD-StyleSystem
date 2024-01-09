import html from './BaseSelect.html';
import styles from './BaseSelect.scss';

export default class BaseSelect extends HTMLElement {
  #selectContainer;
  #fieldWrapper;
  #header;
  #searchInput;
  #label;
  #message;
  #itemSlot;
  #dropdownContainer;

  #invalid = null;
  #value = new Set();
  #opened = false;
  #disabled = false;
  #required = false;
  #multiple = false;

  #autoClose = true;
  #messageText;
  #doValidation = false;
  #resultValidation = false;
  #intervalCheckingCoords;

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
      'data-auto-close',
      'multiple',
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
    this.#dropdownContainer = this.shadowRoot.querySelector('.OptionList');
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#message = this.shadowRoot.querySelector('.Message');
    
    this.#itemSlot = this.shadowRoot.querySelector('slot[name="item"]');

    this.#itemSlot.addEventListener('slotchange', () => {
      const optionValues = this.#getAllOptionValues();
      const arrayValues = [];
      optionValues.forEach((optionItem) => {
        if (optionItem.nodeOption.hasAttribute('selected')) {
          arrayValues.push(optionItem.value);
        }
      });
      this.value = arrayValues;
    });
  }

  get required() {
    return this.#required;
  }

  set required(newValue) {
    this.#required = Boolean(newValue);
  }

  get value() {
    const arrayValues = Array.from(this.#value);
    if (this.multiple) return arrayValues;
    else return arrayValues[0];
  }

  set value(newValue) {
    if (Array.isArray(newValue)) {
      this.#value = new Set(newValue);
      this.dispatchEvent(new Event('input'));
      this.dispatchEvent(new Event('change'));
    } else {
      const oldValue = this.value;
      this.#value = new Set();
      this.#value.add(newValue);

      this.dispatchEvent(new Event('input'));
      if (oldValue !== newValue) {
        this.dispatchEvent(new Event('change'));
      }
    }

    this.#renderVisibleValue();

    if (this.#invalid == null && this.#doValidation) this.validate();
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
    return this.#disabled;
  }

  set disabled(newValue) {
    this.#disabled = Boolean(newValue);
    if (this.#disabled) {
      this.#searchInput.setAttribute('disabled', true);
      this.#selectContainer.classList.add('disabled');
    } else {
      this.#searchInput.removeAttribute('disabled');
      this.#selectContainer.classList.remove('disabled');
    }
  }

  get label() {
    return this.#label.innerHTML;
  }

  set label(value) {
    // this.querySelectorAll('[slot="label"]').forEach((label) => {
    //   label.remove();
    // });

    if (value) {
      // this.innerHTML += `<span slot="label">${value}</span>`;
      this.#label.innerHTML = value;
      this.#selectContainer.classList.add('withLabel');
    } else {
      this.#label.innerHTML = '<slot name="label"></slot>';
      this.#selectContainer.classList.remove('withLabel');
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

  get autoClose() {
    return this.#autoClose;
  }

  set autoClose(newValue) {
    newValue == false ? this.#autoClose = false : this.#autoClose = true;
  }

  get multiple() {
    return this.#multiple;
  }

  set multiple(newValue) {
    this.#multiple = Boolean(newValue);
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.value === '') {
      this.#messageText = 'Это обязательное поле*';
      this.#resultValidation = true;
    } else {
      this.#messageText = '';
      this.#resultValidation = false;
    }

    this.#setInvalidStatus(this.#resultValidation);
    return this.#resultValidation;
  }

  #optionClickCallback = (e) => {
    e.stopPropagation();

    const selectedOption = e.target.closest('[slot="item"]');
    const optionValues = this.#getAllOptionValues();
    const findedOption = optionValues.find((optionItem) => {
      return optionItem.nodeOption === selectedOption;
    });

    if (!this.multiple) this.#value.clear();

    if (this.#value.has(findedOption?.value) || this.#value.has(Number(findedOption.value))) {
      this.#value.delete(findedOption?.value);
    } else {
      this.#value.add(findedOption?.value);
    }
    
    this.dispatchEvent(new Event('input'));
    this.dispatchEvent(new Event('change'));

    this.#renderVisibleValue();
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

      this.#setPosition();
      this.#intervalCheckingCoords = setInterval(() => {
        this.#setPosition();
      }, 100);
    } else {
      this.#selectContainer.classList.remove('opened');
      document.removeEventListener('click', this.#documentClickCallback);

      clearInterval(this.#intervalCheckingCoords);

      if (this.hasAttribute('search')) {
        this.#searchInput.blur();
        this.#searchInput.value = '';
      }

      if (this.#invalid == null && this.#doValidation) this.validate();
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
    clearInterval(this.#intervalCheckingCoords);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'disabled':
        this.disabled = this.hasAttribute('disabled');
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
        if (oldValue !== newValue) {
          this.#header.innerHTML = newValue;
        }
        break;

      case 'label':
        if (oldValue !== newValue) {
          this.label = newValue;
        }
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

      case 'required':
        this.required = this.hasAttribute('required');
        break;

      case 'data-auto-close':
        this.autoClose = newValue == 'false' ? false : true;
        break;

      case 'multiple':
        this.multiple = this.hasAttribute('multiple');
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

  #handleFieldWrapperClick = (event) => {
    event.preventDefault();
    if (this.#disabled) return;

    // костыль для отключения автоматического закрытия BaseSelect,
    // если установлен параметр "autoClose" в значение "false".
    if (this.#autoClose === false && event.target.classList.contains('SearchInput')) {
      return;
    }

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

  #setInvalidStatus (status) {
    const { classList } = this.#selectContainer;

    if (status) {
      classList.remove('withSuccessFill');
      classList.add('withError');
    } else {
      classList.remove('withError');
    }

    this.#message.innerHTML = status && this.#messageText ? this.#messageText : '';
    this.#message.style.padding = this.#message.textContent.length ? '' : '0';
  }

  #setPosition() {
    const {
      height,
      width,
      left,
      top,
    } = this.#fieldWrapper.getBoundingClientRect();

    const render = (hintPos) => {
      const {
        style,
      } = this.#dropdownContainer;

      this.#selectContainer.classList.remove('placement_top', 'placement_bottom');
      this.#selectContainer.classList.add(`placement_${hintPos}`);
      
      style.position = 'fixed';
      style.width = (width - 6) + 'px';
      style.left = (left + width / 2) + 'px';
      
      switch (hintPos) {
        case 'bottom':
          style.top = (top + height) + 'px';
          style.transform = '';
          break;
  
        case 'top':
          style.top = top + 'px';
          style.transform = 'translateX(-50%) translateY(-100%)';
          break;
      }
    }

    const placement = 'bottom';
    render(placement);

    const {
      offsetHeight: windowHeight,
    } = document.body;
    const {
      top: hintTop,
      bottom: hintBottom,
    } = this.#dropdownContainer.getBoundingClientRect();

    let posAwayFromScreen = placement;
    if (hintTop < 0) posAwayFromScreen = 'bottom';
    if (hintBottom > windowHeight) posAwayFromScreen = 'top';

    if (placement !== posAwayFromScreen) {
      render(posAwayFromScreen);
    }
  }

  #renderVisibleValue() {
    const optionValues = this.#getAllOptionValues();
    let visibleValueString = '';

    optionValues.forEach((optionItem) => {
      if (this.#value.has(optionItem.value) || this.#value.has(Number(optionItem.value))) {
        if (visibleValueString) {
          visibleValueString += '; ';
        }
        visibleValueString += optionItem.visibleValue;
        optionItem.nodeOption.setAttribute('selected', '');
      } else {
        optionItem.nodeOption.removeAttribute('selected');
      }
    });

    this.#header.innerHTML = visibleValueString;
    this.#searchInput.setAttribute('placeholder', visibleValueString);
  }
}
