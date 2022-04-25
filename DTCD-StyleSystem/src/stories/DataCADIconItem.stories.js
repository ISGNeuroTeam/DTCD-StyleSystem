import iconmoonJson from '../../fonts/DataCADIcons/selection.json';

import BaseTooltipDoc from './docs/BaseTooltipDoc.mdx';

const ICON_NAMES = [];
iconmoonJson.icons.forEach((iconData) => {
  ICON_NAMES.push(iconData.properties.name);
});

export default {
  title: 'Example/Icons/DataCADIcons',
  argTypes: {
    name: {
      control: {
        type: 'select',
      },
      options: [...ICON_NAMES],
    },
    size: { 
      control: {
        type: 'select',
      },
      options: [
        '2xs',
        'xs',
        'sm',
        '<default>',
        'lg',
        'xl',
        '2xl',
        '3xl',
      ],
    },
  },
  parameters: {
    docs: {
      page: BaseTooltipDoc,
    },
  },
};

const Template = (args) => {
  const {
    size,
    name,
  } = args;

  const icon = document.createElement('span');
  icon.classList.add('FontIcon');

  if (name) {
    icon.classList.add(`name_${name}`);
  }

  if (size && size != '<defalut>') {
    icon.classList.add(`size_${size}`);
  }

  return icon;
};

export const Icon = Template.bind({});
Icon.args = {
  size: '',
  name: ICON_NAMES[0],
};