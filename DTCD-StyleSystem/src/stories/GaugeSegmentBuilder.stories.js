import GaugeSegmentBuilder from '../base-components/GaugeSegmentBuilder/GaugeSegmentBuilder';

import GaugeSegmentBuilderDoc from './docs/GaugeSegmentBuilderDoc.mdx';

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
  parameters: {
    docs: {
      page: GaugeSegmentBuilderDoc,
    },
  },
};

const Template = (args) => {
  const {
    value,
  } = args;

  const gaugeSegment = document.createElement('gauge-segment-builder');
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