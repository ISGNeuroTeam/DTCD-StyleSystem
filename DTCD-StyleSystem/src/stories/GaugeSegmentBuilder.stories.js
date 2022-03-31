import GaugeSegmentBuilder from '../base-components/GaugeSegmentBuilder/GaugeSegmentBuilder';

export default {
  title: 'Example/BaseComponents/GaugeSegmentBuilder',
  argTypes: {
    value: { 
      type: 'array',
      description: `Example: 
        [
          {
            range: [0, 1],
            color: 'red',
          },
          {
            range: [1, 3],
            color: 'black',
          },
        ]
      `,
    },
  },
};

const NAME_COMPONENT = 'gauge-segment-builder';

window.customElements.define(NAME_COMPONENT, GaugeSegmentBuilder);

const Template = (args) => {
  const {
    value,
  } = args;

  const gaugeSegment = document.createElement(NAME_COMPONENT);
  gaugeSegment.value = value;

  return gaugeSegment;
};

export const DefaultGaugeSegment = Template.bind({});
DefaultGaugeSegment.args = {
  value: [
    {
      range: [0, 1],
      color: 'red',
    },
    {
      range: [1, 3],
      color: 'black',
    },
  ],
};