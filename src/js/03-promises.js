import Notiflix from 'notiflix';

const form = document.querySelector('.form');
const createPromisesBtn = document.querySelector('button');
const delayInput = document.querySelector('[name="delay"]');
const stepIput = document.querySelector('[name="step"]');
const amountInput = document.querySelector('[name="amount"]');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  for (let i = 1; i <= Number(form.amount.value); i += 1) {
    createPromise(i, Number(form.delay.value) + Number(form.step.value) * i)
      .then(({ position, delay }) => {
        Notiflix.Notify.success(
          `✅Fulfilled promise ${position} in ${delay}ms`
        );
      })
      .catch(({ position, delay }) => {
        Notiflix.Notify.failure(`❌Rejected promise ${position} in ${delay}ms`);
      });
  }
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    const shouldResolve = Math.random() > 0.3;

    setTimeout(() => {
      if (shouldResolve) {
        // Fulfill
        resolve({ position, delay });
      } else {
        // Reject
        reject({ position, delay });
      }
    }, delay);
  });
}
