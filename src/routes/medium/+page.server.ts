import type { PageServerLoad } from './$types';
import { MEDIUM_BLOG_URL, loadMediumArticles } from '$lib/server/medium';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({
		'cache-control': 'max-age=0, s-maxage=3600'
	});

	return {
		mediumBlogUrl: MEDIUM_BLOG_URL,
		mediumArticles: await loadMediumArticles(fetch)
	};
};
