import scrollMonitor from 'scrollmonitor'
import { default as get } from 'lodash-es/get'
import { default as set } from 'lodash-es/set'
import { generateId } from './utils/helpers'
import Deferred from 'promise-deferred'

// const EVENTS_TO_WATCH = ['visibilityChange', 'stateChange', 'enterViewport', 'fullyEnterViewport', 'exitViewport', 'partiallyExitViewport']
// const getAttr = (vnode) => get(vnode, 'data.attrs.scroll-watch')

// const wrapWithWatcherComponent = (h, children) => {
//   const elsToWatch = children.filter(vnode => getAttr(vnode))
//   return elsToWatch.map((vnode) => {
//     const { data: { attrs, on, key } } = vnode
//     return h(ScrollWatcher, {
//       attrs,
//       on,
//       key,
//       props: { offset: getAttr(vnode), id: key },
//     }, [vnode])
//   })
// }

export const ScrollContainer = {
  name: 'ScrollContainer',
  provide () {
    const $scrollMonitor = {
      registerWatcher: this.registerWatcher,
      unregisterWatcher: this.unregisterWatcher,
    }
    Object.defineProperty($scrollMonitor, 'state', {
      get : () => this.state,
    })
    return { $scrollMonitor }
  },
  props: {
    debug: {
      default: true,
      type: Boolean,
    },
    container: {
      default: false,
    },
  },
  data: () => ({
    state: {},
    init: false,
  }),
  created () {
    this.__deferredReady = new Deferred()
    this.$nextTick(() => {
      this.setupContainer()
      this.__deferredReady.resolve()
    })
  },
  destroyed () {
    this.teardownWatchers()
  },
  render (h) { // TODO diff and patch watchers
    const children = this.$slots.default
    this.init = true
    return h('div', this.$slots.default)
  },
  // beforeUpdate() {
  //   this.$nextTick(() => {
  //     console.log('refresh');
  //     this.__deferredReady.promise.then(() => {
  //       this._container.recalculateLocation()
  //       this._container.update()
  //     })
  //   })
  // },
  methods: {
    updateInternalState (o) {
      const {
        isAboveViewport,
        isBelowViewport,
        isFullyInViewport,
        isInViewport,
        _id: id,
      } = o
      this.state[id] = {
        isAboveViewport,
        isBelowViewport,
        isFullyInViewport,
        isInViewport,
      }
      this.$emit('change', { ...this.state })
      // bottom
      // container
      // height
      // isAboveViewport
      // isBelowViewport
      // isFullyInViewport
      // isInViewport
      // top

      // bottom
      // callbacks
      // container
      // height
      // isAboveViewport
      // isBelowViewport
      // isFullyInViewport
      // isInViewport
      // locked
      // offsets
      // recalculateLocation
      // top
      // triggerCallbacks
      // watchItem
    },
    setupContainer (children) {
      this._container = this.container
        ? scrollMonitor.createContainer(document.querySelector(this.container))
        : scrollMonitor
    },
    teardownWatchers () {
      this._scrollWatchers.map(watcher => watcher.destroy())
    },
    registerWatcher (id, el, options) {
      // this.__deferredReady.promise.then(() => {
        this.setupReactiveState(id)
        const watcher = this.updateWatcher(id, el, options)
        this.updateInternalState(watcher) // initial state update
        // Setup global handler
        watcher.on('stateChange', (e, o) => {
          this.updateInternalState(o)
        })

        // Setup custom handlers
        // const handlers = pick(on, EVENTS_TO_WATCH)
        // Object.keys(handlers).map((key) => watcher.on(key, (e, o) => handlers[key](o)))
      // })
      return watcher
    },
    /**
     * Update watcher with options like lock || offset
     */
    updateWatcher (id, el, options = {}) {
      this._scrollWatchers = this._scrollWatchers || []
      const { lock, offset } = options
      const watcherIndex = this._scrollWatchers.findIndex(({ _id }) => _id === id)
      const alreadyExist = watcherIndex !== -1

      let watcher = alreadyExist ? this._scrollWatchers[watcherIndex] : undefined

      if (!alreadyExist || offset) {
        watcher = this.generateWatcher(id, el, offset) // regenerate watcher with correct id if offset changes
      }

      if (lock) watcher.lock() // handle locking/unlocking
      else if (lock === false) watcher.unlock()

      this._scrollWatchers
        .splice(alreadyExist ? watcherIndex : this._scrollWatchers.length, 1, watcher)
      return watcher
    },
    generateWatcher (id, el, offset) {
      const watcher = this._container.create(el, offset)
      watcher._id = id
      return watcher
    },
    unregisterWatcher (id) {
      const watcherIndex = this._scrollWatchers.findIndex(({ _id }) => _id === id)
      this.$delete(this._scrollWatchers, watcherIndex)
      this.$delete(this.state, id)
    },
    setupReactiveState (key) {
      if (this.state[key]) return
      this.$set(this.state, key, {
        isAboveViewport: null,
        isBelowViewport: null,
        isFullyInViewport: null,
        isInViewport: null,
      })
      this.$emit('change', { ...this.state })
    },
    log (...args) {
      if (this.debug) console.log(...args)
    },
  },
}
export const ScrollItem = {
  name: 'ScrollItem',
  inject: ['$scrollMonitor'],
  props: {
    id: {
      default: generateId,
    },
    lock: {
      default: false,
      type: Boolean,
    },
    offset: {
      default: null,
    },
  },
  render (h) {
    const children = this.$slots.default
    if (children.length > 1) {
      console.warn('VueScrollMonitor: Only one root element is allowed')
    }
    const vNode = children[0]
    if (this.state) {
      const keys = Object.keys(this.state)
      const classString = Object.values(this.state).reduce((sum, val, i) => {
        const k = keys[i]
        return [val ? k : undefined, sum].filter(val => val).join(' ')
      }, null)
      const mergedClassString = [classString.toLowerCase(), get(vNode, 'data.staticClass', '')]
        .join(' ')
      set(vNode, 'data.staticClass', mergedClassString)
    }
    return this.lock ?
      h(
        'div',
        {
          style: 'height: 0px',
        },
        [vNode]
      )
      : vNode
    // return vNode
  },
  beforeUpdate() {
    if (this._scrollwatcher && this.lock) { //HACK
      this._scrollwatcher.unlock()
      this._scrollwatcher.recalculateLocation()
      this._scrollwatcher.lock()
    }
  },
  created () {
    this.$nextTick(() => {
      this._scrollwatcher = this.$scrollMonitor.registerWatcher(this.id, this.$el, { offset: this.offset, lock: this.lock })
    })
  },
  destroyed () {
    this.$scrollMonitor.unregisterWatcher(this.id)
  },
  computed: {
    state() {
      return this.$scrollMonitor.state[this.id]
    }
  },
  watch: {
    lock(val) {
      this.$scrollMonitor.updateWatcher(this.id, this.$el, { lock: val })
    },
    offset: {
      handler() {
        this.$scrollMonitor.updateWatcher(this.id, this.$el, { offset: val })
      },
      deep: true,
    }
  },
}

export default {
  ScrollContainer,
  ScrollItem,
}
