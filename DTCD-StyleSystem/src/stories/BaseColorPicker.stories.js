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

  const divWrapper = document.createElement('div');
        divWrapper.style.paddingBottom = '130px';
  const picker = document.createElement('base-color-picker');
  divWrapper.append(picker);

  picker.disabled = disabled;
  picker.value = value;
  picker.label = label;

  picker.innerHTML += labelSlot;

  return divWrapper;
};

export const DefaultColorPicker = Template.bind({});
DefaultColorPicker.args = {
  disabled: false,
  value: '',
  label: '',
  labelSlot: '<span slot="label">Label slot</span>',
};