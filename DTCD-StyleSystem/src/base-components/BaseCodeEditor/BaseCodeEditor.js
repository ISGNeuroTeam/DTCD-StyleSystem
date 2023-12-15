import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/merge/merge.js';
import 'codemirror/addon/mode/simple';

import htmlOfCodeEditor from './BaseCodeEditor.html';
import stylesOfCodeEditor from './BaseCodeEditor.scss';
import createTextHover from './text-hover.js';

export default class BaseCodeEditor extends HTMLElement {

  #baseCodeEditor;
  #internalInput;
  #label;
  #message;
  #cmEditor;

  #invalid = null;
  #theme = [];
  #size;
  
  #messageText;
  #doValidation = false;
  #resultValidation = false;
  #autoheight = false;
  #rows;
  #required = false;
  #disabled = false;
  #valueAfterFocus;
  #languageMode = 'javascript';

  #codeMirrorView;
  #activateTextHover;

  static get observedAttributes() {
    return [
      'placeholder',
      'disabled',
      'label',
      'required',
      'value',
      'theme',
      'size',
      'readonly',
      'invalid',
      'rows',
      'data-autoheight',
      'data-language-mode',
    ];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = htmlOfCodeEditor;
    
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    
    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(stylesOfCodeEditor));
    
    this.#baseCodeEditor = this.shadowRoot.querySelector('.BaseInput');
    this.#internalInput = this.shadowRoot.querySelector('.Field');
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#message = this.shadowRoot.querySelector('.Message');

