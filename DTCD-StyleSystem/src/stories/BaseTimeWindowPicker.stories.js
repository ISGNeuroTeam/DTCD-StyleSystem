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
  const {
    theme = [],
    label,
    value,
    size,
    opened,
    disabled,
    required,
    invalid,
  } = args;

  const picker = document.createElement('time-window-picker');
  picker.theme = theme.length ? theme : [];
  picker.label = label;
  picker.value = value;
  picker.size = size;
  picker.opened = opened;
  picker.disabled = disabled;
  picker.required = required;
  picker.invalid = invalid;

  return picker;
};

export const DefaultTimeWindowPicker = Template.bind({});
DefaultTimeWindowPicker.args = {
  label: 'Выбрать временное окно',
  theme: [],
  value: 'all',
  opened: false,
  disabled: false,
  required: false,
  invalid: false,
};
