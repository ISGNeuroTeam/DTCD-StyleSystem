import BaseColorPicker from '../base-components/BaseColorPicker/BaseColorPicker';

export default {
  title: 'Example/BaseComponents/BaseColorPicker',
  argTypes: {
    defaultSlot: { 
        type: 'string',
        description: 'Default slot',
    },
  },
};

const NAME_COMPONENT = 'base-color-picker';

window.customElements.define(NAME_COMPONENT, BaseColorPicker);

const Template = (args) => {
  const {
    type,
    disabled,
    value,
  } = args;

  const picker = document.createElement(NAME_COMPONENT);


  picker.type = type;
  picker.disabled = disabled;
  picker.value = value;

  return picker;
};

export const DefaultPicker = Template.bind({});
DefaultPicker.args = {
  defaultSlot: '',
  type: '',
  disabled: false,
  value: '',
};