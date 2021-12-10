import html from 'rollup-plugin-html';
import styles from 'rollup-plugin-styles';

const watch = Boolean(process.env.ROLLUP_WATCH);

const pluginName = 'StyleSystem';

const outputFile = `${pluginName}.js`;
const outputDirectory = watch ? `./../../DTCD/server/plugins/DTCD-${pluginName}` : `./build`;

const plugins = [
  html({
    include: ['**/*.html', '**/*.svg'],
  }),
  styles(),
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
