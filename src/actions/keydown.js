// <input use:keydown on:Escape={() => alert('Escape key hit')} />
// <input use:keydown on:Enter={() => alert('Enter key hit')} />

export default function keydown(node) {
    const listener = event => {
        if (event.code && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent(event.code, { detail: { event, node } }));
        }
    }

    node.addEventListener('keydown', listener, true);

    return {
        destroy() {
            node.removeEventListener('keydown', listener, true);
        },
    };
}
