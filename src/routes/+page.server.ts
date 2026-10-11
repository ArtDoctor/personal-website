import type { PageServerLoad } from './$types';
import { loadMediumArticles } from '$lib/server/medium';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({
		'cache-control': 'max-age=0, s-maxage=3600'
	});

	return {
		mediumArticles: await loadMediumArticles(fetch)
	};
};
