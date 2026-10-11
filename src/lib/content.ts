export const person = {
	name: 'Artem Shelamanov',
	firstName: 'Artem',
	email: 'artdoctorka@gmail.com',
	city: 'Prague',
	from: 'Dnipro, Ukraine',
	tagline: 'Physics · data · building things',
	intro:
		'I study physics, write code, and like making weird ideas actually work. Sometimes that means ML models, sometimes simulations, sometimes just a lot of debugging.',
	artemisUrl: 'https://www.nasa.gov/humans-in-space/artemis/'
};

export const links = {
	github: 'https://github.com/ArtDoctor',
	linkedin: 'https://www.linkedin.com/in/shelamanov/',
	medium: 'https://medium.shelamanov.com/',
	linktree: 'https://linktr.ee/ash_dot_py',
	itch: 'https://doctorsoot.itch.io/'
};

export const about = [
	"I'm Artem. I'm into computational physics, data science, startups, and the kind of problems that look simple until you actually try to solve them.",
	'Most of what I enjoy sits somewhere between research and making things people can use: simulations, ML, small tools, rough prototypes, cleaner interfaces.',
	'Outside formal work, I like experimenting with small systems: FPV drones, physics simulations, ML models, soldering, and weird side projects that turn abstract rules into something visible or usable.',
	"I'm happiest when I'm exploring systems with hidden rules — whether that's a model, a drone build, a trail, or a good sci-fi world."
];

export const traits = [
	{ label: 'Mostly', value: 'AI & physics' },
	{ label: 'Working style', value: 'Curious, practical' },
	{ label: 'Default mood', value: "Let's try it" }
];

export type Project = {
	slug: string;
	title: string;
	description: string;
	stack: string;
	link: string;
	linkLabel: string;
	image?: string;
	/** Slug of this project's own page under /portfolio, if it has one. */
	page?: string;
};

/** The bigger things: each has a screenshot. */
export const projects: Project[] = [
	{
		slug: 'thomson',
		title: 'Thomson Parabolas',
		description:
			'My bachelor thesis: a tool for handling Thomson spectrometer images. It cleans detector shots, finds the ion parabolas, classifies species, and turns the result into energy spectra. What used to be hours of manual fitting per image now takes under a minute.',
		stack: 'U-Net · physics · computer vision',
		link: 'https://thomson-parabolas-unet.shelamanov.com/',
		linkLabel: 'Open the app',
		image: '/images/thomson-parabolas-unet.png'
	},
	{
		slug: 'kolo',
		title: 'Kolo',
		description:
			"I got tired of Spotify recommending music I don't actually like, so, like any sane ML engineer, I built my own. A local player that predicts how I'd rate a song from its audio embedding, plus a 3D map of my taste.",
		stack: 'Audio embeddings · scikit-learn · React · Tauri',
		link: 'https://github.com/ArtDoctor/Kolo-music',
		linkLabel: 'GitHub',
		page: 'kolo',
		image: '/images/projects/kolo-taste.webp'
	},
	{
		slug: 'solar',
		title: 'Solar Filaments',
		description:
			'A Kaggle competition: find every filament on full-disk images of the Sun and draw its exact outline. A detector proposes, a small U-Net draws, five models vote. Top 100 right now.',
		stack: 'YOLO · U-Net · instance segmentation',
		link: 'https://www.kaggle.com/competitions/filament-segmentation-2026',
		linkLabel: 'Kaggle',
		image: '/images/projects/solar-disk.webp',
		page: 'solar'
	},
	{
		slug: 'genetic-cars',
		title: 'Genetic Car Simulator',
		description:
			'A browser 3D playground where little cars slowly get better at driving over rough terrain through genes, mutation, crossover, and leaderboards.',
		stack: 'Python · TypeScript · evolution',
		link: 'https://genetic-simulator.shelamanov.com/',
		linkLabel: 'Evolve some cars',
		image: '/images/genetic-car-simulator.png'
	},
	{
		slug: 'yazero',
		title: 'Yazero',
		description:
			"A home for the startups I've worked on with my co-founder — small bets, experiments, and products we're trying to make real.",
		stack: 'Startups · LLM products · retrieval',
		link: 'https://www.yazero.io/',
		linkLabel: 'yazero.io',
		image: '/images/validator-by-yazero.webp'
	},
	{
		slug: 'lethal-yolo',
		title: 'Lethal YOLO',
		description:
			'An object detector for hoarding bugs in Lethal Company. Fine-tuned on only 42 images, and to be honest I was surprised it worked so well.',
		stack: 'YOLO11n · fine-tuning',
		link: 'https://github.com/ArtDoctor/lethal-yolo',
		linkLabel: 'GitHub',
		image: '/images/projects/lethal-yolo.webp'
	},
	{
		slug: 'santiwen',
		title: 'Santiwen',
		description:
			'A reader for getting through Chinese books one sentence at a time, with pinyin and a dictionary entry under every word.',
		stack: 'Svelte · Python · CC-CEDICT',
		link: 'https://github.com/ArtDoctor/santiwen',
		linkLabel: 'GitHub',
		image: '/images/projects/santiwen.webp'
	},
	{
		slug: 'solitaire',
		title: 'Solitaire',
		description:
			'Klondike, draw three, single pass. Vanilla TypeScript in a Tauri desktop shell, with actual tests.',
		stack: 'TypeScript · Tauri · Vitest',
		link: 'https://github.com/ArtDoctor/ash-solitaire',
		linkLabel: 'GitHub',
		image: '/images/projects/solitaire.webp'
	}
];

