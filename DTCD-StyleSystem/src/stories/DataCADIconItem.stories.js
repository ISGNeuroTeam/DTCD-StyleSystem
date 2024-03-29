import iconmoonJson from '../../fonts/DataCADIcons/selection.json';

import DataCADIconsDoc from './docs/DataCADIconsDoc.mdx';

const ICON_NAMES = iconmoonJson.icons.map((iconData) => iconData.properties.name).sort();

export default {
  title: 'Example/Icons/DataCADIcons',
  argTypes: {
    name: {
      control: {
        type: 'select',
      },
      options: ICON_NAMES,
    },
    size: { 
      control: {
        type: 'select',
      },
      options: [
        '<default>',
        '2xs',
        'xs',
        'sm',
        'md',
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
    '--font-icon-rotate-angle': {
      control: {
        type: 'number',
      },
    },
    color: {
      control: {
        type: 'color',
      },
    },
  },
  parameters: {
    docs: {
      page: DataCADIconsDoc,
    },
  },
};

const Template = (args) => {
  const {
    size,
    name,
    rotate,
    rotate_custom = args['--font-icon-rotate-angle'],
    color,
  } = args;

  const icon = document.createElement('span');
  icon.classList.add('FontIcon');

  if (name) {
    icon.classList.add(`name_${name}`);
  }

  if (size && size != '<default>') {
    icon.classList.add(`size_${size}`);
  }

  if (!rotate_custom) {
    if (rotate && rotate != '<default>') {
      icon.classList.add(rotate);
    }
  } else {
    icon.classList.add('rotate_custom');
    icon.setAttribute('style', `--font-icon-rotate-angle: ${rotate_custom}deg;`);
  }

  color ? icon.style.color = color : false;

  return icon;
};

export const Icon = Template.bind({});
Icon.args = {
  size: '<default>',
  name: ICON_NAMES[0],
  rotate: '<default>',
  '--font-icon-rotate-angle': 0,
  color: '',
};