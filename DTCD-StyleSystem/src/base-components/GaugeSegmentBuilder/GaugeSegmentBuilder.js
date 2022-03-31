import html from './GaugeSegmentBuilder.html';
import fieldsRowHtml from './FieldsRow.html';
import styles from './GaugeSegmentBuilder.scss';

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

    this.#addBtn = this.shadowRoot.querySelector('.AddButton-js');
    this.#rowList = this.shadowRoot.querySelector('.List-js');

    this.#segments = [];
    this.#proxySegments = new Proxy(this.#segments, proxySegmentsHandler);

    this.#addBtnClickHandler = () => {
      this.createNewRow();
      this.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.#addBtn.addEventListener('click', this.#addBtnClickHandler);
  }

  connectedCallback() {
    this.addEventListener('input', this.validate);
  }

  disconnectedCallback() {
    this.#addBtn.removeEventListener('click', this.#addBtnClickHandler);
    this.removeEventListener('input', this.validate);
  }

  clearRowListNodes() {
    while (this.#rowList.firstChild) {
      this.#rowList.removeChild(this.#rowList.firstChild);
    }
  }

  createNewRow(newSegmentData = null) {
    const lastSegment = this.#getLastSegment();
    const newRange = [0, 0];

    if (lastSegment) {
      const lastRangeEnd = lastSegment.range[1];
      newRange[0] = lastRangeEnd;
      newRange[1] = lastRangeEnd;
    }

    const range = newSegmentData ? newSegmentData.range : newRange;
    const color = newSegmentData ? newSegmentData.color : '#555';

    this.#proxySegments.push({ color, range });
    const curSegmentID = this.#proxySegments.length - 1;

    const newAddedRow = document.createElement('div');
          newAddedRow.className = 'FieldsRow';
          newAddedRow.innerHTML = fieldsRowHtml;

    this.#updateRangeInputFields(newAddedRow, range, curSegmentID);

    const colorPicker = newAddedRow.querySelector('.ColorPicker-js');
    colorPicker.value = color;
    colorPicker.addEventListener('input', e => {
      const segment = this.#proxySegments[curSegmentID];
      segment.color = e.target.value;
      this.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const deleteBtn = newAddedRow.querySelector('.IconBtn_type_delete-js');
    deleteBtn.segmentID = curSegmentID;
    deleteBtn.addEventListener('click', () => {
      this.value = this.#proxySegments.filter((s, i) => i !== deleteBtn.segmentID);
      this.dispatchEvent(new Event('input', { bubbles: true }));
    });

    this.#rowList.appendChild(newAddedRow);
    
    return true;
  }

  #getLastSegment() {
    const length = this.#proxySegments.length;
    return length > 0 ? this.#proxySegments[length - 1] : null;
  }

  #updateRangeInputFields(fieldsRow, range = [0, 0], segmentID) {
    const curSegment = this.#proxySegments[segmentID];
    const [startVal, endVal] = range;

    const startInput = fieldsRow.querySelector('.FieldInput_type_start-js');
    startInput.value = startVal;
    startInput.addEventListener('input', e => {
      curSegment.range[0] = Number(e.target.value);
      this.dispatchEvent(new Event('input'));
    });

    const endInput = fieldsRow.querySelector('.FieldInput_type_end-js');
    endInput.value = endVal;
    endInput.addEventListener('input', e => {
      curSegment.range[1] = Number(e.target.value);
      this.dispatchEvent(new Event('input'));
    });

    startInput.validation = val => {
      if (val > curSegment.range[1]) {
        return { isValid: false, message: 'Начало диапазона больше конца' };
      }
      return { isValid: true };
    };

    endInput.validation = val => {
      if (val < curSegment.range[0]) {
        return { isValid: false, message: 'Конец диапазона меньше начала' };
      }
      return { isValid: true };
    };

    if (segmentID >= 1) {
      const prevSegment = this.#proxySegments[segmentID - 1];
      const prevSegmentEndInput = prevSegment.inputs[1];

      const handleStartFieldInput = (event) => {
        const value = Number(event.target.value);
        prevSegment.range[1] = value;

        prevSegmentEndInput.removeEventListener('input', handlePrevSegmentEndInput);
        prevSegmentEndInput.value = value;
        prevSegmentEndInput.addEventListener('input', handlePrevSegmentEndInput);
      }

      const handlePrevSegmentEndInput = (event) => {
        const value = Number(event.target.value);
        curSegment.range[0] = value;

        startInput.removeEventListener('input', handleStartFieldInput);
        startInput.value = value;
        startInput.addEventListener('input', handleStartFieldInput);
      }

      startInput.addEventListener('input', handleStartFieldInput);
      prevSegmentEndInput.addEventListener('input', handlePrevSegmentEndInput);
    }

    this.#proxySegments[segmentID].inputs = [startInput, endInput];

    return true;
  }

  get value() {
    return this.#segments.map(({ range, color }) => ({ range, color }));
  }

  set value(newValue) {
    if (Array.isArray(newValue)) {
      this.clearRowListNodes();
      this.#segments = [];
      this.#proxySegments = new Proxy(this.#segments, proxySegmentsHandler);
      newValue.forEach(v => this.createNewRow(v));
      this.validate();
      this.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  validate() {
    this.#segments.forEach(segment => {
      segment.inputs.forEach(input => input.validate());
    });
  }
}
