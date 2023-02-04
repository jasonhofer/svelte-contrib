import collection from '@/store/collection';

describe('collection()', () => {

  test('push()', () => {
    const c = collection([1, 2, 3]);
    const f = jest.fn();
    c.subscribe(f);
    expect(f).lastCalledWith([1, 2, 3]);
    c.push(4);
    expect(f).lastCalledWith([1, 2, 3, 4]);
  });

  test('unshift()', () => {
    const c = collection([1, 2, 3]);
    const f = jest.fn();
    c.subscribe(f);
    expect(f).lastCalledWith([1, 2, 3]);
    c.unshift(0);
    expect(f).lastCalledWith([0, 1, 2, 3]);
  });

  test('length', () => {
    const c = collection(
      [11, 22, 33]
    );
    const s = c.length;
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith(3);
    c.push(44);
    expect(f).lastCalledWith(4);
  });

  test('map()', () => {
    const c = collection([1, 2, 3]);
    const s = c.map(v => v * 2);
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith([2, 4, 6]);
    c.push(4);
    expect(f).lastCalledWith([2, 4, 6, 8]);
  });

  test('filter()', () => {
    const c = collection([1, 2, 3]);
    const s = c.filter(v => !(v % 2));
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith([2]);
    c.push(4);
    expect(f).lastCalledWith([2, 4]);
  });

  test('reduce()', () => {
    const c = collection([1, 2, 3]);
    const s = c.reduce((s, v) => s + v, 0);
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith(6);
    c.push(4);
    expect(f).lastCalledWith(10);
  });

  test('at()', () => {
    const c = collection([1, 2, 3]);
    const s = c.at(1);
    const t = c.at(-1);
    const f = jest.fn();
    const g = jest.fn();
    s.subscribe(f);
    t.subscribe(g);
    expect(f).lastCalledWith(2);
    expect(g).lastCalledWith(3);
    c.unshift(0);
    c.push(4);
    expect(f).lastCalledWith(1);
    expect(g).lastCalledWith(4);
    c.set([]);
    expect(f).lastCalledWith(void 0);
    expect(g).lastCalledWith(void 0);
  });

  test('includes()', () => {
    const c = collection([1, 2, 3]);
    const s = c.includes(3);
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith(true);
    c.pop();
    expect(f).lastCalledWith(false);
  });

  test('indexOf()', () => {
    const c = collection([1, 2, 3]);
    const s = c.indexOf(2);
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith(1);
    c.unshift(0);
    expect(f).lastCalledWith(2);
  });

  test('every()', () => {
    const c = collection([1, 2, 3]);
    const s = c.every(v => v > 0);
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith(true);
    c.unshift(0);
    expect(f).lastCalledWith(false);
  });

  test('some()', () => {
    const c = collection([1, 2, 3]);
    const s = c.some(v => v < 2);
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith(true);
    c.shift();
    expect(f).lastCalledWith(false);
  });

  test('find()', () => {
    let o, id = 3;
    const c = collection([
      {id: 1},
      {id: 2},
      o = {id},
      {id: 4},
    ]);
    const s = c.find(v => v.id === id);
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith(o);
    c.set([]);
    expect(f).lastCalledWith(void 0);
  });

  test('sort()', () => {
    const c = collection([3, 1, 2]);
    const s = c.sort();
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith([1, 2, 3]);
    c.unshift(4);
    expect(f).lastCalledWith([1, 2, 3, 4]);
    c.set([8, 5, 7, 6]);
    expect(f).lastCalledWith([5, 6, 7, 8]);
  });

  test('reverse()', () => {
    const c = collection([1, 2, 3]);
    const s = c.reverse();
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith([3, 2, 1]);
    c.push(4);
    expect(f).lastCalledWith([4, 3, 2, 1]);
  });

  test('join()', () => {
    const c = collection([1, 2, 3]);
    const s = c.join('-');
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith('1-2-3');
    c.push(4);
    expect(f).lastCalledWith('1-2-3-4');
  });

  test('pop()', () => {
    const c = collection([1, 2, 3]);
    const f = jest.fn();
    c.subscribe(f);
    expect(f).lastCalledWith([1, 2, 3]);
    let val = c.pop();
    expect(val).toBe(3);
    expect(f).lastCalledWith([1, 2]);
  });

  test('shift()', () => {
    const c = collection([1, 2, 3]);
    const f = jest.fn();
    c.subscribe(f);
    expect(f).lastCalledWith([1, 2, 3]);
    let val = c.shift();
    expect(val).toBe(1);
    expect(f).lastCalledWith([2, 3]);
  });

  test('forEach()', () => {
    const c = collection([
      {a: 1},
      {a: 2},
      {a: 3},
    ]);
    const f = jest.fn();
    c.subscribe(f);
    expect(f).toBeCalledTimes(1);
    expect(f).lastCalledWith([
      {a: 1},
      {a: 2},
      {a: 3},
    ]);
    c.forEach(o => {
      if (o.a > 3) {
        o.a = 3;
        return true;
      }
    });
    expect(f).toBeCalledTimes(1);
    c.forEach(o => {
      if (o.a > 2) {
        o.a = 2;
        return true;
      }
    });
    expect(f).toBeCalledTimes(2);
    expect(f).lastCalledWith([
      {a: 1},
      {a: 2},
      {a: 2},
    ]);
  });

  test('reverse().join()', () => {
    const c = collection([1, 2, 3]);
    const s = c.reverse().join('-');
    const f = jest.fn();
    s.subscribe(f);
    expect(f).lastCalledWith('3-2-1');
    c.push(4);
    expect(f).lastCalledWith('4-3-2-1');
  });

});
