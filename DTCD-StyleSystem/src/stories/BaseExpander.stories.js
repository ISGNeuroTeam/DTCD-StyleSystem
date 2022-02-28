import BaseExpander from '../base-components/BaseExpander/BaseExpander';

export default {
  title: 'Example/BaseComponents/BaseExpander',
};

const NAME_COMPONENT = 'base-expander';

window.customElements.define(NAME_COMPONENT, BaseExpander);

const Template = (args) => {
  const {
    open,
    summarySlot = '<div slot="summary">Summary slot</div>',
    iconSlot,
    defaultSlot = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis veniam, dolor explicabo dolore nobis, minima rerum obcaecati eius fuga fugit, nemo consequuntur nesciunt itaque necessitatibus repellendus recusandae porro soluta consequatur?'
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
DefaultExpander.args = {
  open: false,
  summarySlot: '<div slot="summary">Summary slot</div>',
  iconSlot: '',
  defaultSlot: 'Default slot. Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis veniam, dolor explicabo dolore nobis, minima rerum obcaecati eius fuga fugit, nemo consequuntur nesciunt itaque necessitatibus repellendus recusandae porro soluta consequatur?',
};
