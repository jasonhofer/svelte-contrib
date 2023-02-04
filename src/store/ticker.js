import { readable } from 'svelte/store';
import stream from '@/store/stream';
import Ticker from '@/lib/Ticker';
import { toMillis } from '@/utils';

global.lll_logs ??= [];
global.lll ??= m => global.lll_logs.push(m);

const tickerSource = Ticker.create();
const tickerStore = stream(readable(4321, set => {
  ++global.subCalls;
  tickerSource.start((_, now) => {
    lll('tickerSource:set(): now=' + now);
    set(now);
  });
  return () => {
    lll('tickerSource.stop()')
    tickerSource.stop();
  };
}));

export default function ticker(period = 'second') {
  // Browsers can't handle low ms timeouts and intervals.
  const ms = Math.max(5, toMillis(period));
  lll('ticker(): ms=' + ms);
  lll('isRunning: ' + tickerSource.isRunning);

  tickerStore.subscribe(() => {
    lll('    Independent Subscriber Called');
  });
  lll('ISC: tickerSource.isRunning: ' + tickerSource.isRunning);

  return (readable(123450, set => {
    ++global.subCalls;
    lll('tickerSource.subscribe()');
    var r = tickerStore.subscribe(now => {
      lll('readable:set(): ' + now + ' / ' + ms + ' = ' + Math.floor(now / ms));
      set(Math.floor(now / ms));
    });
    lll('tickerSource.isRunning: ' + tickerSource.isRunning);
    return r;
  }));
}