/** Smaller experiments, mostly from GitHub. Text only. */
export const experiments: Project[] = [
	{
		slug: 'sayso',
		title: 'Sayso',
		description:
			'An ultra-minimal desktop transcription app. The one I was using had no dark theme, so I made my own. About 180 seconds of audio per second of GPU time.',
		stack: 'Tauri · Rust · Python',
		link: 'https://github.com/ArtDoctor/sayso-transcribe',
		linkLabel: 'GitHub'
	},
	{
		slug: 'gosling',
		title: 'Gosling, blin',
		description:
			'Sends a Ryan Gosling GIF every time somebody says «блин» in a Telegram chat. There is also a 10% chance of pancakes.',
		stack: 'Python · Telethon',
		link: 'https://github.com/ArtDoctor/gosling-blin',
		linkLabel: 'GitHub'
	},
	{
		slug: 'tempus',
		title: 'TempusOS',
		description:
			'A minimal Android launcher: a big clock, app search, quick notes, and nothing else.',
		stack: 'Kotlin · Jetpack Compose',
		link: 'https://github.com/ArtDoctor/Tempus',
		linkLabel: 'GitHub'
	},
	{
		slug: 'vibeme',
		title: 'vibeme',
		description:
			'A first-person walk through a procedurally generated liminal atrium, in the browser.',
		stack: 'Three.js · TypeScript',
		link: 'https://github.com/ArtDoctor/vibeme',
		linkLabel: 'GitHub'
	},
	{
		slug: 'funcv',
		title: 'funcv',
		description:
			'Hand tracking through a webcam, wired to a spinning 3D structure you steer with both hands.',
		stack: 'MediaPipe · OpenCV',
		link: 'https://github.com/ArtDoctor/funcv',
		linkLabel: 'GitHub'
	},
	{
		slug: 'alpha-decay',
		title: 'Alpha decay',
		description:
			"Research on alpha decay: clarifying Gamow's theory by taking the Yukawa potential into account. It got an INOVA gold medal.",
		stack: 'Nuclear physics',
		link: 'https://inova-croatia.com/en/product-detail/gamows-theory-clarification-through-taking-into-account-yukawa-potential/',
		linkLabel: 'INOVA'
	},
	{
		slug: 'games',
		title: 'Games',
		description:
			'Before ML there were games: five freelance Unity and Godot projects with procedural generation, game AI and physics.',
		stack: 'Unity · C# · Godot',
		link: links.itch,
		linkLabel: 'itch.io'
	}
];

export type Result = {
	prefix: string;
	value: number;
	decimals: number;
	suffix: string;
	label: string;
	note: string;
};

