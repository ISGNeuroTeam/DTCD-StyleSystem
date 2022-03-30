import GaugeSegmentBuilder from '../base-components/GaugeSegmentBuilder/GaugeSegmentBuilder';

export default {
  title: 'Example/BaseComponents/GaugeSegmentBuilder',
};

const NAME_COMPONENT = 'gauge-segment-builder';

window.customElements.define(NAME_COMPONENT, GaugeSegmentBuilder);

const Template = (args) => {
  const {
    iconSlot,
  } = args;

  const addBtn = document.createElement(NAME_COMPONENT);
  addBtn.innerHTML = iconSlot;

  return addBtn;
};

export const DefaultTitle = Template.bind({});
DefaultTitle.args = {
    iconSlot: '',
};