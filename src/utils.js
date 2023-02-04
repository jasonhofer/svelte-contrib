import parseDuration from 'parse-duration';

const padding = Array(3).fill(0);

export function toMillis(value) {
    // isNaN([2, 3]) === true
    //    isNaN([3]) === false
    //       +[2, 3] === NaN
    //          +[3] === 3
    // parseInt([3]) === 3
    //     [3] * [3] === 9
    if (Array.isArray(value)) {
        if (!value.length) {
            return 0;
        }
        value = ':' + value.join(':');
    } else if (!isNaN(value)) {
        if (!isFinite(value)) {
            return value;
        }
        return Math.floor(+value);
    }
    if (!/\d/.test(value)) {
        value = '1 ' + value; // "1 minute"
    } else if (value.includes(':')) {
        const p = value.split(':')
            .map(n => +n || 0)
            .reverse()
            .concat(padding);
        value = (
            p[2] + 'h ' +
            p[1] + 'm ' +
            p[0] + 's'
        );
    }
    return parseDuration(value, 'ms');
}

export function prune(obj) {
    return filterValues(obj, Boolean);
}

export function filterValues(obj, fn) {
    const out = {};
    for (let key in obj) {
        if (fn(obj[key])) {
            out[key] = obj[key];
        }
    }
    return out;
}

export function mapValues(obj, fn) {
    const out = {};
    for (let key in obj) {
        out[key] = fn(obj[key]);
    }
    return out;
}

export function isObject(obj, ifArray = true) {
    return Boolean(
        null != obj &&
        typeof obj === 'object' &&
        (ifArray || !Array.isArray(obj))
    );
}

export function isClass(value) {
    return (
        typeof value === 'function' &&
        /^class\s/.test(value.toString().trim().substr(0, 6))
    );
}

export function isEmptyObject(obj) {
    for (let _ in obj) {
        return false;
    }
    return true;
}

// https://locutus.io/php/strings/ucfirst/
export function ucfirst(str) {
    str += '';
    return str.charAt(0).toUpperCase() + str.substr(1);
}

// https://locutus.io/php/strings/lcfirst/
export function lcfirst(str) {
    str += '';
    return str.charAt(0).toLowerCase() + str.substr(1);
}

export function camel(str) {
    const cc = str.replaceAll(/[\W_]+/g, ' ')
        .split(/\s+|(?<=[a-z])(?=[A-Z])|(?<=[0-9])(?=[a-zA-Z])/)
        .map(s => ucfirst(s.toLowerCase()))
        .join('');
    return lcfirst(cc);
}

export function hasProp(obj, name) {
    if (!obj || !['object', 'function'].includes(typeof obj)) {
        return false;
    }
    if (typeof obj === 'object') {
        return obj.hasOwnProperty(name) || hasProp(obj.constructor, name);
    }
    return obj.hasOwnProperty('prototype') && obj.prototype.hasOwnProperty(name);
}
