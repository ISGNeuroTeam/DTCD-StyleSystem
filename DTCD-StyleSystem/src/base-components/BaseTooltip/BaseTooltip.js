import html from './BaseTooltip.html';
import styles from './BaseTooltip.scss';

export default class BaseTooltip extends HTMLElement {

  #placements = ['top', 'bottom', 'left', 'right'];
  #placement;
  #content;

  #container;
  #tooltip;

  static get observedAttributes() {
    return ['content', 'placement'];
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

    this.#container = this.shadowRoot.querySelector('.Container');

    this.#tooltip = document.createElement('div');
    this.#tooltip.classList.add('Tooltip');
  }

  get content() {
    return this.#content.innerHTML;
  }

  set content(value = '') {
    this.#tooltip.innerHTML = value;
  }

  get placement() {
    return this.getAttribute('placement');
  }

  set placement(newValue) {
    if (newValue) {
      this.setAttribute('placement', newValue);
    } else {
      this.removeAttribute('placement');
    }
  }

  connectedCallback() {
    this.addEventListener('mouseenter', this.#handlerHoverStart);
    this.addEventListener('mouseleave', this.#handlerHoverEnd);

    if (!this.hasAttribute('placement')) {
      this.#setPlacement('top');
    }
  }

  disconnectedCallback() {
    this.removeEventListener('mouseenter', this.#handlerHoverStart);
    this.removeEventListener('mouseleave', this.#handlerHoverEnd);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'content') {
      this.#tooltip.innerHTML = newValue;
    }

    if (attrName === 'placement') {
      this.#setPlacement(newValue);
    }
  }

  #setPlacement(value = 'top') {
    this.#placement = this.#placements.includes(value) ? value : 'top';
    this.#tooltip.classList = `Tooltip ${this.#placement}`;
  }

  #setPosition() {
    const {
      height,
      width,
      left,
      top,
    } = this.getBoundingClientRect();

    const {
      style,
    } = this.#tooltip;

    switch (this.#placement) {
      case 'bottom':
        style.top = (top + height) + 'px';
        style.left = (left + width / 2) + 'px';
        break;

      case 'top':
        style.top = top + 'px';
        style.left = (left + width / 2) + 'px';
        break;

      case 'left':
        style.top = (top + height / 2) + 'px';
        style.left = left + 'px';
        break;

      case 'right':
        style.top = (top + height / 2) + 'px';
        style.left = (left + width) + 'px';
        break;
    
      default:
        break;
    }
  }

  #handlerHoverStart() {
    this.#setPosition();
    this.#container.append(this.#tooltip);
  }

  #handlerHoverEnd() {
    this.#tooltip.remove();
  }
}