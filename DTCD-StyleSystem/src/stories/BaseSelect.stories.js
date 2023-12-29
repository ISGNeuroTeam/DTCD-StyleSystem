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
    multiple,
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
  select.multiple = multiple;

  select.innerHTML += labelSlot;

  return divWrapper;
};

export const DefaultSelect = Template.bind({});
DefaultSelect.args = {
  label: '',
  itemSlot: [
    '<div slot="item" value="1" data-visible-value="Alfa">Alfa</div>',
    '<div slot="item" value="2" data-visible-value="Bravo">Bravo</div>',
    '<div slot="item" value="3" data-visible-value="Charlie">Charlie</div>',
    '<div slot="item" value="4" data-visible-value="Delta">Delta</div>',
    '<div slot="item" value="5" data-visible-value="Echo">Echo</div>',
    '<div slot="item" value="6" data-visible-value="Foxtrot">Foxtrot</div>',
    '<div slot="item" value="7" data-visible-value="Golf">Golf</div>',
    '<div slot="item" value="8" data-visible-value="Hotel">Hotel</div>',
    '<div slot="item" value="9" data-visible-value="India">India</div>',
    '<div slot="item" value="10" data-visible-value="Juliett">Juliett</div>',
    '<div slot="item" value="11" data-visible-value="Kilo">Kilo</div>',
    '<div slot="item" value="12" data-visible-value="Lima">Lima</div>',
    '<div slot="item" value="13" data-visible-value="Mike">Mike</div>',
    '<div slot="item" value="14" data-visible-value="November">November</div>',
    '<div slot="item" value="15" data-visible-value="Oscar">Oscar</div>',
    '<div slot="item" value="16" data-visible-value="Papa">Papa</div>',
    '<div slot="item" value="17" data-visible-value="Quebec">Quebec</div>',
    '<div slot="item" value="18" data-visible-value="Romeo">Romeo</div>',
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
  multiple: false,
};