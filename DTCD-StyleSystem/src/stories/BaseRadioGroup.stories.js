import BaseRadioGroup from '../base-components/BaseRadioGroup/BaseRadioGroup';

import BaseRadioGroupDoc from './docs/BaseRadioGroupDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseRadioGroup',
  argTypes: {
    defaultSlot: { 
      type: 'string',
    },
  },
  parameters: {
    docs: {
      page: BaseRadioGroupDoc,
    },
  },
};

const NAME_COMPONENT = 'base-radio-group';

window.customElements.define(NAME_COMPONENT, BaseRadioGroup);

const Template = (args) => {
  const {
    defaultSlot,
    value,
  } = args;

  const radioGroup = document.createElement(NAME_COMPONENT);

  radioGroup.innerHTML += defaultSlot;
  radioGroup.value = value;

  return radioGroup;
};

export const DefaultRadioGroup = Template.bind({});
DefaultRadioGroup.args = {
  defaultSlot: `
    <div>
      <base-radio value="val1">val1</base-radio>
    </div>
    <div>
      <base-radio value="val2" checked>val2</base-radio>
    </div>
    <div>
      <base-radio value="val3">val3</base-radio>
    <div>
  `,
  value: '',
};