import html from './BaseDropdown.html';
import styles from './BaseDropdown.scss';

export default class BaseDropdown extends HTMLElement {
  #theme = [];
  #opened = false;
  #alignment;
  #placement;
  #placements = ['top', 'bottom', 'left', 'right'];
  #intervalCheckingCoords;

  #dropdown;
  #toggleBtn;
  #dropdownContent;

  static get observedAttributes() {
    return [
      'theme',
      'alignment',
      'opened',
      'placement',
    ];
  }

  constructor() {
    super();

    const template = document.createElement('template');
    template.innerHTML = html;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    const style = document.createElement('style');
    this.shadowRoot.appendChild(style);
    style.appendChild(document.createTextNode(styles));

    this.#dropdown = this.shadowRoot.querySelector('.BaseDropdown');
    this.#dropdownContent = this.shadowRoot.querySelector('.DropdownContent');

    this.#toggleBtn = this.#dropdown.querySelector('.ToggleBtn');
    this.#toggleBtn.addEventListener('click', this.#handleToggleBtnClick);
  }

  get theme() {
    return this.#theme;
  }

  set theme(value) {
    if (value) {
      if (Array.isArray(value)) {
        this.setAttribute('theme', value.join(','));
      } else {
        this.setAttribute('theme', value);
      }
    } else {
      this.removeAttribute('theme');
    }
  }

  get alignment() {
    return this.#alignment;
  }

  set alignment(newValue) {
    if (newValue) {
      this.setAttribute('alignment', newValue);
    } else {
      this.removeAttribute('alignment');
    }
  }

  get placement() {
    return this.#placement;
  }

  set placement(newValue) {
    this.#placement = this.#placements.includes(newValue) ? newValue : 'bottom';
    this.#setPlacementClasses();
  }

  get opened() {
    return this.#opened;
  }

  set opened(newValue) {
    if (newValue) {
      this.setAttribute('opened', true);
    } else {
      this.removeAttribute('opened');
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    switch (attrName) {
      case 'theme':
        if (newValue) {
          this.#theme = newValue.split(',');
        } else {
          this.#theme = [];
        }
        this.#setThemeClasses();
        break;

      case 'alignment':
        this.#alignment = newValue ? newValue : undefined;
        this.#setAlignmentClasses();
        break;

      case 'placement':
        this.placement = newValue;
        break;

      case 'opened':
        this.toggle(newValue ? true : false);
        break;

      default:
        break;
    }
  }

  toggle = doOpen => {
    if (doOpen !== undefined) {
      if (!!doOpen === this.#opened) {
        return;
      }
      this.#opened = !!doOpen;
    } else {
      this.#opened = !this.#opened;
    }

    if (this.#opened) {
      this.#dropdown.classList.add('opened');
      document.addEventListener('click', this.#handleDocumentClick);

      this.#setPosition();
      this.#intervalCheckingCoords = setInterval(() => {
        this.#setPosition();
      }, 100);
    } else {
      this.#dropdown.classList.remove('opened');
      document.removeEventListener('click', this.#handleDocumentClick);

      clearInterval(this.#intervalCheckingCoords);
    }

    this.dispatchEvent(
      new CustomEvent('toggle', {
        bubbles: true,
        cancelable: false,
        detail: {
          opened: this.#opened,
        },
      })
    );
  };

  disconnectedCallback() {
    clearInterval(this.#intervalCheckingCoords);
  }

  #setThemeClasses() {
    const allThemes = [];

    const { classList } = this.#dropdown;

    for (const theme of allThemes) {
      if (this.#theme.indexOf(theme) != -1) {
        classList.add(theme);
      } else {
        classList.remove(theme);
      }
    }
  }

  #setAlignmentClasses(newValue = this.#alignment) {
    const { classList } = this.#dropdown;

    if (newValue === 'right') {
      classList.add('alignment_right');
    } else {
      classList.remove('alignment_right');
    }

    if (newValue === 'center') {
      classList.add('alignment_center');
    } else {
      classList.remove('alignment_center');
    }
  }

  #setPlacementClasses(newPlacement = this.#placement) {
    const { classList } = this.#dropdown;

    if (newPlacement === 'right' || newPlacement === 'rightStart') {
      classList.add('placement_right');
    } else {
      classList.remove('placement_right');
    }

    if (newPlacement === 'left' || newPlacement === 'leftStart') {
      classList.add('placement_left');
    } else {
      classList.remove('placement_left');
    }

    if (newPlacement === 'top') {
      classList.add('placement_top');
    } else {
      classList.remove('placement_top');
    }

    if (newPlacement === 'bottom') {
      classList.add('placement_bottom');
    } else {
      classList.remove('placement_bottom');
    }
  }

