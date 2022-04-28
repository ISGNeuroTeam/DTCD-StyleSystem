import iconmoonJson from '../../fonts/DataCADIcons/selection.json';

import BaseTooltipDoc from './docs/BaseTooltipDoc.mdx';

export default {
  title: 'Example/Icons/DataCADIcons',
  argTypes: {
    color: {
      control: {
        type: 'color',
      },
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
    color,
  } = args;

  const iconsContainer = document.createElement('div');
  iconsContainer.style.display = 'flex';
  iconsContainer.style.columnGap = '20px';
  iconsContainer.style.rowGap = '20px';
  iconsContainer.style.flexWrap = 'wrap';
  
  color ? iconsContainer.style.color = color : false;

  const ICON_NAMES = iconmoonJson.icons.map((iconData) => iconData.properties.name).sort();

  ICON_NAMES.forEach((iconName) => {
    const iconWrapper = document.createElement('div');
    iconWrapper.style.display = 'flex';
    iconWrapper.style.alignItems = 'center';
    iconWrapper.style.justifyContent = 'center';
    iconWrapper.style.width = '32px';
    iconWrapper.style.height = '32px';
    iconWrapper.style.border = '1px dashed var(--button_primary)';
    iconWrapper.style.borderRadius = '3px';
    iconWrapper.setAttribute('title', iconName);
    
    const icon = document.createElement('span');
    icon.classList.add('FontIcon');
    icon.classList.add(`name_${iconName}`);
    icon.style.flex = 'none';

    iconWrapper.appendChild(icon);
    iconsContainer.appendChild(iconWrapper);
  });

  return iconsContainer;
};

export const AllDataCADIcons = Template.bind({});
AllDataCADIcons.args = {};