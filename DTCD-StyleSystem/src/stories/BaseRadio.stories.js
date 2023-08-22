import BaseRadioDoc from './docs/BaseRadioDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseRadio',
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
      page: BaseRadioDoc,
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
    defaultSlot,
  } = args;

  const radio = document.createElement('base-radio');

  radio.type = type;
  radio.disabled = disabled;
  radio.checked = checked;
  radio.label = label;
  radio.value = value;

  radio.innerHTML += defaultSlot;

  return radio;
};

export const DefaultRadio = Template.bind({});
DefaultRadio.args = {
  label: '',
  disabled: false,
  checked: false,
  value: '',
  type: 'radio',
  defaultSlot: '',
};