/** Object balls, in rack order. Shared by the table and the legend next to it. */
export const BALLS = [
	{ color: '#ffd12e', stripe: false },
	{ color: '#2440e8', stripe: false },
	{ color: '#ff5a36', stripe: false },
	{ color: '#7b3fe4', stripe: false },
	{ color: '#ff8a1f', stripe: false },
	{ color: '#ff7ab8', stripe: false },
	{ color: '#8f1d2c', stripe: false },
	{ color: '#111114', stripe: false },
	{ color: '#ffd12e', stripe: true },
	{ color: '#2440e8', stripe: true },
	{ color: '#ff5a36', stripe: true }
];

/** CSS background for a small ball icon. */
export function ballBackground(index: number): string {
	const ball = BALLS[index % BALLS.length];
	return ball.stripe
		? `linear-gradient(#fbfaf5 24%, ${ball.color} 24% 76%, #fbfaf5 76%)`
		: ball.color;
}
