import BaseLink from '../base-components/BaseLink/BaseLink';

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

const NAME_COMPONENT = 'base-link';

window.customElements.define(NAME_COMPONENT, BaseLink);

const Template = (args) => {
  const {
    defaultSlot,
  } = args;

  const link = document.createElement(NAME_COMPONENT);
  link.innerHTML += defaultSlot;

  return link;
};

export const DefaultLink = Template.bind({});
DefaultLink.args = {
  defaultSlot: 'Link',
};