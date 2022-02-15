import html from './BaseExpandPanel.html';
import styles from "./main.scss"

export default class BaseExpandPanel extends HTMLElement {
  #container
  #expandPanel;

  static get observedAttributes() {
    return ['disabled'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    this.#container = this.shadowRoot.querySelector(".container")
    const style = document.createElement("style")
    this.#container.appendChild(style)
    style.type="text/css"
    style.appendChild(document.createTextNode(styles))


    this.#expandPanel = this.shadowRoot.querySelector('#expandPanel');
  }

  connectedCallback() {
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'disabled':
        if (newValue) this.#expandPanel.setAttribute('disabled', '');
        else this.#expandPanel.removeAttribute('disabled');
        break;

      case 'size':
        const sizes = ['small', 'middle', 'big'];

        if (attrName === 'size' && sizes.includes(newValue)) {
          const { classList } = this;

          for (const item of classList) {
            if (item.startsWith('size-')) {
              classList.remove(item);
              break;
            }
          }
          classList.add(`size-${newValue}`);
        }
        break;

      default:
        break;
    }
  }
}
