import BaseExpander from '../base-components/BaseExpander/BaseExpander';

import BaseExpanderDoc from './BaseExpanderDoc.mdx';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Example/BaseComponents/BaseExpander',
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
  argTypes: {
    defaultSlot: { 
      type: 'string',
      description: 'Default slot',
    },
    summarySlot: { 
      type: 'string',
      description: 'Slot "summary"',
    },
    iconSlot: { 
      type: 'string',
      description: 'Slot "icon"',
    },
    theme: { 
      control: {
        type: 'multi-select',
      },
      options: [
        '',
        'with_borderBottom',
      ],
      description: 'Configuration view component',
    },
    open: {
      type: 'boolean',
      description: 'Expander is open or not',
      defaultValue: false,
      table: {
        defaultValue: false,
      }
    },
  },
  parameters: {
    docs: {
      page: BaseExpanderDoc,
    }
  }
};

const NAME_COMPONENT = 'base-expander';

window.customElements.define(NAME_COMPONENT, BaseExpander);

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template = (args) => {
  const {
    theme = [],
    open,
    summarySlot,
    iconSlot,
    defaultSlot,
  } = args;

  const expander = document.createElement(NAME_COMPONENT);
  expander.innerHTML += summarySlot;
  expander.innerHTML += iconSlot;
  expander.innerHTML += defaultSlot;

  expander.open = open ? true : false;
  expander.theme = theme?.length ? theme : [];

  return expander;
};

export const DefaultExpander = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
DefaultExpander.args = {
  summarySlot: '<div slot="summary">Default expander</div>',
  iconSlot: '',
  defaultSlot: 'Default slot. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis veniam, dolor explicabo dolore nobis, minima rerum obcaecati eius fuga fugit, nemo consequuntur nesciunt itaque necessitatibus repellendus recusandae porro soluta consequatur?',
  theme: [],
  open: false,
};

export const ExpanderWithBottomBorder = Template.bind({});
ExpanderWithBottomBorder.args = {
  summarySlot: '<div slot="summary">Expander with bottom border</div>',
  iconSlot: '',
  defaultSlot: 'Default slot. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis veniam, dolor explicabo dolore nobis, minima rerum obcaecati eius fuga fugit, nemo consequuntur nesciunt itaque necessitatibus repellendus recusandae porro soluta consequatur?',
  theme: ['with_borderBottom'],
  open: false,
};
