import { writable, derived } from 'svelte/store';
import readonly from '@/store/readonly';
import Timer from '@/lib/Timer';

/*
const MS_SECOND = 1000;
const MS_MINUTE = 60000;
const MS_HOUR = 3600000;
const MS_DAY = 86400000;
const MS_WEEK = 604800000;
const MS_MONTH = 2629800000;
const MS_YEAR = 31557600000;
*/

export default function unitTimer(time = Infinity) {
  return createStores(Timer.newTimer(time));
}

Object.defineProperty(unitTimer, 'countdown', {
  value: time => createStores(Timer.newCountdownTimer(time)),
});

function createStores(timer) {
  const stores = {
    timer,
    ...timer.stores,
    start() { timer.start(); return stores; },
    stop() { timer.stop(); return stores; },
    reset() { timer.reset(); return stores; },
  };

  stores.msTotal = readonly(timer);
  stores.ms = derived(stores.msTotal, ms => ms % 1000);
  stores.ms000 = derived(stores.ms, pad3);

  stores.secondsTotal = derived(stores.msTotal, ms => Math.floor(ms / 1000));
  stores.seconds = derived(stores.secondsTotal, s => s % 60);
  stores.seconds00 = derived(stores.seconds, pad2);

  stores.minutesTotal = derived(stores.secondsTotal, s => Math.floor(s / 60))
  stores.minutes = derived(stores.minutesTotal, s => s % 60);
  stores.minutes00 = derived(stores.minutes, pad2);

  stores.hoursTotal = derived(stores.minutesTotal, m => Math.floor(m / 60));
  stores.hours = derived(stores.hoursTotal, h => h % 24);
  stores.hours00 = derived(stores.hours, pad2);

  stores.daysTotal = derived(stores.hoursTotal, h => Math.floor(h / 24));
  stores.days = derived(stores.daysTotal, d => d % 7);
  stores.days00 = derived(stores.days, pad2);

  stores.weeksTotal = derived(stores.daysTotal, d => Math.floor(d / 7));
  stores.weeks = readonly(stores.weeksTotal);

  return stores;
}

const pad2 = n => ('0' + n).substr(-2);
const pad3 = n => ('00' + n).substr(-3);
