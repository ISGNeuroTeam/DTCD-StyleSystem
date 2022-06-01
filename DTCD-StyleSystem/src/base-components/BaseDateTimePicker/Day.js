export default class Day {
  constructor(date = null, lang = 'default') {
    date = date ?? new Date();

    this.Date = date;
    this.date = date.getDate();
    this.day = date.toLocaleString(lang, { weekday: 'long' });
    this.dayNumber = date.getDay() === 0 ? 7 : date.getDay();
    this.dayShort = date.toLocaleString(lang, { weekday: 'short' });
    this.year = date.getFullYear();
    this.yearShort = date.toLocaleString(lang, { year: '2-digit' });
    this.month = date.toLocaleString(lang, { month: 'long' });
    this.monthShort = date.toLocaleString(lang, { month: 'short' });
    this.monthNumber = date.getMonth() + 1;
    this.timestamp = date.getTime();
    this.week = getWeekNumber(date);
    this.hours = date.getHours();
    this.minutes = date.getMinutes();
  }

  get isToday() {
    return this.isEqualTo(new Date());
  }

  isEqualTo(date) {
    date = date instanceof Day ? date.Date : date;

    return (
      date.getDate() === this.date &&
      date.getMonth() === this.monthNumber - 1 &&
      date.getFullYear() === this.year
    );
  }

  setHours(hours) {
    this.Date.setHours(hours);
    this.hours = hours;
    this.timestamp = this.Date.getTime();
  }

  setMinutes(minutes) {
    this.Date.setMinutes(minutes);
    this.minutes = minutes;
    this.timestamp = this.Date.getTime();
  }

  format(formatStr) {
    return formatStr
      .replace(/\bYYYY\b/, this.year)
      .replace(/\bYYY\b/, this.yearShort)
      .replace(/\bWW\b/, this.week.toString().padStart(2, '0'))
      .replace(/\bW\b/, this.week)
      .replace(/\bDDDD\b/, this.day)
      .replace(/\bDDD\b/, this.dayShort)
      .replace(/\bDD\b/, this.date.toString().padStart(2, '0'))
      .replace(/\bD\b/, this.date)
      .replace(/\bMMMM\b/, this.month)
      .replace(/\bMMM\b/, this.monthShort)
      .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0'))
      .replace(/\bM\b/, this.monthNumber)
      .replace(/\bH\b/, this.hours)
      .replace(/\bm\b/, this.minutes.toString().padStart(2, '0'));
  }
}

function getWeekNumber(date) {
  const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfTheYear) / 86400000;

  return Math.ceil((pastDaysOfYear + firstDayOfTheYear.getDay()) / 7);
}
