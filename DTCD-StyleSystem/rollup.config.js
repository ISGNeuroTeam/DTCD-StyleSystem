const watch = Boolean(process.env.ROLLUP_WATCH);

const pluginName = 'StyleSystem';

const output = watch ? `./../../DTCD/server/plugins/${pluginName}.js` : `./build/${pluginName}.js`;

const plugins = [];

export default {
	input: `./src/${pluginName}.js`,
	output: {
		file: output,
		format: 'esm',
		sourcemap: false,
	},
	watch: {
		include: ['./*/**'],
	},
	plugins,
};
