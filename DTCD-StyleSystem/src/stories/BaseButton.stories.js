import BaseButtonDoc from './docs/BaseButtonDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseButton',
  argTypes: {
    defaultSlot: { 
      type: 'string',
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
        'theme_alfa',
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
    width: { 
      control: {
        type: 'select',
      },
      options: [
        '<default>',
        'full',
      ],
    },
    disabled: {}
  },
  parameters: {
    docs: {
      page: BaseButtonDoc,
    },
  },
};

const Template = (args) => {
  const {
    theme = [],
    defaultSlot,
    disabled,
    type,
    size,
    width,
    slotIconLeft,
    slotIconRight,
  } = args;

  const button = document.createElement('base-button');

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

  if (slotIconLeft) {
    button.innerHTML += slotIconLeft;
  }
  if (slotIconRight) {
    button.innerHTML += slotIconRight;
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

export const ButtonWithLeftIcon = Template.bind({});
ButtonWithLeftIcon.args = {
  defaultSlot: 'Add something',
  theme: ['theme_alfa'],
  disabled: false,
  type: 'button',
  size: '',
  width: '',
  slotIconLeft: `<svg slot="icon-left" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 6.5V9.5H5.5V6.5H2.5V5.5H5.5V2.5H6.5V5.5H9.5V6.5H6.5Z"/>
  </svg>`,
  slotIconRight: '',
};