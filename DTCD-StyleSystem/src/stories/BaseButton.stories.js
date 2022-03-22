import BaseButton from '../base-components/BaseButton/BaseButton';

export default {
  title: 'Example/BaseComponents/BaseButton',
  argTypes: {
    defaultSlot: { 
      type: 'string',
      description: 'Default slot',
    },
    theme: { 
      control: {
        type: 'multi-select',
      },
      options: [
        '<no modification>',
        'theme_secondary',
        'theme_green',
        'theme_blueSec',
        'theme_red',
      ],
      description: 'Configuration style component.',
    },
    type: { 
      control: {
        type: 'select',
      },
      options: [
        'button',
        'reset',
        'submit',
        'menu',
      ],
      description: 'Setting type button (attribute "type").',
    },
    size: { 
      control: {
        type: 'select',
      },
      options: [
        '<default>',
        'big',
        'small',
      ],
      description: 'Configuration size button.',
    },
    width: { 
      control: {
        type: 'select',
      },
      options: [
        '<default>',
        'full',
      ],
      description: 'Configuration width button in parent container.',
    },
    disabled: {
      description: 'Switch enable/disable button (attribute "disabled").',
    }
  },
};

const NAME_COMPONENT = 'base-button';

window.customElements.define(NAME_COMPONENT, BaseButton);

const Template = (args) => {
  const {
    theme = [],
    defaultSlot,
    disabled,
    type,
    size,
    width
  } = args;

  const button = document.createElement(NAME_COMPONENT);

  if (theme.indexOf('<no modification>') !== -1 || theme === '<no modification>') {
    button.theme = [];
  } else {
    button.theme = theme.length ? theme : [];
  }

  button.disabled = disabled;
  button.type = type;

  if (size === '<default>') {
    button.size = '';
  } else {
    button.size = size;
  }

  if (width === '<default>') {
    button.width = '';
  } else {
    button.width = width;
  }

  button.innerHTML += defaultSlot;

  return button;
};

export const ButtonWithText = Template.bind({});
ButtonWithText.args = {
  defaultSlot: 'Base button',
  theme: [],
  disabled: false,
  type: 'button',
  size: '',
  width: '',
};