import BaseCheckboxDoc from './docs/BaseCheckboxDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseCheckbox',
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
      page: BaseCheckboxDoc,
    },
  },
};

const Template = (args) => {
  const {
    type,
    disabled,
    checked,
    label,
    defaultSlot,
    placement,
  } = args;

  const checkbox = document.createElement('base-checkbox');

  checkbox.checked = checked;
  checkbox.type = type;
  checkbox.disabled = disabled;
  checkbox.label = label;
  checkbox.placement = placement;
  
  checkbox.innerHTML += defaultSlot;

  return checkbox;
};

export const DefaultCheckbox = Template.bind({});
DefaultCheckbox.args = {
  label: '',
  disabled: false,
  checked: false,
  type: 'checkbox',
  defaultSlot: '',
  placement: undefined,
};