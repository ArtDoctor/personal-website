import type { RequestHandler } from './$types';
import { siteUrl } from '$lib/content';

export const prerender = true;

// Pages worth indexing. Redirect-only routes (/about, /projects) stay out.
const PATHS = [
	'/',
	'/portfolio',
	'/portfolio/kolo',
	'/portfolio/solar',
	'/medium',
	'/hobbies',
	'/contact'
];

export const GET: RequestHandler = () => {
	const urls = PATHS.map((path) => `\t<url><loc>${siteUrl}${path}</loc></url>`).join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(body, {
		headers: { 'content-type': 'application/xml' }
	});
};
