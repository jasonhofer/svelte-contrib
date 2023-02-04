import { writable } from 'svelte/store';
import Ticker from './Ticker';
import readonly from '@/store/readonly';
import { toMillis, mapValues } from '@/utils';

export default class Timer {
    #strategy;
    #counter;
    #stores;
    #ticker;
    #isDone = false;

    static newCountdownTimer(time) {
        return new Timer(new CountdownStrategy(time));
    }

    static newTimer(time = Infinity) {
        return new Timer(new CountUpStrategy(time));
    }

    constructor(strategy) {
        this.#strategy = strategy;
        this.#counter = writable(this.#strategy.msStart);

        const { isRunning } = this.#stores = {
            isDone: writable(false),
            isRunning: writable(false),
        };

        this.#ticker = Ticker.create({
            onStart: () => isRunning.set(true),
            onStop: () => isRunning.set(false),
        });
    }

    get stores() { return mapValues(
        this.#stores,
        store => store.readonly || (store.readonly = readonly(store))
    ); }
    get isRunning() { return this.#ticker.isRunning; }
    get isDone() { return this.#isDone; }

    #setDone(done = true) {
        this.#isDone = done;
        this.#stores.isDone.set(done);
    }

    #startTicker() {
        let handler = null;
        if (!this.#ticker.isReady) {
            handler = this.#strategy.newTickHandler(this.#counter, () => {
                this.stop();
                this.#setDone(true);
            });
        }
        this.#ticker.start(handler);
    }

    #stopTicker() {
        this.#ticker.stop();
    }

    start() {
        if (!this.isRunning && !this.#isDone) {
            this.#startTicker();
        }

        return this;
    }

    stop() {
        this.#stopTicker();

        return this;
    }

    reset() {
        this.#counter.set(this.#strategy.msStart);
        this.#setDone(false);

        return this;
    }

    // setTotalTime(time)
    setTime(time) {
        this.#strategy.setTime(time);

        return this;
    }

    // addTotalTime(time)
    addTime(time) {
        this.#strategy.addTime(time);

        return this;
    }

    // subTotalTime(time)
    subTime(time) {
        this.#strategy.subTime(time);

        return this;
    }

    goto(time) {
        this.#counter.set(
            this.#strategy.clamp(toMillis(time))
        );

        return this;
    }

    advance(time) {
        this.#counter.update(
            $ms => this.#strategy.clamp($ms + toMillis(time))
        );

        return this;
    }

    rewind(time) {
        this.#counter.update(
            $ms => this.#strategy.clamp($ms - toMillis(time))
        );

        return this;
    }

    reverse(time) {
        this.pause();
        this.#strategy = this.#strategy.reverse(time);
        this.start();
    }

    countdown(time) {
        if (this.#strategy instanceof CountUpStrategy) {
            this.#strategy = this.#strategy.reverse(time);
            this.reset();
        }
        return this;
    }

    // Svelte store interface methods:

    set(time) {
        this.setTime(time);
    }

    subscribe(listener, ...args) {
        return this.#counter.subscribe(listener, ...args);
    }
}

/* ============================================= */

/**
 * @class CountUpStrategy
 */
class CountUpStrategy {
    msStart = 0;
    msEnd = 0;

    constructor(time) {
        this.setTime(time);
    }

    get msTime() { console.log(`CountUpStrategy.get[msTime]()=`, this.msStart); return this.msEnd; }
    set msTime(value) { console.log(`CountUpStrategy.set[msTime](${value})`); this.msEnd = value; }

    setTime(time) {
        return this.msTime = this.clampToZero(toMillis(time));
    }

    addTime(time) {
        return this.setTime(this.msTime + toMillis(time));
    }

    subTime(time) {
        return this.setTime(this.msTime - toMillis(time));
    }

    newTickHandler(counter, onDone) {
        let tmp;
        return delta => {
            counter.update($ms => tmp = $ms + delta);
            if (tmp >= this.msEnd) {
                if (tmp > this.msEnd) {
                    counter.set(this.msEnd);
                }
                onDone();
            }
        };
    }

    clampToZero(ms) {
        return Math.max(0, ms);
    }

    clamp(ms) {
        return Math.min(Math.max(ms, this.msStart), this.msEnd);
    }

    reverse(time) {
        return new CountdownStrategy(time ?? this.msTime);
    }
}

/* --------------------------------------------- */

/**
 * @class CountdownStrategy
 */
class CountdownStrategy extends CountUpStrategy {
    get msTime() { return this.msStart; }
    set msTime(value) { this.msStart = value; }

    setTime(time) {
        const ms = toMillis(time);
        return super.setTime(isFinite(ms) ? ms : 0);
    }

    newTickHandler(counter, onDone) {
        let tmp;
        return delta => {
            counter.update($ms => tmp = $ms - delta);
            if (tmp <= this.msEnd) {
                if (tmp < this.msEnd) {
                    counter.set(this.msEnd);
                }
                onDone();
            }
        };
    }

    reverse(time) {
        return new CountUpStrategy(time ?? this.msTime);
    }
}
