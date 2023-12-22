import BaseSwitchDoc from './docs/BaseSwitchDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseSwitch',
  argTypes: {
    defaultSlot: { 
      type: 'string',
    },
    type: { 
      control: {
        type: 'select',
      },
      options: [
        'checkbox',
        'radio',
      ],
    },
    placement: {
      control: {
        type: 'select',
      },
      options: [
        '<no modification>',
        'right',
        'left',
      ],
    },
  },
  parameters: {
    docs: {
      page: BaseSwitchDoc,
    },
  },
};

const Template = (args) => {
  const {
    type,
    disabled,
    checked,
    label,
    labelSlot,
    placement,
  } = args;

  const switchInput = document.createElement('base-switch');
  
  switchInput.checked = checked;
  switchInput.type = type;
  switchInput.disabled = disabled;
  switchInput.label = label;
  switchInput.placement = placement;
  
  switchInput.innerHTML += labelSlot;

  return switchInput;
};

export const DefaultSwitch = Template.bind({});
DefaultSwitch.args = {
  label: '',
  disabled: false,
  checked: false,
  type: 'checkbox',
  labelSlot: '<span slot="label">Label slot</span>',
  placement: undefined,
};
