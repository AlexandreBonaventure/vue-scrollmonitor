import livereload from 'rollup-plugin-livereload'
import serve from 'rollup-plugin-serve'
// import html from 'rollup-plugin-fill-html';

import baseConfig from './rollup.config.base.js'

const config = Object.assign(baseConfig,
{
  input: 'examples/src/simple/main.js',
  output: {
    file: 'examples/dist/simple/index.js',
    format: 'umd',
  },
})

// config.plugins.push(html({
//   template: 'index.html',
//   filename: 'index.html'
// }))

const isProduction = process.env.NODE_ENV === `production`
const isDevelopment = process.env.NODE_ENV === `development`

if (isDevelopment) {
  config.plugins.push(livereload())
  config.plugins.push(serve({
    contentBase: ['examples/dist/simple'],
    port: 8080,
    open: true
  }))
}

export default config
