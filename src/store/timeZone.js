import { writable } from 'svelte/store';

let timeZone = 'UTC';

if (typeof Intl !== 'undefined') {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
} else if (typeof process !== 'undefined') {
    timeZone = process.env.DEFAULT_TIME_ZONE || process.env.TIME_ZONE || timeZone;
}

export default writable(timeZone);
