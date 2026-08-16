// One requestAnimationFrame loop shared by every 3D icon on the page.
//
// Each icon used to drive its own loop, which kept rendering forever — offscreen,
// and with the tab in the background. The loop below only runs while at least one
// frame is registered and the tab is visible, and stops itself otherwise.

export type Frame = (delta: number) => void;

const frames = new Set<Frame>();
let raf = 0;
let previous = 0;

const tick = (time: number) => {
	raf = requestAnimationFrame(tick);
	const delta = previous ? time - previous : 16;
	previous = time;
	for (const frame of frames) frame(delta);
};

const sync = () => {
	const shouldRun = frames.size > 0 && !document.hidden;
	if (shouldRun && !raf) {
		previous = 0;
		raf = requestAnimationFrame(tick);
	} else if (!shouldRun && raf) {
		cancelAnimationFrame(raf);
		raf = 0;
	}
};

if (typeof document !== 'undefined') {
	document.addEventListener('visibilitychange', sync);
}

/** Registers a per-frame callback. Returns an unregister function. */
export const addFrame = (frame: Frame): (() => void) => {
	frames.add(frame);
	sync();
	return () => {
		frames.delete(frame);
		sync();
	};
};
