import BaseDropdownDoc from './docs/BaseDropdownDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseDropdown',
  argTypes: {
    theme: {
      control: {
        type: 'multi-select',
      },
      options: ['<no modification>'],
    },
    alignment: {
      control: {
        type: 'select',
      },
      options: [
        '<no modification>', 
        'right',
        'center',
      ],
    },
    placement: {
      control: {
        type: 'select',
      },
      options: [
        '<no modification>',
        'right',
        'left',
        'top',
        'bottom',
      ],
    },
  },
  parameters: {
    docs: {
      page: BaseDropdownDoc,
    },
    actions: {
      handles: ['toggle'],
    },
  },
};

const Template = args => {
  const { theme = [], slot, alignment, placement, opened } = args;

  const divWrapper = document.createElement('div');
        divWrapper.style.padding = '50px';
        divWrapper.style.display = 'flex';
        divWrapper.style.justifyContent = 'center';
  const dropdown = document.createElement('base-dropdown');
  divWrapper.appendChild(dropdown);

  dropdown.theme = theme;
  dropdown.alignment = alignment;
  dropdown.placement = placement;
  dropdown.opened = opened;
  dropdown.innerHTML += slot;
  dropdown.innerHTML += args['toggle-btn'];
  dropdown.innerHTML += args['icon-arrow'];

  return divWrapper;
};

export const DefaultDropdown = Template.bind({});
DefaultDropdown.args = {
  slot: '<div>lorem qwe ad qwd zxd weg dxc qwa das</div>',
  'toggle-btn': '<span slot="toggle-btn">toggle button</span>',
  'icon-arrow': '',
  theme: [],
  alignment: undefined,
  placement: undefined,
  opened: false,
};
