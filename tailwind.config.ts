import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				primary: ['Montserrat', ...fontFamily.sans], // Custom class `text-primary`
			}
		},
	},

	plugins: []
} satisfies Config;
