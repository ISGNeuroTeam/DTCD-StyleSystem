import BaseTextarea from '../base-components/BaseTextarea/BaseTextarea';

import BaseTextareaDoc from './docs/BaseTextareaDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseTextarea',
  argTypes: {
    theme: {
      control: {
        type: 'multi-select',
      },
      options: [
        '<no modification>',
        'withSuccessFill',
        'resize_off',
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
  },
  parameters: {
    docs: {
      page: BaseTextareaDoc,
    },
  },
};

const NAME_COMPONENT = 'base-textarea';

window.customElements.define(NAME_COMPONENT, BaseTextarea);

const Template = (args) => {
  const {
    theme = [],
    placeholder,
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
    maxlength,
    minlength,
  } = args;

  const textarea = document.createElement(NAME_COMPONENT);

  if (theme.indexOf('<no modification>') !== -1 || theme === '<no modification>') {
    textarea.theme = [];
  } else {
    textarea.theme = theme.length ? theme : [];
  }

  textarea.placeholder = placeholder;
  textarea.disabled = disabled;
  textarea.label = label;
  textarea.size = size;
  textarea.required = required;
  textarea.value = value;
  textarea.readonly = readonly;
  textarea.rows = rows;
  textarea.invalid = invalid;
  textarea.autoheight = autoheight;
  textarea.maxlength = maxlength;
  textarea.minlength = minlength;
  
  textarea.innerHTML += labelSlot;
  
  return textarea;
};

export const DefaultTextarea = Template.bind({});
DefaultTextarea.args = {
  placeholder: 'placeholder',
  disabled: false,
  label: '',
  labelSlot: '<span slot="label">Label slot</span>',
  required: false,
  invalid: undefined,
  value: '',
  readonly: false,
  rows: 4,
  autoheight: false,
  maxlength: '',
  minlength: '',
};