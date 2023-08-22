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
    value,
    labelSlot,
  } = args;

  const switchInput = document.createElement('base-switch');
  
  switchInput.checked = checked;
  switchInput.type = type;
  switchInput.disabled = disabled;
  switchInput.label = label;
  switchInput.value = value;
  
  switchInput.innerHTML += labelSlot;

  return switchInput;
};

export const DefaultSwitch = Template.bind({});
DefaultSwitch.args = {
  label: '',
  disabled: false,
  checked: false,
  value: '',
  type: 'checkbox',
  labelSlot: '<span slot="label">Label slot</span>',
};