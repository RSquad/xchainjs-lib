<template>
  <div class="v-multi-select-with-search" v-click-outside="clickOutSideOptions">
    <TextField
      :label="label"
      v-model="search"
      @focus="isOpen = true"
      noshadow
      :focused="isOpen"
      class="v-multi-select-with-search__control"
    />
    <Tags :tags="value" :showAdd="false" @click-tag="change" class="v-multi-select-with-search__tags" />
    <div v-show="isOpen && filteredOptions.length" class="v-multi-select-with-search__options-wrap">
      <div class="v-multi-select-with-search__options">
        <div
          v-for="(option, i) in filteredOptions"
          :key="i"
          class="v-multi-select-with-search__options-option"
          :class="{ active: value.includes(option) }"
          @click="change(option)"
        >
          {{ option.title }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Model, Emit } from 'vue-property-decorator'
import Tags from '@/components/controls/Tags.vue'
import TextField from '@/components/controls/TextField.vue'
import { xorBy } from 'lodash'

@Component({
  components: {
    Tags,
    TextField,
  },
})
export default class MultiSelectWithSearch extends Vue {
  public search = ''
  isOpen = false

  @Prop() readonly label?: string
  @Prop({ type: Array, default: [] }) readonly options!: any

  @Model('input', {
    type: Array,
    required: true,
  })
  readonly value!: any

  @Emit('input')
  change(item: object) {
    // this.isOpen = false;
    return xorBy(this.value, [item], 'value')
  }
  get filteredOptions() {
    const regexp = new RegExp(this.search, 'gi')
    return this.options.filter((el: any) => {
      return regexp.test(el.title)
    })
  }
  clickOutSideOptions() {
    if (this.isOpen) {
      this.isOpen = false
    }
  }
}
</script>

<style lang="sass" scoped>
.v-multi-select-with-search
  position: relative
  &__control
    position: relative
    z-index: 1
    margin-bottom: 12px
  &__tags
    margin-left: 20px
  &__options-wrap
    background: #FFFFFF
    box-shadow: 0px 8px 20px rgba(88, 82, 77, 0.24)
    border-radius: 32px
    padding: 68px 0 24px 0
    top: 0
    left: 0
    right: 0
    z-index: 0
    position: absolute
  &__options
    max-height: 200px
    overflow-y: auto
    &::-webkit-scrollbar
      width: 20px
      border-radius: 60px
    &::-webkit-scrollbar-track
      background: #F6F6F6
      border-radius: 60px
    &::-webkit-scrollbar-thumb
      width: 20px
      border: 6px solid #F6F6F6
      background: #E4E4E4
      border-radius: 60px
    &-option
      padding: 12px 20px
      font-weight: 500
      font-size: 18px
      line-height: 26px
      letter-spacing: 0.02em
      color: #312B2A
      cursor: pointer
      position: relative
      user-select: none
      &:hover
        background: #FDF8EA
        border-radius: 100px
        color: #EB7D23
      &.active
        color: #689F23
        padding: 12px 54px 12px 20px
        &:after
          content: ""
          width: 24px
          height: 24px
          background: no-repeat center url("../../assets/img/green-check.svg")
          position: absolute
          right: 20px
</style>