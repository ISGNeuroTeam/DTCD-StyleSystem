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
  } = args;

  const picker = document.createElement(NAME_COMPONENT);
  picker.disabled = disabled;
  picker.value = value;

  return picker;
};

export const DefaultPicker = Template.bind({});
DefaultPicker.args = {
  disabled: false,
  value: '',
};