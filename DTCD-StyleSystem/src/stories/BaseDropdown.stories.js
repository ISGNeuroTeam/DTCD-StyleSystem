import BaseDropdown from '../base-components/BaseDropdown/BaseDropdown';

export default {
  title: 'Example/BaseComponents/BaseDropdown',
  argTypes: {
    theme: { 
      control: {
        type: 'multi-select',
      },
      options: [
        '<no modification>',
        'theme_alfa',
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
  },
  parameters: {
    actions: {
      handles: [
        'toggle',
      ],
    }
  }
};

const NAME_COMPONENT = 'base-dropdown';

window.customElements.define(NAME_COMPONENT, BaseDropdown);

const Template = (args) => {
  const {
    theme = [],
    slot,
    alignment,
    opened,
  } = args;

  const dropdown = document.createElement(NAME_COMPONENT);
  dropdown.theme = theme;
  dropdown.alignment = alignment;
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
  opened: false,
};