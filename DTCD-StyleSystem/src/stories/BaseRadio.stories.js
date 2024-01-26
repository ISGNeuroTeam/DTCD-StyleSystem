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
    labelSlot,
    placement,
  } = args;

  const radio = document.createElement('base-radio');

  radio.type = type;
  radio.disabled = disabled;
  radio.checked = checked;
  radio.label = label;
  radio.value = value;
  radio.placement = placement;

  radio.innerHTML += labelSlot;

  return radio;
};

export const DefaultRadio = Template.bind({});
DefaultRadio.args = {
  label: '',
  disabled: false,
  checked: false,
  value: '',
  type: 'radio',
  labelSlot: '<span slot="label">Label slot</span>',
  placement: undefined,
};