import BaseCheckbox from '../base-components/BaseCheckbox/BaseCheckbox';

import BaseCheckboxDoc from './docs/BaseCheckboxDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseCheckbox',
  argTypes: {
    defaultSlot: { 
      type: 'string',
      description: 'Default slot',
    },
  },
  parameters: {
    docs: {
      page: BaseCheckboxDoc,
    },
  },
};

const NAME_COMPONENT = 'base-checkbox';

window.customElements.define(NAME_COMPONENT, BaseCheckbox);

const Template = (args) => {
  const {
    type,
    disabled,
    checked,
    defaultSlot,
    label,
  } = args;

  const checkbox = document.createElement(NAME_COMPONENT);

  checkbox.innerHTML += defaultSlot;
  checkbox.checked = checked;
  checkbox.type = type;
  checkbox.disabled = disabled;
  checkbox.label = label;

  return checkbox;
};

export const DefaultCheckbox = Template.bind({});
DefaultCheckbox.args = {
  disabled: false,
  label: '',
  defaultSlot: '',
  checked: true,
};