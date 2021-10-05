import 'jest-localstorage-mock';

beforeEach(() => {
    // to fully reset the state between tests, clear the storage
    localStorage.clear();
    // and reset all mocks
    jest.clearAllMocks();

    // clearAllMocks will impact your other mocks too, so you can optionally reset individual mocks instead:
    //localStorage.setItem.mockClear();
});

it('is defined', () => {
    expect(window).toBeDefined();
    expect(window.localStorage).toBeDefined();
    expect(window.sessionStorage).toBeDefined();
});
