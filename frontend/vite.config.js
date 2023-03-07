import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	optimizeDeps: { include: ['@carbon/charts'] },
	resolve: { alias: { './runtimeConfig': './runtimeConfig.browser' } }
});
