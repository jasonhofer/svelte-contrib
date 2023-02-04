import 'mock-match-media/polyfill';
import { setMedia, cleanup } from 'mock-match-media';
import { isReadable, isWritable } from '@/store/utils';
import { responsive, mediaQuery } from '@/store/responsive';

afterEach(() => {
    cleanup();
});

describe('responsive()', () => {
    it('returns a read-only store', () => {
        const store = responsive({
            foo: 0,
            bar: 100,
            baz: 200,
        });
        expect(isReadable(store)).toBeTruthy();
        expect(isWritable(store)).toBeFalsy();
    });

    it('reacts to breakpoint changes', () => {
        const media = {
          type: 'screen',
          width: '50px',
        };
        setMedia(media);

        const store = responsive({
            foo: 0,
            bar: 100,
            baz: 200,
        });
        const listener = jest.fn();
        store.subscribe(listener);
        
        expect(listener)
          .lastCalledWith({
            breakpoint: 'foo',
            breakpoints: ['foo'],
            foo: true,
            foo_only: true,
            bar: false,
            bar_only: false,
            baz: false,
            baz_only: false,
          });

        media.width = '150px';
        setMedia(media);
        expect(listener)
          .lastCalledWith({
            breakpoint: 'bar',
            breakpoints: ['foo', 'bar'],
            foo: true,
            foo_only: false,
            bar: true,
            bar_only: true,
            baz: false,
            baz_only: false,
          });

        media.width = '250px';
        setMedia(media);

        expect(listener)
          .lastCalledWith({
            breakpoint: 'baz',
            breakpoints: ['foo', 'bar', 'baz'],
            foo: true,
            foo_only: false,
            bar: true,
            bar_only: false,
            baz: true,
            baz_only: true,
          });
    });
});

describe('mediaQuery()', () => {
    it('returns a read-only store', () => {
        const store = mediaQuery('(min-width: 1200px)');
        expect(isReadable(store)).toBeTruthy();
        expect(isWritable(store)).toBeFalsy();
    });

    it('begins as true if media query was already matching', () => {
      setMedia({width: '1250px'});
        const store = mediaQuery('(min-width: 1200px)');
        const listener = jest.fn();
        store.subscribe(listener);
        expect(listener).lastCalledWith(true);
    });

    it('begins as false if media query does not match yet', () => {
      setMedia({width: '1150px'});
        const store = mediaQuery('(min-width: 1200px)');
        const listener = jest.fn();
        store.subscribe(listener);
        expect(listener).lastCalledWith(false);
    });

    it('is true when the media query changes to matching', () => {
      setMedia({width: '1150px'});
        const store = mediaQuery('(min-width: 1200px)');
        const listener = jest.fn();
        store.subscribe(listener);
        expect(listener).lastCalledWith(false);

      setMedia({width: '1250px'});
        expect(listener).lastCalledWith(true);
    });
});
