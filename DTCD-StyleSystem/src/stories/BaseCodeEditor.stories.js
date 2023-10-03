import BaseCodeEditorDoc from './docs/BaseCodeEditorDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseCodeEditor',
  argTypes: {
    theme: {
      control: {
        type: 'multi-select',
      },
      options: [
        '<no modification>',
        'withSuccessFill',
      ],
    },
    size: { 
      control: {
        type: 'select',
      },
      options: [
        '<no-modification>',
        'small',
        'big',
      ],
    },
    invalid: {
      control: {
        type: 'select',
      },
      options: [
        'true',
        'false',
        'undefined',
      ],
      value: 'undefined',
    },
    languageMode: { 
      control: {
        type: 'select',
      },
      options: [
        '<no-modification>',
        'javascript',
        'otl',
      ],
    },
  },
  parameters: {
    docs: {
      page: BaseCodeEditorDoc,
    },
  },
};

const Template = (args) => {
  const {
    theme = [],
    disabled,
    label,
    size,
    required,
    value,
    readonly,
    labelSlot,
    rows,
    invalid,
    autoheight,
    languageMode,
  } = args;

  const codeEditor = document.createElement('base-code-editor');

  if (theme.indexOf('<no modification>') !== -1 || theme === '<no modification>') {
    codeEditor.theme = [];
  } else {
    codeEditor.theme = theme.length ? theme : [];
  }

  codeEditor.disabled = disabled;
  codeEditor.label = label;
  codeEditor.size = size;
  codeEditor.required = required;
  codeEditor.value = value;
  codeEditor.readonly = readonly;
  codeEditor.rows = rows;
  codeEditor.invalid = invalid;
  codeEditor.autoheight = autoheight;
  
  codeEditor.innerHTML += labelSlot;
  codeEditor.languageMode = languageMode;
  
  return codeEditor;
};

export const DefaultCodeEditor = Template.bind({});
DefaultCodeEditor.args = {
  disabled: false,
  label: '',
  labelSlot: '<span slot="label">Label slot</span>',
  required: false,
  invalid: undefined,
  value: '',
  readonly: false,
  rows: 4,
  autoheight: false,
  languageMode: '',
};