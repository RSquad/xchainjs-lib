<template>
  <div class="v-radio-button-group">
    <RadioButton :name="'1' + id" label="1" v="1" v-model="model" />
    <RadioButton :name="'2' + id" label="2" v="2" v-model="model" />
    <RadioButton :name="'3' + id" label="3" v="3" v-model="model" />
    <RadioButton :name="'4' + id" label="4" v="4" v-model="model" />
    <RadioButton :name="'5' + id" label="5" v="5" v-model="model" />
    <RadioButton :name="'6' + id" label="6" v="6" v-model="model" />
    <RadioButton :name="'7' + id" label="7" v="7" v-model="model" />
    <RadioButton :name="'8' + id" label="8" v="8" v-model="model" />
    <RadioButton :name="'9' + id" label="9" v="9" v-model="model" />
    <RadioButton :name="'10' + id" label="10" v="10" v-model="model" />
    <RadioButton
      :name="'abstain' + id"
      label="Abstain"
      v="abstain"
      v-model="model"
    />
    <RadioButton
      :name="'reject' + id"
      label="Reject"
      v="reject"
      :reject="true"
      v-model="model"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, VModel, Vue } from "vue-property-decorator";
import RadioButton from "@/components/controls/RadioButton.vue";

@Component({ components: { RadioButton } })
export default class RadioButtonGroup extends Vue {
  @Prop() id: string;
  @VModel({ type: String }) model!: string;
}
</script>

<style lang="sass" scoped>
.v-radio-button-group
  width: max-content
  height: 32px
  background: #F8F9F9
  border-radius: 50px
</style>