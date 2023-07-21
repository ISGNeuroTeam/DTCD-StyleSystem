import BaseTabsDoc from './docs/BaseTabsDoc.mdx';

export default {
  title: 'Example/BaseComponents/BaseTabs',
  argTypes: {
    activeTab: {
      type: 'number',
    },
  },
  parameters: {
    docs: {
      page: BaseTabsDoc,
    },
  },
};

const Template = (args) => {
  const {
    tabSlot = [],
    activeTab,
  } = args;

  const tabs = document.createElement('base-tabs');
  tabs.activeTab = activeTab;

  tabSlot.forEach((slot) => {
    tabs.innerHTML += slot;
  });

  return tabs;
};

export const DefaultTabs = Template.bind({});
DefaultTabs.args = {
  tabSlot: [
    `<div slot="tab">Tab 1 content</div>`,
    `<span slot="tab">Tab 2 content</span>`,
    `<p slot="tab" tab-name="Test">Tab 3 content</p>`,
  ],
  activeTab: 1,
};