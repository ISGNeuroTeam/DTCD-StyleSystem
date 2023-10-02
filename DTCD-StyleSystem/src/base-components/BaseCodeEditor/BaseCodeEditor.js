import {
  EditorView,
  basicSetup,
} from 'codemirror';
import {
  EditorState,
  Compartment,
} from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { StreamLanguage } from "@codemirror/language";
import { simpleMode } from "@codemirror/legacy-modes/mode/simple-mode";

import htmlOfCodeEditor from './BaseCodeEditor.html';
import stylesOfCodeEditor from './BaseCodeEditor.scss';

export default class BaseCodeEditor extends HTMLElement {

  #baseCodeEditor;
  #label;
  #message;
  #fieldWrapper;
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
  #readonly = false;
  #disabled = false;

  #codeMirrorView;

  #docAfterFocusString;

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
    ];
  }

  #readonlyCompartment;

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
    this.#fieldWrapper = this.shadowRoot.querySelector('.FieldWrapper');
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#message = this.shadowRoot.querySelector('.Message');

    this.#init();
  }

  #init() {
    this.#readonlyCompartment = new Compartment();

    const streamParser = StreamLanguage.define(simpleMode({
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
    }));
    streamParser.name = 'otl';

    const codeMirrorState = EditorState.create({
      extensions: [
        basicSetup,
        // javascript(),
        EditorView.updateListener.of((viewUpdate) => {
          // doc changed
          if (viewUpdate.docChanged) {
            this.dispatchEvent(new Event('input'));
          }
          if (viewUpdate.focusChanged) {
            if (viewUpdate.view.hasFocus) {
              // focus event
              this.#docAfterFocusString = viewUpdate.state.doc.toString();
            } else {
              // blur event
              if (viewUpdate.state.doc.toString() !== this.#docAfterFocusString) {
                this.dispatchEvent(new Event('change'));
              }
            }
          }
        }),
        
        this.#readonlyCompartment.of(EditorState.readOnly.of(this.readonly)),

        streamParser,
      ],
    });

    this.#codeMirrorView = new EditorView({
      state: codeMirrorState,
      parent: this.#fieldWrapper,
      tabSize: 4,
      gutters: [
        'CodeMirror-linenumbers',
        'CodeMirror-lint-markers',
      ],
      lineWrapping: true,
      lineNumbers: true,
      lint: true,
    });

    this.#cmEditor = this.#baseCodeEditor.querySelector('.cm-editor');
    this.#cmEditor && this.#cmEditor.addEventListener('input', (event) => {
      event.stopPropagation();
    });

    this.addEventListener('input', () => {
      if (this.#invalid == null && this.#doValidation) this.validate();
    });
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
    return this.#codeMirrorView.state.doc.toString();
  }

  set value(newValue) {
    if (this.#codeMirrorView) {
      const transaction = this.#codeMirrorView.state.update({
        startState: this.#codeMirrorView.state,
        changes: {
          from: 0,
          to: this.#codeMirrorView.state.doc.length,
          insert: newValue,
        },
      });
      this.#codeMirrorView.dispatchTransactions([transaction]);
    }
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
    this.#baseCodeEditor.classList[this.#disabled ? 'add' : 'remove']('disabled');
  }

  get readonly() {
    return this.#readonly;
  }

  set readonly(newValue) {
    this.#readonly = Boolean(newValue);
    
    this.#codeMirrorView.dispatch({
      effects: this.#readonlyCompartment.reconfigure(EditorState.readOnly.of(this.#readonly)),
    });

    const {classList } = this.#baseCodeEditor;
    if (this.#readonly) classList.add('disabled');
    else if ( ! this.disabled) classList.remove('disabled');
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
}
