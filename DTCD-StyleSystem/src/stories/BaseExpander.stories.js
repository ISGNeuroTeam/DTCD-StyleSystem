import BaseExpander from '../base-components/BaseExpander/BaseExpander';

import BaseExpanderDoc from './docs/BaseExpanderDoc.mdx';

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: 'Example/BaseComponents/BaseExpander',
  // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
  argTypes: {
    defaultSlot: { 
      type: 'string',
    },
    'summary(slot)': { 
      type: 'string',
    },
    'icon(slot)': { 
      type: 'string',
    },
    'icon-arrow(slot)': {
      type: 'string',
    },
    theme: { 
      control: {
        type: 'multi-select',
      },
      options: [
        '',
        'with_borderBottom',
        'theme_iconLeft',
        'theme_rotate90',
      ],
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
    defaultSlot,
  } = args;

  const expander = document.createElement(NAME_COMPONENT);
  expander.innerHTML += args['summary(slot)'];
  expander.innerHTML += args['icon(slot)'];
  expander.innerHTML += args['icon-arrow(slot)'];
  expander.innerHTML += defaultSlot;

  expander.open = open ? true : false;
  expander.theme = theme?.length ? theme : [];

  return expander;
};

export const DefaultExpander = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
DefaultExpander.args = {
  'summary(slot)': '<div slot="summary">Default expander</div>',
  'icon(slot)': '',
  'icon-arrow(slot)': '',
  defaultSlot: 'Default slot. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis veniam, dolor explicabo dolore nobis, minima rerum obcaecati eius fuga fugit, nemo consequuntur nesciunt itaque necessitatibus repellendus recusandae porro soluta consequatur?',
  theme: [],
  open: false,
};

export const ExpanderWithBottomBorder = Template.bind({});
ExpanderWithBottomBorder.args = {
  'summary(slot)': '<div slot="summary">Expander with bottom border</div>',
  'icon(slot)': '',
  'icon-arrow(slot)': '',
  defaultSlot: 'Default slot. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis veniam, dolor explicabo dolore nobis, minima rerum obcaecati eius fuga fugit, nemo consequuntur nesciunt itaque necessitatibus repellendus recusandae porro soluta consequatur?',
  theme: ['with_borderBottom'],
  open: false,
};
