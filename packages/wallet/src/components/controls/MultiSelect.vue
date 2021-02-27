<template>
  <div class="v-multi-select" v-click-outside="clickOutSideOptions">
    <Tags :tags="value" :showAdd="options.length !== value.length" @click-tag="change" @click-add="isOpen = true" />
    <div v-show="isOpen && noActiveOptions.length" class="v-multi-select__options">
      <div
        v-for="(option, i) in noActiveOptions"
        :key="i"
        class="v-multi-select__options-option"
        @click="change(option)"
      >
        {{ option.title }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Model } from 'vue-property-decorator'
import Tags from '@/components/controls/Tags.vue'
import { xor } from 'lodash'

@Component({ components: { Tags } })
export default class MultiSelect extends Vue {
  isOpen = false

  @Prop() readonly options!: string
  @Model('input', {
    type: Array,
    required: true,
  })
  readonly value!: any

  @Emit('input')
  change(item: object) {
    // this.isOpen = false;
    return xor(this.value, [item])
  }

  get noActiveOptions() {
    return xor(this.options, this.value)
  }

  clickOutSideOptions() {
    if (this.isOpen) {
      this.isOpen = false
    }
  }
}
</script>

<style lang="sass" scoped>
.v-multi-select
  &__options
    background: #FFFFFF
    box-shadow: 0px 8px 20px rgba(88, 82, 77, 0.24)
    border-radius: 32px
    margin-top: 16px
    padding: 12px 0
    &-option
      padding: 12px 20px
      font-weight: 500
      font-size: 18px
      line-height: 26px
      letter-spacing: 0.02em
      color: #312B2A
      cursor: pointer
      user-select: none

      &:hover
        background: #FDF8EA
        border-radius: 100px
        color: #EB7D23
</style>