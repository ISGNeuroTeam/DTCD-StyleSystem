import html from './BaseColorPicker.html';
import styles from './BaseColorPicker.scss';
import iro from '@jaames/iro';
import { createPopper } from '@popperjs/core';

export default class BaseColorPicker extends HTMLElement {
  #picker;
  #label;
  #value;
  #opened = false;
  #colorPicker;

  static get observedAttributes() {
    return ['value', 'disabled', 'label'];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#picker = this.shadowRoot.querySelector('.BaseColorPicker');
    this.#colorPicker = this.shadowRoot.querySelector('.colorPicker');
    this.#label = this.shadowRoot.querySelector('.Label');

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    value ? this.setAttribute('disabled', '') : this.removeAttribute('disabled');
  }

  get value() {
    return this.#value;
  }

  set value(value) {
    value ? this.setAttribute('value', value) : this.removeAttribute('value');
  }

  get label() {
    return this.#label.innerHTML;
  }

  set label(value) {
    this.querySelectorAll('[slot="label"]').forEach(label => label.remove());
    value && (this.innerHTML += `<span slot="label">${value}</span>`);
  }

  get opened() {
    return this.#opened;
  }

  set opened(newValue) {
    newValue ? this.setAttribute('opened', true) : this.removeAttribute('opened');
  }

  toggle() {
    this.#opened = !this.#opened;
  
    if (this.#opened) {
      this.#picker.classList.add('opened');
    } else {
      this.#picker.classList.remove('opened');
    }
  }

  connectedCallback() {
    const field = this.shadowRoot.querySelector('#selectButton'); 
    const container = this.shadowRoot.querySelector('#container');

    field.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleContainer(container);
    });
    
    container.addEventListener('click', function (e) {
      e.stopPropagation();
    });

    document.addEventListener('click', function () {
      container.style.display = 'none';
    });
  }
  
  toggleContainer(container) {
    if (container.style.display === 'block') {
      container.style.display = 'none';
    } else {
      container.style.display = 'block';
      this.createColorPickerInsideContainer(container);
    }
  }

  createColorPickerInsideContainer(container) {
    const colorPickerContainer = container.querySelector('.colorPickerContainer');

    if (!colorPickerContainer) {
      const colorPickerDiv = document.createElement('div');
      colorPickerDiv.className = 'colorPickerContainer';
      container.appendChild(colorPickerDiv);

      this.#createColorPickers();
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'disabled') {
      this.#picker.classList.toggle('disabled');
      this.disabled && this.#picker.classList.remove('opened');
    }

    if (attrName === 'value') {
      this.#value = newValue;
      this.dispatchEvent(new Event('input'));
      oldValue !== newValue && this.dispatchEvent(new Event('change'));
    }

    if (attrName === 'label') {
      this.label = newValue;
    }

    if (attrName === 'opened') {
      this.toggle(Boolean(newValue));
    }
  }

  #createColorPickers() { 
    this.#colorPicker = new iro.ColorPicker(this.#colorPicker, {
      width: 180,
      color: '#0579F6',
      borderWidth: 2,
      borderColor: '#C6C6D4',
      handleRadius: 7,
      margin: 7,
      layout: [
        {
          component: iro.ui.Box,
        },
        {
          component: iro.ui.Slider,
          options: {
            id: 'hue-slider',
            sliderType: 'hue'
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            sliderType: 'alpha'
          }
        },
      ]
    });

    const hexInput = this.shadowRoot.getElementById('hex-input');
    const rgbaInput = this.shadowRoot.getElementById('rgba-input');
    const hslaInput = this.shadowRoot.getElementById('hsla-input');

    hexInput.value = this.#colorPicker.color.hexString;
    rgbaInput.value = this.#colorPicker.color.rgbaString;
    hslaInput.value = this.#colorPicker.color.hslaString;

    hexInput.addEventListener('input', () => {
      const hexValue = hexInput.value;
      this.#colorPicker.color.hexString = hexValue;
      this.#value = hexValue;
    });
  
    rgbaInput.addEventListener('input', () => {
      const rgbaValue = rgbaInput.value;
      this.#colorPicker.color.rgbaString = rgbaValue;
      this.#value = this.#colorPicker.color.hexString;
    });
  
    hslaInput.addEventListener('input', () => {
      const hslaValue = hslaInput.value;
      this.#colorPicker.color.hslaString = hslaValue;
      this.#value = this.#colorPicker.color.hexString;
    });
  
    this.#colorPicker.on('color:change', (color) => {
      hexInput.value = color.hexString;
      rgbaInput.value = color.rgbaString;
      hslaInput.value = color.hslaString;
      this.#value = color.hexString;

      field.value = color.hexString;
  
      this.dispatchEvent(new Event('input'));
      this.dispatchEvent(new Event('change'));
    });

    this.#colorPicker.on('color:change', (color) => {
      this.#value = color.hexString;
      this.shadowRoot.querySelector('#selectButton').style.backgroundColor = color.hexString;
      this.dispatchEvent(new Event('input'));
      this.dispatchEvent(new Event('change'));
    });

    const colorArray = [
      { name: 'button_primary', val: 'rgba(5, 121, 246, 1)' },
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
    ];
    
    const colorBox = this.shadowRoot.getElementById("colorBox");
    const field = this.shadowRoot.getElementById("selectButton");
    
    colorArray.forEach(color => {
      const swatch = document.createElement("div");
      swatch.className = "Swatch";
      swatch.setAttribute("data-color", color.val);
      swatch.style.background = color.val;
      colorBox.appendChild(swatch);
    });
    
    colorBox.addEventListener('click', e => {
      const clickTarget = e.target;

      if (clickTarget.dataset.color) {
        this.#colorPicker.color.set(clickTarget.dataset.color);
        this.#value = clickTarget.dataset.color;
        this.dispatchEvent(new Event('input'));
        this.dispatchEvent(new Event('change'));
      }
    });

    const popperInstance = createPopper(field, container, {
      placement: 'bottom-start',
    });
  }
}
