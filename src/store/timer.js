import Timer from '@/lib/Timer';

export default function timer(time) {
  return Timer.newTimer(time);
}

Object.defineProperty(timer, 'countdown', {
  value: time => Timer.newCountdownTimer(time),
});
