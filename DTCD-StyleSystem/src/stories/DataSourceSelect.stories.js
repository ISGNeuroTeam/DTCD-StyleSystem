import DataSourceSelect from '../base-components/DataSourceSelect/DataSourceSelect';

import DataSourceSelectDoc from './docs/DataSourceSelectDoc.mdx';

export default {
  title: 'Example/BaseComponents/DataSourceSelect',
  argTypes: {
    placement: { 
      control: {
        type: 'select',
      },
      options: [
        '<no-modification>',
        'top',
        'bottom',
        'left',
        'right',
      ],
    },
  },
  parameters: {
    docs: {
      page: DataSourceSelectDoc,
    },
  },
};

const NAME_COMPONENT = 'datasource-select';

window.customElements.define(NAME_COMPONENT, DataSourceSelect);

const Template = (args) => {
  const {} = args;

  const dataSourceSelect = document.createElement(NAME_COMPONENT);

  return dataSourceSelect;
};

export const DefaultTabs = Template.bind({});
DefaultTabs.args = {};