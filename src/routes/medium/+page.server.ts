import type { PageServerLoad } from './$types';

const MEDIUM_BLOG_URL = 'https://medium.shelamanov.com/';
const MEDIUM_FEED_URL = 'https://medium.shelamanov.com/feed';

export type MediumArticle = {
	title: string;
	link: string;
	date: string;
	datetime: string;
	excerpt: string;
	image: string | null;
	tags: string[];
};

const fallbackArticles: MediumArticle[] = [
	{
		title: 'AI Agents in Production: What Actually Works (Based on 300+ Deployments)',
		link: 'https://pub.towardsai.net/ai-agents-in-production-what-actually-works-based-on-300-deployments-cb9036e2d82f',
		date: 'Dec 28, 2025',
		datetime: '2025-12-28T18:02:27.000Z',
		excerpt:
			'Practical takeaways from real-world AI agent deployments: reliability, constrained workflows, evaluation, and what teams actually ship.',
		image: 'https://cdn-images-1.medium.com/max/1024/0*pb27c6ovioD6RC8S',
		tags: ['ai', 'data-science', 'llm']
	},
	{
		title: 'Fine-Tuning vs Distillation vs Transfer Learning: What’s The Difference?',
		link: 'https://pub.towardsai.net/fine-tuning-vs-distillation-vs-transfer-learning-whats-the-difference-9294ea617ff0',
		date: 'Feb 20, 2025',
		datetime: '2025-02-20T18:01:52.000Z',
		excerpt:
			'What are the main ideas behind fine-tuning, distillation, and transfer learning? A simple explanation with focus on LLMs.',
		image: 'https://cdn-images-1.medium.com/max/2600/1*7xzNmKLEBASx1s8QyhfaVg.png',
		tags: ['machine-learning', 'llm', 'ai']
	},
	{
		title: 'I Switched From Windows To Linux For 1 Month — Here Is What Happened',
		link: 'https://pub.towardsai.net/i-switched-from-windows-to-linux-for-1-month-here-is-what-happened-8c920be92d27',
		date: 'Jan 27, 2025',
		datetime: '2025-01-27T20:02:05.000Z',
		excerpt:
			'My PC broke, and while it was on repairs, I had to use my laptop with nothing but Linux on it. Here are the main conclusions.',
		image: 'https://cdn-images-1.medium.com/max/2600/0*lz3nMP1DsB4zgllo',
		tags: ['linux', 'windows', 'productivity']
	}
];

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	setHeaders({
		'cache-control': 'max-age=0, s-maxage=3600'
	});

	try {
		const response = await fetch(MEDIUM_FEED_URL);

		if (!response.ok) {
			throw new Error(`Medium feed responded with ${response.status}`);
		}

		const feed = await response.text();
		const articles = parseMediumFeed(feed).slice(0, 3);

		return {
			mediumBlogUrl: MEDIUM_BLOG_URL,
			mediumArticles: articles.length ? articles : fallbackArticles
		};
	} catch {
		return {
			mediumBlogUrl: MEDIUM_BLOG_URL,
			mediumArticles: fallbackArticles
		};
	}
};

function parseMediumFeed(feed: string): MediumArticle[] {
	return [...feed.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
		const title = getTag(item, 'title');
		const link = removeTrackingParams(getTag(item, 'link'));
		const published = getTag(item, 'pubDate');
		const content = getTag(item, 'description') || getTag(item, 'content:encoded');
		const date = new Date(published);
		const categories = [...item.matchAll(/<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g)]
			.map(([, category]) => decodeEntities(category.trim()))
			.slice(0, 3);

		return {
			title,
			link,
			date: Number.isNaN(date.getTime())
				? published
				: new Intl.DateTimeFormat('en', {
						month: 'short',
						day: 'numeric',
						year: 'numeric'
					}).format(date),
			datetime: Number.isNaN(date.getTime()) ? '' : date.toISOString(),
			excerpt: getExcerpt(content),
			image: getImage(content),
			tags: categories
		};
	});
}

function getTag(item: string, tagName: string): string {
	const match = item.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`));
	return match ? decodeEntities(stripCdata(match[1]).trim()) : '';
}

function stripCdata(value: string): string {
	return value.replace(/^<!\[CDATA\[/, '').replace(/\]\]>$/, '');
}

function getExcerpt(html: string): string {
	const snippet = html.match(/<p class="medium-feed-snippet">([\s\S]*?)<\/p>/)?.[1];
	const firstParagraph = snippet ?? html.match(/<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? html;
	const text = decodeEntities(
		firstParagraph
			.replace(/<[^>]+>/g, ' ')
			.replace(/\s+/g, ' ')
			.trim()
	);

	return text.length > 170 ? `${text.slice(0, 167).trim()}…` : text;
}

function getImage(html: string): string | null {
	const image = html.match(/<img[^>]+src="([^"]+)"/)?.[1];
	return image ? decodeEntities(image) : null;
}

function removeTrackingParams(url: string): string {
	return url.replace(/\?source=.*$/, '');
}

function decodeEntities(value: string): string {
	return value
		.replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
		.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.replace(/&nbsp;/g, ' ');
}
