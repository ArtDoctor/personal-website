<script lang="ts">
	import data from '$lib/data/kolo.json';
	import { HOT, MONO, clamp, ink, smooth, stage, type Frame } from './stage';

	type Props = {
		active?: boolean;
		/** Let the pointer turn the cloud. Off where the plate is a link. */
		interactive?: boolean;
	};

	let { active = true, interactive = false }: Props = $props();

	/*
	 * The real map from the Kolo repo: every track of the library at its 3D UMAP position,
	 * computed from 512-dimensional audio embeddings and scaled to fit a unit sphere.
	 * One cluster at a time is lit, with its name, so the six never rely on colour alone.
	 */
	const points = data.umap;
	const count = points.length / 3;
	const HOLD = 3.4;

	const CUBE = [-1, 1].flatMap((x) => [-1, 1].flatMap((y) => [-1, 1].map((z) => [x, y, z])));
	const EDGES = CUBE.flatMap((a, i) =>
		CUBE.map((b, j) => [i, j, a.filter((value, axis) => value !== b[axis]).length] as const)
			.filter(([from, to, differ]) => from < to && differ === 1)
			.map(([from, to]) => [from, to] as const)
	);

	const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

	function draw({ ctx, width, height, time, dt }: Frame) {
		pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4);
		pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4);

		const yaw = time * 0.16 + pointer.x * 1.4;
		const pitch = 0.32 + pointer.y * 0.7;
		const [cy, sy, cp, sp] = [Math.cos(yaw), Math.sin(yaw), Math.cos(pitch), Math.sin(pitch)];
		const radius = Math.min(width * 0.42, height * 0.64);
		const cx = width / 2;
		const cyScreen = height * 0.5;

		const project = (x: number, y: number, z: number) => {
			const rx = x * cy - z * sy;
			const rz = x * sy + z * cy;
			const ry = y * cp - rz * sp;
			const depth = y * sp + rz * cp;
			const scale = 2.6 / (2.6 + depth);
			return [cx + rx * radius * scale, cyScreen + ry * radius * scale, depth, scale] as const;
		};

		// The box the cloud sits in.
		ctx.lineWidth = 1;
		ctx.strokeStyle = ink(0.1);
		ctx.beginPath();
		const corners = CUBE.map(([x, y, z]) => project(x * 0.6, y * 0.6, z * 0.6));
		for (const [from, to] of EDGES) {
			ctx.moveTo(corners[from][0], corners[from][1]);
			ctx.lineTo(corners[to][0], corners[to][1]);
		}
		ctx.stroke();

		const turn = time / HOLD;
		const lit = Math.floor(turn) % data.clusters.length;
		const fade = smooth(0, 0.14, turn % 1) * (1 - smooth(0.88, 1, turn % 1));
		const dot = Math.max(1.1, radius / 190);

		for (let pass = 0; pass < 2; pass++) {
			for (let i = 0; i < count; i++) {
				const isLit = Number(data.cluster[i]) === lit;
				if (isLit !== (pass === 1)) continue;
				const [x, y, depth, scale] = project(
					points[i * 3] / 999,
					points[i * 3 + 1] / 999,
					points[i * 3 + 2] / 999
				);
				const near = clamp(0.62 - depth * 0.45, 0.16, 1);
				const size = dot * scale * (isLit ? 1 + fade * 0.7 : 1);
				if (isLit && fade > 0) {
					ctx.globalAlpha = clamp(near + 0.25) * fade;
					ctx.fillStyle = HOT;
					ctx.fillRect(x - size * 0.7, y - size * 0.7, size * 1.4, size * 1.4);
					ctx.globalAlpha = near * (1 - fade) * 0.7;
				} else {
					ctx.globalAlpha = near * 0.7;
				}
				ctx.fillStyle = ink();
				ctx.fillRect(x - size / 2, y - size / 2, size, size);
			}
		}
		ctx.globalAlpha = 1;

		// What is lit, in words.
		const small = width < 520;
		const pad = small ? 12 : 20;
		const cluster = data.clusters[lit];
		ctx.font = `${small ? 9 : 11}px ${MONO}`;
		ctx.textBaseline = 'alphabetic';
		ctx.fillStyle = ink(0.45);
		ctx.textAlign = 'left';
		ctx.fillText(`${count.toLocaleString('en-US')} tracks · 3D UMAP`, pad, pad + 8);
		ctx.textAlign = 'right';
		ctx.fillText(`${lit + 1} / ${data.clusters.length}`, width - pad, pad + 8);

		ctx.globalAlpha = fade;
		ctx.textAlign = 'left';
		ctx.fillStyle = HOT;
		ctx.fillRect(pad, height - pad - 8, 7, 7);
		ctx.fillStyle = ink();
		ctx.fillText(cluster.name, pad + 14, height - pad - 1);
		if (!small) {
			ctx.textAlign = 'right';
			ctx.fillStyle = ink(0.45);
			ctx.fillText(`${cluster.tracks} tracks`, width - pad, height - pad - 1);
		}
		ctx.globalAlpha = 1;
	}

	function move(event: PointerEvent) {
		if (!interactive) return;
		const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
		pointer.tx = (event.clientX - box.left) / box.width - 0.5;
		pointer.ty = (event.clientY - box.top) / box.height - 0.5;
	}

	function release(event: PointerEvent) {
		// A mouse letting go of its button is still hovering; a finger lifting is gone.
		if (event.type === 'pointerup' && event.pointerType === 'mouse') return;
		pointer.tx = pointer.ty = 0;
	}
</script>

<!-- A sideways drag turns it on touch screens; up and down still scrolls the page. -->
<canvas
	class="visual"
	class:interactive
	use:stage={{ draw, active, still: 1.2 }}
	onpointermove={move}
	onpointerleave={release}
	onpointerup={release}
	onpointercancel={release}
	aria-hidden="true"
></canvas>

<style>
	.interactive {
		touch-action: pan-y;
	}
</style>
