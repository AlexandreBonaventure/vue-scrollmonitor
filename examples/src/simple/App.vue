<script>
import { ScrollContainer, ScrollItem } from '../../src/vue-scrollmonitor.js'
export default {
  name: 'Example',
  components: {
    ScrollContainer,
    ScrollItem,
    Prism: window.PrismComponent,
    test: {
      functional: true,
      render: (h, { props }) => { console.log('refresh', props.state); return h('div', `${JSON.stringify(props.state)}${Math.random()}`) }
    }
  },
  data: () => ({
    state: {},
  }),
  methods: {
    updateState (state) {
      this.state = state
    },
    onChange (state) {
      console.log('change')
    },
  },
  computed: {
    itemsInViewport() {
      return _.pickBy(this.state, ({ isInViewport }) => isInViewport)
    }
  },
}
</script>

<template>
<div class="pa4">
  <h1 class="white">Vue<span class="blue">ScrollMonitor</span></h1>
  <div>
    <scroll-container @change="updateState" class="flex">
      <div class="flex-auto left">
        <scroll-item :lock="true">
          <div class="sidebar">
            <prism language="javascript">{{ itemsInViewport }}</prism>
          </div>
        </scroll-item>
      </div>
      <div class="">
        <scroll-item v-for="i in 10" :id="i" :key="i" @change="onChange">
          <p :class="`bloc mb4 mt0 pa6 f3 b tc white ${state[i] && state[i].isFullyInViewport ? 'bg-blue' : 'bg-light-blue'}`">
            {{ i }}
            <!-- {{  i % 2 ? `${i}: ${state[i] && state[i].isFullyInViewport ? 'i’m fully in viewport' : 'i’m not fully in viewport'}` : 'I’m not !'}} -->
          </p>
        </scroll-item>
      </div>
    </scroll-container>
  </div>
</div>
</template>

<style>
  html {
    background: #272822;
  }
  .left {
    min-width: 480px;
  }
  .sidebar.isaboveviewport {
    position: fixed;
    top: 0;
  }
  .bloc{
    transition: background-color .3s ease-in-out;
  }
</style>
