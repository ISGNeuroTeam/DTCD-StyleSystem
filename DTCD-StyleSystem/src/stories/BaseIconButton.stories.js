import BaseIconButton from '../base-components/BaseIconButton/BaseIconButton';

import BaseIconButtonDoc from './docs/BaseIconButtonDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseIconButton',
  argTypes: {
    defaultSlot: { 
      type: 'text',
    },
    theme: { 
      control: {
        type: 'multi-select',
      },
      options: [
        '<no modification>',
        'theme_secondary',
        'theme_green',
        'theme_red',
      ],
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
    },
    disabled: {}
  },
  parameters: {
    docs: {
      page: BaseIconButtonDoc,
    },
  },
};

const NAME_COMPONENT = 'base-icon-button';

window.customElements.define(NAME_COMPONENT, BaseIconButton);

const Template = (args) => {
  const {
    theme = [],
    defaultSlot,
    disabled,
    type,
    size,
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

  button.innerHTML += defaultSlot;

  return button;
};

export const ButtonIcon = Template.bind({});
ButtonIcon.args = {
  defaultSlot: `<svg width="17" height="16" viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.33545 12.6668L12.6688 8.00016L5.33545 3.3335V12.6668Z"/>
  </svg>`,
  theme: [],
  disabled: false,
  type: 'button',
  size: '',
};