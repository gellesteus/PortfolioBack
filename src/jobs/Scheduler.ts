import * as log from '../logging/logging';

interface IJobSched {
  period: number;
  ticks: number;
  dispatch(): void;
}

const jobs: IJobSched[] = [];

const schedule = (
  job: () => void,
  period: number,
  execNow: boolean = false
) => {
  log.info('Job scheduled');
  if (execNow) {
    jobs.push({ dispatch: job, period, ticks: 1000 });
  } else {
    jobs.push({ dispatch: job, period, ticks: 0 });
  }
};

const tick = () => {
  log.trace('Scheduler ticked');
  for (const job in jobs) {
    if (jobs[job]) {
      jobs[job].ticks++;
      if (jobs[job].ticks > jobs[job].period) {
        jobs[job].period = 0;
        jobs[job].dispatch();
        log.trace(`Job ${job} dispatched`);
      }
    }
  }
};

const start = (callback: () => void) => {
  log.debug('Scheduler starting');
  setInterval(tick, 60 * 1000);
  log.info('Scheduler started');
  callback();
  tick();
};
export default { schedule, start };
