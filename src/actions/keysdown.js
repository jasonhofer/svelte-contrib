// <input use:keysdown={'Enter|Escape|Ctrl-Enter|Alt+Shift+B'} on:keysdown={() => console.log('Key pressed')} />
// <input use:keysdown={['Enter', 'Escape', 'Ctrl+Enter', 'Alt-Shift-B']} on:keysdown={() => console.log('Key pressed')} />

export default function keysdown(node, keys) {
    keys = (Array.isArray(keys) ? keys : keys.split('|')).map(splitKey);

    const listener = event => {
        if (event.code && !event.defaultPrevented && checkKeyboardEvent(event, keys)) {
            node.dispatchEvent(new CustomEvent('keysdown', { detail: { event, node } }));
        }
    }

    node.addEventListener('keydown', listener, true);

    return {
        destroy() {
            node.removeEventListener('keydown', listener, true);
        },
    };
}

function checkKeyboardEvent(event, keys) {
    for (let keyList of keys) {
        if (checkKey(event, keyList)) {
            return true;
        }
    }
    return false;
}

const aliases = {
    esc:     'escape',
    ctl:     'ctrl',
    cmd:     'meta',
    command: 'meta',
};

function splitKey(key) {
    // Have to parse because of combinations like "Ctrl+-", "Alt-+"
    const parts = [], delimiters = ['-', '+'];
    let delimiter = '', buffer = '';
    for (let c of key.replaceAll(/\s+/g, '').split('')) {
        if (!buffer.length) {
            buffer = c;
        } else if ((!delimiter && delimiters.includes(c)) || c === delimiter) {
            delimiter = c;
            parts.push(buffer.toLowerCase());
            buffer = '';
        } else {
            buffer += c;
        }
    }
    buffer.length && parts.push(buffer.toLowerCase());
    return parts.map(part => aliases[part] || part);
}

const impliedShift = '~!@#$%^&*()_+{}|:"<>?';
const stateKeys = ['shift', 'ctrl', 'alt', 'meta'];

function checkKey(event, comboKeys) {
    // event.key:         'a',    'A',     ' ',      '1',      '!',       '2',  'ArrowDown', 'Escape', 'Enter',  'F1', 'Shift',     'Meta'
    // event.code:     'KeyA', 'KeyA', 'Space', 'Digit1', 'Digit1', 'Numpad2',    'Numpad2', 'Escape', 'Enter',  'F1', 'ShiftLeft', 'MetaLeft'
    // event.shiftKey:  false,   true,   false,    false,     true,     false,         true,    false,   false, false, true,        false
    if (!impliedShift.includes(event.key)) {
        if (comboKeys.includes('shift') !== event.shiftKey) { return false; }
    }
    if (comboKeys.includes('ctrl') !== event.ctrlKey) { return false; }
    if (comboKeys.includes('alt') !== event.altKey) { return false; }
    if (comboKeys.includes('meta') !== event.metaKey) { return false; }
    const remaining = comboKeys.filter(k => !stateKeys.includes(k));
    if (remaining.length > 1) { return false; }
    return [event.key.toLowerCase(), event.code.toLowerCase()].includes(remaining.shift());
}
