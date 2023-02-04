import { toMillis, ucfirst, lcfirst, hasProp } from '@/utils';

const realTimers = {
  'Date.now': Date.now.bind(Date),
  'performance.now': performance.now.bind(performance),
  setTimeout,
  setInterval,
  requestAnimationFrame: global.requestAnimationFrame,
};

const timerAliases = {
  now: 'Date.now',
  DateNow: 'Date.now',
  dateNow: 'Date.now',
  perfNow: 'performance.now',
  performanceNow: 'performance.now',
  raf: 'requestAnimationFrame',
};

Object.entries(timerAliases).forEach(([alias, name]) => {
  realTimers[alias] = realTimers[name];
});

function rn(name) {
  return timerAliases[name] || name;
}

function realTimer(name) {
  return global.realTimers[name];
}

Object.defineProperties(global, {
  realTimers: { value: realTimers },
  realTimer: { value: realTimer },
});

const START_TIME = 1000000;

class MockTimers {
  #msStart = START_TIME; // start
  #msNow = START_TIME;  // now
  #msPerTick = 1000;     // perTick | timePerTick
  #msToElapse = 1000;    // toElapse | timeToElapse
  maxRecursion = 20;
  timerNames = ['Date.now', 'performance.now', 'setTimeout', 'setInterval', 'requestAnimationFrame'];
  #recursionDepth = {
    setTimeout: 0,
    setInterval: 0,
    requestAnimationFrame: 0,
  };

  debug() {
    return {
      msStart: this.msStart,
      msEnd: this.msEnd,
      msNow: this.msNow,
      msPerTick: this.msPerTick,
      msToElapse: this.msToElapse,
      tickCount: this.tickCount,
    };
  }

  reset() {
    this.msStart = START_TIME;
    this.msNow = START_TIME;
    this.msPerTick = 1000;
    this.msToElapse = 1000;
    this.maxRecursion = 20;
    this.#recursionDepth = {
      setTimeout: 0,
      setInterval: 0,
      requestAnimationFrame: 0,
    };
    return this;
  }

  get msStart() { return this.#msStart; }
  set msStart(ms) { this.#msStart = toMillis(ms); }

  get msNow() { return this.#msNow; }
  set msNow(ms) { this.#msNow = toMillis(ms); }

  get msToElapse() { return this.#msToElapse; }
  set msToElapse(ms) { this.#msToElapse = toMillis(ms); }

  get msPerTick() { return this.#msPerTick; }
  set msPerTick(ms) { this.#msPerTick = toMillis(ms); }

  get msEnd() { return this.msStart + this.msToElapse; }

  get tickCount() {
    return this.calcTickCount(this.msToElapse, this.msPerTick);
  }

  set(props) {
    const finder = key => [
      key,
      'ms' + ucfirst(key),
      key.replace(/^time/, 'ms'),
    ].find(k => hasProp(this, k))
    Object.entries(props).map(([k, v]) => [finder(k), v]).filter(([k]) => k).forEach(([key, val]) => {
      this[key] = val;
    });
    return this;
  }

  elapseTimeBy(ms) {
    this.msNow += toMillis(ms);
  }

  setTimeToElapse(ms) {
    this.msToElapse = toMillis(ms);
    return this;
  }

  setTimePerTick(ms) {
    this.msPerTick = toMillis(ms);
    return this;
  }

  calcTickCount(msToElapse, msPerTick) {
    return Math.floor(
      (msToElapse ?? this.msToElapse) /
      (msPerTick ?? this.msPerTick)
    );
  }

  calcTimePerTick(tickCount, msToElapse) {
    return Math.floor(
      (msToElapse ?? this.msToElapse) /
      tickCount
    );
  }

  calcTimeToElapse(tickCount, msPerTick) {
    return tickCount * (msPerTick ?? this.msPerTick);
  }

  now(ms) {
    if (arguments.length === 1) {
      this.msNow = ms;
      return this;
    }
    return this.dateNow()
  }

  dateNow() { return Math.floor(this.#msNow); }

  performanceNow() { return this.#msNow; }

  setTimeout(fn, delay) {
    return setTimeout(fn, delay);

    /* @TODO
    this.elapseTimeBy(this.msPerTick);

    if (this.#msNow - this.msStart >= delay) {
      if (this.#hasReachedRecursionMax('setTimeout')) {
        return;
      }

      ++this.#recursionDepth.setTimeout;
      fn();
      --this.#recursionDepth.setTimeout;
    }
    */
  }

  setInterval(fn, delay) {
    return setInterval(fn, delay);

    /* @TODO
    this.elapseTimeBy(this.msPerTick);

    // this.#msNow - this.#lastTick ???
    const elapsedTime = this.#msNow - this.msStart;
    const tickCount = this.calcTickCount(elapsedTime, delay);

    for (let i = 0; i < tickCount; ++i) {
      if (this.#hasReachedRecursionMax('setInterval')) {
        return;
      }

      ++this.#recursionDepth.setInterval;
      fn();
      --this.#recursionDepth.setInterval;
    }
    */
  }

  requestAnimationFrame(fn) {
    lll('requestAnimationFrame()');

    lll('msNow (pre)  = ' + this.msNow);
    this.elapseTimeBy(this.msPerTick);
    lll('msNow (post) = ' + this.msNow);
    lll('msEnd        = ' + this.msEnd);
    lll('Date.now()   = ' + Date.now());

    if (this.#hasReachedRecursionMax('requestAnimationFrame')) {
      return;
    }

    if (this.#msNow <= this.msEnd) {
      ++this.#recursionDepth.requestAnimationFrame;
      lll('fn(): depth: ' +  this.#recursionDepth.requestAnimationFrame);
      fn();
      --this.#recursionDepth.requestAnimationFrame;
    }
  }

  #hasReachedRecursionMax(name) {
    if (this.#recursionDepth[name] >= this.maxRecursion) {
      console.log('ABORTED: Reached max requestAnimationFrame recursion depth: ' + this.maxRecursion);
      return true;
    }
    return false;
  }

  restore(timers) {
    timers = Array.isArray(timers) ? timers : [timers];
    timers.forEach(name => {
      name = timerAliases[name] || name;
      global[name] = realTimers[name];
    });
  }

  mock(timerName) {
    const name = timerAliases[timerName] || timerName;
    if (!realTimers[name]) return;
    if ('Date.now' === name) {
      Date.now = this.dateNow.bind(this);
    } else if ('performance.now' === name) {
      global.performance.now = this.performanceNow.bind(this);
    } else {
      global[name] = this[name].bind(this);
    }
  }

  useMock(only) {
    if (only) {
      only = (Array.isArray(only) ? only : [only])
        .map(n => timerAliases[n] || n);
    } else {
      only = this.timerNames;
    }
    this.timerNames.forEach(timer => {
      if (only.includes(timer)) {
        this.mock(timer);
      } else {
        this.restore(timer);
      }
    });

    return this;
  }

  useReal() {
    Date.now = realTimers['Date.now'];
    performance.now = realTimers['performance.now'];
    global.setTimeout = realTimers.setTimeout;
    global.setInterval = realTimers.setInterval;
    global.requestAnimationFrame = realTimers.requestAnimationFrame;
    return this;
  }

  useFake(options) {
    return this.useMock(options);
  }
}

export default new MockTimers();
