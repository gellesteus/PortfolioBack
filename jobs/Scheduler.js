let jobs = [];
const schedule = (job, period, execNow = false) => {
	if (execNow) {
		jobs.push({ dispatch: job, period, ticks: 1000 });
	} else {
		jobs.push({ dispatch: job, period, ticks: 0 });
	}
};

const tick = () => {
	for (let job in jobs) {
		jobs[job].ticks++;
		if (jobs[job].ticks > jobs[job].period) {
			jobs[job].period = 0;
			jobs[job].dispatch();
		}
	}
};

const start = callback => {
	setInterval(tick, 60 * 1000);
	callback();
	tick();
};
export default { schedule, start };
