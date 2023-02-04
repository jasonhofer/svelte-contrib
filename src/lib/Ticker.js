
let runningTickers = [];
let peakRunningCount = 0;
let totalCreated = 0;

export default class Ticker {
  #callback;
  #getNow;
  #lastTick = 0;
  #currentTick = 0;
  #tickCount = 0;
  #elapsedTime = 0;
  #delta = 0;
  #delay = 0;
  #isRunning = false;
  #doTick = null;
  #endTick = null;
  #onStart;
  #onStop;
  
  static create(callback = null, options = {}) {
    return new this(callback, options);
  }

  static stopAll() {
    [...runningTickers]
      .forEach(t => t.stop());
  }

  static get runningCount() {
    return runningTickers.length;
  }

  static get peakRunningCount() {
    return peakRunningCount;
  }

  static get totalCreated() {
    return totalCreated;
  }

  constructor(callback = null, options = {}) {
    if (callback && 'object' === typeof callback) {
      [callback, options] = [null, callback];
    }

    this.#callback = callback;
    this.#onStart = options.onStart;
    this.#onStop = options.onStop;

    this.usePerformanceNow(Boolean(
      options.usePerformanceNow
    ));
    this.useTimeout(Boolean(
      options.useTimeout
    ));

    ++totalCreated;
  }
  
  get isReady() { return Boolean(this.#callback); }
  get isRunning() { return this.#isRunning; }
  get currentTick() { return this.#currentTick; }
  get lastTick() { return this.#lastTick; }
  get tickCount() { return this.#tickCount; }
  get elapsedTime() { return this.#elapsedTime; }
  get delta() { return this.#delta; }
  get delay() { return this.#delay; }

  setDelay(delay) {
    this.#delay = toMillis(delay);
    return this;
  }

  now() {
    return this.#getNow();
  }

  #tick() {
    const now = this.#getNow();
    const delta = now - this.#lastTick;
    if (delta >= this.#delay) {
      this.#currentTick = now;
      this.#delta = delta;
      this.#callback(delta, now);
      this.#lastTick = now;
      this.#elapsedTime += delta;
      ++this.#tickCount;
    }
    if (this.#isRunning) {
      this.#doTick(() => this.#tick());
    } else {
      this.#endTick && this.#endTick();
      this.#onStop && this.#onStop();
    }
  }
  
  start(callback = null) {
    this.#callback = callback || this.#callback;
    if (!this.#isRunning) {
      this.#isRunning = true;
      this.#onStart && this.#onStart();
      this.#lastTick = this.#getNow();
      this.#doTick(() => this.#tick());
      runningTickers.push(this);
      peakRunningCount = Math.max(
        peakRunningCount,
        runningTickers.length
      );
    }
    return this;
  }
  
  stop() {
    this.#isRunning = false;
    const idx = runningTickers
      .indexOf(this);
    if (idx >= 0) {
      runningTickers.splice(idx, 1);
    }
    return this;
  }
  
  usePerformanceNow(enable = true) {
    this.#getNow = enable ? (() => performance.now()) : (() => Date.now());
    return this;
  }
  
  useDateNow(enable = true) {
    return this.usePerformanceNow(!enable);
  }
  
  useTimeout(enable = true) {
    if (enable) {
      let timeout = null;
      this.#doTick = tick => timeout = setTimeout(tick, 1);
      this.#endTick = () => clearTimeout(timeout);
    } else {
      this.#doTick = tick => requestAnimationFrame(tick);
      this.#endTick = null;
    }
    return this;
  }
  
  useRequestAnimationFrame(enable = true) {
    return this.useTimeout(!enable);
  }
}
