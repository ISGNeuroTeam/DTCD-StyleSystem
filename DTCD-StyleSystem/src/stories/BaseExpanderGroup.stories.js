import BaseExpanderGroupDoc from './docs/BaseExpanderGroupDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseExpander',
  argTypes: {
    itemSlot: { 
      type: 'string[]',
    },
  },
  parameters: {
    docs: {
      page: BaseExpanderGroupDoc,
    },
  },
};

const Template = (args) => {
  const {
    itemSlot = [],
    themesOfExpanders,
  } = args;

  const expanderGroup = document.createElement('base-expander-group');

  itemSlot.forEach((slot) => {
    expanderGroup.innerHTML += slot;
  });

  expanderGroup.querySelectorAll('base-expander').forEach((expander) => {
    expander.theme = themesOfExpanders;
  });

  return expanderGroup;
};

export const DefaultExpanderGroup = Template.bind({});
DefaultExpanderGroup.args = {
  itemSlot: [
    `<base-expander slot="item" open="open">
      <div slot="summary">Expander 1</div>
      Lorem ipsum dolor sit amet
    </base-expander>`,

    `<base-expander slot="item">
      <div slot="summary">Expander 2</div>
      Lorem ipsum dolor sit amet consectetur adipisicing elit.
    </base-expander>`,

    `<base-expander slot="item">
      <div slot="summary">Expander 3</div>
      Lorem ipsum dolor
    </base-expander>`,
  ],
  themesOfExpanders: ['with_borderBottom'],
};
