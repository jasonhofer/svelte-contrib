import MatchMediaMock from '../mocks/MatchMediaMock';
import { isReadable, isWritable } from '@/store/utils';
import { responsive, mediaQuery, breakpoints } from '@/store/responsive';

let matchMediaMock;

beforeEach(() => {
    matchMediaMock = new MatchMediaMock();
});

afterEach(() => {
    matchMediaMock.clear();
});

describe('responsive()', () => {
    it('reacts to breakpoint changes', () => {
        const store = responsive({
            foo: 0,
            bar: 100,
            baz: 200,
        });
        const listener = jest.fn();
        const logger = value => console.log('LOGGER:', value);
        store.subscribe(listener);
        store.subscribe(logger);
        expect(listener).toHaveBeenCalledTimes(1);
        expect(listener).lastCalledWith({
            breakpoint: null,
            breakpoints: [],
            foo: false,
            foo_only: false,
            bar: false,
            bar_only: false,
            baz: false,
            baz_only: false,
        });
        matchMediaMock.setWindowWidth(50);
        expect(listener).toHaveBeenCalledTimes(2);
        expect(listener).lastCalledWith({
            breakpoint: 'foo',
            breakpoints: ['foo'],
            foo: true,
            foo_only: true,
            bar: false,
            bar_only: false,
            baz: false,
            baz_only: false,
        });
        matchMediaMock.setWindowWidth(150);
        expect(listener).toHaveBeenCalledTimes(3);
        expect(listener).lastCalledWith({
            breakpoint: 'bar',
            breakpoints: ['foo', 'bar'],
            foo: true,
            foo_only: false,
            bar: true,
            bar_only: true,
            baz: false,
            baz_only: false,
        });
        matchMediaMock.setWindowWidth(250);
        expect(listener).toHaveBeenCalledTimes(4);
        expect(listener).lastCalledWith({
            breakpoint: 'baz',
            breakpoints: ['foo', 'bar', 'baz'],
            foo: true,
            foo_only: false,
            bar: true,
            bar_only: false,
            baz: true,
            baz_only: true,
        });
        console.log(listener.mock.calls);
    });
});

/*
describe('mediaQuery()', () => {
    it('returns a read-only store', () => {
        const store = mediaQuery('(min-width: 1200px)');
        expect(isReadable(store)).toBeTruthy();
        expect(isWritable(store)).toBeFalsy();
    });

    it('begins as true if media query was already matching', () => {
        const queryStr = '(min-width: 1200px)';
        const store = mediaQuery(queryStr);
        const listener = jest.fn();
        store.subscribe(listener);
        matchMediaMock.useMediaQuery(queryStr);
        expect(listener).toHaveBeenCalledWith(true);
    });

    it('begins as false if media query does not match yet', () => {
        const store = mediaQuery('(min-width: 1200px)');
        const listener = jest.fn();
        store.subscribe(listener);
        expect(listener).toHaveBeenCalledWith(false);
    });

    it('is true when the media query changes to matching', () => {
        const queryStr = '(min-width: 2048px)';
        const store = mediaQuery(queryStr);
        const listener = jest.fn();
        store.subscribe(listener);
        expect(listener).toHaveBeenCalledWith(false);
        matchMediaMock.useMediaQuery(queryStr);
        expect(listener).toHaveBeenCalledWith(true);
    });
});
*/
