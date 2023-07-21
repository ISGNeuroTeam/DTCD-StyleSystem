import moment from 'moment';
import 'moment/locale/ru.js';

import styles from './BaseDateTimePicker.scss';
import html from './BaseDateTimePicker.html';
import Calendar from './Calendar';
import Day from './Day';

export default class BaseDateTimePicker extends HTMLElement {
  // settings
  #visible = false;
  #disabled = false;
  #range = false;
  #timepicker = false;
  #timewindows = false;
  
  // private properties
  #datepickerValue = [];
  #selectedDates = [];
  #use12HourClock = false;
  #selectedDayElement = [];
  #twBtnsConfig = [
    {
      text: 'Последние 60 минут',
      value: 'last_hours',
      timeAmount: 1,
    },
    {
      text: 'Последние 12 часов',
      value: 'last_hours',
      timeAmount: 12,
    },
    {
      text: 'Последние сутки',
      value: 'last_days',
      timeAmount: 1,
    },
    {
      text: 'Последние 3 дня',
      value: 'last_days',
      timeAmount: 3,
    },
    {
      text: 'Текущая неделя',
      value: 'week',
      timeAmount: 1,
    },
    {
      text: 'Предыдущая неделя',
      value: '-week',
    },
    {
      text: 'Последние 7 дней',
      value: 'last_days',
      timeAmount: 7,
    },
    {
      text: 'Последние 30 дней',
      value: 'last_days',
      timeAmount: 30,
    },
    {
      text: 'Текущий месяц',
      value: 'month',
    },
    {
      text: 'Предыдущий месяц',
      value: '-month',
    },
    {
      text: 'Текущий год',
      value: 'year',
    },
    {
      text: 'Предыдущий год',
      value: '-year',
    },
  ];
  
  // HTML-elements
  #toggleWithContext;
  #datePickerContainer;
  #dayBtns;
  #vdpHoursInputStart;
  #hoursSpanStart;
  #vdpMinutesInputStart;
  #minutesSpanStart;
  #vdpHoursInputFinish;
  #hoursSpanFinish;
  #vdpMinutesInputFinish
  #minutesSpanFinish;
  #timeWindowsBtns;

  constructor() {
    super();

    moment.locale('ru-RU');
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

    this.#vdpHoursInputStart = this.shadow.querySelector('.time-input-wrapper.first .vdpHoursInput');
    this.#vdpHoursInputStart.addEventListener('input', () => this.updateHours());
    this.#vdpHoursInputStart.addEventListener('focus', this.onTimeInputFocus);
    this.#hoursSpanStart = this.shadow.querySelector('.time-input-wrapper.first .hoursSpan');
    
    this.#vdpMinutesInputStart = this.shadow.querySelector('.time-input-wrapper.first .vdpMinutesInput');
    this.#vdpMinutesInputStart.addEventListener('input', () => this.updateMinutes());
    this.#vdpMinutesInputStart.addEventListener('focus', this.onTimeInputFocus);
    this.#minutesSpanStart = this.shadow.querySelector('.time-input-wrapper.first .minutesSpan');

    this.#vdpHoursInputFinish = this.shadow.querySelector('.time-input-wrapper.second .vdpHoursInput');
    this.#vdpHoursInputFinish.addEventListener('input', () => this.updateHours(2));
    this.#vdpHoursInputFinish.addEventListener('focus', this.onTimeInputFocus);
    this.#hoursSpanFinish = this.shadow.querySelector('.time-input-wrapper.second .hoursSpan');
    
    this.#vdpMinutesInputFinish = this.shadow.querySelector('.time-input-wrapper.second .vdpMinutesInput');
    this.#vdpMinutesInputFinish.addEventListener('input', () => this.updateMinutes(2));
    this.#vdpMinutesInputFinish.addEventListener('focus', this.onTimeInputFocus);
    this.#minutesSpanFinish = this.shadow.querySelector('.time-input-wrapper.second .minutesSpan');

    this.shadow.querySelector('.submitButton').addEventListener('click', () => {
      this.updateToggleText();
      this.toggleCalendar();
      this.dispatchEvent(new Event('input'));
    });

    this.shadow.querySelector('.cancelButton').addEventListener('click', () => {
      this.toggleCalendar();
    });

    this.dateInput.addEventListener('change', this.#handlerDateInputChange);

    this.addEventListener('input', event => {
      if (event.isTrusted) {
        event.stopImmediatePropagation();
      }
    });

    this.#toggleWithContext = this.#toggleButton.bind(this);
    this.toggleButton.addEventListener('click', this.#toggleWithContext);
    prevBtn.addEventListener('click', () => this.prevMonth());
    nextButton.addEventListener('click', () => this.nextMonth());

    this.#timeWindowsBtns = this.shadow.querySelector('.TimeWindows-js');

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
    if (this.#datepickerValue[1]) {
      return this.#datepickerValue[0].timestamp + ';' + this.#datepickerValue[1].timestamp;
    } else {
      return this.#datepickerValue[0].timestamp;
    }
  }

  set value(newValue) {
    if (typeof newValue?.includes == 'function' && newValue.includes(';')) {
      this.#datepickerValue = newValue.split(';')
                        .map((value, i) => value = new Day(new Date(parseInt(value))))
                        .sort(this.#compareDates);
    } else {
      this.#datepickerValue[0] = newValue
                              ? new Day(new Date(parseInt(newValue)))
                              : new Day();
    }

    this.#selectedDates = this.#datepickerValue;
    this.calendar.goToDate(this.#selectedDates[0].monthNumber, this.#selectedDates[0].year);
    this.renderCalendarDays();
    this.setTime();
    setTimeout(() => {
      this.updateToggleText();
    }, 0);
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
    const {
      classList,
    } = this.#datePickerContainer;
    this.#range ? classList.add('type-range') : classList.remove('type-range');
  }

  get timepicker() {
    return this.#timepicker;
  }

  set timepicker(value) {
    this.#timepicker = Boolean(value);
    const {
      classList,
    } = this.#datePickerContainer;
    this.#timepicker ? classList.add('with-timepicker') : classList.remove('with-timepicker');
  }

  get selectedDates() {
    const selectedDates = [];
    this.#selectedDates.sort(this.#compareDates).forEach((dateItem) => {
      selectedDates.push({...dateItem});
    });
    return selectedDates;
  }

  get timewindows () {
    return this.#timewindows;
  }

  set timewindows(newValue) {
    this.#timewindows = Boolean(newValue);
    const {
      classList,
    } = this.#datePickerContainer;
    
    if (this.#timewindows) {
      classList.add('with-timewindows')
      this.#renderTWBtns();
    } else {
      classList.remove('with-timewindows');
      this.#timeWindowsBtns.innerHTML = '';
    }
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
      'data-timepicker',
      'data-timewindows',
    ];
  }

  onTimeInputFocus(event) {
    event.target.select && event.target.select();
  }

  updateHours(numberOfClock) {
    const isSecondDateBigger = this.#selectedDates[1] && this.#compareDates(this.#selectedDates[1], this.#selectedDates[0]) == 1;
    const minHours = this.#use12HourClock ? 1 : 0;
    const maxHours = this.#use12HourClock ? 12 : 23;

    if (numberOfClock == 2) {
      if (!this.#selectedDates[1]) return;

      const targetValue = parseInt(this.#vdpHoursInputFinish.value, 10) || 0;
      const numValue = boundNumber(targetValue, minHours, maxHours);
      const targetDate = isSecondDateBigger ? this.#selectedDates[1] : this.#selectedDates[0];
            targetDate.setHours(numValue);
  
      this.#vdpHoursInputFinish.value = numValue;
      this.#hoursSpanFinish.innerHTML = numValue;
    } else {
      const targetValue = parseInt(this.#vdpHoursInputStart.value, 10) || 0;
      const numValue = boundNumber(targetValue, minHours, maxHours);
      const targetDate = isSecondDateBigger ? this.#selectedDates[0] : this.#selectedDates[1];
            targetDate.setHours(numValue);
  
      this.#vdpHoursInputStart.value = numValue;
      this.#hoursSpanStart.innerHTML = numValue;
    }
  }

  updateMinutes(numberOfClock) {
    const isSecondDateBigger = this.#selectedDates[1] && this.#compareDates(this.#selectedDates[1], this.#selectedDates[0]) == 1;
    
    if (numberOfClock == 2) {
      if (!this.#selectedDates[1]) return;

      const targetValue = parseInt(this.#vdpMinutesInputFinish.value, 10) || 0;
      const numValue = boundNumber(targetValue, 0, 59);
      const targetDate = isSecondDateBigger ? this.#selectedDates[1] : this.#selectedDates[0];
            targetDate.setMinutes(numValue);
      
      this.#vdpMinutesInputFinish.value = numValue.toString().padStart(2, '0');
      this.#minutesSpanFinish.innerHTML = numValue.toString().padStart(2, '0');
    } else {
      const targetValue = parseInt(this.#vdpMinutesInputStart.value, 10) || 0;
      const numValue = boundNumber(targetValue, 0, 59);
      const targetDate = !isSecondDateBigger ? this.#selectedDates[0] : this.#selectedDates[1];
            targetDate.setMinutes(numValue);
  
      this.#vdpMinutesInputStart.value = numValue.toString().padStart(2, '0');
      this.#minutesSpanStart.innerHTML = numValue.toString().padStart(2, '0');
    }
  }

  setTime() {
    const selectedDates = [...this.#selectedDates].sort(this.#compareDates);

    this.#vdpHoursInputStart.value = selectedDates[0].hours;
    this.#hoursSpanStart.innerHTML = this.#vdpHoursInputStart.value;

    this.#vdpMinutesInputStart.value = selectedDates[0].minutes.toString().padStart(2, '0');
    this.#minutesSpanStart.innerHTML = this.#vdpMinutesInputStart.value;

    if (selectedDates.length == 2) {
      this.#vdpHoursInputFinish.value = selectedDates[1].hours;
      this.#vdpMinutesInputFinish.value = selectedDates[1].minutes.toString().padStart(2, '0');
    } else {
      this.#vdpHoursInputFinish.value = this.#vdpHoursInputStart.value;
      this.#vdpMinutesInputFinish.value = this.#vdpMinutesInputStart.value;
    }
    this.#hoursSpanFinish.innerHTML = this.#vdpHoursInputFinish.value;
    this.#minutesSpanFinish.innerHTML = this.#vdpMinutesInputFinish.value;
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

    if (this.#selectedDates.length == 1) {
      this.#vdpHoursInputFinish.value = day.hours;
      this.#hoursSpanFinish.innerHTML = day.hours;
      this.#vdpMinutesInputFinish.value = day.minutes.toString().padStart(2, '0');
      this.#minutesSpanFinish.innerHTML = day.minutes.toString().padStart(2, '0');
    } else {
      this.#vdpHoursInputStart.value = day.hours;
      this.#hoursSpanStart.innerHTML = day.hours;
      this.#vdpMinutesInputStart.value = day.minutes.toString().padStart(2, '0');
      this.#minutesSpanStart.innerHTML = day.minutes.toString().padStart(2, '0');
    }
  }

  updateToggleText() {
    const selectedDates = [...this.#selectedDates].sort(this.#compareDates);
    const dateFormat = 'DD.MM.YYYY H:m';
    
    if (selectedDates.length == 2) {
      this.dateInput.value = `${selectedDates[0].format(dateFormat)} - ${selectedDates[1].format(dateFormat)}`;
    } else if (selectedDates.length > 2) {
      let dateInputValue = '';
      selectedDates.forEach((dateItem, index) => {
        if (index > 0) dateInputValue += ' | ';
        dateInputValue += dateItem.format(dateFormat);
      });
      this.dateInput.value = dateInputValue;
    } else {
      this.dateInput.value = `${selectedDates[0].format(dateFormat)}`;
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
        this.value = newValue;
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
        break;

      case 'data-timepicker':
        this.timepicker = newValue;
        break;
      
      case 'data-timewindows':
        this.timewindows = newValue;
        break;
    }
  }

  render() {
    const template = document.createElement('template');
    template.innerHTML = `<style>${styles}</style>${html}`;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.shadow.querySelector('.week-days').innerHTML = this.getWeekDaysElementStrings();
  }

  #renderTWBtns() {
    this.#timeWindowsBtns.innerHTML = '';

    this.#twBtnsConfig.forEach((config) => {
      const btn = document.createElement('base-button');
            btn.theme = ['theme_blueSec'];
            btn.width = 'full';
            btn.size = 'small';
            btn.type = 'button';
            btn.value = config.value;
            btn.textContent = config.text;
            btn.setAttribute('data-time-amount', config.timeAmount || 1);
            btn.addEventListener('click', this.#handleTWBtnsClick);
      this.#timeWindowsBtns.appendChild(btn);
    });
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

  #handlerDateInputChange = () => {
    const regexp =
      /^(0[1-9]|[12]\d|3[01])[.](0[1-9]|1[0-2])[.]\d{4}\s(0\d|1\d|2[0-3])[:]([0-5]\d)$/;

    this.dateInput.value.split(' - ').forEach((dateString, index) => {
      if (index > 1) return;

      const date = moment(dateString, 'DD-MM-YYYY hh:mm');

      if (!date.isValid() || dateString.match(regexp) === null) {
        this.#selectedDates[index] = new Day(new Date(Date.now()), 'ru-RU');
      } else {
        this.#selectedDates[index] = new Day(date.toDate(), 'ru-RU');
      }
    });

    this.calendar = new Calendar(this.#selectedDates[0].year, this.#selectedDates[0].monthNumber, 'ru-RU');
    this.renderCalendarDays();
    this.setTime();
    this.updateToggleText();
    this.dispatchEvent(new Event('input'));
  }

  #handleTWBtnsClick = (event) => {
    const btnValue = event.target.value;
    const timeAmount = event.target.getAttribute('data-time-amount') ?? 1;
    let resultDates = [];
    
    switch (btnValue) {
      // a few hours ago
      case 'last_hours': {
        const now = new Date();
        resultDates.push(new Date(now - (1000 * 60 * 60 * timeAmount)));
        resultDates.push(now);
        break;
      }

      // a few days ago
      case 'last_days': {
        const period = 'day';
        const startDate = moment().subtract(timeAmount, `${period}s`).startOf(period).toDate();
        const endDate = moment().subtract(1, `${period}s`).endOf(period).toDate();
        resultDates.push(startDate);
        resultDates.push(endDate);
        break;
      }

      // current period
      case 'day':
      case 'week':
      case 'month':
      case 'year': {
        resultDates.push(moment().startOf(btnValue).toDate());
        resultDates.push(moment().endOf(btnValue).toDate());
        break;
      }

      // previous period
      case '-day':
      case '-week':
      case '-month':
      case '-year': {
        const period = btnValue.slice(1);
        const startDate = moment().subtract(timeAmount, `${period}s`).startOf(period).toDate();
        const endDate = moment().subtract(timeAmount, `${period}s`).endOf(period).toDate();
        resultDates.push(startDate);
        resultDates.push(endDate);
        break;
      }
    
      default:
        break;
    }

    this.#selectedDates = resultDates.map((value, i) => value = new Day(value));
    this.calendar.goToDate(this.#selectedDates[0].monthNumber, this.#selectedDates[0].year);
    this.renderCalendarDays();
    this.setTime();
  }
}

function boundNumber(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
