import html from './BaseIconBtn.html';
import styles from './BaseIconBtn.scss';

export default class BaseIconBtn extends HTMLElement {
        
  #button;

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    this.#button = this.shadowRoot.querySelector('button');
    const style = document.createElement('style');
    this.#button.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.#button = this.shadowRoot.querySelector('.BaseIconBtn');
  }
}
