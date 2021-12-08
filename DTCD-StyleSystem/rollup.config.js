import html from 'rollup-plugin-html';

const watch = Boolean(process.env.ROLLUP_WATCH);

const pluginName = 'StyleSystem';

const outputFile = `${pluginName}.js`;
const outputDirectory = watch ? `./../../DTCD/server/plugins/DTCD-${pluginName}` : `./build`;

const plugins = [
  html({
    include: '**/*.html',
  }),
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
