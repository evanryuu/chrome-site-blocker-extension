import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';
import { copyPlugin } from './rsbuild-plugins/copy-plugin';
import path from 'path';
import fs from 'fs';

function getEntryFile(entryPath: string) {
  return fs.readdirSync(entryPath);
}

const chromeName = getEntryFile(path.resolve('src/entry'));

const entries: Record<string, string> = {};
chromeName.forEach((name) => {
  const fileName = name.replace(/\.[^/.]+$/, '');
  entries[fileName] = `./src/entry/${name}`;
});

export default defineConfig({
  plugins: [pluginVue(), copyPlugin],
  source: {
    entry: entries,
  },
  output: {
    filename: {
      js: '[name].js',
    },
    distPath: {
      root: 'dist',
      js: 'js',
      css: 'css',
      html: '',
    },
    cleanDistPath: false, // 改为 false
  },
  // tools: {
  //   rspack: {
  //     output: {
  //       chunkFilename: 'js/[name].js',
  //     },
  //   },
  // },
  html: {
    template: './public/index.html',
    templateParameters: {
      BASE_URL: '/',
    },
    title: 'SiteBlocker',
  },
  performance: {
    chunkSplit: {
      strategy: 'all-in-one',
    },
  },
  dev: {
    writeToDisk: true,
  },
});
