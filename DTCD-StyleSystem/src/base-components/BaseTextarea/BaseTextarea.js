import html from './BaseTextarea.html';
import styles from './BaseTextarea.scss';

export default class BaseTextarea extends HTMLElement {

  #label;
  #textarea;

  static get observedAttributes() {
    return ['label', 'value', 'disabled', 'placeholder'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.#label = this.shadowRoot.querySelector('.Label');
    this.#textarea = this.shadowRoot.querySelector('.Field');
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get value(){
    return this.#textarea.value
  }

  set value(val) {
    this.#textarea.value = val;
    this.dispatchEvent(new Event('input', { bubbles: true }));
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'label') {
      this.#label.textContent = newValue ? newValue : '';
    }

    if (attrName === 'value') {
      this.value = newValue;
    }

    if (attrName === 'disabled') {
      this.#textarea.disabled = this.disabled;
    }

    if (attrName === 'placeholder') {
      this.#textarea.placeholder = newValue;
    }
  }

}
