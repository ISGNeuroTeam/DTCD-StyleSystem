import BaseExpanderGroup from '../base-components/BaseExpanderGroup/BaseExpanderGroup';

export default {
  title: 'Example/BaseComponents/BaseExpander',
  argTypes: {
    itemSlot: { 
      type: 'string[]',
      description: 'Slot "item"',
    },
  },
};

const NAME_COMPONENT = 'base-expander-group';

window.customElements.define(NAME_COMPONENT, BaseExpanderGroup);

const Template = (args) => {
  const {
    itemSlot = [],
    themesOfExpanders,
  } = args;

  const expanderGroup = document.createElement(NAME_COMPONENT);

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
  themesOfExpanders: ['with_border-bottom'],
};
