<script lang="ts">
	import { browser } from '$app/environment';

	type Point = {
		x: number;
		y: number;
	};

	const storageKey = 'theme-preference';

	const b11Start = { x: 1.6948, y: -62.9386 };
	const b12Start = { x: -34.95854, y: -98.84125 };
	const b13Start = { x: -76.88828, y: -113.92809 };

	const b21Start = { x: 265.90016, y: 144.06089 };
	const b22Start = { x: 265.90016, y: 144.06089 };
	const b23Start = { x: 265.90016, y: 144.06089 };

	const r1Start = { x: 0, y: 0 };
	const r2Start = { x: 0, y: 0 };
	const r3Start = { x: 0, y: 0 };
	const r4Start = { x: 0, y: 0 };
	const r5Start = { x: 0, y: 0 };
	const r6Start = { x: 0, y: 0 };
	const r7Start = { x: 0, y: 0 };
	const r8Start = { x: 0, y: 0 };

	let { width, height } = $props<{ width: string; height: string }>();

	let currentState = $state('sun');

	let b11 = $state({ x: 1.6948, y: -62.9386 });
	let b12 = $state({ x: -34.95854, y: -98.84125 });
	let b13 = $state({ x: -76.88828, y: -113.92809 });

	let b21 = $state({ x: 265.90016, y: 144.06089 });
	let b22 = $state({ x: 265.90016, y: 144.06089 });
	let b23 = $state({ x: 265.90016, y: 144.06089 });

	let r1 = $state({ x: 0, y: 0 });
	let r2 = $state({ x: 0, y: 0 });
	let r3 = $state({ x: 0, y: 0 });
	let r4 = $state({ x: 0, y: 0 });
	let r5 = $state({ x: 0, y: 0 });
	let r6 = $state({ x: 0, y: 0 });
	let r7 = $state({ x: 0, y: 0 });
	let r8 = $state({ x: 0, y: 0 });

	const animatePoint = (p1: Point, p2: Point, duration = 200) => {
		const end = duration / 30;
		const d = {
			x: (p2.x - p1.x) / end,
			y: (p2.y - p1.y) / end
		};
		let n = 0;
		const i: Timer = setInterval(() => {
			if (n >= Math.floor(end)) {
				p1.x = p2.x;
				p1.y = p2.y;
				return clearInterval(i);
			}
			n++;
			p1.x += d.x;
			p1.y += d.y;
		}, 30);
	};

	const trigger = (duration = 200) => {
		if (currentState === 'sun') {
			animatePoint(b11, { x: 0, y: 0 }, duration);
			animatePoint(b12, { x: 0, y: 0 }, duration);
			animatePoint(b13, { x: 0, y: 0 }, duration);

			animatePoint(b21, { x: 249.88724, y: 424.97945 }, duration);
			animatePoint(b22, { x: 113.87945, y: 177.27148 }, duration);
			animatePoint(b23, { x: 290.85586, y: 149.58168 }), duration;

			animatePoint(r1, { x: 0, y: -34 }, duration);
			animatePoint(r2, { x: 41, y: -41 }, duration);
			animatePoint(r3, { x: 34, y: 0 }, duration);
			animatePoint(r4, { x: 41, y: 41 }, duration);
			animatePoint(r5, { x: 0, y: 34 }, duration);
			animatePoint(r6, { x: -41, y: 41 }, duration);
			animatePoint(r7, { x: -34, y: 0 }, duration);
			animatePoint(r8, { x: -41, y: -41 }, duration);
			currentState = 'moon';
			document.documentElement.setAttribute('data-theme', 'dark');
			localStorage.setItem(storageKey, 'dark');
		} else {
			animatePoint(b11, b11Start);
			animatePoint(b12, b12Start);
			animatePoint(b13, b13Start);

			animatePoint(b21, b21Start);
			animatePoint(b22, b22Start);
			animatePoint(b23, b23Start);

			animatePoint(r1, r1Start);
			animatePoint(r2, r2Start);
			animatePoint(r3, r3Start);
			animatePoint(r4, r4Start);
			animatePoint(r5, r5Start);
			animatePoint(r6, r6Start);
			animatePoint(r7, r7Start);
			animatePoint(r8, r8Start);
			currentState = 'sun';
			document.documentElement.setAttribute('data-theme', 'light');
			localStorage.setItem(storageKey, 'light');
		}
	};

	if (browser) {
		let s = 'light';
		let storageVal = localStorage.getItem(storageKey);
		if (storageVal) s = storageVal;
		else s = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
		if (s === 'dark') trigger(0);
	}
