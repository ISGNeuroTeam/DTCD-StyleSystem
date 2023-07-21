import DataSourceSelectDoc from './docs/DataSourceSelectDoc.mdx';

export default {
  title: 'Example/BaseComponents/DataSourceSelect',
  parameters: {
    docs: {
      page: DataSourceSelectDoc,
    },
  },
};

const Template = (args) => {
  const {} = args;

  const dataSourceSelect = document.createElement('datasource-select');

  return dataSourceSelect;
};

export const DefaultDataSourceSelect = Template.bind({});
DefaultDataSourceSelect.args = {};