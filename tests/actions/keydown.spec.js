import keydown from '@/actions/keydown';

let events, event;

const addEventListener = jest.fn((event, callback) => {
  events[event] = callback;
}).mockName('addEventListener');

const removeEventListener = jest.fn((event, callback) => {
  delete events[event];
}).mockName('removeEventListener');

const dispatchEvent = jest.fn(e => {
  event = e;
}).mockName('dispatchEvent');

const node = {
  addEventListener,
  removeEventListener,
  dispatchEvent,
};

beforeEach(() => {
  events = {};
  event = null;
});

test('use:keydown', () => {
  const { destroy } = keydown(node);
  expect(addEventListener)
    .toHaveBeenCalled();
  const e = { code: 'a' };
  events.keydown(e);
  expect(dispatchEvent)
    .toHaveBeenCalled();
  expect(event.detail.event.code)
    .toBe(e.code);
  expect(event.detail.node)
    .toBe(node);
  destroy();
  expect(events.keydown)
    .toBeUndefined();
});
