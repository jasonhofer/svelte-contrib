import isReadable from './utils/isReadable';
import toWritable from './utils/toWritable';

// Streams do not give listeners the current value.
// They only call listeners when the value changes.
export default function stream(storeOrValue) {
  const store = isReadable(storeOrValue) ?
    storeOrValue :
    toWritable(storeOrValue);
  //console.log(store, isReadable(storeOrValue), store === storeOrValue);

  const sub = store.subscribe.bind(store);

  store.subscribe = (listener, ...args) => {
    let handler = () => void (handler = listener);
    return sub(v => handler(v), ...args);
  };

  return store;

  /*
  return {
    ...store,
    subscribe(listener, ...args) {
      let handler = () => void (handler = listener);
      return store.subscribe(
        $value => handler($value),
        ...args
      );
    },
  };
  */
}