/** A few things that worked, with the number that says so. */
export const results: Result[] = [
	{
		prefix: '',
		value: 99.6,
		decimals: 1,
		suffix: '%',
		label: 'test accuracy',
		note: 'A computer-vision system that finds defects in manufactured parts. It inspects parts at factories in several countries.'
	},
	{
		prefix: '~',
		value: 90,
		decimals: 0,
		suffix: '%',
		label: 'less manual review',
		note: 'A pipeline that spots rust and scratches on wind turbines in drone video, then places them on a 3D model.'
	},
	{
		prefix: '<',
		value: 1,
		decimals: 0,
		suffix: ' min',
		label: 'per image, down from hours',
		note: 'My thesis pipeline for Thomson spectrometer data, used on shots from the PALS laser facility.'
	},
	{
		prefix: '$',
		value: 10000,
		decimals: 0,
		suffix: '',
		label: 'first place, solo',
		note: 'The soonami.io hackathon. Built and deployed an AI product in four days.'
	},
	{
		prefix: '~',
		value: 5000,
		decimals: 0,
		suffix: '',
		label: 'followers on Medium',
		note: '20+ articles about AI, data science, Linux, and things I’m learning while building.'
	}
];

export const alsoTrue = [
	'Co-author of a laser-plasma paper, under peer review at Plasma Physics and Controlled Fusion.',
	'Gave 5+ talks on Python, ML and MLOps to students at Lviv University.',
	'Built a voice assistant that lives on a Raspberry Pi.'
];

export const hobbies = [
	'Drones · FPV & building',
	'Climbing',
	'Hiking',
	'Cycling',
	'Sci-fi & speculative fiction',
	'ML experiments & Kaggle',
	'Soldering',
	'Sandbox/co-op games',
	'Pool/snooker',
	'Meditation & NSDR',
	'Lockpicking'
];

export const photos = [
	{
		src: '/images/drone_flight.png',
		alt: 'FPV drone in flight',
		caption: 'FPV drones',
		width: 760,
		height: 507
	},
	{ src: '/images/bouldering.png', alt: 'Climbing', caption: 'Climbing', width: 396, height: 592 },
	{
		src: '/images/cycling.jpg',
		alt: 'Cycling outdoors',
		caption: 'Cycling',
		width: 960,
		height: 1280
	},
	{ src: '/images/hike.jpg', alt: 'Hiking outdoors', caption: 'Hiking', width: 639, height: 960 }
];

export const languages = [
	{ name: 'English', level: 'C2', progress: 6 },
	{ name: 'Ukrainian', level: 'C2', progress: 6 },
	{ name: 'Russian', level: 'C2', progress: 6 },
	{ name: 'German', level: 'B1', progress: 3 },
	{ name: 'Czech', level: 'A2', progress: 2 },
	{ name: 'Chinese', level: 'HSK2', progress: 2 }
];

export const languagesNote =
	'Useful for reading papers, moving countries, and occasionally ordering coffee correctly.';

export const stack = [
	{
		label: 'AI & data',
		items: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'OpenCV', 'ONNX', 'FastAPI']
	},
	{ label: 'Web', items: ['TypeScript', 'Svelte', 'React', 'Tailwind', 'Bun', 'Vite'] },
	{ label: 'Systems', items: ['C#', 'C++', 'Bash', 'Linux'] },
	{ label: 'Data', items: ['PostgreSQL', 'pgvector', 'SQLite', 'Redis', 'Supabase'] },
	{ label: 'Tools', items: ['Docker', 'Azure', 'Google Cloud', 'Git', 'Blender', 'Unity', 'Figma'] }
];

export const contact = {
	heading: 'Want to chat?',
	body: "If you're working on something interesting — research, AI, physics software, a prototype, or a slightly chaotic idea — feel free to reach out.",
	hint: "A few lines are enough. Tell me what you're doing and what you're looking for."
};

export function formatResult(result: Result, value = result.value): string {
	const number = value.toLocaleString('en-US', {
		minimumFractionDigits: result.decimals,
		maximumFractionDigits: result.decimals
	});
	return `${result.prefix}${number}${result.suffix}`;
}

