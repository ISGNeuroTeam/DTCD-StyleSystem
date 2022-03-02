import BaseIconBtn from '../base-components/BaseIconBtn/BaseIconBtn';


export default {
  title: 'Example/BaseComponents/BaseIconBtn',
};

const NAME_COMPONENT = 'base-icon-btn';

window.customElements.define(NAME_COMPONENT, BaseIconBtn);

const Template = (args) => {
  const {
    buttonSlot = '<button slot=""></button>',
    iconSlot,  
  } = args;

  const expander = document.createElement(NAME_COMPONENT);
  expander.innerHTML += buttonSlot;
  expander.innerHTML += iconSlot;

  return expander;
};

export const DefaultExpander = Template.bind({});
DefaultExpander.args = {
  buttonSlot: '<button slot=""></button>',
  iconSlot: '',
};
