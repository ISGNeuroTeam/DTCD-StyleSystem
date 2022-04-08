import BaseRadioGroup from '../base-components/BaseRadioGroup/BaseRadioGroup';

export default {
  title: 'Example/BaseComponents/BaseRadioGroup',
  argTypes: {
    defaultSlot: { 
      type: 'string',
      description: 'Default slot',
    },
  },
};

const NAME_COMPONENT = 'base-radio-group';

window.customElements.define(NAME_COMPONENT, BaseRadioGroup);

const Template = (args) => {
  const {
    defaultSlot,
  } = args;

  const radioGroup = document.createElement(NAME_COMPONENT);

  radioGroup.innerHTML += defaultSlot;

  return radioGroup;
};

export const DefaultRadioGroup = Template.bind({});
DefaultRadioGroup.args = {
  defaultSlot: `
    <base-radio label="radio 1"></base-radio>
    <base-radio label="radio 2"></base-radio>
  `,
};