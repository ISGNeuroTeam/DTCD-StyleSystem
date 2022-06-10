import BaseDateTimePicker from '../base-components/BaseDateTimePicker/BaseDateTimePicker';

export default {
  title: 'Example/BaseComponents/BaseDateTimePicker',
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['<no-modification>', 'small', 'big'],
    },
  },
};

const NAME_COMPONENT = 'date-time-picker';

window.customElements.define(NAME_COMPONENT, BaseDateTimePicker);

const Template = args => {
  const { visible, value, label, size, disabled, required } = args;

  const picker = document.createElement(NAME_COMPONENT);
  picker.visible = visible;
  picker.value = value;
  picker.disabled = disabled;
  picker.required = required;
  picker.label = label;
  picker.size = size;

  return picker;
};

export const DefaultDateTimePicker = Template.bind({});
DefaultDateTimePicker.args = {
  visible: false,
  value: 1653489867960,
  label: 'Label',
  size: '',
  disabled: false,
  required: false,
};
