import html from './BaseTextarea.html';

export default class BaseTextarea extends HTMLElement {

  static get observedAttributes() {
    return [
      'width',
      'label',
      'value',
      'disabled',
      'placeholder',
    ];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.textarea = this.shadowRoot.querySelector('textarea');

    this.inputHandler = e => {
      e.value = this.textarea.value
    };

    this.addEventListener('input', this.inputHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('input', this.inputHandler);
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

  get value(){
    return this.textarea.value
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'width') {
      const width = parseFloat(newValue);
      this.textarea.style.setProperty(`--width`, `${width}px`);
    }

    if (attrName === 'label') {
      const label = this.shadowRoot.querySelector('label');
      const text = newValue ? newValue : '';
      label.textContent = text;
    }

    if (attrName === 'value') {
      this.textarea.value = newValue;
      this.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (attrName === 'disabled') {
      this.textarea.disabled = this.disabled;
    }

    if (attrName === 'placeholder') {
      this.textarea.placeholder = newValue;
    }
  }

}
