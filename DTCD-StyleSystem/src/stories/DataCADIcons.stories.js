import iconmoonJson from '../../fonts/DataCADIcons/selection.json';

import BaseTooltipDoc from './docs/BaseTooltipDoc.mdx';

export default {
  title: 'Example/Icons/DataCADIcons',
  argTypes: {
    size: { 
      control: {
        type: 'select',
      },
      options: [
        '1x',
        '2x',
        '3x',
        '4x',
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
  } = args;

  const iconsContainer = document.createElement('div');
  iconsContainer.style.display = 'flex';
  iconsContainer.style.columnGap = '20px';
  iconsContainer.style.rowGap = '20px';
  iconsContainer.style.flexWrap = 'wrap';

  // switch (size) {
  //   case '2x':
  //     icon.classList.add('size_2x');
  //     break;

  //   case '3x':
  //     icon.classList.add('size_3x');
  //     break;

  //   case '4x':
  //     icon.classList.add('size_4x');
  //     break;
  
  //   default:
  //     break;
  // }

  iconmoonJson.icons.forEach((iconData) => {
    const iconWrapper = document.createElement('div');
    iconWrapper.style.display = 'flex';
    iconWrapper.style.alignItems = 'center';
    iconWrapper.style.justifyContent = 'center';
    iconWrapper.style.width = '32px';
    iconWrapper.style.height = '32px';
    iconWrapper.style.border = '1px dashed var(--button_primary)';
    iconWrapper.style.borderRadius = '3px';
    iconWrapper.setAttribute('title', iconData.properties.name);
    
    const icon = document.createElement('span');
    icon.classList.add('FontIcon');
    icon.classList.add(`name_${iconData.properties.name}`);
    icon.style.flex = 'none';

    iconWrapper.appendChild(icon);
    iconsContainer.appendChild(iconWrapper);
  });

  return iconsContainer;
};

export const AllDataCADIcons = Template.bind({});
AllDataCADIcons.args = {
  size: '1x',
};