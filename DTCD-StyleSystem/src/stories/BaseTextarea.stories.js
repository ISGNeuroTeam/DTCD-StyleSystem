import BaseTextarea from '../base-components/BaseTextarea/BaseTextarea';

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
      ],
      description: 'Configuration style component.',
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
    required,
    value,
    readonly,
    labelSlot,
  } = args;

  const textarea = document.createElement(NAME_COMPONENT);

  if (theme.indexOf('<no modification>') !== -1 || theme === '<no modification>') {
    textarea.theme = [];
  } else {
    textarea.theme = theme.length ? theme : [];
  }

  textarea.innerHTML += labelSlot;

  textarea.placeholder = placeholder;
  textarea.disabled = disabled;
  textarea.label = label;
  textarea.required = required;
  textarea.value = value;
  textarea.readonly = readonly;

  return textarea;
};

export const DefaultTextarea = Template.bind({});
DefaultTextarea.args = {
  placeholder: 'placeholder',
  disabled: false,
  label: '',
  required: false,
  value: '',
  readonly: false,
  labelSlot: '<span slot="label">Label slot</span>',
};