import classes from '@/actions/classes';

const node = {
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
  },
};

test('use:classes', () => {
  const { update } = classes(node, 'foo bar');
  expect(node.classList.add)
    .lastCalledWith('foo', 'bar');
  expect(node.classList.remove)
    .not.toHaveBeenCalled();
  node.classList.add.mockClear();
  node.classList.remove.mockClear();

  update('bar baz');
  expect(node.classList.add)
    .lastCalledWith('bar', 'baz');
  expect(node.classList.remove)
    .lastCalledWith('foo');
  node.classList.add.mockClear();
  node.classList.remove.mockClear();

  update('');
  expect(node.classList.add)
    .not.toHaveBeenCalled();
  expect(node.classList.remove)
    .lastCalledWith('bar', 'baz');
});
