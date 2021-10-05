import { readable } from 'svelte/store';

const tickers = {};

export default function ticker(period = 'second') {
	const ms = isNaN(period) ? toMillis(period) : +period;

    if (ms < 1) {
        throw new Error('Invalid period given to ticker: ' + period);
    }

    if (tickers[ms]) {
        return tickers[ms];
    }

    if (1 === ms) {
        return tickers[ms] = readable(Date.now(), set => {
            const interval = setInterval(() => {
                set(Date.now());
            }, 1);
            return () => {
                clearInterval(interval);
                delete tickers[ms];
            };
        });
    }

    const tickValue = () => Math.floor(Date.now() / ms);

    const ticker = readable(tickValue(), set => {
        const interval = setInterval(() => set(tickValue()), 1);
        return () => {
            clearInterval(interval);
            delete tickers[ms];
        };
    });

    // Skip the first call, it will most likely be late.
    const origSubscribe = ticker.subscribe;
    ticker.subscribe = function (run, ...args) {
        let handler = () => handler = run;
        return origSubscribe(newValue => {
            handler(newValue);
        }, ...args);
    };

    return tickers[ms] = ticker;
}

const periods = {
	millisecond:  1,
	second:    1000, // "ticks" every second, on the second
	minute:   60000, // "ticks" every minute, on the minute
	hour:   3600000, // "ticks" every hour, on the hour
};

function toMillis(period) {
    return periods[period.toLowerCase().replace(/^ms$/, 'millisecond').replace(/s$/, '')];
}
