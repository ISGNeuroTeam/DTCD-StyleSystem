import moment from 'moment';

import styles from './BaseDateTimePicker.scss';
import html from './BaseDateTimePicker.html';
import Calendar from './Calendar';
import Day from './Day';

export default class BaseDateTimePicker extends HTMLElement {
  #visible = false;
  #disabled = false;
  #range = false;
  
  #selectedDates = [];
  #use12HourClock = false;
  #selectedDayElement = [];
  #dayBtns;

  #toggleWithContext;
  #datePickerContainer;

  constructor() {
    super();

    const date = new Date(Date.now());
    this.#selectedDates[0] = new Day(date, 'ru-RU');
    this.calendar = new Calendar(this.#selectedDates[0].year, this.#selectedDates[0].monthNumber, 'ru-RU');
    this.shadow = this.attachShadow({ mode: 'open' });

    this.render();

    this.#datePickerContainer = this.shadow.querySelector('.BaseDateTimePicker');
    this.toggleButton = this.shadow.querySelector('.date-toggle');
    this.calendarDropDown = this.shadow.querySelector('.calendar-dropdown');
    this.dateInput = this.shadow.querySelector('.date-input');
    const [prevBtn, calendarDateElement, nextButton] =
      this.calendarDropDown.querySelector('.header').children;
    this.calendarDateElement = calendarDateElement;
    this.calendarDaysContainer = this.calendarDropDown.querySelector('.month-days');

    this.vdpHoursInput = this.shadow.querySelector('.vdpHoursInput');

    this.vdpHoursInput.addEventListener('input', () => this.updateHours());
    this.vdpHoursInput.addEventListener('focus', this.onTimeInputFocus);

    this.vdpMinutesInput = this.shadow.querySelector('.vdpMinutesInput');

    this.vdpMinutesInput.addEventListener('input', () => this.updateMinutes());
    this.vdpMinutesInput.addEventListener('focus', this.onTimeInputFocus);

    this.shadow.querySelector('.submitButton').addEventListener('click', () => {
      this.updateToggleText();
      this.toggleCalendar();
      this.dispatchEvent(new Event('input'));
    });

    this.shadow.querySelector('.cancelButton').addEventListener('click', () => {
      this.toggleCalendar();
    });

    this.dateInput.addEventListener('change', () => {
      const regexp =
        /^(0[1-9]|[12]\d|3[01])[.](0[1-9]|1[0-2])[.]\d{4}\s(0\d|1\d|2[0-3])[:]([0-5]\d)$/;
      let date = moment(this.dateInput.value, 'DD-MM-YYYY hh:mm');
      if (!date.isValid() || this.dateInput.value.match(regexp) === null) {
        this.#selectedDates[0] = new Day(new Date(Date.now()), 'ru-RU');
        this.updateToggleText();
        return;
      }
      this.#selectedDates[0] = new Day(date.toDate(), 'ru-RU');
      this.calendar = new Calendar(this.#selectedDates[0].year, this.#selectedDates[0].monthNumber, 'ru-RU');
      this.renderCalendarDays();
      this.setTime();
      this.dispatchEvent(new Event('input'));
    });

    this.addEventListener('input', event => {
      if (event.isTrusted) {
        event.stopImmediatePropagation();
      }
    });

    this.#toggleWithContext = this.#toggleButton.bind(this);
    this.toggleButton.addEventListener('click', this.#toggleWithContext);
    prevBtn.addEventListener('click', () => this.prevMonth());
    nextButton.addEventListener('click', () => this.nextMonth());

    this.renderCalendarDays();
    this.setTime();
  }

  disconnectedCallback() {
    document.removeEventListener('click', this.#handleClickOut);
  }

  get visible() {
    return this.#visible;
  }

  set visible(newValue) {
    this.setAttribute('visible', newValue);
  }

  get label() {
    return this.dateInput.getAttribute('label');
  }

  set label(value) {
    if (value) {
      this.setAttribute('label', value);
    }
  }

  get value() {
    return this.#selectedDates[0].timestamp;
  }

  set value(newValue) {
    if (newValue) this.setAttribute('value', newValue);
  }

  get size() {
    return this.dateInput.size;
  }

  set size(value) {
    this.dateInput.setAttribute('size', value);
  }

  get disabled() {
    return this.#disabled;
  }

  set disabled(value) {
    value ? this.setAttribute('disabled', value) : this.removeAttribute('disabled');
  }

  get required() {
    return this.dateInput.required;
  }

  set required(newValue) {
    this.dateInput.required = newValue;
  }

  get range() {
    return this.#range;
  }

  set range(value) {
    this.#range = Boolean(value);
  }

  static get observedAttributes() {
    return [
      'value',
      'visible',
      'label',
      'size',
      'disabled',
      'required',
      'data-range',
    ];
  }

  onTimeInputFocus(event) {
    event.target.select && event.target.select();
  }

  updateHours() {
    const currentDate = this.#selectedDates[0];
    const targetValue = parseInt(this.vdpHoursInput.value, 10) || 0;
    const minHours = this.#use12HourClock ? 1 : 0;
    const maxHours = this.#use12HourClock ? 12 : 23;
    const numValue = boundNumber(targetValue, minHours, maxHours);
    currentDate.setHours(numValue);

    this.vdpHoursInput.value = numValue;
    this.shadow.querySelector('#hoursSpan').innerHTML = numValue;
  }

  updateMinutes() {
    const currentDate = this.#selectedDates[0];
    const targetValue = parseInt(this.vdpMinutesInput.value, 10) || 0;
    const numValue = boundNumber(targetValue, 0, 59);
    currentDate.setMinutes(numValue);

    this.vdpMinutesInput.value = numValue.toString().padStart(2, '0');
    this.shadow.querySelector('#minutesSpan').innerHTML = numValue.toString().padStart(2, '0');
  }

  setTime() {
    this.vdpHoursInput.value = this.#selectedDates[0].hours;
    this.vdpMinutesInput.value = this.#selectedDates[0].minutes.toString().padStart(2, '0');

    this.shadow.querySelector('#hoursSpan').innerHTML = this.#selectedDates[0].hours;
    this.shadow.querySelector('#minutesSpan').innerHTML = this.#selectedDates[0].minutes
      .toString()
      .padStart(2, '0');
  }

  renderCalendarDays() {
    this.updateHeaderText();
    this.updateMonthDays();
  }

  #toggleButton() {
    this.toggleCalendar();
  }

  toggleCalendar(visible = null) {
    if (visible === null) {
      this.calendarDropDown.classList.toggle('visible');
    } else if (visible) {
      this.calendarDropDown.classList.add('visible');
    } else {
      this.calendarDropDown.classList.remove('visible');
    }

    this.#visible = this.calendarDropDown.className.includes('visible');

    if (this.#visible) document.addEventListener('click', this.#handleClickOut);
    else document.removeEventListener('click', this.#handleClickOut);

    if (!this.#visible && !this.isCurrentCalendarMonth()) {
      this.calendar.goToDate(this.#selectedDates[0].monthNumber, this.#selectedDates[0].year);
      this.renderCalendarDays();
    }
  }

  #handleClickOut = (event) => {
    const eventPath = event.composedPath();
    const originalTarget = eventPath[0];
    const isSelectContainsOriginalTarget = this.#datePickerContainer.contains(originalTarget);
    const isComponentContainsTarget = this.contains(event.target);
    if (!isSelectContainsOriginalTarget && !isComponentContainsTarget) {
      this.toggleCalendar(false);
    }
  }

  selectDay(el, day) {
    if (this.range) {
      if (!this.#selectedDates?.length || this.#selectedDates.length == 2) {
        // выбор первой даты из двух
        this.#selectedDates = [];
        this.#selectedDates[0] = day;

        this.#selectedDayElement[0].classList.remove('selected');
        el.classList.add('selected');
        this.#selectedDayElement[0] = el;
        if (this.#selectedDayElement[1] !== el) {
          this.#selectedDayElement[1]?.classList.remove('selected');
        }
      } else if (this.#selectedDates.length == 1) {
        // выбор второй даты из двух
        this.#selectedDates[1] = day;

        el.classList.add('selected');
        this.#selectedDayElement[1] = el;
      }
    } else {
      if (day.isEqualTo(this.#selectedDates[0])) return;
      this.#selectedDates = [];
      this.#selectedDates[0] = day;

      this.#selectedDayElement[0].classList.remove('selected');
      el.classList.add('selected');
      this.#selectedDayElement[0] = el;
    }

    if (day.monthNumber < this.calendar.month.number) {
      this.prevMonth();
    } else if (day.monthNumber > this.calendar.month.number) {
      this.nextMonth();
    } else {
      this.#highlightBtnsInRange();
    }

    this.vdpHoursInput.value = day.hours;
    this.shadow.querySelector('#hoursSpan').innerHTML = day.hours;
    this.vdpMinutesInput.value = day.minutes.toString().padStart(2, '0');
    this.shadow.querySelector('#minutesSpan').innerHTML = day.minutes.toString().padStart(2, '0');
  }

  updateToggleText() {
    const selectedDates = [...this.#selectedDates].sort(this.#compareDates);
    
    if (selectedDates.length == 2) {
      this.dateInput.value = `${selectedDates[0].format('DD.MM.YYYY H:m')} - ${selectedDates[1].format('DD.MM.YYYY H:m')}`;
    } else if (selectedDates.length > 2) {
      let dateInputValue = '';
      selectedDates.forEach((dateItem, index) => {
        if (index > 0) dateInputValue += ' | ';
        dateInputValue += dateItem.format('DD.MM.YYYY H:m');
      });
      this.dateInput.value = dateInputValue;
    } else {
      this.dateInput.value = `${selectedDates[0].format('DD.MM.YYYY H:m')}`;
    }
  }

  isSelectedDate(date) {
    const searchResult = this.#selectedDates.find(dateItem => {
      return (
        date.date === dateItem.date &&
        date.monthNumber === dateItem.monthNumber &&
        date.year === dateItem.year
      );
    });

    return searchResult;
  }

  isCurrentCalendarMonth() {
    const searchResult = this.#selectedDates.find(dateItem => {
      return (
        this.calendar.month.number === dateItem.monthNumber &&
        this.calendar.year === dateItem.year
      );
    });

    return searchResult;
  }

  updateHeaderText() {
    this.calendarDateElement.textContent = `${this.calendar.month.name}, ${this.calendar.year}`;
    const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`;
    this.calendarDateElement.setAttribute('aria-label', `current month ${monthYear}`);
  }

  prevMonth() {
    this.calendar.goToPreviousMonth();
    this.renderCalendarDays();
  }

  nextMonth() {
    this.calendar.goToNextMonth();
    this.renderCalendarDays();
  }

  getMonthDaysGrid() {
    const firstDayOfTheMonth = this.calendar.month.getDay(1);
    const prevMonth = this.calendar.getPreviousMonth();
    const totalLastMonthFinalDays = firstDayOfTheMonth.dayNumber - 1;

    const lastDayOfTheMonth = this.calendar.month.getDay(this.calendar.month.numberOfDays);
    const nextMonth = this.calendar.getNextMonth();
    const totalNextMonthStartingDays = 7 - lastDayOfTheMonth.dayNumber;

    const monthList = [];

    for (let i = 0; i < totalLastMonthFinalDays; i++) {
      monthList.push(prevMonth.getDay(prevMonth.numberOfDays - (totalLastMonthFinalDays - i - 1)));
    }

    for (let i = 1; i <= this.calendar.month.numberOfDays; i++) {
      monthList.push(this.calendar.month.getDay(i));
    }

    for (let i = 0; i < totalNextMonthStartingDays; i++) {
      monthList.push(nextMonth.getDay(i + 1));
    }

    return monthList;
  }

  updateMonthDays() {
    this.calendarDaysContainer.innerHTML = '';
    this.#selectedDayElement = [];
    this.#dayBtns = new Map();

    this.getMonthDaysGrid().forEach(day => {
      const el = document.createElement('button');
      el.className = 'month-day';
      el.textContent = day.date;
      el.addEventListener('click', e => this.selectDay(el, day));

      if (day.monthNumber === this.calendar.month.number) {
        if ([6, 7].includes(day.dayNumber)) el.classList.add('weekend');
        else el.classList.add('current');
      }

      if (this.isSelectedDate(day)) {
        el.classList.add('selected');
        this.#selectedDayElement.push(el);
      }

      this.calendarDaysContainer.appendChild(el);
      this.#dayBtns.set(day.timestamp, el);
    });

    this.#highlightBtnsInRange();
  }

  getWeekDaysElementStrings() {
    let days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return days.map(weekDay => `<span>${weekDay.substring(0, 3)}</span>`).join('');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'value':
        this.#selectedDates[0] = new Day(new Date(parseInt(newValue)));
        this.calendar.goToDate(this.#selectedDates[0].monthNumber, this.#selectedDates[0].year);
        this.renderCalendarDays();
        this.setTime();
        setTimeout(() => {
          this.updateToggleText();
        }, 0);
        break;

      case 'visible':
        this.#visible = newValue === 'true' ? true : false;
        this.toggleCalendar(this.#visible);
        break;

      case 'label':
        this.dateInput.setAttribute('label', newValue);
        break;

      case 'disabled':
        this.#disabled = newValue === 'true' ? true : false;
        if (this.#disabled) {
          this.dateInput.setAttribute('disabled', true);
          this.toggleButton.removeEventListener('click', this.#toggleWithContext);
          this.toggleButton.classList.add('disabled');
        } else {
          this.dateInput.removeAttribute('disabled');
          this.toggleButton.addEventListener('click', this.#toggleWithContext);
          this.toggleButton.classList.remove('disabled');
        }
        break;

      case 'data-range':
        this.range = newValue;
        break
    }
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadow.querySelector('.week-days').innerHTML = this.getWeekDaysElementStrings();
  }

  #highlightBtnsInRange() {
    if (this.#selectedDates.length == 2) {
      const selectedDates = [...this.#selectedDates].sort(this.#compareDates);
      const minDate = selectedDates[0].timestamp;
      const maxDate = selectedDates[1].timestamp;
  
      this.#dayBtns.forEach((dayBtn, timestamp) => {
        if (timestamp > minDate && timestamp < maxDate) {
          dayBtn.classList.add('inRange');
        } else {
          dayBtn.classList.remove('inRange');
        }
      });
    } else {
      this.#dayBtns.forEach((dayBtn, timestamp) => {
        dayBtn.classList.remove('inRange');
      });
    }
  }

  #compareDates(a, b) {
    if (a.timestamp > b.timestamp) return 1;
    if (a.timestamp == b.timestamp) return 0;
    if (a.timestamp < b.timestamp) return -1;
  }
}

function boundNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
