import BaseSwitch from '../base-components/BaseSwitch/BaseSwitch';

import BaseSwitchDoc from './docs/BaseSwitchDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseSwitch',
  parameters: {
    docs: {
      page: BaseSwitchDoc,
    },
  },
};

const NAME_COMPONENT = 'base-switch';

window.customElements.define(NAME_COMPONENT, BaseSwitch);

const Template = (args) => {
  const {
    disabled,
    checked,
    value,
  } = args;

  const switchInput = document.createElement(NAME_COMPONENT);

  switchInput.checked = checked;
  switchInput.disabled = disabled;
  switchInput.value = value;

  return switchInput;
};

export const DefaultSwitch = Template.bind({});
DefaultSwitch.args = {
  disabled: false,
  checked: false,
  value: '',
};