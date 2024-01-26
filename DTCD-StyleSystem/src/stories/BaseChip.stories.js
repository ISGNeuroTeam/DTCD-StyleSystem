import BaseChipDoc from './docs/BaseChipDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseChip',
  argTypes: {
    defaultSlot: { 
      type: 'string',
    },
    close: { 
      type: 'boolean',
    },
  },
  parameters: {
    docs: {
      page: BaseChipDoc,
    },
  },
};

const Template = (args) => {
  const {
    close,
    defaultSlot,
  } = args;

  const chip = document.createElement('base-chip');
  chip.close = close;
  chip.innerHTML += defaultSlot;

  return chip;
};

export const DefaultChip = Template.bind({});
DefaultChip.args = {
  defaultSlot: 'Tag',
  close: false,
};