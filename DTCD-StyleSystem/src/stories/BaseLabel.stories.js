import BaseLabel from '../base-components/BaseLabel/BaseLabel';

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

const NAME_COMPONENT = 'base-label';

window.customElements.define(NAME_COMPONENT, BaseLabel);

const Template = (args) => {
  const {
    defaultSlot,
  } = args;

  const label = document.createElement(NAME_COMPONENT);
  label.innerHTML += defaultSlot;

  return label;
};

export const DefaultLabel = Template.bind({});
DefaultLabel.args = {
  defaultSlot: 'Label',
};