import BaseDropdown from './BaseDropdown';

const NAME_COMPONENT = 'base-dropdown';
window.customElements.define(NAME_COMPONENT, BaseDropdown);

describe('BaseDropdown tests', () => {
  test('click out the dropdown', () => {
    const dropdown = document.createElement(NAME_COMPONENT);
    document.body.appendChild(dropdown);
    dropdown.opened = true;

    document.body.click();
    
    const isDropdownClosed = dropdown.opened === false;
    expect(isDropdownClosed).toBeTruthy();
  });

  test('click on other dropdown', () => {
    const dropdownFirst = document.createElement(NAME_COMPONENT);
    document.body.appendChild(dropdownFirst);
    dropdownFirst.opened = true;

    const dropdownSecond = document.createElement(NAME_COMPONENT);
    document.body.appendChild(dropdownSecond);
    
    dropdownSecond.shadowRoot.querySelector('.BaseDropdown').click();

    const isDropdownClosed = dropdownFirst.opened === false;
    expect(isDropdownClosed).toBeTruthy();
  });
});