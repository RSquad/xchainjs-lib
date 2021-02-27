<template>
  <div class="v-button">
    <button @click="$emit('click')" :disabled="disabled" :type="type" class="v-button__control">
      {{ text }}
    </button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ButtonView extends Vue {
  @Prop({ type: String }) readonly text?: string
  @Prop({ type: Boolean, default: false }) readonly disabled?: boolean
  @Prop({ type: String, default: 'button' }) readonly type?: string
}
</script>

<style lang="sass" scoped>
.v-button
  width: max-content
  &__control
    border: none
    outline: none
    padding: 0 12px
    height: 32px
    width: 100%
    background: #84BF3A
    border-radius: 34px
    font-weight: 700
    font-size: 14px
    line-height: 20px
    letter-spacing: 0.75px
    color: #FFFFFF
    outline: 0
    cursor: pointer
    overflow: hidden
    pointer-events: auto
    transition: all 0.2s ease
    &:active
      background: #689F23
    &:disabled
      pointer-events: none
      background: #EDEDED
      color: #CDC6C5
</style>