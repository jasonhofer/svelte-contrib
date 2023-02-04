import storage from '@/services/storage';

// 'foo'       --> storage.get('foo');
// 'foo:bar'   --> storage('foo').get('bar');
// 'foo.bar'  --> storage.get('foo.bar');
// 'foo:bar.baz' --> storage('foo').get('bar.baz')
export function persistedValue(key, value) {
    let namespace = null;
    if (key.includes(':')) {
      [namespace, key] =
        key.split(':');
    }

    return storage(namespace)
      .writable(key, value);
}

export function persistedValues(namespace, vars) {
  if (null == vars && typeof namespace === 'object') {
    [namespace, vars] = [null, namespace];
  }
  const s = storage(namespace);
  if (vars) {
    return Object.entries(vars)
      .reduce((o, [k, v]) => (
        o[k] = s.writable(k, v), o
      ), {});
  }
  return s;
}

export default persistedValues;
