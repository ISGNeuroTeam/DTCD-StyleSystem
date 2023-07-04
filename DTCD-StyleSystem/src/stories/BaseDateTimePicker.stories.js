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

const Template = args => {
  const {
    visible,
    value,
    label,
    size,
    disabled,
    required,
    range,
  } = args;

  const picker = document.createElement('date-time-picker');
  picker.visible = visible;
  picker.value = value;
  picker.disabled = disabled;
  picker.required = required;
  picker.label = label;
  picker.size = size;
  picker.range = range;

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
  range: false,
};
