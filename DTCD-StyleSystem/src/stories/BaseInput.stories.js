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
        'withLeftIcon',
        'withRightIcon'
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
      options: ['<no-modification>', 'small', 'big'],
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

const Template = args => {
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
    invalid,
    maxlength,
    minlength,
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
  input.invalid = invalid;
  input.maxlength = maxlength;
  input.minlength = minlength;

  input.innerHTML += labelSlot;
  input.innerHTML += args['icon-left'];
  input.innerHTML += args['icon-right'];

  return input;
};

export const DefaultInput = Template.bind({});
DefaultInput.args = {
  theme: [],
  placeholder: 'placeholder',
  type: 'text',
  disabled: false,
  label: '',
  size: '',
  required: false,
  invalid: false,
  value: '',
  readonly: false,
  labelSlot: '<span slot="label">Label slot</span>',
  'icon-left': '',
  'icon-right': '',
  maxlength: '',
  minlength: '',
};

export const InputWithIcons = Template.bind({});
InputWithIcons.args = {
  theme: [],
  placeholder: 'placeholder',
  type: 'text',
  disabled: false,
  label: '',
  size: '',
  required: false,
  invalid: false,
  value: '',
  readonly: false,
  labelSlot: '<span slot="label">Label slot</span>',
  'icon-left': '<span slot="icon-left" class="FontIcon name_searchSmall size_lg"></span>',
  'icon-right': '<span slot="icon-right" class="FontIcon name_show size_lg"></span>',
  maxlength: '',
  minlength: '',
};
