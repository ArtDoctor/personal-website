import { redirect } from '@sveltejs/kit';

// The old About page is now a section of the home page.
export function load() {
	redirect(301, '/#about');
}
