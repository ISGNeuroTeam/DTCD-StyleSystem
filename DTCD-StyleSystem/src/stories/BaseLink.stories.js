import BaseLinkDoc from './docs/BaseLinkDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseLink',
  argTypes: {
    defaultSlot: { 
      type: 'string',
    },
  },
  parameters: {
    docs: {
      page: BaseLinkDoc,
    },
  },
};

const Template = (args) => {
  const {
    defaultSlot,
  } = args;

  const link = document.createElement('base-link');
  link.innerHTML += defaultSlot;

  return link;
};

export const DefaultLink = Template.bind({});
DefaultLink.args = {
  defaultSlot: 'Link',
};