</script>

<button
	on:click={() => trigger()}
	class={currentState === 'sun' ? 'sun' : 'moon'}
	type="button"
	role="switch"
	title={`Switch to ${currentState === 'sun' ? 'dark' : 'light'} theme`}
	aria-checked={currentState === 'sun' ? false : true}
>
	<svg
		{width}
		{height}
		viewBox="0 0 135.46666 135.46667"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path
			id="path8968"
			style="opacity:1;fill:currentColor;fill-opacity:1;stroke-width:45.5909;stroke-linecap:round;stroke-linejoin:round"
			d={`
       m 256,144 
       c 
       -61.8559,-1e-5 
       -112.00001,50.1441 
       -112,112 
       -1e-5,61.8559 
       50.1441,112.00001 
       112,112 
       59.33151,10e-6 
       107.87973,-46.13705 
       111.74414,-104.49023 
       ${b11.x},${b11.y} 
       ${b12.x},${b12.y} 
       ${b13.x},${b13.y} 
       C
       ${b21.x},${b21.y} 
       ${b22.x},${b22.y} 
       ${b23.x},${b23.y} 
       281.8496,146.036 
       265.90016,144.06089 
       256,144 
       Z`}
			transform="scale(0.26458333)"
		/>
		<path
			transform={`translate(${r1.x},${r1.y})`}
			style="fill:none;stroke:currentColor;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
			d="M 67.733332,29.633333 V 8.2385201"
			id="path9613"
		/>
		<path
			transform={`translate(${r2.x},${r2.y})`}
			style="fill:none;stroke:currentColor;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
			d="M 110.06667,25.4 97.366665,38.1"
			id="path9623"
		/>
		<path
			transform={`translate(${r3.x},${r3.y})`}
			style="fill:none;stroke:currentColor;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
			d="M 105.83333,67.733332 H 127"
			id="path9625"
		/>
		<path
			transform={`translate(${r4.x},${r4.y})`}
			style="fill:none;stroke:currentColor;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
			d="M 110.06667,110.06667 97.366665,97.366665"
			id="path9627"
		/>
		<path
			transform={`translate(${r5.x},${r5.y})`}
			style="fill:none;stroke:currentColor;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
			d="m 67.733332,105.83333 v 21.13121"
			id="path9615"
		/>
		<path
			transform={`translate(${r6.x},${r6.y})`}
			style="fill:none;stroke:currentColor;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
			d="M 38.1,97.366665 25.4,110.06667"
			id="path9617"
		/>
		<path
			transform={`translate(${r7.x},${r7.y})`}
			style="fill:none;stroke:currentColor;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
			d="M 29.633333,67.733332 H 8.4666666"
			id="path9619"
		/>
		<path
			transform={`translate(${r8.x},${r8.y})`}
			style="fill:none;stroke:currentColor;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
			d="M 25.4,25.4 38.1,38.1"
			id="path9621"
		/>
	</svg>
</button>

<style lang="scss">
	button {
		// padding: 0.25rem;
		border: none;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background-color: transparent;
		color: var(--text);
		// border: 1px solid var(--text);
		&.sun {
			color: #ffa013;
		}
		// &.moon {
		// 	color: #95cae2;
		// }
		&:hover {
			cursor: pointer;
			// color: var(--primary);
		}
	}
</style>