  #handleDocumentClick = event => {
    let isDropdownContainsOriginalTarget = false;
    try {
      isDropdownContainsOriginalTarget = this.#dropdown.contains(event.originalTarget);
    } catch (error) {}

    let isComponentContainsTarget = this.contains(event.target);
    const resultCondition = !isDropdownContainsOriginalTarget && !isComponentContainsTarget;

    if (resultCondition) {
      this.toggle(false);
    }
  }

  #handleToggleBtnClick = () => {
    if (!this.disabled) {
      this.toggle();
    }
  }

  #setPosition() {
    const {
      height,
      width,
      left,
      top,
      right,
    } = this.getBoundingClientRect();

    const render = (hintPos, alignment = this.#alignment) => {
      const {
        style,
      } = this.#dropdownContent;

      this.#setPlacementClasses(hintPos);
        
      style.position = 'fixed';
      style.top = 'auto';
      style.bottom = 'auto';
      style.left = 'auto';
      style.right = 'auto';
      style.transform = '';
  
      switch (hintPos) {
        case 'bottom':
          style.top = (top + height) + 'px';
          this.#setAlignmentClasses(alignment);
          switch (alignment) {
            case 'center':
              style.left = (left + width / 2) + 'px';
              style.transform = 'translateX(-50%)';
              break;

            case 'right':
              style.left = right + 'px';
              style.transform = 'translateX(-100%)';
              break;
          
            default:
              style.left = left + 'px';
              break;
          }
          break;
  
        case 'top':
          style.top = top + 'px';
          this.#setAlignmentClasses(alignment);
          switch (alignment) {
            case 'center':
              style.left = (left + width / 2) + 'px';
              style.transform = 'translateX(-50%) translateY(-100%)';
              break;

            case 'right':
              style.left = right + 'px';
              style.transform = 'translateX(-100%) translateY(-100%)';
              break;
          
            default:
              style.left = left + 'px';
              style.transform = 'translateY(-100%)';
              break;
          }
          break;
  
        case 'left':
          style.top = top + 'px';
          style.left = left + 'px';
          style.transform = 'translateX(-100%)';
          this.#setAlignmentClasses('');
          break;
  
        case 'right':
          style.top = top + 'px';
          style.left = (left + width) + 'px';
          this.#setAlignmentClasses('');
          break;
      
        default:
          break;
      }
    }

    if (!this.placement) {
      this.placement = 'bottom';
    }
    render(this.placement);

    const {
      offsetHeight: windowHeight,
      offsetWidth: windowWidth,
    } = document.body;

    const checkPosByAligment = () => {
      const {
        top: hintTop,
        bottom: hintBottom,
        left: hintLeft,
        right: hintRight,
      } = this.#dropdownContent.getBoundingClientRect();
  
      let alignmentAwayFromScreen = this.#alignment;
      if (hintLeft < 0) alignmentAwayFromScreen = 'left';
      if (hintRight > windowWidth) alignmentAwayFromScreen = 'right';
  
      if (this.#alignment !== alignmentAwayFromScreen) {
        render(this.placement, alignmentAwayFromScreen);
      }
    }

    checkPosByAligment();

    const checkPosByPlacement = () => {
      const {
        top: hintTop,
        bottom: hintBottom,
        left: hintLeft,
        right: hintRight,
      } = this.#dropdownContent.getBoundingClientRect();

      let posAwayFromScreen = this.placement;
      if (hintTop < 0) posAwayFromScreen = 'bottom';
      if (hintBottom > windowHeight) posAwayFromScreen = 'top';
      if (hintLeft < 0) posAwayFromScreen = 'right';
      if (hintRight > windowWidth) posAwayFromScreen = 'left';
  
      if (this.placement !== posAwayFromScreen) {
        render(posAwayFromScreen);
      }
    }

    checkPosByPlacement();
  }
}
