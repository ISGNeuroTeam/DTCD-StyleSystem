import BaseModalWindow from '../base-components/BaseModalWindow/BaseModalWindow';
import BaseModalWindowDoc from './docs/BaseModalWindowDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseModalWindow',
  argTypes: {
    opacity: { 
      control: {
        type: 'multi-select',
      },
      options: [
        '<default>',
        'light',
        'dark'
      ],
    },
  },
  parameters: {
    docs: {
      page: BaseModalWindowDoc,
    },
    actions: {
      handles: ['toggle'],
    },
  },
};

const NAME_COMPONENT = 'base-modal-window';

window.customElements.define(NAME_COMPONENT, BaseModalWindow);

const Template = args => {
  const { 
    slot, 
    opened, 
    opacity,
  } = args;

  const modal = document.createElement(NAME_COMPONENT);

  if (opacity === '<default>') {
      modal.opacity = '';
    } else {
      modal.opacity = opacity;
  }

  modal.opened = opened;
  modal.innerHTML += slot;
  modal.innerHTML += args['toggle-btn'];
  
  return modal;
};

export const DefaultBaseModalWindow = Template.bind({});
DefaultBaseModalWindow.args = {
  slot: '<div>Title here</div>',
  'toggle-btn': '<span slot="toggle-btn">open modal</span>',
  opened: false,
  opacity: '',
}
