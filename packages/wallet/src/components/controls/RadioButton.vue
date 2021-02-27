<template>
  <label
    :for="name"
    class="v-radio-button"
    :class="{ _reject: reject, _active: checked }"
  >
    <span class="v-radio-button__btn">
      <input type="radio" :value="v" v-model="model" :id="name" :name="name" />
    </span>
    <span class="v-radio-button__label">{{ label }}</span>
  </label>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from "vue-property-decorator";

@Component
export default class RadioButton extends Vue {
  @Prop() label: string;
  @Prop() name: string;
  @Prop() v: string;
  @Prop() reject: boolean;

  @VModel({ type: String }) model!: string;

  public get checked(): boolean {
    return this.v === this.model;
  }
}
</script>

<style lang="sass" scoped>
.v-radio-button
  position: relative
  display: inline-block
  height: 32px
  padding: 6px 8px
  cursor: pointer
  border-radius: 50px
  user-select: none
  &:hover
    background: #312B2A
    .v-radio-button__label
      color: #FFFFFF
  &._active
    background: #84BF3A
    .v-radio-button__label
      color: #FFFFFF
  &._reject._active
    background: #FF5C46

  &__btn
    position: absolute
    top: 0
    left: 0
    z-index: -1
    width: 100%
    height: 100%

  input[type="radio"]
    width: 0
    height: 0
    opacity: 0
    pointer-events: none

  &__label
    display: block
    font-weight: 500
    font-size: 14px
    line-height: 20px
    letter-spacing: 0.02em
    color: #312B2A
    min-width: 16px
    text-align: center
</style>
