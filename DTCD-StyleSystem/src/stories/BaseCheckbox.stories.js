import BaseCheckboxDoc from './docs/BaseCheckboxDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseCheckbox',
  argTypes: {
    defaultSlot: { 
      type: 'string',
    },
  },
  parameters: {
    docs: {
      page: BaseCheckboxDoc,
    },
  },
};

const Template = (args) => {
  const {
    type,
    disabled,
    checked,
    defaultSlot,
    label,
  } = args;

  const checkbox = document.createElement('base-checkbox');

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