import BaseInput from '../base-components/BaseInput/BaseInput';

import BaseInputDoc from './docs/BaseInputDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseInput',
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
    type: { 
      control: {
        type: 'select',
      },
      options: [
        'button',
        'checkbox',
        'color',
        'date',
        'datetime',
        'datetime-local',
        'email',
        'file',
        'hidden',
        'image',
        'month',
        'number',
        'password',
        'radio',
        'range',
        'reset',
        'search',
        'submit',
        'tel',
        'text',
        'time',
        'url',
        'week',
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
  },
  parameters: {
    docs: {
      page: BaseInputDoc,
    },
  },
};

const NAME_COMPONENT = 'base-input';

window.customElements.define(NAME_COMPONENT, BaseInput);

const Template = (args) => {
  const {
    theme = [],
    placeholder,
    type,
    disabled,
    label,
    size,
    required,
    value,
    readonly,
    labelSlot,
  } = args;

  const input = document.createElement(NAME_COMPONENT);

  if (theme.indexOf('<no modification>') !== -1 || theme === '<no modification>') {
    input.theme = [];
  } else {
    input.theme = theme.length ? theme : [];
  }

  input.placeholder = placeholder;
  input.type = type;
  input.disabled = disabled;
  input.label = label;
  input.size = size;
  input.required = required;
  input.value = value;
  input.readonly = readonly;
  
  input.innerHTML += labelSlot;
  
  return input;
};

export const DefaultInput = Template.bind({});
DefaultInput.args = {
  placeholder: 'placeholder',
  type: 'text',
  disabled: false,
  label: '',
  size: '',
  required: false,
  value: '',
  readonly: false,
  labelSlot: '<span slot="label">Label slot</span>',
};