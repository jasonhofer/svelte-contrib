import clickout from '@/actions/clickout';

let events, event;

const add = jest.spyOn(
  document,
  'addEventListener'
).mockImplementation((type, fn) => {
  events[type] = fn;
});

const rem = jest.spyOn(
  document,
  'removeEventListener'
).mockImplementation(type => {
  delete events[type];
});

const node = {
  dispatchEvent: jest.fn(e => {
    event = e;
  }).mockName('node.dispatchEvent')
};

test('use:clickout triggered', () => {
  doTest({}, false, true);
});

test('use:clickout -- not triggered because node contains target', () => {
  doTest({}, true, false);
});

test('use:clickout -- not triggered because node is target', () => {
  doTest(node, false, false);
});

function doTest(target = {}, contains = false, called = true) {
  events = {};
  event = null;
  node.dispatchEvent.mockClear();
  node.contains = jest.fn()
    .mockReturnValue(contains)
    .mockName('node.contains');
  const handler = jest.fn();
  const { destroy } = clickout(
    node,
    handler
  );
  expect(add)
    .toHaveBeenCalled();
  expect(events.click)
    .toBeDefined();
  events.click({
    target,
  });
  if (called) {
    expect(node.dispatchEvent)
      .toHaveBeenCalled();
    expect(handler)
      .toHaveBeenCalled();
    expect(event.type)
      .toBe('clickout');
    expect(event.detail.node)
      .toBe(node);
  } else {
    expect(node.dispatchEvent)
      .not.toHaveBeenCalled();
    expect(handler)
      .not.toHaveBeenCalled();
    expect(event).toBeNull();
  }

  destroy();
  expect(rem)
    .toHaveBeenCalled();
  expect(events.click)
    .toBeUndefined();
}
