# VueScrollmonitor
> Handle scroll events like a boss

Wrapper to use the awesome scrollMonitor with Vue@2.4.x

To know more : [https://github.com/stutrek/scrollMonitor](https://github.com/stutrek/scrollMonitor)


### Demos
[Simple example](https://htmlpreview.github.io/?https://raw.githubusercontent.com/AlexandreBonaventure/vue-scrollmonitor/dev/examples/dist/simple/index.html)
see source : [here](https://github.com/AlexandreBonaventure/vue-scrollmonitor/tree/dev/examples/src/simple)

### Installation
```
npm install vue-scrollmonitor

// or

yarn add vue-scrollmonitor
```

### Usage
VueScrollMonitor relies on two components. So in order to use it, you have two choices:
#### Use the plugin
It will register the components globally so you'll be able to leverage the plugin in every components.
```
import VueScrollMonitor from 'vue-scrollmonitor'
Vue.use(VueScrollMonitor)
```


#### or registering components directly
Otherwise fell free to import and register manually the two plugins.
```
import { ScrollContainer, ScrollItem } from 'vue-scrollmonitor'
// then, in component definition:
{
  name: 'MyComponent',
  components: {
    ScrollContainer,
    ScrollItem,
  }
}
```

### Doc
[see source of example for recipes]()
To track items with ScrollItem component you'll need to wrap them in a ScrollContainer component.

#### ScrollContainer
---
##### Props
__container__ :DOMElement
By default, ScrollContainer will listen to scroll events emitted from HTML body, but you can setup another DOM element to watch for scrolling event. [see also](https://github.com/stutrek/scrollMonitor#when-the-body-scrolls)

---
##### Events
__change__ => Object
Every time scrollMonitor updates, it will fire a change event transporting the state of tracked items (aka all ScrollItem components children of this container).

One common pattern is to retrieve the state in the parent component (or register it in Vuex state for example) listening to this event. That way you can have access the state in the template easily.

The state is an index following this structure:
```
{
  id: {
    isAboveViewport: Boolean,
    isBelowViewport: Boolean,
    isInViewport: Boolean,
    isFullyInViewport: Boolean,
  }
  ...
}
```

#### ScrollItem

---
##### Props

__id__ :String|Number
*default: random uid*
Id is required to keep track of each item watcher & state. You can pass your own id as long as you make sure it is unique for each ScrollItem in a ScrollContainer component.

__lock__ :Boolean
*default: false*
[see](https://github.com/stutrek/scrollMonitor#locking)

__offset__ :Number | { top :Number, bottom :Number }
*default: undefined*
[see](https://github.com/stutrek/scrollMonitor#locking)

---
##### Events

__change__ => Object
same as ScrollContainer but for this item.

### License

MIT © Alexandre Bonaventure
