import BaseRadio from '../base-components/BaseRadio/BaseRadio';

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

const NAME_COMPONENT = 'base-radio';

window.customElements.define(NAME_COMPONENT, BaseRadio);

const Template = (args) => {
  const {
    disabled,
    checked,
    defaultSlot,
    value,
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
  value: '',
};