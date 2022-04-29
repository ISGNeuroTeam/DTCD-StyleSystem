import BaseDropdown from '../base-components/BaseDropdown/BaseDropdown';

import BaseDropdownDoc from './docs/BaseDropdownDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseDropdown',
  argTypes: {
    theme: { 
      control: {
        type: 'multi-select',
      },
      options: [
        '<no modification>',
      ],
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
        'rightTop',
      ],
    },
  },
  parameters: {
    docs: {
      page: BaseDropdownDoc,
    },
    actions: {
      handles: [
        'toggle',
      ],
    },
  }
};

const NAME_COMPONENT = 'base-dropdown';

window.customElements.define(NAME_COMPONENT, BaseDropdown);

const Template = (args) => {
  const {
    theme = [],
    slot,
    alignment,
    placement,
    opened,
  } = args;

  const dropdown = document.createElement(NAME_COMPONENT);
  dropdown.theme = theme;
  dropdown.alignment = alignment;
  dropdown.placement = placement;
  dropdown.opened = opened;
  dropdown.innerHTML += slot;
  dropdown.innerHTML += args['toggle-btn'];
  dropdown.innerHTML += args['icon-arrow'];

  return dropdown;
};

export const DefaultDropdown = Template.bind({});
DefaultDropdown.args = {
  slot: 'lorem qwe ad qwd zxd weg dxc qwa das',
  'toggle-btn': '<span slot="toggle-btn">toggle button</span>',
  'icon-arrow': '',
  theme: [],
  alignment: undefined,
  placement: undefined,
  opened: false,
};