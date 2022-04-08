import BaseRadio from '../base-components/BaseRadio/BaseRadio';

export default {
  title: 'Example/BaseComponents/BaseRadio',
  argTypes: {
    defaultSlot: { 
      type: 'string',
      description: 'Default slot',
    },
  },
};

const NAME_COMPONENT = 'base-radio';

window.customElements.define(NAME_COMPONENT, BaseRadio);

const Template = (args) => {
  const {
    disabled,
    checked,
    value,
    defaultSlot,
  } = args;

  const radio = document.createElement(NAME_COMPONENT);

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
  value: 'test',
};