import {
  WorkspaceSystemAdapter,
  DataSourceSystemAdapter,
  EventSystemAdapter,
} from './../../../../DTCD-SDK/index';

import html from './DataSourceSelect.html';
import styles from './DataSourceSelect.scss';

export default class DataSourceSelect extends HTMLElement {
  #workspaceSystem;
  #dataSourceSystem;
  #eventSystem;
  #createDSBtn;
  #selectDSContainer;
  #selectDS;

  static get observedAttributes() {
    return ['placeholder', 'value', 'disabled', 'label', 'size', 'required'];
  }

  constructor() {
    super();
    this.#dataSourceSystem = new DataSourceSystemAdapter('0.2.0');
    this.#workspaceSystem = new WorkspaceSystemAdapter('0.4.0');
    this.#eventSystem = new EventSystemAdapter('0.4.0', DataSourceSelect.guid);

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({
      mode: 'open',
    }).appendChild(template.content.cloneNode(true));

    this.#selectDSContainer = this.shadowRoot.querySelector('#selectDataSourceContainer');
    this.#createDSBtn = this.shadowRoot.querySelector('#createDataSourceButton');
    this.#renderSelect();

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));
  }

  get required() {
    return this.hasAttribute('required');
  }

  get value() {
    return this.#selectDS.value;
  }

  set value(newValue) {
    this.#selectDS.value = newValue;
    this.validate();
    this.dispatchEvent(new Event('input'));
  }

  validate() {
    // TODO: HERE ADD VALIDATIONS
    if (this.required && this.value === '') {
      return (this.invalid = true);
    }
    return (this.invalid = false);
  }

  #renderSelect() {
    if (this.#selectDS) this.#selectDS.remove();
    this.#selectDS = document.createElement('base-select');
    this.#selectDS.setAttribute('id', 'selectDataSource');
    this.#selectDS.setAttribute('placeholder', 'Источник данных');
    for (let ds in this.#dataSourceSystem.getDataSourceList()) {
      const optionElement = document.createElement('div');
      optionElement.innerHTML = ds;
      optionElement.setAttribute('value', ds);
      optionElement.setAttribute('slot', 'item');
      this.#selectDS.appendChild(optionElement);
    }
    this.#selectDS.addEventListener('input', e => this.dispatchEvent(new Event('input')));
    this.#selectDSContainer.appendChild(this.#selectDS);
  }

  connectedCallback() {
    const dataSourceSystemInstance = this.#dataSourceSystem.getSystem('DataSourceSystem', '0.2.0');
    const dataSourceSystemGUID = dataSourceSystemInstance.getGUID(dataSourceSystemInstance);
    this.#createDSBtn.addEventListener('click', e => {
      this.#workspaceSystem.openPanelInModal('DatasourcePanel', '0.5.0');
    });
    this.#eventSystem.registerCustomAction(
      'updateDataSourceListByCreated',
      (({ dataSource }) => {
        this.#workspaceSystem.closeModal();
        this.#renderSelect();
        this.value = dataSource;
      }).bind(this)
    );

    this.#eventSystem.registerCustomAction(
      'updateDataSourceListByDeleted',
      (() => {
        this.#workspaceSystem.closeModal();
        this.#renderSelect();
      }).bind(this)
    );

    this.#eventSystem.subscribe(
      dataSourceSystemGUID,
      'DataSourceCreated',
      undefined,
      'updateDataSourceListByCreated'
    );

    this.#eventSystem.subscribe(
      dataSourceSystemGUID,
      'DataSourceDeleted',
      undefined,
      'updateDataSourceListByDeleted'
    );

    this.#workspaceSystem.closeModal();
  }

  disconnectedCallback() {
    const workspaceSystemInstance = this.#workspaceSystem.getSystem('WorkspaceSystem', '0.4.0');
    const workspaceSystemGUID = workspaceSystemInstance.getGUID(workspaceSystemInstance);

    this.#eventSystem.removeCustomAction('updateDataSourceList');
    this.#eventSystem.unsubscribe(
      workspaceSystemGUID,
      'CloseModal',
      undefined,
      'updateDataSourceList'
    );
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'disabled':
        if (newValue) {
          this.#selectDS.setAttribute('disable');
          this.#createDSBtn.setAttribute('disable');
        } else {
          this.#selectDS.removeAttribute('disable');
          this.#createDSBtn.removeAttribute('disable');
        }
        break;

      case 'size':
        const sizes = ['small', 'middle', 'big'];

        if (attrName === 'size' && sizes.includes(newValue)) {
          const { classList } = this.#selectDS;

          for (const item of classList) {
            if (item.startsWith('size-')) {
              classList.remove(item);
              break;
            }
          }
          classList.add(`size-${newValue}`);
        }
        break;

      case 'placeholder':
        this.#selectDS.placeholder = newValue;
        break;

      case 'required':
        this.#selectDS.setAttribute('required', newValue);
        break;

      case 'label':
        this.#selectDS.setAttribute('label', newValue);
        break;

      case 'value':
        this.value = newValue;
        break;

      default:
        break;
    }
  }
}
