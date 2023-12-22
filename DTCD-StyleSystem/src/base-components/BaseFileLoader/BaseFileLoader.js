import html from './BaseFileLoader.html';
import styles from './BaseFileLoader.scss';

export default class BaseFileLoader extends HTMLElement {

  #accept = '';
  #files = [];
  #input;
  #dropzone;
  #descriptionEl;
  #infoEl;
  #label;
  #theme = [];

  #dropEvents = [
    {
      name: 'dragover',
      handler: event => {
        event.preventDefault();
        event.stopPropagation();
      },
    },
    {
      name: 'dragenter',
      handler: event =>{
        event.preventDefault();
        event.stopPropagation();
        !this.disabled && this.#dropzone.classList.add('dragover');
      },
    },
    {
      name: 'dragleave',
      handler: event => {
        event.preventDefault();
        event.stopPropagation();
        this.#dropzone.classList.remove('dragover');
      },
    },
    {
      name: 'drop',
      handler: event => {
        event.preventDefault();
        event.stopPropagation();
        this.#dropzone.classList.remove('dragover');

        const { files } = event.dataTransfer;
        if (!this.disabled && files.length > 0) {
          const list = this.multiple ? [...files] : [files.item(0)];
          this.#handleFilesUpload(
            list.filter(f => this.#verifyDroppedFileFormat(f))
          );
        }
      },
    },
  ]

  static get observedAttributes() {
    return ['disabled', 'multiple', 'droppable', 'accept', 'description', 'label', 'theme'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${styles}</style>
      ${html}
    `;

    this.#input = this.shadowRoot.getElementById('input');
    this.#label = this.shadowRoot.getElementById('label');
    this.#dropzone = this.shadowRoot.getElementById('dropzone');
    this.#infoEl = this.shadowRoot.getElementById('info');
    this.#descriptionEl = this.shadowRoot.getElementById('description');

    this.#input.oninput = event => {
      event.stopPropagation();
      this.#handleFilesUpload([...event.target.files]);
    };

    this.description = 'Загрузить файл';
  }

  get value() {
    return this.#files;
  }

  get disabled() {
    return this.hasAttribute('disabled');
  }

  set disabled(value) {
    if (value) this.setAttribute('disabled', '');
    else this.removeAttribute('disabled');
  }

  get multiple() {
    return this.hasAttribute('multiple');
  }

  set multiple(value) {
    if (value) this.setAttribute('multiple', '');
    else this.removeAttribute('multiple');
  }

  get droppable() {
    return this.hasAttribute('droppable');
  }

  set droppable(value) {
    if (value) this.setAttribute('droppable', '');
    else this.removeAttribute('droppable');
  }

  get accept() {
    return this.#accept;
  }

  set accept(val) {
    this.#accept = typeof val !== 'string' ? '' : val;
    this.#input.accept = this.#accept;
  }

  get description() {
    return this.#descriptionEl.textContent;
  }

  set description(val) {
    const text = typeof val !== 'string' ? 'Загрузить файл' : val;
    this.#descriptionEl.textContent = text;
  }

  get label() {
    return this.#label.innerHTML;
  }

  set label(value) {
    this.querySelectorAll('[slot="label"]').forEach((label) => {
      label.remove();
    });

    if (value) {
      this.innerHTML += `<span slot="label">${value}</span>`;
    }
  }

  get theme() {
    return this.#theme;
  }

  set theme(value) {
    if (value) {
      if (Array.isArray(value)) {
        this.setAttribute('theme', value.join(','));
      } else {
        this.setAttribute('theme', value);
      }
    } else {
      this.removeAttribute('theme');
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'disabled': {
        this.#input.disabled = this.disabled;
        break;
      }

      case 'multiple': {
        this.#input.multiple = this.multiple;
        break;
      }

      case 'droppable': {
        this.#dropEvents.forEach(event => {
          const { name, handler } = event;
          this.#dropzone[`on${name}`] = this.droppable ? handler : null;
        });
        break;
      }

      case 'accept': {
        this.accept = newValue;
        break;
      }

      case 'description': {
        this.description = newValue;
        break;
      }

      case 'theme': {
        if (newValue) {
          this.#theme = newValue.split(',');
        } else {
          this.#theme = [];
        }
        this.#setThemeClasses();
        break;
      }

      case 'label': {
        this.label = newValue;
        break;
      }
    }
  }

  #setThemeClasses() {
    const allThemes = [
      'theme_imageLoad',
    ];

    const { classList } = this.#dropzone;
    
    for (const theme of allThemes) {
      if (this.#theme.indexOf(theme) != -1) {
        classList.add(theme);
      } else {
        classList.remove(theme);
      }
    }

    const hideCaption = classList.contains('theme_imageLoad');
    this.#descriptionEl.classList.toggle('hidden', hideCaption);
    this.#infoEl.classList.toggle('hidden', hideCaption);
  }

  #handleFilesUpload(fileList) {
    if (fileList.length <= 0) return;
  
    if (this.#theme.includes('theme_imageLoad')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const outputDiv = this.shadowRoot.getElementById('output');
  
        outputDiv.innerHTML = '';
        const img = new Image();
        img.src = e.target.result;
  
        outputDiv.appendChild(img);
        this.shadowRoot.getElementById('icon').style.display = 'none';
      };
  
      reader.readAsDataURL(fileList[0]);
    }
  
    const info = fileList.length === 1
      ? fileList[0].name
      : `Выбрано файлов: ${fileList.length}`;
  
    this.#files = fileList;
    this.#infoEl.textContent = info;
    this.#descriptionEl.hidden = true;
  
    this.dispatchEvent(new Event('input'));
  }

  #verifyDroppedFileFormat(file) {
    const { name, type } = file;

    if (!this.accept) return true;

    const checks = this.accept.split(',').map(str => {
      const format = str.trim();
      const validCases = [
        format === type,
        format.startsWith('.') && name.endsWith(format),
        format.endsWith('/*') && type.startsWith(format.slice(0, -1)),
      ];
      return validCases.includes(true);
    });

    return checks.some(c => c === true);
  }

}
