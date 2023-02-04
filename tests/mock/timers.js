import { toMillis } from '@/utils';

function runTime(ms, ...args) {
  ms = toMillis(ms);
  return jest.advanceTimersByTime(
    ms,
    ...args
  );
}

function runTicks(n = 1, ...args) {
  while (n--)
    jest
      .runOnlyPendingTimers(...args);
}

function runTick() {
  runTicks(1);
}

function runTimers(ms) {
  ms = toMillis(ms);
  ms > 2 && jest.advanceTimersToNextTimer(
    this.countTicks(ms)
  );
}

function countTicks(ms) {
  ms = toMillis(ms);
  if (ms <= 2) {
    return 0;
  }
  return Math.floor(toMillis(ms) / 16 + 1);
}

function useFake(...args) {
  return jest.useFakeTimers(...args);
}

function useReal(...args) {
  return jest.useRealTimers(...args);
}

export default {
  useFake,
  useReal,
  runTime,
  runTimers,
  runTick,
  runTicks,
  countTicks,
}
