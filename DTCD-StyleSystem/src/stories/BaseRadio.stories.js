import BaseRadioDoc from './docs/BaseRadioDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseRadio',
  argTypes: {
    defaultSlot: { 
      type: 'string',
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
    disabled,
    checked,
    defaultSlot,
    value,
  } = args;

  const radio = document.createElement('base-radio');

  radio.innerHTML += defaultSlot;
  radio.checked = checked;
  radio.disabled = disabled;
  radio.value = value;

  return radio;
};

export const DefaultRadio = Template.bind({});
DefaultRadio.args = {
  disabled: false,
  defaultSlot: '',
  checked: false,
  value: '',
};