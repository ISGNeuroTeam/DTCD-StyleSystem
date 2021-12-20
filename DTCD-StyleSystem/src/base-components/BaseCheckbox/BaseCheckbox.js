import html from './BaseCheckbox.html';

export default class BaseCheckbox extends HTMLElement {
  static get observedAttributes() {
    return ['color', 'label', 'checked', 'disabled'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.checkbox = this.shadowRoot.querySelector('input');
    this.icon = this.shadowRoot.querySelector('.icon');

    this.checkChangeHandler = e => {
      this.dispatchEvent(new Event('input', { bubbles: true }));
    };

    this.inputHandler = e => {
      e.value = this.checkbox.checked;
      this.value = this.checkbox.checked;
    };

    this.iconClickHandler = e => {
      if (!this.disabled) {
        this.checkbox.checked = !this.checkbox.checked;
        this.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    this.checkbox.addEventListener('change', this.checkChangeHandler);
    this.icon.addEventListener('click', this.iconClickHandler);
    this.addEventListener('input', this.inputHandler);
  }

  disconnectedCallback() {
    this.checkbox.removeEventListener('change', this.checkChangeHandler);
    this.icon.removeEventListener('click', this.iconClickHandler);
    this.removeEventListener('change', this.inputHandler);
  }

  get checked() {
    return this.hasAttribute('checked');
  }

  set checked(value) {
    if (value) {
      this.setAttribute('checked', '');
    } else {
      this.removeAttribute('checked');
    }
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) {
      this.setAttribute('disabled', '');
    } else {
      this.removeAttribute('disabled');
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'color') {
      this.shadowRoot.querySelector('label').style.setProperty(`--color`, newValue);
    }

    if (attrName === 'label') {
      const label = this.shadowRoot.querySelector('label');
      const text = newValue ? newValue : '';
      label.textContent = text;
    }

    if (attrName === 'checked') {
      this.checkbox.checked = this.checked;
    }

    if (attrName === 'disabled') {
      this.checkbox.disabled = this.disabled;
    }
  }
}
