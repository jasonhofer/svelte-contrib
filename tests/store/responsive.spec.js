import MatchMediaMock from 'jest-matchmedia-mock';

let matchMedia;

beforeAll(() => {
    matchMedia = new MatchMediaMock();
});

afterEach(() => {
    matchMedia.clear();
});

it('is defined', () => {
    expect(window).toBeDefined();
    expect(window.matchMedia).toBeDefined();
});
