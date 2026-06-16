import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				surface: {
					DEFAULT: '#0B0D14',
					raised: '#12141D',
					overlay: '#1A1D28',
				},
				accent: {
					DEFAULT: '#818CF8',
					light: '#A5B4FC',
					dark: '#6366F1',
					muted: 'rgba(129, 140, 248, 0.12)',
				},
				muted: {
					DEFAULT: '#6B7280',
					light: '#9CA3AF',
				},
				border: {
					DEFAULT: 'rgba(255, 255, 255, 0.08)',
					hover: 'rgba(129, 140, 248, 0.3)',
				},
			},
			fontFamily: {
				primary: ['Montserrat', ...fontFamily.sans],
			},
		},
	},

	plugins: []
} satisfies Config;
