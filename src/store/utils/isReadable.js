
export default function isReadable(value) {
	return (
        value != null &&
        typeof value.subscribe === 'function'
    );
}
