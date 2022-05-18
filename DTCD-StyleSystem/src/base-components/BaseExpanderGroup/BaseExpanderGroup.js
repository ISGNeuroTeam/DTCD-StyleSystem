import html from './BaseExpanderGroup.html';
import styles from './BaseExpanderGroup.scss';

export default class BaseExpanderGroup extends HTMLElement {

  #slot;
  #openedExpander;

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.#slot = this.shadowRoot.querySelector('slot');
    this.#slot.addEventListener('slotchange', this.#slotChangeHandler);
  }

  #slotChangeHandler = () => {
    this.#openedExpander = null;

    this.#getExpanders().forEach((expander) => {
      if (expander.open) {
        this.#openedExpander = expander;
      }
      expander.addEventListener('click', this.#hideOtherExpanders);
    });
  };

  #hideOtherExpanders = (event) => {
    const { currentTarget } = event;
    this.#openedExpander = currentTarget;

    this.#getExpanders().forEach((expander) => {
      if (expander !== this.#openedExpander) {
        expander.open = false;
      }
    });
  };

  #getExpanders() {
    return this.#slot.assignedElements().filter(
      el => el.tagName.toLowerCase() === 'base-expander'
    );
  }

}
