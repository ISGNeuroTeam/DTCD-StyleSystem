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
    invalid: {
      control: {
        type: 'select',
      },
      options: [
        'true',
        'false',
        'undefined',
      ],
      value: 'undefined',
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
    autoClose,
  } = args;

  const divWrapper = document.createElement('div');
  const select = document.createElement('base-select');
  divWrapper.append(select);
  
  let paddingBottomDivWrapper = 0;
  if (Array.isArray(itemSlot)) {
    itemSlot.forEach((item) => {
      select.innerHTML += item;
      paddingBottomDivWrapper += 30;
    });
  }

  Object.assign(divWrapper.style, {
    'overflow': 'hidden',
    'padding-bottom': `${paddingBottomDivWrapper}px`,
  });

  select.theme = theme.length ? theme : [];
  select.label = label;
  select.value = value;
  select.search = search;
  select.size = size;
  select.opened = opened;
  select.disabled = disabled;
  select.required = required;
  select.invalid = invalid;
  select.autoClose = autoClose;

  select.innerHTML += labelSlot;

  return divWrapper;
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
  invalid: undefined,
  labelSlot: '<span slot="label">Default dropdown</span>',
  autoClose: true,
};