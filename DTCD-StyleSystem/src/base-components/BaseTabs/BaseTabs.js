import html from './BaseTabs.html';

export default class BaseTabs extends HTMLElement {

  #tabList = [];
  #activeTab = 0;
  #tmpActiveTab;

  #nav;
  #tabSlot;
  #panelsContainer;
  #tabSlotChangeHandler;

  static get observedAttributes() {
    return [
      'data-active-tab',
    ];
  }

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
    if (!this.#tabList.length) {
      this.#tmpActiveTab = tabIndex;
      return;
    }

    if (!isNaN(tabIndex) && tabIndex !== null) {
      this.#selectTab(parseInt(tabIndex));
    }
  }

  set isNavbarVisible(visible = true) {
    const display = visible ? 'flex' : 'none';
    const className = visible ? 'panels' : 'panels-compact';
    this.#nav.style.display = display;
    this.#panelsContainer.className = className;
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'data-active-tab':
        this.activeTab = newValue;
        break;

      default:
        break;
    }
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
    const targetActiveTab = (tabIndex > this.#tabList.length - 1)
                            ? this.#tabList.length - 1
                            : tabIndex;

    const activeTab = this.#tabList[this.#activeTab];
    const currentTab = this.#tabList[targetActiveTab];
    this.#toggleTabVisibility(false, activeTab);
    this.#toggleTabVisibility(true, currentTab);
    if (isAfterSync || targetActiveTab !== this.#activeTab) {
      this.#activeTab = targetActiveTab;
      this.dispatchEvent(new CustomEvent('select', {
        detail: {
          indexActiveTab: this.#activeTab,
        }
      }));
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

    if (this.#tabList.length > 0) {
      if (this.#tmpActiveTab !== undefined) {
        this.#selectTab(this.#tmpActiveTab, true);
        this.#tmpActiveTab = undefined;
      } else {
        this.#selectTab(this.#activeTab, true);
      }
    }
  }

}
