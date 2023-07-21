import BaseColorPickerDoc from './docs/BaseColorPickerDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseColorPicker',
  parameters: {
    docs: {
      page: BaseColorPickerDoc,
    },
  },
};

const Template = (args) => {
  const {
    disabled,
    value,
    label,
    labelSlot,
  } = args;

  const picker = document.createElement('base-color-picker');
  picker.disabled = disabled;
  picker.value = value;
  picker.label = label;

  picker.innerHTML += labelSlot;

  return picker;
};

export const DefaultColorPicker = Template.bind({});
DefaultColorPicker.args = {
  disabled: false,
  value: '',
  label: '',
  labelSlot: '<span slot="label">Label slot</span>',
};