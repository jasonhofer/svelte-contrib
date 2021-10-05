import storage from '@/services/storage';

// 'foo'       --> storage.get('foo');
// 'foo.bar'   --> storage('foo').get('bar');
// '.foo.bar'  --> storage.get('foo.bar');
export default function persisted(key, value) {
	let namespace = null;
	if (key.startsWith('.')) {
		key = key.substr(1);
	} else if (key.includes('.')) {
		const parts = key.split('.');
		namespace = parts.shift();
		key = parts.join('.');
	}

    return storage(namespace).writable(key, value);
}
