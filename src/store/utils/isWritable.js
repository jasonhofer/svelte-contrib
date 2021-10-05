
export default function isWritable(value) {
	return (
        value != null &&
        typeof value.subscribe === 'function' &&
        typeof value.set === 'function'
    );
}
