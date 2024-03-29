import DataSourceSelect from '../base-components/DataSourceSelect/DataSourceSelect';

import DataSourceSelectDoc from './docs/DataSourceSelectDoc.mdx';

export default {
  title: 'Example/BaseComponents/DataSourceSelect',
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

export const DefaultDataSourceSelect = Template.bind({});
DefaultDataSourceSelect.args = {};