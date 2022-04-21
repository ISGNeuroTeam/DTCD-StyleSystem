import html from './BaseRadioGroup.html';

export default class BaseRadioGroup extends HTMLElement {

  #value = null;
  #slot;
  #checkedRadio;
  #slotChangeHandler;
  #radioInputHandler;

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#slot = this.shadowRoot.querySelector('slot');
    this.#slotChangeHandler = () => {
      this.#checkedRadio = null;
      this.#getRadioButtons().forEach(radio => {
        if (radio.checked) {
          if (this.#checkedRadio) {
            this.#checkedRadio.checked = false;
          }
          this.value = radio.value;
          this.#checkedRadio = radio;
        }
        radio.addEventListener('input', this.#radioInputHandler);
      });
    };

    this.#radioInputHandler = event => {
      event.stopPropagation();

      const { target } = event;

      if (this.#checkedRadio) {
        this.#checkedRadio.checked = false;
      }

      this.value = target.value;
      this.#checkedRadio = target;
    };

    this.#slot.addEventListener('slotchange', this.#slotChangeHandler);
  }

  get value() {
    return this.#value;
  }

  set value(val) {
    this.#value = val !== null ? val : '';
    this.dispatchEvent(new Event('input', { bubbles: true }));
  }

  #getRadioButtons() {
    return this.querySelectorAll('base-radio');
  }

}
