import styles from './BaseDateTimePicker.scss';
import html from './BaseDateTimePicker.html';

import Day from './Day';
import Calendar from './Calendar';

export default class BaseDateTimePicker extends HTMLElement {
  #date = null;
  #visible = false;
  #use12HourClock = false;
  #disabled = false;
  #toggleWithContext;

  constructor() {
    super();

    const date = new Date(Date.now());
    this.#date = new Day(date, 'ru-RU');
    this.calendar = new Calendar(this.#date.year, this.#date.monthNumber, 'ru-RU');
    this.shadow = this.attachShadow({ mode: 'open' });

    this.render();

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
    });

    this.#toggleWithContext = this.#toggleButton.bind(this);
    this.toggleButton.addEventListener('click', this.#toggleWithContext);
    prevBtn.addEventListener('click', () => this.prevMonth());
    nextButton.addEventListener('click', () => this.nextMonth());
    document.addEventListener('click', e => this.handleClickOut(e));

    this.renderCalendarDays();
    this.setTime();
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
    return this.#date.timestamp;
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

  static get observedAttributes() {
    return ['value', 'visible', 'label', 'size', 'disabled', 'required'];
  }

  onTimeInputFocus(event) {
    event.target.select && event.target.select();
  }

  updateHours() {
    const currentDate = this.#date;
    const targetValue = parseInt(this.vdpHoursInput.value, 10) || 0;
    const minHours = this.#use12HourClock ? 1 : 0;
    const maxHours = this.#use12HourClock ? 12 : 23;
    const numValue = boundNumber(targetValue, minHours, maxHours);
    currentDate.setHours(numValue);

    this.vdpHoursInput.value = numValue;
    this.shadow.querySelector('#hoursSpan').innerHTML = numValue;
  }

  updateMinutes() {
    const currentDate = this.#date;
    const targetValue = parseInt(this.vdpMinutesInput.value, 10) || 0;
    const numValue = boundNumber(targetValue, 0, 59);
    currentDate.setMinutes(numValue);

    this.vdpMinutesInput.value = numValue.toString().padStart(2, '0');
    this.shadow.querySelector('#minutesSpan').innerHTML = numValue.toString().padStart(2, '0');
  }

  setTime() {
    this.vdpHoursInput.value = this.#date.hours;
    this.vdpMinutesInput.value = this.#date.minutes.toString().padStart(2, '0');

    this.shadow.querySelector('#hoursSpan').innerHTML = this.#date.hours;
    this.shadow.querySelector('#minutesSpan').innerHTML = this.#date.minutes
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

    if (!this.#visible && !this.isCurrentCalendarMonth()) {
      this.calendar.goToDate(this.#date.monthNumber, this.#date.year);
      this.renderCalendarDays();
    }
  }

  handleClickOut(e) {
    if (this.#visible && this !== e.target) {
      this.toggleCalendar(false);
    }
  }

  selectDay(el, day) {
    if (day.isEqualTo(this.#date)) return;
    this.#date = day;

    if (day.monthNumber < this.calendar.month.number) this.prevMonth();
    else if (day.monthNumber > this.calendar.month.number) this.nextMonth();
    else {
      el.classList.add('selected');
      this.selectedDayElement.classList.remove('selected');
      this.selectedDayElement = el;
    }

    this.vdpHoursInput.value = day.hours;
    this.shadow.querySelector('#hoursSpan').innerHTML = day.hours;
    this.vdpMinutesInput.value = day.minutes.toString().padStart(2, '0');
    this.shadow.querySelector('#minutesSpan').innerHTML = day.minutes.toString().padStart(2, '0');
  }

  updateToggleText() {
    this.dateInput.value = `${this.#date.format('DD.MM.YYYY H:m')}`;
  }

  isSelectedDate(date) {
    return (
      date.date === this.#date.date &&
      date.monthNumber === this.#date.monthNumber &&
      date.year === this.#date.year
    );
  }

  isCurrentCalendarMonth() {
    return (
      this.calendar.month.number === this.#date.monthNumber &&
      this.calendar.year === this.#date.year
    );
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
        this.selectedDayElement = el;
      }

      this.calendarDaysContainer.appendChild(el);
    });
  }

  getWeekDaysElementStrings() {
    let days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    return days.map(weekDay => `<span>${weekDay.substring(0, 3)}</span>`).join('');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'value':
        this.#date = new Day(new Date(parseInt(newValue)));
        this.calendar.goToDate(this.#date.monthNumber, this.#date.year);
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
    }
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadow.querySelector('.week-days').innerHTML = this.getWeekDaysElementStrings();
  }
}

function boundNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
