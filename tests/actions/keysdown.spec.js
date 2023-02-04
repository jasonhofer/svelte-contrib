import keysdown from '@/actions/keysdown';

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

function clearMocks() {
  events = {};
  event = null;
  addEventListener.mockClear();
  removeEventListener.mockClear();
  dispatchEvent.mockClear();
}

test('use:keysdown={"Escape"}', () => {
  testKeys('Escape', {
    key: 'Escape',
    code: 'Escape',
  });
  testKeys('Escape', {
    key: 'Enter',
    code: 'Enter',
  }, false);
});

test('use:keysdown={"Escape|Enter"}', () => {
  testKeys(['Escape', 'Enter'], {
    key: 'Escape',
    code: 'Escape',
  });
  testKeys('Escape|Enter', {
    key: 'Enter',
    code: 'Enter',
  });
  testKeys('Escape|Enter', {
    key: 'Enter',
    code: 'Enter',
    ctrlKey: true,
  }, false);
});

test('use:keysdown={"Escape|Ctrl-Enter"}', () => {
  testKeys(['Escape', 'Ctrl-Enter'], {
    key: 'Escape',
    code: 'Escape',
  });
  testKeys('Escape|Ctrl-Enter', {
    key: 'Enter',
    code: 'Enter',
    ctrlKey: true,
  });
  testKeys('Escape|Ctrl-Enter', {
    key: 'Enter',
    code: 'Enter',
  }, false);
});

test('use:keysdown={"Escape|Ctrl-Enter|Alt+Shift+B"}', () => {
  testKeys(['Escape', 'Ctrl-Enter', 'Alt+Shift+B'], {
    key: 'Escape',
    code: 'Escape',
  });
  testKeys(['Escape', 'Ctrl-Enter', 'Alt+Shift+B'], {
    key: 'Enter',
    code: 'Enter',
    ctrlKey: true,
  });
  testKeys('Escape|Ctrl-Enter|Alt+Shift+B', {
    key: 'B',
    code: 'KeyB',
    altKey: true,
    shiftKey: true,
  });
  testKeys('Escape|Ctrl-EnterAlt+Shift+B', {
    key: 'B',
    code: 'KeyB',
    shiftKey: true,
  }, false);
});

function testKeys(keys, ev, called = true) {
  clearMocks();
  const { destroy } = keysdown(node, keys);
  expect(addEventListener)
    .toHaveBeenCalled();
  expect(events.keydown)
    .toBeDefined();
  const e = keyEvent(ev);
  events.keydown(e);
  if (called) {
    expect(dispatchEvent)
      .toHaveBeenCalled();
    expect(eOnly(event.detail.event))
      .toEqual(e);
    expect(event.detail.node)
      .toBe(node);
  } else {
    expect(dispatchEvent)
      .not.toHaveBeenCalled();
    expect(event).toBeNull();
  }
  destroy();
  expect(events.keydown)
    .toBeUndefined();
}

const keyEventObj = {
  key: null,
  code: null,
  shiftKey: false,
  ctrlKey: false,
  altKey: false,
  metaKey: false,
};
const keyEventKeys =
  Object.keys(keyEventObj);

function keyEvent(ev = {}) {
  return Object.assign({}, keyEventObj, ev);
}

function eOnly(e) {
  return only(e, keyEventKeys);
}

function only(obj, keys) {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(
        ([k]) => keys.includes(k)
      )
  );
}