    this.#init();
  }
  
  #init() {
    this.#addOTLCodeHighlight();

    this.#activateTextHover = createTextHover(CodeMirror);

    this.#codeMirrorView = CodeMirror.fromTextArea(this.#internalInput, {
      tabSize: 4,
      styleActiveLine: false,
      lineNumbers: true,
      styleSelectedText: false,
      line: true,
      foldGutter: true,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-foldgutter',
      ],
      mode: this.languageMode == 'otl' ? 'text/x-otl' : {
        name: 'javascript',
        json: true,
      },
      hintOptions: {
        completeSingle: false,
      },
      matchBrackets: true,
      showCursorWhenSelecting: true,
      lineWrapping: false,
      textHover: {
        delay: 400,
      },
    });
    
    this.#cmEditor = this.shadowRoot.querySelector('.CodeMirror');
    this.#cmEditor.addEventListener('input', (event) => { event.stopPropagation(); });
    this.#cmEditor.addEventListener('keyup', this.#handleCMEditorKeyup);

    this.#codeMirrorView.on('change', this.#handleEditorChange);
    this.#codeMirrorView.on('focus', this.#handleEditorFocus);
    this.#codeMirrorView.on('blur', this.#handleEditorBlur);
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.value === '') {
      this.#messageText = 'Обязательное поле*';
      this.#resultValidation = true;
    } else if (typeof this.validation !== 'undefined') {
      const { isValid, message } = this.validation(this.value);
      this.#messageText = message;
      this.#resultValidation = !isValid;
    } else {
      this.#resultValidation = false;
    }

    this.#setInvalidStatus(this.#resultValidation);
  }

  connectedCallback() {
    this.#codeMirrorView.refresh();
    this.#codeMirrorView && (this.#doValidation = true);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'placeholder':
        this.placeholder = newValue;
        break;

      case 'disabled':
        this.disabled = this.hasAttribute('disabled');
        break;

      case 'type':
        this.type = newValue;
        break;

      case 'label':
        this.label = newValue;
        break;

      case 'value':
        this.value = newValue;
        break;

      case 'required':
        this.required = this.hasAttribute('required');
        break;

      case 'theme':
        if (newValue) {
          this.#theme = newValue.split(',').map(t => t.trim());
        } else {
          this.#theme = [];
        }
        this.#setThemeClasses();
        break;

      case 'size':
        this.#size = newValue ? newValue : undefined;
        this.#setSizeClasses();
        break;

      case 'readonly':
        this.readonly = this.hasAttribute('readonly');
        break;

      case 'invalid':
        this.invalid = newValue;
        break;

      case 'rows':
        if (oldValue !== newValue) {
          this.rows = newValue;
        }
        break;

      case 'data-autoheight':
        this.autoheight = this.hasAttribute('data-autoheight');
        break;

      case 'data-language-mode':
        this.languageMode = newValue;
        break;

      default:
        break;
    }
  }

  get invalid() {
    if (this.#invalid == true) return true;
    if (this.#resultValidation == true) return true;
    return false;
  }

  set invalid(newVal) {
    if (newVal == 'false' || newVal == false || newVal == 0 || newVal == '0') {
      this.#invalid = false;
    } else if (newVal == 'true' || newVal == true || newVal == 1 || newVal == '1') {
      this.#invalid = true;
    } else {
      this.#invalid = null;
    }

    this.#setInvalidStatus(this.#invalid);
  }

  get value() {
    return this.#codeMirrorView.doc.getValue();
  }

  set value(newValue) {
    this.#codeMirrorView && this.#codeMirrorView.doc.setValue(newValue);
    if (this.#invalid == null && this.#doValidation) this.validate();
  }

  get required() {
    return this.#required;
  }

  set required(newValue) {
    this.#required = Boolean(newValue);
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

  get disabled() {
    return this.#disabled;
  }

  set disabled(newValue) {
    this.#disabled = Boolean(newValue);
    this.#codeMirrorView.setOption('readOnly', this.disabled ? 'nocursor' : false);
    this.#baseCodeEditor.classList[this.disabled ? 'add' : 'remove']('disabled');
  }

  get readonly() {
    return this.#codeMirrorView.getOption('readOnly');
  }

  set readonly(newValue) {
    if ( this.disabled) return;
    
    this.#codeMirrorView.setOption('readOnly', Boolean(newValue));
    this.#baseCodeEditor.classList[this.readonly ? 'add' : 'remove']('disabled');
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

  get size() {
    return this.getAttribute('size');
  }

  set size(value) {
    if (value) {
      this.setAttribute('size', value);
    } else {
      this.removeAttribute('size');
    }
  }

  get autoheight() {
    return this.#autoheight;
  }

  set autoheight(value) {
    this.#autoheight = Boolean(value);
    this.rows = this.#rows;
  }

  get rows() {
    return this.#rows;
  }

  set rows(newValue) {
    this.#rows = Math.round(newValue) || 0;

    if (this.#cmEditor) {
      this.#cmEditor.style.height = '';
      this.#cmEditor.style['min-height'] = '';
  
      if (this.#rows) {
        this.#cmEditor.style[this.autoheight ? 'min-height' : 'height'] = `calc(19px * ${this.#rows} + 4px + 4px)`;
      }
    }
  }

  get languageMode () {
    return this.#languageMode;
  }

  set languageMode(newValue) {
    if (newValue == 'otl') {
      this.#codeMirrorView.setOption('mode', 'text/x-otl');
      this.#activateTextHover(this.#codeMirrorView, true);
      this.#languageMode = 'otl';
    } else {
      this.#codeMirrorView.setOption('mode', {
        name: 'javascript',
        json: true,
      });
      this.#activateTextHover(this.#codeMirrorView, false);
      this.#languageMode = 'javascript';
    }
  }

  #setThemeClasses() {
    const allThemes = [
      'withSuccessFill',
      'withError',
    ];

    const { classList } = this.#baseCodeEditor;

    for (const theme of allThemes) {
      if (this.#theme.indexOf(theme) != -1) {
        classList.add(theme);
      } else {
        classList.remove(theme);
      }
    }
  }

  #setSizeClasses() {
    if (this.#size === 'big') {
      this.#baseCodeEditor.classList.add('size_big');
    } else {
      this.#baseCodeEditor.classList.remove('size_big');
    }

    if (this.#size === 'small') {
      this.#baseCodeEditor.classList.add('size_small');
    } else {
      this.#baseCodeEditor.classList.remove('size_small');
    }
  }

  #setInvalidStatus (status) {
    const { classList } = this.#baseCodeEditor;

    if (status) {
      classList.remove('withSuccessFill');
      classList.add('withError');
    } else {
      classList.remove('withError');
    }

    this.#message.innerHTML = status && this.#messageText ? this.#messageText : '';
    this.#message.style.padding = this.#message.textContent.length ? '' : '0';
  }

  #handleEditorChange = () => {
    if (this.#invalid == null && this.#doValidation) this.validate();
    this.dispatchEvent(new Event('input'));
  }

  #handleEditorFocus = () => {
    this.#valueAfterFocus = this.value;
  }

  #handleEditorBlur = () => {
    if (this.#valueAfterFocus !== this.value) {
      this.dispatchEvent(new Event('change'));
    }
  }

  #addLineBreaks() {
    if (this.value.indexOf(`${/\s*\|/g}`)) {
      this.value = this.value.replaceAll(
        /\s*\|/g,
        '\n|',
      );
    } else {
      this.value = this.value.replaceAll(
        '|',
        '\n|',
      );
    }
    if (this.value[0] === '\n') {
      this.value = this.value.substring(1);
    }
    this.value = this.value.replaceAll(
      '\n\n|',
      '\n|',
    );
    this.value = this.value.replaceAll(
      '|\n',
      '| ',
    );
    this.value = this.value.replaceAll(
      '| \n',
      '| ',
    );
  }

  #handleCMEditorKeyup = (event) => {
    if (this.languageMode !== 'otl') return;
    if (event.key == '\\' && (event.ctrlKey || event.metaKey)) {
      this.#addLineBreaks();
    }
  }

  #addOTLCodeHighlight() {
    CodeMirror.defineSimpleMode('otl', {
      start: [
        {
          token: 'string.quoted.double',
          regex: /"/,
          next: 'string',
        },
        {
          token: 'string.quoted.single',
          regex: /(')/,
          next: 'qstring',
        },
        {
          token: 'constant.numeric',
          regex: /[+-]?\d+\b/,
        },
        {
          token: 'keyword.operator',
          regex: /[-+%=<>*]|![><=]/,
        },
        {
          token: 'lparen',
          regex: /[{([]/,
        },
        {
          token: 'rparen',
          regex: /[)\]}]/,
        },
        {
          token: 'variable.token',
          regex: /\|?\s?\$/,
          next: 'token',
        },
        {
          token: 'entity.name.function',
          regex: /\|\s\w+/,
        },
        {
          token: 'support.parameter',
          regex: /\w+\s?=/,
        },
        {
          token: 'keyword',
          regex: /\b(?:or|and|by|as)\b/,
        },
        {
          token: 'support.function',
          regex: /\b(?:count|sum|round|int|rand|max|p50|avg|dc|case|values|locate|ctime|sin|sqrt|min)\b/,
        },
        {
          regex: /[{[(]/,
          indent: true,
        },
        {
          regex: /[}\])]/,
          dedent: true,
        },
      ],
  
      qstring: [
        {
          regex: /'/,
          token: 'string',
          next: 'start',
        },
        {
          regex: /[^']+/,
          token: 'string',
        },
      ],
      string: [
        {
          regex: /"/,
          token: 'string',
          next: 'start',
        },
        {
          regex: /[^"]+/,
          token: 'string.big',
        },
      ],
      token: [
        {
          regex: /\$/,
          token: 'variable.token',
          next: 'start',
        },
        {
          regex: /[^$]+/,
          token: 'variable.token',
        },
      ],
      meta: {
        fold: 'indent',
      },
    });
  
    CodeMirror.defineMIME('text/x-otl', 'otl');
  }
}