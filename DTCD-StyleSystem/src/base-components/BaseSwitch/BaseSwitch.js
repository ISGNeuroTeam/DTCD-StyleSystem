import html from './BaseSwitch.html';

export default class BaseSwitch extends HTMLElement {

  static get observedAttributes() {
    return [
      'color',
      'checked',
      'disabled',
    ];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.checkbox = this.shadowRoot.querySelector('input');

    this.checkChangeHandler = () => {
      this.dispatchEvent(new Event('change', { bubbles: true }));
    };

    this.changeHandler = e => {
      e.value = this.checkbox.checked;
    };

    this.checkbox.addEventListener('change', this.checkChangeHandler);
    this.addEventListener('change', this.changeHandler);
  }

  disconnectedCallback() {
    this.checkbox.removeEventListener('change', this.checkChangeHandler);
    this.removeEventListener('change', this.changeHandler);
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
      this.shadowRoot.querySelector('.switch').style.setProperty(`--color`, newValue);
    }

    if (attrName === 'checked') {
      this.checkbox.checked = this.checked;
    }

    if (attrName === 'disabled') {
      this.checkbox.disabled = this.disabled;
    }
  }

}
