<template>
  <v-app-bar class="v-app-bar" app clipped-right short flat color="white">
    <v-app-bar-title class="v-app-bar__title">Web wallet</v-app-bar-title>
  </v-app-bar>
</template>


  <script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {}
</script>

<style lang="sass" scoped>
.v-app-bar
  border-bottom: 1px solid
  border-color: #F5F5F5!important
  &__title
    font-weight: 700
    font-size: 18px
    line-height: 24px
    letter-spacing: 0.5px
    color: #333333
</style>