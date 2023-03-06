import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const clockDays = document.querySelector('[data-days]');
const clockHours = document.querySelector('[data-hours]');
const clockMinutes = document.querySelector('[data-minutes]');
const clockSeconds = document.querySelector('[data-seconds]');

startBtn.disabled = true;
let selectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    selectedDate = selectedDates[0].getTime();
    if (selectedDate - Date.now() >= 0) {
      startBtn.disabled = false;
    } else {
      Notiflix.Notify.failure('Please choose a date in the future');
      // window.alert('Please choose a date in the future');
    }
  },
};

flatpickr(inputEl, options);

class Timer {
  constructor({ onTick }) {
    this.intervalId = null;
    this.isActive = false;
    this.onTick = onTick;
  }

  start() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;

    this.intervalId = setInterval(() => {
      const currentDate = Date.now();
      const deltaTime = selectedDate - currentDate;
      const time = this.convertMs(deltaTime);
      this.onTick(time);

      // console.log(time);
      // console.log(deltaTime);
      if (deltaTime < 999) {
        clearInterval(this.intervalId);
        this.isActive = false;
        startBtn.disabled = true;
        Notiflix.Notify.success('Countdown is over');
      }
    }, 1000);
  }
  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new Timer({
  onTick: updateClockface,
});

startBtn.addEventListener('click', () => {
  timer.start.bind(timer)();
});

function updateClockface({ days, hours, minutes, seconds }) {
  clockDays.textContent = `${days}`;
  clockHours.textContent = `${hours}`;
  clockMinutes.textContent = `${minutes}`;
  clockSeconds.textContent = `${seconds}`;
}
