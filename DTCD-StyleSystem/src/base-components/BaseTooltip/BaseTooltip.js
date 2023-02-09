import html from './BaseTooltip.html';
import styles from './BaseTooltip.scss';

export default class BaseTooltip extends HTMLElement {

  #placements = ['top', 'bottom', 'left', 'right'];
  #tooltip;
  #content;

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

    this.#tooltip = this.shadowRoot.querySelector('#tooltip');
    this.#tooltip.addEventListener('animationstart', this.#animationStartHandler);
    this.#tooltip.addEventListener('animationend', this.#animationEndHandler);
  }

  get content() {
    return this.#content.innerHTML;
  }

  set content(value = '') {
    this.#tooltip.innerHTML = value;
  }

  #setContent(value = '') {
    this.#tooltip.textContent = value;
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

  #setPlacement(value = 'top') {
    const placement = this.#placements.includes(value) ? value : 'top';
    this.#tooltip.classList = `Tooltip ${placement}`;
  }

  #animationStartHandler(e) {
    if (e.animationName === 'fade-in') {
      e.target.classList.add('did-fade-in');
    }
  }

  #animationEndHandler(e) {
    if (e.animationName === 'fade-out') {
      e.target.classList.remove('did-fade-in');
    }
  }

  connectedCallback() {
    if (!this.hasAttribute('placement')) {
      this.#setPlacement('top');
    }
  }

  disconnectedCallback() {
    this.#tooltip.removeEventListener('animationstart', this.#animationStartHandler);
    this.#tooltip.removeEventListener('animationend', this.#animationEndHandler);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'content') {
      this.#setContent(newValue);
    }

    if (attrName === 'placement') {
      this.#setPlacement(newValue);
    }
  }

}