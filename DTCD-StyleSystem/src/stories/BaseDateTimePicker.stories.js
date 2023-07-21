import BaseDateTimePickerDoc from './docs/BaseDateTimePickerDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseDateTimePicker',
  parameters: {
    docs: {
      page: BaseDateTimePickerDoc,
    },
  },
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
    timepicker,
    timewindows,
  } = args;

  const picker = document.createElement('date-time-picker');
  picker.visible = visible;
  picker.value = value;
  picker.disabled = disabled;
  picker.required = required;
  picker.label = label;
  picker.size = size;
  picker.range = range;
  picker.timepicker = timepicker;
  picker.timewindows = timewindows;

  return picker;
};

export const DefaultDateTimePicker = Template.bind({});
DefaultDateTimePicker.args = {
  visible: false,
  value: String(Date.now()),
  label: 'Label',
  size: '',
  disabled: false,
  required: false,
  range: false,
  timepicker: false,
  timewindows: false,
};
