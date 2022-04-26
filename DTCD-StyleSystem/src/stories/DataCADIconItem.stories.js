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
    rotate: {
      control: {
        type: 'select',
      },
      options: [
        '<default>',
        'rotate_45',
        'rotate_90',
        'rotate_135',
        'rotate_180',
        'rotate_225',
        'rotate_270',
        'rotate_315',
        'flip_horizontal',
        'flip_vertical',
        'flip_both',
      ],
    },
    rotate_custom: {
      control: {
        type: 'number',
      },
    }
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
    rotate,
    rotate_custom,
  } = args;

  const icon = document.createElement('span');
  icon.classList.add('FontIcon');

  if (name) {
    icon.classList.add(`name_${name}`);
  }

  if (size && size != '<defalut>') {
    icon.classList.add(`size_${size}`);
  }

  if (!rotate_custom) {
    if (rotate && rotate != '<defalut>') {
      icon.classList.add(rotate);
    }
  } else {
    icon.classList.add('rotate_custom');
    icon.setAttribute('style', `--font-icon-rotate-angle: ${rotate_custom}deg;`);
  }

  return icon;
};

export const Icon = Template.bind({});
Icon.args = {
  size: '<default>',
  name: ICON_NAMES[0],
  rotate: '<default>',
  rotate_custom: 0,
};