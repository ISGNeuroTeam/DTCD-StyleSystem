import iconmoonJson from '../../fonts/DataCADIcons/selection.json';

import DataCADIconsDoc from './docs/DataCADIconsDoc.mdx';

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
      page: DataCADIconsDoc,
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
    iconWrapper.style.display = 'inline-flex';
    iconWrapper.style.alignItems = 'center';
    iconWrapper.style.flexWrap = 'wrap';
    iconWrapper.style.flexDirection = 'column';
    iconWrapper.style.width = '100px';
    iconWrapper.style.padding = '2px 3px';
    iconWrapper.style.wordWrap = 'anywhere';
    iconWrapper.style.textAlign = 'center';
    iconWrapper.style.border = '1px dashed var(--button_primary)';
    iconWrapper.style.borderRadius = '3px';
    iconWrapper.setAttribute('title', iconName);
    
    const icon = document.createElement('span');
    icon.classList.add('FontIcon');
    icon.classList.add(`name_${iconName}`);
    icon.style.fontSize = '40px';
    icon.style.flex = 'none';

    iconWrapper.appendChild(icon);
    iconWrapper.append(iconName);
    iconsContainer.appendChild(iconWrapper);
  });

  return iconsContainer;
};

export const AllDataCADIcons = Template.bind({});
AllDataCADIcons.args = {};