<template>
  <div class="v-comment-field">
    <div
      @click="onClickComment"
      class="v-comment-field__comment"
      :class="{ _active: !model }"
    >
      <img :src="img" alt="comment" />
      <div>{{ comment }}</div>
    </div>
    <TextareaAutosize
      @blur="active = !active"
      v-model="model"
      :active="active"
      :id="id"
      class="v-comment-field__text-area"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from "vue-property-decorator";
import TextareaAutosize from "@/components/controls/TextareaAutosize.vue";
import greyComment from "@/assets/img/grey-comment.svg";
import blackComment from "@/assets/img/black-comment.svg";

@Component({
  components: { TextareaAutosize },
})
export default class CommentField extends Vue {
  active = false;
  @Prop() id: string;
  @VModel() model: string;

  onClickComment() {
    this.active = !this.active;
  }

  public get comment(): string {
    return this.model ? this.model : "Comment";
  }

  public get img(): any {
    return !this.model ? greyComment : blackComment;
  }
}
</script>

<style lang="sass" scoped>
.v-comment-field
  min-height: 56px
  position: relative
  &__comment
    cursor: text
    min-height: 56px
    padding-left: 48px
    img
      position: absolute
      top: 16px
      left: 12px
    div
      font-size: 14px
      line-height: 21px
      letter-spacing: 0.02em
      word-break: break-word
      padding-top: 18px
    &._active
      div
        color: #7C7675
  &__text-area
    position: absolute
    top: 0
    left: 0
    right: 0
    z-index: 1
</style>