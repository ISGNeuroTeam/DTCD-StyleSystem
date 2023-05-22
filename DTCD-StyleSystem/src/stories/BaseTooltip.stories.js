import BaseTooltip from '../base-components/BaseTooltip/BaseTooltip';

import BaseTooltipDoc from './docs/BaseTooltipDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseTooltip',
  argTypes: {
    placement: { 
      control: {
        type: 'select',
      },
      options: [
        '<no-modification>',
        'top',
        'bottom',
        'left',
        'right',
      ],
    },
  },
  parameters: {
    docs: {
      page: BaseTooltipDoc,
    },
  },
};

const NAME_COMPONENT = 'base-tooltip';

window.customElements.define(NAME_COMPONENT, BaseTooltip);

const Template = (args) => {
  const {
    defaultSlot,
    placement,
    content = '',
  } = args;

  const tooltip = document.createElement(NAME_COMPONENT);

  tooltip.innerHTML = defaultSlot;
  tooltip.placement = placement;
  tooltip.content = content;

  const wrapper = document.createElement('div');
        wrapper.style.margin = '30px';
        wrapper.style.overflow = 'hidden';
        wrapper.appendChild(tooltip);

  return wrapper;
};

export const DefaultTooltip = Template.bind({});
DefaultTooltip.args = {
  defaultSlot: '<button>click me</button>',
  placement: 'top',
  content: 'Tooltip',
};