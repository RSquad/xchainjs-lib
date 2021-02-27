<template id="v-switch-button">
  <div class="v-switch-button-control" @click="toggle">
    <div
      class="v-switch-button"
      :class="{ enabled: isEnabled }"
      :style="{ '--color': color }"
    >
      <div class="button"></div>
    </div>
    <div class="v-switch-button-label">
      {{ label }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model } from "vue-property-decorator";

@Component
export default class SwitchButton extends Vue {
  @Prop() readonly label?: string;
  @Prop({
    type: String,
    required: false,
    default: "#312B2A",
  })
  private offColor?: string;
  @Prop({
    type: String,
    required: false,
    default: "#84BF3A",
  })
  private onColor?: string;

  get color() {
    return this.isEnabled ? this.onColor : this.offColor;
  }

  @Model("toggle") readonly isEnabled!: boolean;
  isFocus = false;

  toggle() {
    this.$emit("toggle", !this.isEnabled);
  }
}
</script>

<style lang="sass" scoped>
.v-switch-button-control
  display: flex
  flex-direction: row
  align-items: center
  user-select: none
  & .v-switch-button
    height: 20px
    width: 32px
    border: 2px solid var(--color)
    box-shadow: inset 0px 0px 2px 0px rgba(0, 0, 0, 0.33)
    border-radius: 10px
    transition: all 0.3s ease-in-out
    cursor: pointer
    box-sizing: border-box

  & .v-switch-button .button
    height: 12px
    width: 12px
    margin: 2px
    border-radius: 50%
    background: var(--color)
    transition: all 0.3s ease-in-out

  & .v-switch-button.enabled
    background-color: var(--color)
    box-shadow: none

  & .v-switch-button.enabled .button
    background: white
    transform: translateX(calc(calc( 12px - (2 * 2px) ) + (2 *2px)))

  & .v-switch-button-label
    margin-left: 14px
    font-family: PT Root UI
    font-weight: 500
    font-size: 16px
    line-height: 20px
    letter-spacing: 0.25px
    color: #312B2A
    cursor: pointer
    user-select: none
</style>

