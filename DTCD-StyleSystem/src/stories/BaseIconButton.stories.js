import BaseIconButton from '../base-components/BaseIconButton/BaseIconButton';

export default {
  title: 'Example/BaseComponents/BaseIconButton',
  argTypes: {
    defaultSlot: { 
      type: 'string',
      description: 'Default slot',
    },
    size: {
      type: 'number',
      options: {
        min: 0,
        max: 100,
        step: 1,
      },
      description: 'Size of icon button.',
    },
    color: { 
      control: {
        type: 'select',
      },
      options: [
        '<no modification>',
        'second',
        'red',
        'green',
      ],
      description: 'Select color of icon button.',
    },
    // theme: { 
    //   control: {
    //     type: 'select',
    //   },
    //   options: [
    //     '<no modification>',
    //   ],
    //   description: 'Configuration view component',
    // },
  },
};

const NAME_COMPONENT = 'base-icon-button';

window.customElements.define(NAME_COMPONENT, BaseIconButton);

const Template = (args) => {
  const {
    // theme = [],
    defaultSlot,
    disabled,
    color,
    size,
  } = args;

  const button = document.createElement(NAME_COMPONENT);
  // button.theme = theme.length ? theme : [];
  button.disabled = disabled;
  button.color = color;

  if (size) {
    button.size = size + 'px';
  }

  button.innerHTML += defaultSlot;

  return button;
};

export const DefaultIconButton = Template.bind({});
DefaultIconButton.args = {
  defaultSlot: `<svg id="circle_check_outline" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C21.9939 17.5203 17.5203 21.9939 12 22ZM11.984 20H12C16.4167 19.9956 19.9942 16.4127 19.992 11.996C19.9898 7.57929 16.4087 4 11.992 4C7.57528 4 3.99421 7.57929 3.992 11.996C3.98979 16.4127 7.56729 19.9956 11.984 20ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z" fill="#0579F7"/>
  </svg>`,
  disabled: false,
  color: '',
  size: undefined,
  // theme: [],
};