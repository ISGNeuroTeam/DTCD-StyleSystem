import BaseCheckbox from '../base-components/BaseCheckbox/BaseCheckbox';

export default {
  title: 'Example/BaseComponents/BaseCheckbox',
  argTypes: {
    defaultSlot: { 
        type: 'string',
        description: 'Default slot',
    },
    theme: {
      control: {
        type: 'checkbox',
      },
      options: [
        '<no modification>',
      ],
      description: 'Configuration style component.',
    },
  },
};

const NAME_COMPONENT = 'base-checkbox';

window.customElements.define(NAME_COMPONENT, BaseCheckbox);

const Template = (args) => {
  const {
    theme = [],
    type,
    disabled,
    checked,
    defaultSlot,
  } = args;

  const checkbox = document.createElement(NAME_COMPONENT);

  if (theme.indexOf('<no modification>') !== -1 || theme === '<no modification>') {
    checkbox.theme = [];
  } else {
    checkbox.theme = theme.length ? theme : [];
  }

  
  checkbox.innerHTML += defaultSlot;
  checkbox.checked = checked;
  checkbox.type = type;
  checkbox.disabled = disabled;

  return checkbox;
};

export const DefaultCheckbox = Template.bind({});
DefaultCheckbox.args = {
  disabled: false,
  label: '',
  defaultSlot: '',
  checked: true,
};