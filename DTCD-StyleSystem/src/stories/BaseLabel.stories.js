import BaseLabelDoc from './docs/BaseLabelDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseLabel',
  argTypes: {
    defaultSlot: { 
      type: 'string',
    },
  },
  parameters: {
    docs: {
      page: BaseLabelDoc,
    },
  },
};

const Template = (args) => {
  const {
    defaultSlot,
  } = args;

  const label = document.createElement('base-label');
  label.innerHTML += defaultSlot;

  return label;
};

export const DefaultLabel = Template.bind({});
DefaultLabel.args = {
  defaultSlot: 'Label',
};