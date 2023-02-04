import ticker from '@/store/ticker';
import timers from '@/../tests/mock/timers';

global.lll_logs ??= [];
global.lll ??= m => global.lll_logs.push(m);

/* * /
global.real = {
  now: Date.now.bind(Date),
  perfNow: performance.now.bind(performance),
  setTimeout,
  setInterval,
  requestAnimationFrame: global.requestAnimationFrame,
};

global.fake = {
  now() { },
  perfNow: real.perfNow,
  setTimeout: real.setTimeout,
  setInterval: real.setInterval,
};

const startTime = 1000000;
let msNow = startTime;
let timePerTick = 1000;
let advanceTimeBy = 3000;
let endTime = startTime + advanceTimeBy;
let safetyNet = 0;
const MAX_LOOP = 20;

function resetFake(a, t) {
  msNow = startTime;
  timePerTick = t || 1000;
  advanceTimeBy = a || 3000;
  endTime = startTime + advanceTimeBy;
  safetyNet = 0;
}

function useFake(a, t) {
  resetFake(a, t);
  Date.now = () => msNow;
}

function useReal() {
  Date.now = real.now;
  global.setTimeout = real.setTimeout;
  global.setInterval = real.setInterval;
  global.requestAnimationFrame = real.requestAnimationFrame;
  performance.now = real.perfNow;
};

global.requestAnimationFrame = fn => {
  lll('requestAnimationFrame()');
  ++safetyNet;
  //console.log(Date.now(), endTime);

  lll('msNow      = ' + msNow);
  msNow += timePerTick;
  lll('msNow      = ' + msNow);
  lll('endTime    = ' + endTime);
  lll('Date.now() = ' + Date.now());

  if (Date.now() <= endTime && safetyNet <= MAX_LOOP) {
    //setTimeout(() => {
    lll('fn()');
    fn();
    //});
  }
};
/* */

afterEach(() => {
  timers.useReal();
  //jest.useRealTimers();
});

test('wip let it pass', () => { });

/* @TODO uncomment * /
test('the fake timers work', () => {
  timers.useFake().set({
    timeToElapse: '3s',
  });

  expect(Date.now())
    .toBe(timers.msStart);

  let counter = 0;

  const raf = requestAnimationFrame;

  raf(() => ++counter);
  
  expect(counter).toBe(1);
  expect(Date.now())
    .toBe(timers.msStart + timers.msPerTick);

  raf(() => ++counter);

  expect(counter).toBe(2);
  expect(Date.now())
    .toBe(timers.msStart + (timers.msPerTick * 2));

  raf(() => ++counter);
  
  expect(counter).toBe(3);
  expect(Date.now())
    .toBe(timers.msStart + (timers.msPerTick * 3));

  raf(() => ++counter);
  
  expect(counter).toBe(3);
  expect(Date.now())
    .toBe(timers.msStart + (timers.msPerTick * 4));

  //resetFake(4000, 500);
  timers.reset().set({
    timeToElapse: '4s',
    timePerTick: '.5s',
  });

  expect(timers.calcTickCount()).toBe(8);

  expect(Date.now())
    .toBe(timers.msStart);

  counter = 0;

  const tick = () => {
    ++counter;
    raf(tick)
  };

  raf(tick);

  expect(counter).toBe(timers.calcTickCount());
});
/* */


/* * ------>/
it('it defaults to ticking once every second', () => {
  //jest.useFakeTimers({timerLimit: Number.MAX_SAFE_INTEGER});
  timers.useFake().set({
    timeToElapse: '4s',
  });
  //useFake(4000);

  global.tickCalls = 0;
  global.subCalls = 0;
  logs = [];

  const store = ticker();

  let counter = 0;

  store.subscribe((n) => {
    lll('listener(): ' + n);
    ++counter;
  });

  console.log("LOGS\n" + logs.join("\n"));
  //jest.advanceTimersByTime(3000); // 3 seconds (3000)

  //console.log('global.subCalls', global.subCalls, 'global.tickCalls', global.tickCalls);

  expect(counter).toBe(4);
});
/* */



/*
it('can tick every minute, on the minute', () => {
    //jest.useFakeTimers({timerLimit: Number.MAX_SAFE_INTEGER});

  global.tickCalls = 0;
  global.subCalls = 0;

    const store = ticker('minute');

    let counter = 0;
    const seconds = [];

    store.subscribe(() => {
        ++counter;
        seconds.push(new Date().getSeconds());
    });

    //jest.advanceTimersByTime(180000); // 3 minutes (180000)

  console.log('global.subCalls', global.subCalls, 'global.tickCalls', global.tickCalls);

    // ... every minute
    expect(counter).toBe(3);

    // ... on the minute
    seconds.forEach(s => expect(s).toBe(0));
});

/* Expecting a little too much out of advanceTimersByTime here. * /
it('can tick every hour, on the hour', () => {
    jest.useFakeTimers();

    const store = ticker('hour');

    let counter = 0;
    const minutes = [];
    const seconds = [];

    store.subscribe(() => {
        ++counter;
        const dt = new Date();
        minutes.push(dt.getMinutes());
        seconds.push(dt.getSeconds());
    });

    jest.advanceTimersByTime(10800000); // 3 hours

    // ... every hour
    expect(counter).toBe(3);

    // ... on the hour
    minutes.forEach(m => expect(m).toBe(0));
    seconds.forEach(s => expect(s).toBe(0));
});
/* */


/*
it('can have custom millisecond periods', () => {
    //jest.useFakeTimers({timerLimit: Number.MAX_SAFE_INTEGER});

  global.tickCalls = 0;
  global.subCalls = 0;

    const s010 = ticker(10);
    const s100 = ticker(100);
    const s250 = ticker(250);
    const s500 = ticker(500);

    let s010counter = 0;
    let s100counter = 0;
    let s250counter = 0;
    let s500counter = 0;

    s010.subscribe(() => ++s010counter);
    s100.subscribe(() => ++s100counter);
    s250.subscribe(() => ++s250counter);
    s500.subscribe(() => ++s500counter);

    //jest.advanceTimersByTime(1000);

  console.log('global.subCalls', global.subCalls, 'global.tickCalls', global.tickCalls);

    expect(s010counter).toBe(100);
    expect(s100counter).not.toBeLessThan(10);
    expect(s100counter).not.toBeGreaterThan(11); // Sometimes it's 11 for some reason.
    expect(s250counter).toBe(4);
    expect(s500counter).toBe(2);
});
*/

