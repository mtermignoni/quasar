<template>
  <q-layout
    ref="layout"
    view="lHh Lpr fff"
    :left-class="{'bg-grey-2': true}"
  >
    <Toolbar slot="header"></Toolbar>
    <Drawer slot="left"></Drawer>
    <!--
      Replace following <div> with
      <router-view /> component
      if using subRoutes
    -->
    <router-view class="layout-view"></router-view>
  </q-layout>
</template>

<script>
import {
  QLayout,
  Events
} from 'quasar'

import Toolbar from './common/Toolbar.vue'
import Drawer from './common/Drawer.vue'

export default {
  name: 'index',
  components: {
    QLayout,
    Toolbar,
    Drawer,
    Events
  },
  mounted () {
    Events.$on('openDrawer', () => {
      this.$refs.layout.toggleLeft()
    })
  },
  beforeDestroy () {
    Events.$off('openDrawer')
  }
}
</script>

<style>

</style>
