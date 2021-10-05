import { readable } from 'svelte/store';

/* A few different ways to use this:

import { responsive, breakpoints } from 'svelte-contrib/store';
export default responsive(breakpoints.tailwind);

import { responsive } from 'svelte-contrib/store';
export default responsive('tailwind');

import { responsive } from 'svelte-contrib/store';
export default responsive.tailwind();

*/

export function responsive(breakpoints) {
    if (typeof matchMedia === 'undefined') {
        throw new Error('The matchMedia() function does not exist.');
    }
    if (typeof breakpoints === 'string') {
        breakpoints = predefinedBreakpoints[breakpoints];
    }

    let max = 0;

    const queries = Object.entries(breakpoints)
        .sort((a, b) => b[1] - a[1])
        .reduce((obj, [name, min]) => {
            const only = name + '_only';
            const str = `screen and (min-width: ${min})`;
            obj[name] = matchMedia(str);
            obj[only] = matchMedia(str + (max > 0 ? ` and (max-width: ${max}px)` : ''));
            max = min - 1;
            return obj;
        }, {});

    const getResults = () => (
        Object.keys(breakpoints).reduce(
            (results, name) => {
                const only = name + '_only';
                results[name] = queries[name].matches;
                results[only] = queries[only].matches;
                if (results[name]) {
                    results.breakpoints.push(name);
                }
                if (results[only]) {
                    results.breakpoint = name;
                }
                return results;
            },
            { breakpoint: null, breakpoints: [] }
        )
    );

    return readable(getResults(), (set) => {
        const unsubs = Object.keys(queries).map((name) => {
            const listener = () => set(getResults());
            queries[name].addEventListener('change', listener);
            return () => queries[name].removeEventListener('change', listener);
        });

        return () => unsubs.forEach(unsub => unsub());
    });
}

export function mediaQuery(queryStr) {
    if (typeof matchMedia === 'undefined') {
        throw new Error('The matchMedia() function does not exist.');
    }

    const query = matchMedia(queryStr);

    return readable(query.matches, set => {
		const listener = e => set(e.matches);
		query.addEventListener('change', listener);

        return () => query.removeEventListener('change', listener);
	});
}

export const breakpoints = {
    tailwind: {
        xs:     0,
        sm:   640,
        md:   768,
        lg:  1024,
        xl:  1280,
        xxl: 1536, // 2xl
    },
    bootstrap: {
        xs:     0,
        sm:   576,
        md:   768,
        lg:   992,
        xl:  1200,
        xxl: 1400,
    },
    foundation: {
        small:      0,
        medium:   640,
        large:   1024,
        xlarge:  1200,
        xxlarge: 1440,
    },
    bulma: {
        mobile:        0,
        tablet:      769,
        desktop:    1024,
        widescreen: 1216,
        fullhd:     1408,
    },
    ionic: {
        xs:    0,
        sm:  576,
        md:  768,
        lg:  992,
        xl: 1200,
    },
    material_ui: {
        xs:    0,
        sm:  600,
        md:  960,
        lg: 1280,
        xl: 1920,
    },
    materialize: {
        s:     0,
        m:   600,
        l:   992,
        xl: 1200,
    },
    semantic: {
        mobile:           0,
        table:          768,
        small_monitor:  992,
        large_monitor: 1200,
    },
    uikit: {
        xs:    0,
        s:   640,
        m:   960,
        l:  1200,
        xl: 1600,
    },
    halfmoon: {
        xs:    0,
        sm:  540,
        md:  720,
        lg:  960,
        xl: 1140,
    },
};

const predefinedBreakpoints = breakpoints;

Object.entries(breakpoints).forEach(([name, points]) => {
    responsive[name] = () => responsive(points);
});

export default responsive;