/** Everything the Kolo page says, taken from the repo's own reports. */
export const kolo = {
	github: 'https://github.com/ArtDoctor/Kolo-music',
	pitch:
		"I got tired of Spotify recommending music I don't actually like, so, like any sane ML engineer, I decided to build my own Spotify — with some ML experiments and questionable amounts of tinkering along the way.",
	steps: [
		{
			title: 'Listen',
			text: 'Every track in my library goes through MuQ-MuLan, an audio model that turns it into a 512-dimensional vector. Songs that sound alike land close together.'
		},
		{
			title: 'Map',
			text: 'K-means splits those vectors into six clusters, and t-SNE and UMAP flatten them into a 3D map I can fly through inside the player. I named the clusters by hand.'
		},
		{
			title: 'Predict',
			text: 'A small ensemble (an RBF support-vector regressor plus Extra Trees) learns my star ratings from the vectors, then guesses how I would rate anything I have not heard yet.'
		}
	],
	numbers: [
		{ value: '2,065', label: 'tracks embedded' },
		{ value: '1,208', label: 'ratings it learned from' },
		{ value: '0.47', label: 'stars of average error' },
		{ value: '90%', label: 'of guesses within one star' }
	],
	clusters: [
		{ name: 'Drift Phonk & Bass House', tracks: 345 },
		{ name: 'British Garage Indie & Alt-Rock', tracks: 312 },
		{ name: 'Cinematic Ambient & Neoclassical OST', tracks: 255 },
		{ name: 'Dark Alt-Pop & Trap-Rock', tracks: 244 },
		{ name: 'Indie Dance & Synth-Rock', tracks: 205 },
		{ name: 'Atmospheric Indie & Dream Pop', tracks: 195 }
	],
	honest: [
		'The model is conservative and regresses toward the middle. Its worst miss: it predicted 3.4 stars for a track I gave half a star.',
		'On a discovery run it scored 30 new tracks and kept four at four stars or more, including Kiasmos and David August.'
	],
	player:
		'The player itself is React and Vite with an optional Tauri desktop shell: ratings in half stars, a queue, a loudness limiter, and imports from YouTube links or Spotify playlists.'
};

/** The solar filament competition. Update `standing` and `score` as the leaderboard moves. */
export const solar = {
	competition: 'Filament Segmentation 2026',
	kaggle: 'https://www.kaggle.com/competitions/filament-segmentation-2026',
	/** Add the repository link here once the competition allows sharing the code. */
	github: null as string | null,
	standing: 'Top 100',
	standingNote: 'on the public leaderboard, October 2026. The competition runs until 15 November.',
	score: 0.4,
	task: 'Given a 2048 × 2048 image of the Sun in H-alpha light, find every filament and draw its exact outline, one mask per filament.',
	why: 'Filaments are dense clouds of solar material held above the surface by magnetic fields. They sit at the core of solar eruptions, so finding them automatically matters for space-weather forecasting.',
	approach: [
		{
			title: 'Detect',
			text: 'A YOLO detector proposes a box around everything that might be a filament.'
		},
		{
			title: 'Draw',
			text: 'A small U-Net looks at each box at full resolution and draws the mask inside it.'
		},
		{
			title: 'Vote',
			text: 'Five detectors look at the same image and vote on which masks to keep.'
		}
	],
	failed:
		'What did not work: classic image processing. Thresholding the dark regions found 510 real filaments and 4,415 things that were not.',
	/** Public leaderboard score of each submission, in order. */
	history: [
		{ day: 'Oct 9', score: 0.35, note: 'First two-stage baseline' },
		{ day: 'Oct 9', score: 0.33, note: 'Stricter thresholds' },
		{ day: 'Oct 9', score: 0.34, note: 'Consensus with a Mask R-CNN' },
		{ day: 'Oct 9', score: 0.35, note: 'Three models, flip augmentation' },
		{ day: 'Oct 9', score: 0.35, note: 'One more variant of the baseline' },
		{ day: 'Oct 10', score: 0.37, note: 'Mask model trained on every annotator' },
		{ day: 'Oct 10', score: 0.37, note: 'Learned quality score' },
		{ day: 'Oct 10', score: 0.39, note: '77-feature scorer, merged fragments' },
		{ day: 'Oct 10', score: 0.39, note: 'New tile detector' },
		{ day: 'Oct 11', score: 0.39, note: 'Five-detector ensemble' },
		{ day: 'Oct 11', score: 0.38, note: 'Probe: keep more masks' },
		{ day: 'Oct 11', score: 0.39, note: 'Probe: keep fewer masks' },
		{ day: 'Oct 11', score: 0.4, note: 'Rank-averaged scores' }
	],
	credit: 'Image: GONG H-alpha, National Solar Observatory. Expert outlines: the MAGFiLO dataset.'
};
