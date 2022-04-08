import BaseSwitch from '../base-components/BaseSwitch/BaseSwitch';

export default {
  title: 'Example/BaseComponents/BaseSwitch',
};

const NAME_COMPONENT = 'base-switch';

window.customElements.define(NAME_COMPONENT, BaseSwitch);

const Template = (args) => {
  const {
    disabled,
    checked,
  } = args;

  const baseSwitch = document.createElement(NAME_COMPONENT);

  baseSwitch.checked = checked;
  baseSwitch.disabled = disabled;

  baseSwitch.addEventListener('input', () => {console.log('input')});
  baseSwitch.addEventListener('change', () => {console.log('change')});

  return baseSwitch;
};

export const DefaultSwitch = Template.bind({});
DefaultSwitch.args = {
  disabled: false,
  checked: false,
};