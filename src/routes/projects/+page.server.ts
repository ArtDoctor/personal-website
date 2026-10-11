import { redirect } from '@sveltejs/kit';

// The old Projects page moved to /portfolio.
export function load() {
	redirect(301, '/portfolio');
}
