<template>
  <textarea
    v-show="active"
    class="v-text-area-autosize"
    :style="computedStyles"
    v-model="model"
    @focus="resize"
    @blur="$emit('blur')"
    ref="textareaAutosize"
    :name="'text-area' + id"
  ></textarea>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue, Watch } from "vue-property-decorator";

@Component
export default class TextareaAutosize extends Vue {
  @VModel({ type: [String, Number], default: "" }) model: any;
  @Prop({ type: Boolean, default: true }) autosize: any;
  @Prop({ type: Boolean, default: false }) active: any;
  @Prop({ type: [Number], default: 56 }) minHeight: any;
  @Prop({ type: [Number], default: 500 }) maxHeight: any;
  @Prop({ type: [Boolean, Array], default: false }) important: any;
  @Prop({ type: String, default: "text-area" }) id: string;

  maxHeightScroll = false;
  height = "auto";

  public get computedStyles(): any {
    if (!this.autosize) return {};
    return {
      resize: !this.isResizeImportant ? "none" : "none !important",
      height: this.height,
      overflow: this.maxHeightScroll
        ? "auto"
        : !this.isOverflowImportant
        ? "hidden"
        : "hidden !important",
    };
  }

  public get isResizeImportant(): any {
    const imp = this.important;
    return imp === true || (Array.isArray(imp) && imp.includes("resize"));
  }

  public get isOverflowImportant(): any {
    const imp = this.important;
    return imp === true || (Array.isArray(imp) && imp.includes("overflow"));
  }

  public get isHeightImportant(): any {
    const imp = this.important;
    return imp === true || (Array.isArray(imp) && imp.includes("height"));
  }

  @Watch("model")
  onChangeVal() {
    this.$nextTick(this.resize);
  }

  @Watch("minHeight")
  onChangeMinHeight() {
    this.$nextTick(this.resize);
  }

  @Watch("maxHeight")
  onChangeMaxHeight() {
    this.$nextTick(this.resize);
  }

  @Watch("autosize")
  onChangeAutosize(val: any) {
    if (val) this.resize();
  }

  mounted() {
    this.resize();
  }

  resize() {
    const important = this.isHeightImportant ? "important" : "";
    this.height = `auto${important ? " !important" : ""}`;
    this.$nextTick(() => {
      let contentHeight = this.$el.scrollHeight + 1;
      if (this.minHeight) {
        contentHeight =
          contentHeight - 32 < this.minHeight ? this.minHeight : contentHeight;
      }
      if (this.maxHeight) {
        if (contentHeight > this.maxHeight) {
          contentHeight = this.maxHeight;
          this.maxHeightScroll = true;
        } else {
          this.maxHeightScroll = false;
        }
      }
      const heightVal = contentHeight + "px";
      this.height = `${heightVal}${important ? " !important" : ""}`;
    });
    return this;
  }

  @Watch("active")
  onActiveChange() {
    if (this.active) {
      const textareaAutosize: any = this.$refs.textareaAutosize;
      this.$nextTick(() => {
        textareaAutosize.focus();
      });
    }
  }
}
</script>


<style scoped lang="sass">
.v-text-area-autosize
  width: 100%
  background: #FFFFFF
  border: 1px solid #E4E4E4
  box-sizing: border-box
  box-shadow: 0px 8px 20px rgba(88, 82, 77, 0.24)
  border-radius: 12px
  display: block
  outline: none
  font-size: 16px
  line-height: 24px
  letter-spacing: 0.02em
  color: #312B2A
  padding: 16px
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
</style>