import store2 from 'store2';
import { writable } from 'svelte/store';

applyExtensions(store2._);

export default store2;

function applyExtensions(_) {

    // storage.update('my_array', my_array => my_array.concat([1, 2, 3]));
	_.fn('update', function (key, fn, alt) {
		const newValue = fn(this.get(key, alt));
		this.set(key, newValue);
		return newValue;
	});

	// const persistedValue = storage.writable('my_value');
	_.fn('writable', function (key, alt) {
		return this.persistStore(key, writable(this.get(key, alt)));
	});

	// storage.persistStore('my_value', myStore);
	_.fn('persistStore', function (key, store) {
		store.detach = store.subscribe(value => this.set(key, value));
		return store;
	});

	_.fn('falsy', key => !this.get(key));
	_.fn('truthy', key => Boolean(this.get(key)));

	//
	// https://raw.githubusercontent.com/nbubna/store/master/src/store.deep.js
	//
	// save original core accessor
	var _get = _.get;
	// replace with enhanced version
	_.get = function (area, key, kid) {
		var s = _get(area, key);
		if (s == null) {
			var parts = _.split(key);
			if (parts) {
				key = parts[0];
				kid = kid ? parts[1] + '.' + kid : parts[1];
				return _.get(area, parts[0], kid);
			}
		} else if (kid) {
			var val = _.parse(s);
			/*jshint evil:true */
			val = eval('val.'+kid);
			s = _.stringify(val);
		}
		return s;
	};

	// expose internals to allow extensibility
	_.split = function (key) {
		var dot = key.lastIndexOf('.');
		if (dot > 0) {
			var kid = key.substring(dot+1, key.length);
			key = key.substring(0, dot);
			return [key, kid];
		}
	};

	//
	// https://raw.githubusercontent.com/nbubna/store/master/src/store.array.js
	//
	// expose internals to allow extensibility
	_.array = function (fnName, key, args) {
		let value = this.get(key, []),
				array = Array.isArray(value) ? value : [value],
				ret   = array[fnName].apply(array, args);
		if (array.length > 0) {
			this.set(key, array.length > 1 ? array : array[0]);
		} else {
			this.remove(key);
		}
		return ret;
	};
	_.arrayFn = function (fnName, ...args) {
		return function (key) {
			return this.array(fnName, key, ...args);
		};
	};
	// add function(s) to the store interface
	_.fn('array', _.array);
	Object.getOwnPropertyNames(Array.prototype).forEach(function (name) {
		if ('constructor' === name) return;
		// add Array interface functions w/o existing conflicts
		if (typeof Array.prototype[name] === 'function') {
			if (!(name in _.storeAPI)) {
				_.fn(name, _.array[name] = _.arrayFn(name));
			}
		}
	});

	//
	// https://raw.githubusercontent.com/nbubna/store/master/src/store.on.js
	//
	_.on = function(key, fn) {
		if (!fn) { fn = key; key = ''; }// no key === all keys
		var s = this,
				listener = function(e) {
					var k = s._out(e.key);// undefined if key is not in the namespace
					if ((k && (k === key ||// match key if listener has one
										 (!key && k !== '_-bad-_'))) &&// match catch-all, except internal test
							(!e.storageArea || e.storageArea === s._area)) {// match area, if available
						return fn.call(s, _.event.call(s, k, e));
					}
				};
		window.addEventListener('storage', fn[key+'-listener']=listener, false);
		return this;
	};

	_.off = function(key, fn) {
		if (!fn) { fn = key; key = ''; }// no key === all keys
		window.removeEventListener('storage', fn[key+'-listener']);
		return this;
	};

	_.once = function(key, fn) {
		if (!fn) { fn = key; key = ''; }
		var s = this, listener;
		return s.on(key, listener = function() {
			s.off(key, listener);
			return fn.apply(this, arguments);
		});
	};

	_.event = function(k, e) {
		var event = {
			key: k,
			namespace: this.namespace(),
			newValue: _.parse(e.newValue),
			oldValue: _.parse(e.oldValue),
			url: e.url || e.uri,
			storageArea: e.storageArea,
			source: e.source,
			timeStamp: e.timeStamp,
			originalEvent: e
		};
		if (_.cache) {
			var min = _.expires(e.newValue || e.oldValue);
			if (min) {
				event.expires = _.when(min);
			}
		}
		return event;
	};

	// store2 policy is to not throw errors on old browsers
	var old = !window.addEventListener ? function(){} : null;
	_.fn('on', old || _.on);
	_.fn('off', old || _.off);
	_.fn('once', old || _.once);
}
