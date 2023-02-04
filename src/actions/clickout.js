/**
 * Usages:
 *
 *     <div use:clickout={() => alert('You clicked outside of this element.')}></div>
 *
 *     <div use:clickout on:clickout={() => alert('You clicked outside of this element.')}></div>
 *
 * @param {HTMLElement} node
 * @param {Function} [handler]
 * @returns {Object}
 */
export default function clickout(node, handler = null) {
    handler = (typeof handler === 'function' ? handler : null);

    const listener = event => {
        if (
            node !== event.target &&
            !node.contains(event.target) &&
            !event.defaultPrevented
        ) {
            const eventData = { detail: { event, node } };
            if (handler) {
                handler(eventData);
            }
            node.dispatchEvent(new CustomEvent('clickout', eventData));
        }
    }

    document.addEventListener('click', listener, true);

    return {
        destroy() {
            document.removeEventListener('click', listener, true);
        }
    }
}
