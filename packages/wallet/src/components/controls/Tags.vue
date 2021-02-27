<template>
  <div class="v-tags">
    <div
      class="v-tags__tag"
      v-for="(item, i) in tags"
      :key="i"
      @click="clickTag(item)"
    >
      {{ item.title }}
      <img src="@/assets/img/black-cross.svg" :alt="item" />
    </div>
    <div v-show="showAdd" class="v-tags__add" @click="clickAdd">
      Add
      <img src="@/assets/img/black-plus.svg" alt="add" />
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";

@Component
export default class Tags extends Vue {
  @Prop() readonly tags!: any;
  @Prop() readonly showAdd!: boolean;

  @Emit("click-tag")
  clickTag(v: string) {
    return v;
  }

  @Emit("click-add")
  clickAdd() {
    return true;
  }
}
</script>

<style lang="sass" scoped>
.v-tags
  display: flex
  flex-wrap: wrap
  user-select: none
  &__tag
    background: #F6F6F6
    border: 1px solid #EDEDED
    box-sizing: border-box
    border-radius: 65px
    width: max-content
    padding: 6px 2px 6px 12px
    height: 32px
    font-weight: 500
    font-size: 14px
    line-height: 20px
    display: flex
    align-items: center
    letter-spacing: 0.75px
    color: #364046
    text-transform: capitalize
    cursor: pointer
    margin-bottom: 8px
    &:not(:last-child)
      margin-right: 8px
    img
      margin-left: 2px
  &__add
    font-weight: 500
    font-size: 16px
    line-height: 20px
    display: flex
    align-items: center
    letter-spacing: 0.25px
    color: #312B2A
    cursor: pointer
    margin-bottom: 8px
    img
      margin-left: 8px
</style>