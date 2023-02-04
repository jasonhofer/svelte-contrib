import { readable } from 'svelte/store';
import stream from '@/store/stream';
import { toMillis } from '@/utils';

const intervals = {};

// The problem with this is, when all
// subscribers unsubscribe, the interval
// is cleared. So when something else
// subscribes, the interval is no longer
// in sync with what it used to be.
// @TODO When testing, make sure it is
// still consistent after it has gone dormant.
export default function interval(ms) {
  ms = toMillis(ms);
  return intervals[ms] || (
    intervals[ms] = new Interval(ms)
  );
}

class Interval {
  #ms;
  #lastTick = 0;
  //#isStopped = false;
  #listeners = [];
  #interval = null;
  #timeout = null;

  constructor(ms) {
    this.#ms = +ms;
    this.#lastTick = Date.now();
  }

  //get ms() { return this.#ms; }
  //get lastTick() { return this.#lastTick; }

  subscribe(listener) {
    this.#listeners
      .push(listener);
    if (this.#listeners.length === 1) {
      this.start();
    }
    return () => {
      this.#listeners = this.#listeners.filter(fn => fn !== listener);
      if (this.#listeners.length === 0) {
        this.stop();
      }
    }
  }

  start() {
    if (
      this.#timeout ||
      this.#interval ||
      this.#listeners.length === 0
    ) return;
    const tick = () => {
      const t = this.#lastTick = Date.now();
      this.#listeners.forEach(l => l(t));
    };
    const startInterval = () => {
      this.#interval =
        setInterval(tick, this.#ms);
    };
    //if (this.#isStopped) {
    let delay = 0;
    if (this.#lastTick > 0) {
      delay = (
        Date.now() - this.#lastTick
      ) % this.#ms;
    }
    this.#timeout =
      setTimeout(() => {
        tick();
        startInterval();
      }, delay);
    //    this.#isStopped = false;
    //} else {
    //    startInterval();
    //}
  }

  stop() {
    if (
      !this.#timeout &&
      !this.#interval
    ) return;
    clearTimeout(this.#timeout);
    clearInterval(this.#interval);
    //this.#isStopped = true;
    this.#timeout = null;
    this.#interval = null;
  }
}


/*
export function interval_old(ms) {
    return intervals[ms] || (
        intervals[ms] = (() => {
            let lastTick = 0;
            return stream(readable(0, set => {
                let tid = null, iid = null;
                if (lastTick > 0) {
                    tid = setTimeout(() => {
                        set(lastTick = Date.now());
                        startInterval();
                    }, (Date.now() - lastTick) % ms);
                } else {
                    startInterval();
                }
                function startInterval() {
                    iid = setInterval(() => set(lastTick = Date.now()), ms);
                }
                return () => {
                    clearTimeout(tid);
                    clearInterval(iid);
                    delete intervals[ms];
                };
            }))
        })()
    );
}
*/