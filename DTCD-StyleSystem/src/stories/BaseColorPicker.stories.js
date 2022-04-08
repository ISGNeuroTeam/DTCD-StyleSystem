import BaseColorPicker from '../base-components/BaseColorPicker/BaseColorPicker';

export default {
  title: 'Example/BaseComponents/BaseColorPicker',
};

const NAME_COMPONENT = 'base-color-picker';

window.customElements.define(NAME_COMPONENT, BaseColorPicker);

const Template = (args) => {
  const {
    disabled,
    value,
    label,
    labelSlot,
  } = args;

  const picker = document.createElement(NAME_COMPONENT);
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