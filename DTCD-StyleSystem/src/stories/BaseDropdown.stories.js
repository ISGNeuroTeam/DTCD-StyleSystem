import BaseDropdown from '../base-components/BaseDropdown/BaseDropdown';

export default {
  title: 'Example/BaseComponents/BaseDropdown',
  argTypes: {
    defaultSlot: { 
      type: 'string',
      description: 'Default slot',
    },
    toggleBtnSlot: { 
      type: 'string',
      description: 'Default slot',
    },
    iconArrowSlot: { 
      type: 'string',
      description: 'Default slot',
    },
    theme: { 
      control: {
        type: 'select',
      },
      options: [
        '<no modification>',
        'theme_alfa',
      ],
      description: 'Configuration view component',
    },
  },
};

const NAME_COMPONENT = 'base-dropdown';

window.customElements.define(NAME_COMPONENT, BaseDropdown);

const Template = (args) => {
  const {
    theme = [],
    defaultSlot,
    toggleBtnSlot,
    iconArrowSlot,
  } = args;

  const dropdown = document.createElement(NAME_COMPONENT);
  dropdown.theme = theme.length ? theme : [];
  dropdown.innerHTML += defaultSlot;
  dropdown.innerHTML += toggleBtnSlot;
  dropdown.innerHTML += iconArrowSlot;

  return dropdown;
};

export const DefaultDropdown = Template.bind({});
DefaultDropdown.args = {
  defaultSlot: 'lorem',
  toggleBtnSlot: '<span slot="toggle-btn"></span>',
  iconArrowSlot: '<span slot="icon-arrow">v</span>',
  theme: [],
};