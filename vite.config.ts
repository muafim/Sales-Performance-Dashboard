import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [tailwindcss(), {
    name: 'local-data-development-only',
    configureServer(server) {
      server.middlewares.use('/local-sales-data.json', async (_request, response) => {
        try {
          const data = await readFile(resolve('local-data/salesData.json'));
          response.setHeader('Content-Type', 'application/json');
          response.end(data);
        } catch {
          response.statusCode = 404;
          response.end('Local data has not been prepared.');
        }
      });
    },
  }],
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/',
});
