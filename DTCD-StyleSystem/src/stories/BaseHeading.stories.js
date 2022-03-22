import BaseHeading from '../base-components/BaseHeading/BaseHeading';

export default {
  title: 'Example/BaseComponents/BaseHeading',
  argTypes: {
    defaultSlot: { 
      type: 'string',
      description: 'Default slot',
    },
    theme: { 
      control: {
        type: 'select',
      },
      options: [
        '<no modification>',
        'theme_titleHeavy',
        'theme_titleLight',
        'theme_headerHeavy',
        'theme_headerLight',
        'theme_subheader',
        'theme_subheaderSmall',
      ],
      description: 'Configuration view component',
    },
  },
};

const NAME_COMPONENT = 'base-heading';

window.customElements.define(NAME_COMPONENT, BaseHeading);

const Template = (args) => {
  const {
    theme = [],
    defaultSlot,
  } = args;

  const heading = document.createElement(NAME_COMPONENT);
  heading.theme = theme.length ? theme : [];
  heading.innerHTML += defaultSlot;

  return heading;
};

export const DefaultTitle = Template.bind({});
DefaultTitle.args = {
  defaultSlot: '<h1>Base Heading</h1>',
  theme: [],
};