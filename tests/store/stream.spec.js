import stream from '@/store/stream';

test('stream()', () => { 
  const s = stream('foo');
  const l = jest.fn();
  let u = s.subscribe(l);
  expect(l).not.toHaveBeenCalled();
  s.set('bar');
  expect(l).lastCalledWith('bar');
  s.set('baz');
  expect(l).lastCalledWith('baz');
  expect(l).toHaveBeenCalledTimes(2);
  l.mockClear();
  u();
  s.set('baz');
  s.subscribe(l);
  expect(l).not.toHaveBeenCalled();
  s.set('qux');
  expect(l).lastCalledWith('qux');
});
