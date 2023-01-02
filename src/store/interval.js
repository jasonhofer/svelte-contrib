import { readable } from 'svelte/store';
import stream from '@/store/stream';

const intervals = {};

// The problem with this is, when all subscribers unusbscurbe, the interval is cleared.
// So when something else subscribes, the interval is no longer in sync with what it
// used to be.
// @TODO When testing, make sure it is still consistent after it has gone dormant.
export default function interval(ms) {
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

function newInterval(ms) {
    let lastTick = 0,
        listeners = [],
        interval = null,
        timeout = null;

    function tick() {
        lastTick = Date.now();
        listeners.forEach(listener => listener(lastTick));
    }

    function startInterval() {
        interval = setInterval(() => tick(), ms);
    }

    function restartInterval() {
        timeout = setTimeout(() => {
            tick();
            startInterval();
            timeout = null;
        }, (Date.now() - lastTick) % ms);
    }

    function start () {
        if (timeout || interval) return;
        if (lastTick) {
            restartInterval();
        } else {
            startInterval();
        }
    };

    function stop() {
        if (!timeout && !interval) return;
        clearTimeout(timeout);
        clearInterval(interval);
        timeout = null;
        interval = null;
    };

    function subscribe(listener) {
        listeners.push(listener);
        if (listeners.length === 1) {
            start();
        }
        return () => {
            listeners = listeners.filter(fn => fn !== listener);
            if (listeners.length === 0) {
                stop();
            }
        };
    }

    return {
        start,
        stop,
        subscribe,
    };
}

class Interval {
    #ms;
    #lastTick = 0;
    #isStoped = false;
    #listeners = [];
    #interval = null;
    #timeout = null;

    constructor(ms) {
        this.#ms = ms;
    }

    subscribe(listener) {
        this.#listeners.push(listener);
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
        if (this.#timeout || this.#interval) return;
        const tick = () => {
            this.#lastTick = Date.now();
            this.listeners.forEach(listener => listener(this.#lastTick));
        };
        const startInterval = () => {
            this.#interval = setInterval(() => {
                tick();
            }, this.#ms);
        };
        if (this.#isStopped) {
            this.#timeout = setTimeout(() => {
                tick();
                startInterval();
            }, (Date.now() - this.#lastTick) % this.#ms);
            this.#isStopped = false;
        } else {
            startInterval();
        }
    }

    stop() {
        if (!this.#timeout && !this.#interval) return;
        clearTimeout(this.#timeout);
        clearInterval(this.#interval);
        this.#isStopped = true;
        this.#timeout = null;
        this.#interval = null;
    }
}
