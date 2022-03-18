import html from './BaseColorPicker.html';
import styles from './BaseColorPicker.scss';

const colors = [
  { name: 'title', val: 'rgba(37, 34, 48, 1)' },
  { name: 'text_main', val: 'rgba(81, 81, 92, 1)' },
  { name: 'text_secondary', val: 'rgba(147, 143, 160, 1)' },
  { name: 'background_secondary', val: 'rgba(244, 244, 250, 1)' },
  { name: 'border', val: 'rgba(198, 198, 212, 1)' },
  { name: 'border_secondary', val: 'rgba(235, 235, 243, 1)' },
  { name: 'success', val: 'rgba(76, 217, 100, 1)' },
  { name: 'warning', val: 'rgba(248, 180, 7, 1)' },
  { name: 'error', val: 'rgba(255, 59, 48, 1)' },
  { name: 'aero', val: 'rgba(98, 144, 195, 1)' },
  { name: 'navi', val: 'rgba(69, 67, 114, 1)' },
  { name: 'brown', val: 'rgba(162, 132, 94, 1)' },
  { name: 'orange', val: 'rgba(255, 149, 0, 1)' },
  { name: 'yellow', val: 'rgba(255, 204, 0, 1)' },
  { name: 'mint', val: 'rgba(0, 199, 190, 1)' },
  { name: 'teal', val: 'rgba(48, 176, 199, 1)' },
  { name: 'cyan', val: 'rgba(50, 173, 230, 1)' },
  { name: 'indigo', val: 'rgba(88, 86, 214, 1)' },
  { name: 'purple', val: 'rgba(175, 82, 222, 1)' },
  { name: 'pink', val: 'rgba(205, 93, 103, 1)' },
  { name: 'accent', val: 'rgba(23, 86, 155, 1)' },
  { name: 'button_primary', val: 'rgba(5, 121, 246, 1)' },
];

export default class BaseColorPicker extends HTMLElement {

  #picker;
  #colorList;
  #selectedPreview;
  #colorListClickHandler;
  #selectedPreviewClickHandler;
  #value;

  static get observedAttributes() {
    return ['value', 'disabled'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#picker = this.shadowRoot.querySelector('.BaseColorPicker');
    this.#colorList = this.shadowRoot.querySelector('.ColorList');
    this.#selectedPreview = this.shadowRoot.querySelector('.Field');

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.#value = '#252230';

    this.#colorListClickHandler = ({ target }) => {
      const classes = ['SelectedColor', 'ColorPreview'];

      if (!classes.includes(target.className)) return;

      const color = target.getAttribute('data-color');
      this.#value = color;
      this.#setSelectedColorBackground(color);
      this.dispatchEvent(new Event('input', { bubbles: true }));

      this.toggle(false);
    };

    this.#selectedPreviewClickHandler = () => {
      if (!this.disabled) {
        this.toggle();
      }
    };

    this.#colorList.addEventListener('click', this.#colorListClickHandler);
    this.#selectedPreview.addEventListener('click', this.#selectedPreviewClickHandler);
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    if (value) this.setAttribute('value', value);
    else this.removeAttribute('value');
  }

  #setSelectedColorBackground(color = '#252230') {
    this.#selectedPreview.querySelector('.ColorPreview').style.backgroundColor = color;
  }

  #addColorSelected(color) {
    const selected = document.createElement('div');
    selected.className = 'SelectedColor';
    selected.setAttribute('data-color', color);

    const preview = document.createElement('div');
    preview.className = 'ColorPreview';
    preview.style.backgroundColor = color;
    preview.setAttribute('data-color', color);

    selected.appendChild(preview);
    this.#colorList.appendChild(selected);
  }

  toggle(doOpen) {
    if (doOpen == undefined) {
      this.#picker.classList.toggle('opened');
      return;
    }

    if (doOpen) {
      this.#picker.classList.add('opened');
    } else {
      this.#picker.classList.remove('opened');
    }
  }

  connectedCallback() {
    colors.forEach(c => this.#addColorSelected(c.val));
  }

  disconnectedCallback() {
    this.#colorList.removeEventListener('click', this.#colorListClickHandler);
    this.#selectedPreview.removeEventListener('click', this.#selectedPreviewClickHandler);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'disabled') {
      this.#picker.classList.toggle('disabled');
      if (this.disabled) {
        this.#picker.classList.remove('opened');
      }
    }

    if (attrName === 'value') {
      this.#value = newValue;
      this.#setSelectedColorBackground(newValue);
    }
  }
}
