import {
  EditorView,
  basicSetup,
} from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';

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
  #required = false;

  #codeMirrorView;

  #value;
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
    this.#fieldWrapper = this.shadowRoot.querySelector('.FieldWrapper');
    this.#label = this.shadowRoot.querySelector('.Label');
    this.#message = this.shadowRoot.querySelector('.Message');

    const codeMirrorState = EditorState.create({
      extensions: [
        basicSetup,
        javascript(),
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
        })
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
      mode: {
        name: 'javascript',
        json: true,
      },
      lint: true,
    });

    this.#cmEditor = this.#baseCodeEditor.querySelector('.cm-editor');
    this.#cmEditor && this.#cmEditor.addEventListener('input', this.#handleCMEditorInput);
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

      default:
        break;
    }
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

  set rows(newValue) {
    if (newValue && Number.isInteger(newValue)) {
      this.#cmEditor.style.height = `calc(19px * ${newValue} + 4px + 4px)`;
    } else {
      this.#cmEditor.style.height = '';
    }
  }

  #handleCMEditorInput(event) {
    event.stopPropagation();
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
