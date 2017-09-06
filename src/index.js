import {
  ScrollContainer,
  ScrollItem,
} from './vue-scrollmonitor.js'

const install = function install (Vue) {
  Vue.component(ScrollContainer.name, ScrollContainer)
  Vue.component(ScrollItem.name, ScrollItem)
}
const plugin = { install }

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}

export default plugin
export {
  ScrollContainer,
  ScrollItem,
} from './vue-scrollmonitor.js'
