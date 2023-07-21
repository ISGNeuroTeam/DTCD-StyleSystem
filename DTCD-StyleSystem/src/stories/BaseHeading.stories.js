import BaseHeadingDoc from './docs/BaseHeadingDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseHeading',
  argTypes: {
    defaultSlot: { 
      type: 'string',
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
    },
  },
  parameters: {
    docs: {
      page: BaseHeadingDoc,
    },
  },
};

const Template = (args) => {
  const {
    theme = [],
    defaultSlot,
  } = args;

  const heading = document.createElement('base-heading');
  heading.theme = theme.length ? theme : [];
  heading.innerHTML += defaultSlot;

  return heading;
};

export const DefaultTitle = Template.bind({});
DefaultTitle.args = {
  defaultSlot: '<h1>Base Heading</h1>',
  theme: [],
};