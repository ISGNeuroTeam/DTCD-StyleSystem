import html from './BaseButton.html';

export default class BaseButton extends HTMLElement {

  static get observedAttributes() {
    return [
      'size',
      'disabled',
      'back-color',
      'text-color',
      'hover-color',
      'active-color',
    ];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.clickHandler = e => {
      this.disabled && e.stopImmediatePropagation();
    };

    this.addEventListener('click', this.clickHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.clickHandler);
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
    const button = this.shadowRoot.querySelector('button');

    if (attrName === 'disabled') {
      button.disabled = this.disabled;
    }

    const colorAttrs = [
      'back-color',
      'text-color',
      'hover-color',
      'active-color',
    ];

    if (colorAttrs.includes(attrName)) {
      button.style.setProperty(`--${attrName}`, newValue);
    }

    const sizes = ['small', 'middle', 'big'];

    if (attrName === 'size' && sizes.includes(newValue)) {
      const { classList } = button;

      for (const item of classList) {
        if (item.startsWith('size-')) {
          classList.remove(item);
          break;
        }
      }

      classList.add(`size-${newValue}`);
    }
  }

}
