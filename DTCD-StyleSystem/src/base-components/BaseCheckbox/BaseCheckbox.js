import htmlOfCheckbox from './BaseCheckbox.html';
import stylesOfCheckbox from './BaseCheckbox.scss';

import htmOflSwitcher from '../BaseSwitch/BaseSwitch.html';
import stylesOfSwitcher from '../BaseSwitch/BaseSwitch.scss';

import htmOflRadio from '../BaseRadio/BaseRadio.html';
import stylesOfRadio from '../BaseRadio/BaseRadio.scss';

export default class BaseCheckbox extends HTMLElement {

  #label;
  #checkbox;
  #placement;
  #placements = ['right', 'left'];

  #value;

  static get observedAttributes() {
    return [
      'label',
      'checked',
      'disabled',
      'type',
      'value',
      'placement',
    ];
  }

  constructor() {
    super();

    const { tagName } = this;

    const template = document.createElement('template');
    if (tagName == 'BASE-CHECKBOX') template.innerHTML = htmlOfCheckbox;
    if (tagName == 'BASE-SWITCH') template.innerHTML = htmOflSwitcher;
    if (tagName == 'BASE-RADIO') template.innerHTML = htmOflRadio;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    if (tagName == 'BASE-CHECKBOX') style.appendChild(document.createTextNode(stylesOfCheckbox));
    if (tagName == 'BASE-SWITCH') style.appendChild(document.createTextNode(stylesOfSwitcher));
    if (tagName == 'BASE-RADIO') style.appendChild(document.createTextNode(stylesOfRadio));
    
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#checkbox = this.shadowRoot.querySelector('.Input');
    
    this.#checkbox.addEventListener('input', this.#handleCheckboxInput);
    this.#checkbox.addEventListener('change', this.#handleCheckboxChange);
  }

  get value() {
    if (this.tagName == 'BASE-RADIO') return this.#value;
    else return this.checked;
  }

  set value(newValue) {
    if (this.tagName == 'BASE-RADIO') return this.#value = newValue !== null ? newValue : '';
    else return this.checked = newValue;
  }

  get checked() {
    return this.#checkbox.checked;
  }

  set checked(newValue) {
    const oldValue = this.checked;
    this.#checkbox.checked = Boolean(newValue);

    if (oldValue !== Boolean(newValue)) {
      this.dispatchEvent(new Event('change'));
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get label() {
    return this.#label.innerHTML;
  }

  set label(newValue) {
    const { tagName } = this;

    if (tagName === 'BASE-CHECKBOX' || tagName === 'BASE-RADIO') {
      this.innerHTML = newValue ? newValue : '';
    }
    if (tagName === 'BASE-SWITCH') {
      this.querySelectorAll('[slot="label"]').forEach((label) => {
        label.remove();
      });
  
      if (newValue) {
        this.innerHTML += `<span slot="label">${newValue}</span>`;
      }
    }
  }

  get type() {
    return this.#checkbox.type;
  }

  set type(newValue) {
    this.#checkbox.type = newValue == 'radio' ? 'radio' : 'checkbox';
  }

  get placement() {
    return this.#placement;
  }

  set placement(newValue) {
    if (newValue == 'rightStart') {
      newValue = 'right';
    }
    if (newValue == 'leftStart') {
      newValue = 'left';
    }
    
    this.#placement = this.#placements.includes(newValue) ? newValue : 'bottom';
    this.#setPlacementClasses();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'label': {
        this.label = newValue;
        break;
      }
  
      case 'checked': {
        this.checked = newValue;
        break;
      }

      case 'value': {
        this.value = newValue;
        break;
      }

      case 'type': {
        this.type = newValue;
        break;
      }
  
      case 'disabled': {
        this.#checkbox.disabled = this.disabled;
        break;
      }

      case 'placement': {
        this.placement = newValue;
        break;
      }

      default:
        break;
    }
  }

  connectedCallback() {
    this.#setPosition();
  }

  #handleCheckboxInput = (event) => {
    event.stopPropagation();
    this.dispatchEvent(new Event('input', { bubbles: true }));
  }

  #handleCheckboxChange = (event) => {
    event.stopPropagation();
    this.dispatchEvent(new Event('change'));
  }

  #setPlacementClasses(newPlacement = this.#placement) {
    const { classList } = this.#checkbox;
    classList.toggle('placement_right', newPlacement === 'right' || newPlacement === 'rightStart');
    classList.toggle('placement_left', newPlacement === 'left' || newPlacement === 'leftStart');
  }
  
  #setPosition() {
    const { style } = this.#label;
    const checkboxElement = this.shadowRoot.querySelector('.Сheckbox') || this.shadowRoot.querySelector('.Switch');
    const parentContainer = this.shadowRoot.querySelector('.BaseCheckbox') || this.shadowRoot.querySelector('.BaseSwitch');
  
    if (checkboxElement) {
  
      switch (this.placement) {
        case 'left':
          style.top = '25%';
          style.left = '0';
          style.transform = 'translateY(-25%)';
          parentContainer.style.marginTop = '0';
  
          if (checkboxElement) {
            const labelWidth = this.#label.clientWidth;
            const checkboxContainer = this.shadowRoot.querySelector('.Сheckbox') || this.shadowRoot.querySelector('.Switch');
            checkboxContainer.style.marginLeft = `calc(${labelWidth}px + 10px)`;
          }
  
          break;
  
        case 'right':
          style.top = '25%';
          style.left = '100%';
          style.transform = 'translateY(-25%)';
          style.marginLeft = '10px';
          parentContainer.style.marginTop = '0';
  
          break;
  
        default:
          parentContainer.style.marginTop = '10px';
  
          break;
      }
    }
  }
}
