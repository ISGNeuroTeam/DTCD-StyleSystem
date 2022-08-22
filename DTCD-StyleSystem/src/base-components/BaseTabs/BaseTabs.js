import html from './BaseTabs.html';

export default class BaseTabs extends HTMLElement {

  #tabList = [];
  #activeTab = 0;
  #nav;
  #tabSlot;
  #panelsContainer;
  #tabSlotChangeHandler;

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#nav = this.shadowRoot.querySelector('#nav');
    this.#panelsContainer = this.shadowRoot.querySelector('#panels');
    this.#tabSlot = this.shadowRoot.querySelector('slot[name=tab]');
    this.#tabSlotChangeHandler = () => this.#syncTabsWithNav();

    this.#tabSlot.addEventListener('slotchange', this.#tabSlotChangeHandler);
  }

  disconnectedCallback() {
    this.#tabSlot.removeEventListener('slotchange', this.#tabSlotChangeHandler);
  }

  get activeTab() {
    return this.#tabList[this.#activeTab];
  }

  set activeTab(tabIndex = 0) {
    this.#selectTab(tabIndex);
  }

  set isNavbarVisible(visible = true) {
    const display = visible ? 'flex' : 'none';
    const className = visible ? 'panels' : 'panels-compact';
    this.#nav.style.display = display;
    this.#panelsContainer.className = className;
  }

  get #tabPanels() {
    return this.#tabSlot.assignedElements();
  }

  #clearNavTabs() {
    this.#tabList.forEach(({ tab }) => tab.remove());
  }

  #createNavTab(tabIndex, title = '') {
    const tab = document.createElement('div');
    tab.className = 'tab';
    tab.textContent = title;
    tab.onclick = () => {
      this.activeTab = tabIndex;
    };
    return tab;
  }

  #selectTab(tabIndex, isAfterSync = false) {
    const activeTab = this.#tabList[this.#activeTab];
    const currentTab = this.#tabList[tabIndex];
    this.#toggleTabVisibility(false, activeTab);
    this.#toggleTabVisibility(true, currentTab);
    if (isAfterSync || tabIndex !== this.#activeTab) {
      this.#activeTab = tabIndex;
      this.dispatchEvent(new Event('select'));
    }
  }

  #toggleTabVisibility(isShow = true, { tab, panel }) {
    panel.style.display = isShow ? '' : 'none';
    tab[isShow ? 'setAttribute' : 'removeAttribute']('active', '');
  }

  #syncTabsWithNav() {
    this.#clearNavTabs();

    this.#tabList = this.#tabPanels.map((panel, tabIndex) => {
      const tabName = !panel.hasAttribute('tab-name')
        ? 'Tab'
        : panel.getAttribute('tab-name');

      const tab = this.#createNavTab(tabIndex, tabName);
      this.#nav.appendChild(tab);
      panel.style.display = 'none';

      return { tab, panel, tabName, tabIndex };
    });

    if (this.#activeTab > this.#tabList.length - 1) this.#activeTab = 0;

    this.#tabList.length > 0 && this.#selectTab(this.#activeTab, true);
  }

}
