import html from './GaugeSegmentBuilder.html';
import deleteIcon from './../icons/delete-icon.svg';

const proxySegmentsHandler = {
  get(target, prop) {
    return target[prop];
  },

  set(target, prop, value) {
    target[prop] = value;
    return true;
  },
};

export default class BaseTextarea extends HTMLElement {

  #addBtn;
  #addBtnClickHandler;
  #rowList;
  #segments;
  #proxySegments;

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#addBtn = this.shadowRoot.querySelector('.add-btn');
    this.#rowList = this.shadowRoot.querySelector('.list');

    this.#segments = [];
    this.#proxySegments = new Proxy(this.#segments, proxySegmentsHandler);

    this.#addBtnClickHandler = () => {
      this.createNewRow();
      this.dispatchEvent(new Event('input', { bubbles: true }));
    }

    this.#addBtn.addEventListener('click', this.#addBtnClickHandler);
  }

  disconnectedCallback() {
    this.#addBtn.removeEventListener('click', this.#addBtnClickHandler);
  }

  clearRowListNodes() {
    while (this.#rowList.firstChild) {
      this.#rowList.removeChild(this.#rowList.firstChild);
    }
  }

  createNewRow(newSegmentData = null) {
    const lastSegment = this.getLastSegment();
    const newRange = [0, 0];

    if (lastSegment) {
      const lastRangeEnd = lastSegment.range[1];
      newRange[0] = lastRangeEnd;
      newRange[1] = lastRangeEnd;
    }

    const range = newSegmentData ? newSegmentData.range : newRange;
    const color = newSegmentData ? newSegmentData.color: '#555';

    this.#proxySegments.push({ color, range });
    const curSegmentID = this.#proxySegments.length - 1;

    const segments = this.createSegmentsElement(range, curSegmentID);

    const colorPicker = this.createColorPickerElement(color, curSegmentID);
    colorPicker.addEventListener('input', e => {
      const segment = this.#proxySegments[curSegmentID];
      segment.color = e.target.value;
      this.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const deleteBtn = this.createDeleteBtnElement(curSegmentID);
    deleteBtn.segmentID = curSegmentID;
    deleteBtn.addEventListener('click', () => {
      this.value = this.#proxySegments.filter((s, i) => i !== deleteBtn.segmentID);
      this.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const row = document.createElement('div');
    row.className = 'row';

    row.appendChild(segments);
    row.appendChild(colorPicker);
    row.appendChild(deleteBtn);
    this.#rowList.appendChild(row);
  }

  getLastSegment() {
    const length = this.#proxySegments.length;
    return length > 0 ? this.#proxySegments[length - 1] : null;
  }

  createSegmentsElement(range = [0, 0], segmentID) {
    const curSegment = this.#proxySegments[segmentID];
    const [startVal, endVal] = range;

    const startInput = this.createInputElement();
    startInput.value = startVal;
    startInput.addEventListener('input', e => {
      curSegment.range[0] = Number(e.target.value);
    });

    const endInput = this.createInputElement();
    endInput.value = endVal;
    endInput.addEventListener('input', e => {
      curSegment.range[1] = Number(e.target.value);
    });

    startInput.validation = (val) => {
      if (val > curSegment.range[1]) {
        return { isValid: false, message: 'Начало диапазона больше конца' };
      }
      return { isValid: true };
    };

    endInput.validation = (val) => {
      if (val < curSegment.range[0]) {
        return { isValid: false, message: 'Начало диапазона больше конца' };
      }
      return { isValid: true };
    };

    if (segmentID >= 1) {
      const prevSegment = this.#proxySegments[segmentID - 1];
      const prevSegmentEndInput = prevSegment.inputs[1];

      startInput.addEventListener('input', e => {
        const value = Number(e.target.value);
        prevSegment.range[1] = value;
        prevSegmentEndInput.value = value;
      });

      prevSegmentEndInput.addEventListener('input', e => {
        const value = Number(e.target.value);
        startInput.value = value;
        curSegment.range[0] = value;
      });
    }

    this.#proxySegments[segmentID].inputs = [startInput, endInput];

    const segments = document.createElement('div');
    segments.className = 'segments';

    const divider = document.createElement('span');
    divider.className = 'divider';

    segments.appendChild(startInput);
    segments.appendChild(divider);
    segments.appendChild(endInput);

    return segments;
  }

  createInputElement() {
    const input = document.createElement('base-input');
    input.setAttribute('type', 'number');
    input.className = 'input';
    return input;
  }

  createColorPickerElement(color) {
    const picker = document.createElement('base-color-picker');
    picker.setAttribute('value', color);
    return picker;
  }

  createDeleteBtnElement() {
    const btn = document.createElement('div');
    btn.innerHTML = deleteIcon;
    btn.className = 'delete-btn';
    return btn;
  }

  get value() {
    return this.#segments.map(
      ({ range, color }) => ({ range, color })
    );
  }

  set value(newValue) {
    if (Array.isArray(newValue)) {
      this.clearRowListNodes();
      this.#segments = [];
      this.#proxySegments = new Proxy(this.#segments, proxySegmentsHandler);
      newValue.forEach(v => this.createNewRow(v));
      this.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

}
