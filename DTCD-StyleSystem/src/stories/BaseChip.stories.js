import BaseChip from '../base-components/BaseChip/BaseChip';

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

const NAME_COMPONENT = 'base-chip';

window.customElements.define(NAME_COMPONENT, BaseChip);

const Template = (args) => {
  const {
    close,
    defaultSlot,
  } = args;

  const chip = document.createElement(NAME_COMPONENT);
  chip.close = close;
  chip.innerHTML += defaultSlot;

  return chip;
};

export const DefaultChip = Template.bind({});
DefaultChip.args = {
  defaultSlot: 'Tag',
  close: false,
};