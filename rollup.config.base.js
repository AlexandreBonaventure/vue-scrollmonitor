import alias from 'rollup-plugin-alias'
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import nodeGlobals from 'rollup-plugin-node-globals'
import butternut from 'rollup-plugin-butternut'

const plugins = [
  alias({
    vue$: 'vue/dist/vue.common.js'
  }),
  vue({
    css: true,
    // css: './public/assets/css/app.css'
  }),
  buble({
    objectAssign: 'Object.assign'
  }),
  nodeResolve({
    jsnext: true,
    main: true,
    browser: true,
    module: true,
  }),
  commonjs(),
  nodeGlobals()
]

const config = {
  name: 'VueScrollMonitor',
  sourcemap: true,
  plugins: plugins
}

const isProduction = process.env.NODE_ENV === `production`
const isDevelopment = process.env.NODE_ENV === `development`

if (isProduction) {
  config.sourcemap = false
  config.plugins.push(butternut())
}

export default config
