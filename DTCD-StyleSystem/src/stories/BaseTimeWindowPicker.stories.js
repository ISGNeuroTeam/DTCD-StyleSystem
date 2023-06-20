export default {
  title: 'Example/BaseComponents/BaseTimeWindowPicker',
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
  const { visible, value, label, size, disabled, required } = args;

  const picker = document.createElement('time-window-picker');
  picker.visible = visible;
  picker.value = value;
  picker.disabled = disabled;
  picker.required = required;
  picker.label = label;
  picker.size = size;

  return picker;
};

export const DefaultTimeWindowPicker = Template.bind({});
DefaultTimeWindowPicker.args = {
  visible: false,
  value: 1653489867960,
  label: 'Label',
  size: '',
  disabled: false,
  required: false,
};
