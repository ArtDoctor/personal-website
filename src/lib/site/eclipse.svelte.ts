/** How far the hero's disc has grown over the home page. Hero writes it, the top bar reads it. */
export const eclipse = $state({
	/** How much of the hero has scrolled past, 0 → 1. */
	progress: 0,
	/** Whether the strip under the top bar is entirely in shadow. */
	overhead: false
});
