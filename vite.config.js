import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base: './' deixa os caminhos relativos -> funciona no GitHub Pages
// (https://SEU-USUARIO.github.io/SEU-REPO/) sem configurar o nome do repo.
export default defineConfig({
  plugins: [react()],
  base: './',
  test: { environment: 'node' },
});
