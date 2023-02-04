import { toMillis, camel, hasProp } from '@/utils';

const MS_SECOND = 1000;
const MS_MINUTE = 60 * MS_SECOND;
const MS_HOUR = 60 * MS_MINUTE;
const MS_DAY = 24 * MS_HOUR;
const MS_WEEK = 7 * MS_DAY;

describe('toMillis()', () => {

  it('returns a given integer', () => {
    expect(toMillis(0)).toBe(0);
    expect(toMillis(1)).toBe(1);
    expect(toMillis(1234)).toBe(1234);
  });

  it('returns an integer when given a float', () => {
    expect(toMillis(0.987)).toBe(0);
    expect(toMillis(1.987)).toBe(1);
    expect(toMillis(1234.987)).toBe(1234);
  });

  it('returns an integer when given a numeric string', () => {
    expect(toMillis('0')).toBe(0);
    expect(toMillis('1')).toBe(1);
    expect(toMillis('1234')).toBe(1234);
    expect(toMillis('001234')).toBe(1234);

    expect(toMillis('0.987')).toBe(0);
    expect(toMillis('1.987')).toBe(1);
    expect(toMillis('1234.987')).toBe(1234);
    expect(toMillis('001234.987')).toBe(1234);
  });

  it('parses single unit names without numbers', () => {
    expect(toMillis('second')).toBe(MS_SECOND);
    expect(toMillis('minute')).toBe(MS_MINUTE);
    expect(toMillis('hour')).toBe(MS_HOUR);
    expect(toMillis('day')).toBe(MS_DAY);
    expect(toMillis('week')).toBe(MS_WEEK);

    expect(toMillis('seconds')).toBe(MS_SECOND);
    expect(toMillis('minutes')).toBe(MS_MINUTE);
    expect(toMillis('hours')).toBe(MS_HOUR);
    expect(toMillis('days')).toBe(MS_DAY);
    expect(toMillis('weeks')).toBe(MS_WEEK);

    expect(toMillis('s')).toBe(MS_SECOND);
    expect(toMillis('m')).toBe(MS_MINUTE);
    expect(toMillis('h')).toBe(MS_HOUR);
    expect(toMillis('d')).toBe(MS_DAY);
    expect(toMillis('w')).toBe(MS_WEEK);
  });

  it('parses colon separated time values', () => {
    expect(toMillis('01:02:03')).toBe(MS_HOUR + (MS_MINUTE * 2) + (MS_SECOND * 3));
    expect(toMillis('1:02:03')).toBe(MS_HOUR + (MS_MINUTE * 2) + (MS_SECOND * 3));
    expect(toMillis(':02:03')).toBe((MS_MINUTE * 2) + (MS_SECOND * 3));
    expect(toMillis('2:03')).toBe((MS_MINUTE * 2) + (MS_SECOND * 3));
    expect(toMillis(':03')).toBe(MS_SECOND * 3);
    expect(toMillis(':3')).toBe(MS_SECOND * 3);

    expect(toMillis('10:20:30')).toBe((MS_HOUR * 10) + (MS_MINUTE * 20) + (MS_SECOND * 30));
    expect(toMillis(':20:30')).toBe((MS_MINUTE * 20) + (MS_SECOND * 30));
    expect(toMillis('20:30')).toBe((MS_MINUTE * 20) + (MS_SECOND * 30));
    expect(toMillis(':30')).toBe(MS_SECOND * 30);
  });

  it('handles arrays of integers', () => {
    expect(toMillis([])).toBe(0);

    expect(toMillis([1, 2, 3])).toBe(MS_HOUR + (MS_MINUTE * 2) + (MS_SECOND * 3));

    expect(toMillis([2, 3])).toBe((MS_MINUTE * 2) + (MS_SECOND * 3));
    expect(toMillis([0, 2, 3])).toBe((MS_MINUTE * 2) + (MS_SECOND * 3));

    expect(toMillis([3])).toBe(MS_SECOND * 3);
    expect(toMillis([0, 3])).toBe(MS_SECOND * 3);
    expect(toMillis([0, 0, 3])).toBe(MS_SECOND * 3);

    expect(toMillis([10, 20, 30])).toBe((MS_HOUR * 10) + (MS_MINUTE * 20) + (MS_SECOND * 30));

    expect(toMillis([20, 30])).toBe((MS_MINUTE * 20) + (MS_SECOND * 30));
    expect(toMillis([0, 20, 30])).toBe((MS_MINUTE * 20) + (MS_SECOND * 30));

    expect(toMillis([30])).toBe(MS_SECOND * 30);
    expect(toMillis([0, 30])).toBe(MS_SECOND * 30);
    expect(toMillis([0, 0, 30])).toBe(MS_SECOND * 30);
  });

  it('returns infinity when given infinity', () => {
    expect(toMillis(Infinity)).toBe(Infinity);
  });

});

describe('Other:', () => {

    test('camel()', () => {
        expect(camel('foo bar baz')).toBe('fooBarBaz');
        expect(camel('foo_bar_baz')).toBe('fooBarBaz');
        expect(camel('foo-bar-baz')).toBe('fooBarBaz');
        expect(camel('FooBarBaz')).toBe('fooBarBaz');
        expect(camel('Foo_Bar_Baz')).toBe('fooBarBaz');
        expect(camel('foo    bar    baz')).toBe('fooBarBaz');
        expect(camel('foo_  -_bar?#( $($baz')).toBe('fooBarBaz');
        expect(camel('fooBarBaz')).toBe('fooBarBaz');

        expect(camel('FOO123BAR456BAZ')).toBe('foo123Bar456Baz');
        expect(camel('foo123bar456baz')).toBe('foo123Bar456Baz');
        expect(camel('foo123Bar456Baz')).toBe('foo123Bar456Baz');
    });

    test('hasProp()', () => {
        class MyClass {
            prop1 = 123;
            #prop2 = 234;
            constructor() {
                this.prop3 = 345;
            }
            get prop4() { return 456; }
        }
        const o1 = new MyClass();

        expect(hasProp(o1, 'prop1')).toBeTruthy();
        expect(hasProp(o1, '#prop2')).toBeFalsy();
        expect(hasProp(o1, 'prop2')).toBeFalsy();
        expect(hasProp(o1, 'prop3')).toBeTruthy();
        expect(hasProp(o1, 'prop4')).toBeTruthy();

        const o2 = {
            prop1: 123,
            get prop2() { return 234; },
        };
        Object.defineProperty(o2, 'prop3', {value: 345});

        expect(hasProp(o2, 'prop1')).toBeTruthy();
        expect(hasProp(o2, 'prop2')).toBeTruthy();
        expect(hasProp(o2, 'prop3')).toBeTruthy();

        function FuncClass() {
            this.prop1 = 123;
        }
        FuncClass.prototype.prop2 = 234;
        const o3 = new FuncClass();
        Object.defineProperty(o3, 'prop3', {value: 345});

        expect(hasProp(o3, 'prop1')).toBeTruthy();
        expect(hasProp(o3, 'prop2')).toBeTruthy();
        expect(hasProp(o3, 'prop3')).toBeTruthy();
    });

});
