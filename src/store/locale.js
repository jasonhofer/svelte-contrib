import { writable } from 'svelte/store';

let locale = 'en-US';

if (typeof Intl !== 'undefined') {
    locale = Intl.DateTimeFormat().resolvedOptions().locale;
} else if (typeof process !== 'undefined') {
    locale = process.env.LOCALE || process.env.DEFAULT_LOCALE || locale;
}

export default writable(locale);

function format(l) {
}
