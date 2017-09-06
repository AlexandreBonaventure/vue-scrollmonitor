import baseConfig from './rollup.config.base.js'

const config = Object.assign(baseConfig,
{
  input: './src/index.js',
  output: {
    file: './dist/vue-scroll-monitor.js',
    format: 'umd',
  }
})

export default config
