import BaseRange from '../base-components/BaseRange/BaseRange';

import BaseRangeDoc from './docs/BaseRangeDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseRange',
  parameters: {
    docs: {
      page: BaseRangeDoc,
    },
  },
};

const NAME_COMPONENT = 'base-range';

window.customElements.define(NAME_COMPONENT, BaseRange);

const Template = (args) => {
  const {
    min,
    max,
    step,
    value,
  } = args;

  const range = document.createElement(NAME_COMPONENT);

  range.min = min;
  range.max = max;
  range.step = step;
  range.value = value;

  return range;
};

export const DefaultRange = Template.bind({});
DefaultRange.args = {
  min: 0,
  max: 100,
  step: 1,
  value: 50,
};