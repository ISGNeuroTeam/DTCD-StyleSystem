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

  const button = document.createElement(NAME_COMPONENT);
  button.innerHTML += buttonSlot;
  button.innerHTML += iconSlot;

  return button;
};

export const DefaultIconBtn = Template.bind({});
DefaultIconBtn.args = {
  buttonSlot: '<button slot=""></button>',
  iconSlot: '',
};
