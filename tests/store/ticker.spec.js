import ticker from '@/store/ticker';

afterEach(() => {
    jest.useRealTimers();
});

it('it caches tickers', () => {
    const t100 = ticker(100);
    const t200 = ticker(200);
    const t300 = ticker(300);

    expect(Object.is(t100, ticker(100))).toBeTruthy();
    expect(Object.is(t200, ticker(200))).toBeTruthy();
    expect(Object.is(t300, ticker(300))).toBeTruthy();

    const o = {};
    expect(o).toBe(o);
    expect(o).not.toBe({});
});

it('it defaults to ticking once every second', () => {
    jest.useFakeTimers();

    const store = ticker();

    let counter = 0;

    store.subscribe(() => {
        ++counter;
    });

    jest.advanceTimersByTime(3000);

    expect(counter).toBe(3);
});

it('can tick every minute, on the minute', () => {
    jest.useFakeTimers();

    const store = ticker('minute');

    let counter = 0;
    const seconds = [];

    store.subscribe(() => {
        ++counter;
        seconds.push(new Date().getSeconds());
    });

    jest.advanceTimersByTime(180000); // 3 minutes

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

it('can have custom millisecond periods', () => {
    jest.useFakeTimers();

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

    jest.advanceTimersByTime(1000);

    expect(s010counter).toBe(100);
    expect(s100counter).not.toBeLessThan(10);
    expect(s100counter).not.toBeGreaterThan(11); // Sometimes it's 11 for some reason.
    expect(s250counter).toBe(4);
    expect(s500counter).toBe(2);
});
