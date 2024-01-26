import BaseFileLoaderDocs from './docs/BaseFileLoaderDocs.mdx';

export default {
  title: 'Example/BaseComponents/BaseFileLoader',
  argTypes: {
    theme: { 
      control: {
        type: 'multi-select',
      },
      options: [
        '<no modification>',
        'theme_imageLoad'
      ],
    },
  },
  parameters: {
    docs: {
      page: BaseFileLoaderDocs,
    },
  },
};

const Template = (args) => {
  const {
    description,
    disabled,
    multiple,
    droppable,
    accept,
    iconSlot,
    label,
    labelSlot,
    theme = [],
  } = args;

  const fileLoader = document.createElement('base-file-loader');
  fileLoader.description = description;
  fileLoader.disabled = disabled;
  fileLoader.multiple = multiple;
  fileLoader.droppable = droppable;
  fileLoader.accept = accept;
  fileLoader.innerHTML = iconSlot;
  fileLoader.label = label;
  fileLoader.innerHTML += labelSlot;
  fileLoader.theme = theme.length ? theme : [];

  return fileLoader;
};

export const DefaultFileLoader = Template.bind({});
DefaultFileLoader.args = {
  description: 'Выберите файл',
  disabled: false,
  multiple: false,
  droppable : false,
  accept: '',
  label: '',
  labelSlot: '<span slot="label">Label slot</span>',
  iconSlot: `
  <svg slot="icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21ZM5 5V19H19V5H5ZM18 17H6L9 13L10 14L13 10L18 17ZM8.5 11C7.67157 11 7 10.3284 7 9.5C7 8.67157 7.67157 8 8.5 8C9.32843 8 10 8.67157 10 9.5C10 10.3284 9.32843 11 8.5 11Z" fill="#938FA0"/>
  </svg>
  `.trim(),
  theme: [],
};
