import BaseSelectDoc from './docs/BaseSelectDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseSelect',
  argTypes: {
    itemSlot: { 
      type: 'string[]',
    },
    size: { 
      control: {
        type: 'select',
      },
      options: [
        '<no-modification>',
        'small',
        'big',
      ],
    },
  },
  parameters: {
    docs: {
      page: BaseSelectDoc,
    },
  },
};

const Template = (args) => {
  const {
    theme = [],
    label,
    itemSlot = [],
    value,
    search,
    size,
    opened,
    disabled,
    required,
    labelSlot,
    invalid,
  } = args;

  const select = document.createElement('base-select');
  
  if (Array.isArray(itemSlot)) {
    itemSlot.forEach((item) => {
      select.innerHTML += item;
    });
  }

  select.theme = theme.length ? theme : [];
  select.label = label;
  select.value = value;
  select.search = search;
  select.size = size;
  select.opened = opened;
  select.disabled = disabled;
  select.required = required;
  select.invalid = invalid;

  select.innerHTML += labelSlot;

  return select;
};

export const DefaultSelect = Template.bind({});
DefaultSelect.args = {
  label: '',
  itemSlot: [
    '<div slot="item" value="1" data-visible-value="Alfa">Alfa (1)</div>',
    '<div slot="item" value="2" data-visible-value="Bravo">Bravo (2)</div>',
    '<div slot="item" value="3" data-visible-value="Charlie">Charlie (3)</div>',
  ],
  theme: [],
  value: '',
  search: false,
  opened: false,
  value: '',
  disabled: false,
  required: false,
  invalid: false,
  labelSlot: '<span slot="label">Default dropdown</span>',
};