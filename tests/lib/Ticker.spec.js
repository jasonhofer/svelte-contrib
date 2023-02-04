import Ticker from '@/lib/Ticker';
import timers from '@/../tests/mock/timers';
import { toMillis } from '@/utils';

describe('Ticker', () => {

  beforeEach(() => {
    timers.useFake();
  });

  afterEach(() => {
    Ticker.stopAll();
    timers.useReal();
  });

  it('ticks', () => {
    let deltas = [];
    let times = [];

    const t0 = Date.now();
    Ticker.create((d, t) => {
      deltas.push(d);
      times.push(t);
    }).start();

    timers.runTicks(3);

    expect(deltas.length).toBe(3);

    const [d1, d2, d3] = deltas;
    const [t1, t2, t3] = times;

    expect(t1 - t0).toBe(d1);
    expect(t2 - t1).toBe(d2);
    expect(t3 - t2).toBe(d3);
  });


  it('works with fake timers', () => {
    const times = [
      0, 1, 2, 3, 4,
      7, 8, 9,
      15, 16, 17,
      31, 32, 33,
      47, 48, 49,
      58999, 59000,
      59991, 59992,
      59999, 60000,
      60007, 60008,
      toMillis('4m 59s'),
    ];

    const ticker = Ticker.create();
    let fn;

    for (let t of times) {
      ticker.start(fn = jest.fn());

      timers.runTimers(t);

      const ticks = timers.countTicks(t);

      try {
        if (ticks > 0) {
          expect(fn).toBeCalledTimes(ticks);
        } else {
          expect(fn).not.toBeCalled();
        }
      } catch (e) {
        console.log('FAIL:', t + 'ms');
        throw e;
      }
    }
  });


  it('recursivly calls the timing function', () => {
    jest.spyOn(global, 'requestAnimationFrame');

    const fn = jest.fn();
    Ticker.create(fn).start();

    timers.runTick();

    expect(fn).toBeCalled();
    expect(requestAnimationFrame).toBeCalled();
    expect(requestAnimationFrame).toBeCalledTimes(2);
  });

  it('is not running by default', () => {
    const fn = jest.fn();
    const ticker = Ticker.create(fn);

    expect(fn).not.toBeCalled();

    ticker.start();

    timers.runTick();

    expect(fn).toBeCalledTimes(1);
  });

  /* -----> not passing
  it('can be stopped and restarted', () => {
    const fn = jest.fn();
    const ticker = Ticker.create(fn);

    ticker.start();

    timers.runTimers(10);

    expect(fn).toBeCalledTimes(1);

    ticker.stop();

    timers.runTimers(15);

    expect(fn).toBeCalledTimes(1);
  });
  */

  /*
  it('replaces the current callback when one is passed to start()', () => {
    const fn1 = jest.fn();
    const ticker = Ticker.create(fn1);
  
    expect(fn1).not.toBeCalled();
  
    ticker.start();
  
    timers.runTick();
  
    expect(fn1).toBeCalledTimes(1);

    const fn2 = jest.fn();

    

  });
  */

});
