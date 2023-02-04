import Ticker from '@/lib/Ticker';
import ticker from '@/store/ticker';
import timers from '@/../tests/mock/timers'

describe('ticker()', () => {

  afterEach(() => {
    Ticker.stopAll();
    timers.useReal();
  });

  it('defaults to ticking each second', () => {
    timers.useFake();

    const store = ticker();
  });

});
