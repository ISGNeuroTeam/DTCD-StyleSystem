import BaseExpander from '../base-components/BaseExpander/BaseExpander';

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
    open: {
      type: 'boolean',
      description: 'Expander is open or not',
      defaultValue: false,
      table: {
        defaultValue: false,
      }
    },
  },
};

const NAME_COMPONENT = 'base-expander';

window.customElements.define(NAME_COMPONENT, BaseExpander);

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template = (args) => {
  const {
    open,
    summarySlot,
    iconSlot,
    defaultSlot,
  } = args;

  const expander = document.createElement(NAME_COMPONENT);
  expander.innerHTML += summarySlot;
  expander.innerHTML += iconSlot;
  expander.innerHTML += defaultSlot;

  if (open) {
    expander.setAttribute('open', 'open');
  } else {
    expander.removeAttribute('open');
  }

  return expander;
};

export const DefaultExpander = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
DefaultExpander.args = {
  summarySlot: '<div slot="summary">Summary slot</div>',
  iconSlot: '',
  defaultSlot: 'Default slot. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis veniam, dolor explicabo dolore nobis, minima rerum obcaecati eius fuga fugit, nemo consequuntur nesciunt itaque necessitatibus repellendus recusandae porro soluta consequatur?',
  open: false,
};
