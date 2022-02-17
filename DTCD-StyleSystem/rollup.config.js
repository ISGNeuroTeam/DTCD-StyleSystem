import html from 'rollup-plugin-html';
import styles from 'rollup-plugin-styles';
import json from '@rollup/plugin-json';

import { version } from './package.json';

const watch = Boolean(process.env.ROLLUP_WATCH);

const pluginName = 'StyleSystem';

const outputFile = `${pluginName}.js`;
const outputDirectory = watch
  ? `./../../DTCD/server/plugins/DTCD-${pluginName}_${version}`
  : `./build`;

const plugins = [
  styles({
    mode: ['inject', () => ''],
  }),
  html({
    include: ['**/*.html', '**/*.svg'],
  }),
  styles(),
  json(),
];

export default {
  input: `./src/${pluginName}.js`,
  output: {
    file: `${outputDirectory}/${outputFile}`,
    format: 'esm',
    sourcemap: false,
  },
  watch: {
    include: ['./*/**'],
  },
  plugins,
};
