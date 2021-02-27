<template>
  <div class="v-text-field">
    <input
      class="v-text-field__input"
      :class="{ _active: isFocus || model || focused }"
      :style="{
        '--shadow': noshadow ? 'none' : '0px 8px 20px rgba(88, 82, 77, 0.24)',
      }"
      @focus="focus"
      @blur="isFocus = false"
      :placeholder="!isFocus && label"
      v-model="model"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, VModel, Vue } from "vue-property-decorator";

@Component
export default class TextField extends Vue {
  @Prop({ type: String }) readonly label?: string;
  @Prop({ type: Boolean }) readonly noshadow?: boolean;
  @Prop({ type: Boolean }) readonly focused?: boolean;

  @VModel({ type: String }) model!: string;
  isFocus = false;

  @Emit("focus")
  focus() {
    this.isFocus = true;
  }
}
</script>

<style lang="sass" scoped>
.v-text-field
  &__input
    display: block
    width: 100%
    height: 56px
    padding: 16px 20px
    outline: none
    box-sizing: border-box
    font-family: PT Root UI
    font-size: 16px
    line-height: 24px
    letter-spacing: 0.02em
    background: #F6F6F6
    border-radius: 100px
    border: 1px solid #EDEDED
    &::placeholder
      color: #7C7675
    &:hover
      background: #EDEDED
    &._active
      background: #FFFFFF
      box-shadow: var(--shadow)
</style>