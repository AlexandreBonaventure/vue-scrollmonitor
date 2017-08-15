import baseConfig from './rollup.config.base.js'

const config = Object.assign(baseConfig,
{
  entry: './src/index.js',
  dest: './dist/vue-scroll-monitor.js',
  format: 'umd',
})

export default config
