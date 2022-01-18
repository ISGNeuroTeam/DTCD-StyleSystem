import html from './BaseTabs.html';

export default class BaseTabs extends HTMLElement {

  #tabList = [];
  #activeTab = 0;
  #nav;
  #tabSlot;
  #tabSlotChangeHandler;

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.#nav = this.shadowRoot.querySelector('#nav');
    this.#tabSlot = this.shadowRoot.querySelector('slot[name=tab]');
    this.#tabSlotChangeHandler = () => this.#syncTabsWithNav();

    this.#tabSlot.addEventListener('slotchange', this.#tabSlotChangeHandler);
  }

  disconnectedCallback() {
    this.#tabSlot.removeEventListener('slotchange', this.#tabSlotChangeHandler);
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
    tab.onclick = () => this.#selectTab(tabIndex);
    return tab;
  }

  #selectTab(tabIndex) {
    const activeTab = this.#tabList[this.#activeTab];
    const currentTab = this.#tabList[tabIndex];
    this.#toggleTabVisibility(false, activeTab);
    this.#toggleTabVisibility(true, currentTab);
    this.#activeTab = tabIndex;
  }

  #toggleTabVisibility(isShow = true, { tab, panel }) {
    panel.style.display = isShow ? '' : 'none';
    tab[isShow ? 'setAttribute' : 'removeAttribute']('active', '');
  }

  #syncTabsWithNav() {
    this.#clearNavTabs();

    this.#tabList = this.#tabPanels.map((panel, index) => {
      const tabName = !panel.hasAttribute('tab-name')
        ? 'Tab'
        : panel.getAttribute('tab-name');

      const tab = this.#createNavTab(index, tabName);
      this.#nav.appendChild(tab);
      panel.style.display = 'none';

      return { tab, panel };
    });

    if (this.#activeTab > this.#tabList.length - 1) this.#activeTab = 0;

    this.#tabList.length > 0 && this.#selectTab(this.#activeTab);
  }

}
