import html from './GaugeSegmentBuilder.html';
import deleteIcon from './../icons/delete-icon.svg';

const proxySegmentsHandler = {
  get(target, prop) {
    return target[prop];
  },

  set(target, prop, value) {
    // console.log(`${prop} => ${value}`);
    target[prop] = value;
    return true;
  },
};

export default class BaseTextarea extends HTMLElement {

  #addBtn;
  #addBtnClickHandler;
  #rowList;
  #inputListener;
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

    this.#addBtnClickHandler = () => this.createRow();
    this.#inputListener = () => {
      // console.log('inputListener');
    }

    this.addEventListener('input', this.#inputListener);
    this.#addBtn.addEventListener('click', this.#addBtnClickHandler);
  }

  connectedCallback() {
  }

  disconnectedCallback() {
    this.removeEventListener('input', this.#inputListener);
    this.#addBtn.removeEventListener('click', this.#addBtnClickHandler);
  }

  clearRowListNodes() {
    while (this.#rowList.firstChild) {
      this.#rowList.removeChild(this.#rowList.firstChild);
    }
  }

  createSegmentsFromValue() {
    this.#proxySegments.forEach((s, i) => this.createRow(s, true, i));
  }

  createRow(segment = {}, isCreatedFromValue = false, segmentID = null) {
    if (isCreatedFromValue) {
      const { range, color } = segment;

      const row = document.createElement('div');
      row.className = 'row';

      const segments = this.createSegments(range, segmentID);
      const colorPicker = this.createColorPicker(color);
      const deleteBtn = this.createDeleteBtn();

      row.appendChild(segments);
      row.appendChild(colorPicker);
      row.appendChild(deleteBtn);

      this.#rowList.appendChild(row);
    } else {
      const { range = [0, 0], color = '#555' } = this.getLastSegment();
      const lastRow = this.getLastRow();


      const lastRowInputs = !lastRow ? [] : lastRow.querySelectorAll('.input');

      const [lastInputStart, lastInputEnd] = lastRowInputs;

      const lastInputStartVal = lastInputStart ? lastInputStart.value : 0;
      const lastInputEndVal = lastInputStart ? lastInputEnd.value : 0;

      const newRange = [lastInputEndVal, lastInputEndVal];

      const row = document.createElement('div');
      row.className = 'row';

      const newLength = this.#proxySegments.push({ color,range: newRange });

      const segments = this.createSegments(newRange, newLength - 1);
      const colorPicker = this.createColorPicker(color);
      const deleteBtn = this.createDeleteBtn();

      row.appendChild(segments);
      row.appendChild(colorPicker);
      row.appendChild(deleteBtn);

      this.#rowList.appendChild(row);
    }
  }

  getLastRow() {
    const rows = this.#rowList.querySelectorAll('.row');
    return rows.length > 0 ? rows[rows.length - 1] : null;
  }

  getLastSegment() {
    const length = this.#proxySegments.length;
    return length > 0 ? this.#proxySegments[length - 1] : {};
  }

  createSegments(range = [0, 1], segmentID = null) {
    const [startVal, endVal] = range;

    const segments = document.createElement('div');
    segments.className = 'segments';

    const segmentStart = this.createInput();
    segmentStart.value = startVal;

    const segmentEnd = this.createInput();
    segmentEnd.value = endVal;


    if (segmentID !== null) {
      const segmentLength = this.#proxySegments.length;

      let startHandler = () => {};
      let endHandler = () => {};
      let prevEndInputHandler = () => {};

      if (segmentID >= 1) {
        const prevInput = this.#proxySegments[segmentID - 1].inputs[1];
        startHandler = e => { prevInput.value = e.target.value; };
        prevInput.addEventListener('input', e => { segmentStart.value = e.target.value; });
      }

      segmentStart.addEventListener('input', startHandler);
      segmentEnd.addEventListener('input', endHandler);

      this.#proxySegments[segmentID].inputs = [segmentStart, segmentEnd ];
    }

    const divider = document.createElement('span');
    divider.className = 'divider';

    segments.appendChild(segmentStart);
    segments.appendChild(divider);
    segments.appendChild(segmentEnd);

    return segments;
  }

  createInput() {
    const input = document.createElement('base-input');
    input.setAttribute('type', 'number');
    input.className = 'input';
    return input;
  }

  createColorPicker(color = '#555') {
    const picker = document.createElement('base-color-picker');
    picker.setAttribute('value', color);
    return picker;
  }

  createDeleteBtn() {
    const btn = document.createElement('div');
    btn.innerHTML = deleteIcon;
    btn.className = 'delete-btn';
    btn.addEventListener('click', e => {
      btn.closest('.row').remove();
    });
    return btn;
  }

  get value() {
    return this.#segments.map(
      ({ range, color }) => ({ range, color })
    );
  }

  set value(val) {
    if (Array.isArray(val)) {
      this.#segments = val;
      this.#proxySegments = new Proxy(this.#segments, proxySegmentsHandler);
      this.clearRowListNodes();
      this.createSegmentsFromValue();
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
  }

}
