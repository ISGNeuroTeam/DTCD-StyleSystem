import DataSourceSelect from '../base-components/DataSourceSelect/DataSourceSelect';

export default {
  title: 'Example/BaseComponents/DataSourceSelect',
};

const NAME_COMPONENT = 'data-source-select';

window.customElements.define(NAME_COMPONENT, DataSourceSelect);

const Template = (args) => {
  const {
    defaultSlot,
  } = args;

  const selectDS = document.createElement(NAME_COMPONENT);

  selectDS.innerHTML = defaultSlot;

  return selectDS;
};

export const DefaultSelectDS = Template.bind({});
DefaultSelectDS.args = {
  defaultSlot: '<span slot="label">Label slot</span>',
};