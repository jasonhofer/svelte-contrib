import MatchMediaMock from 'jest-matchmedia-mock';

export default class MyMatchMediaMock extends MatchMediaMock {

    matchingMediaQueries = [];

    constructor() {
        super();
        const self = this;
        const mockMatchMedia = window.matchMedia;
        window.matchMedia = function (query) {
            const mediaQueryList = mockMatchMedia(query);
            delete mediaQueryList.matches;
            return {
                ...mediaQueryList,
                get matches() {
                    return (
                        self.currentMediaQuery === query ||
                        self.matchingMediaQueries.includes(query)
                    );
                },
            };
        };
    }

    setWindowWidth(width) {
        const sortedMediaQueries = this.getMediaQueries()
            .filter(q => q.startsWith('screen and') && q.includes('min-width:'))
            .map(query => ({
                query,
                min: +query.match(/min-width: (\d+)/)[1],
                max: query.includes('max-width:') ? +query.match(/max-width: (\d+)/)[1] : null,
            }))
            .sort((a, b) => a.min - b.min);

        sortedMediaQueries.filter(q => !q.max).pop().max = Infinity;
        console.log('sortedMediaQueries', sortedMediaQueries);

        const matching = [];
        let current = '';
        for (let { query, min, max } in sortedMediaQueries) {
            if (width < min) continue;
            if (max) {
                if (width > max) continue;
                current = query;
            }
            if (!matching.includes(query)) {
                matching.push(query);
            }
        }

        console.log('current:', current);
        console.log('width:', width);
        this.matchingMediaQueries = matching;
        this.useMediaQuery(current);
    }
}
