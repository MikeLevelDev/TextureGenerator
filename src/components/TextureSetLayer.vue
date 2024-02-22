<template>
  <div class="layer">
    <h3 class="layer__title">{{ layer }}</h3>

    <div class="layer__options">
      <div v-show="useColor" class="option">
        <sketch-picker
          :value="color"
          :preset-colors="colors"
          @input="applyColor"
        ></sketch-picker>
      </div>
      <div v-show="!useColor" class="option">
        <TextureUpload
          :texture="texture"
          :layer="layer"
          :size="size"
          @dropped="handleDrop"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Sketch } from "vue-color";
import TextureUpload from "./TextureUpload";
//import { sizeIsValid } from "../lib/validation";

export default {
  name: "TextureSetLayer",
  components: {
    TextureUpload,
    "sketch-picker": Sketch,
  },
  props: {
    texture: {
      type: String,
      required: true,
      default: "",
    },
    layer: {
      type: String,
      required: true,
      default: "color",
      validator: (v) => v.length > 1,
    },
    colors: {
      type: Array,
      required: false,
      default: () => ["#000"],
      validator: (v) => v.length > 1,
    },
    size: {
      type: Number,
      required: true,
      default: 256,
      //validator: sizeIsValid,
    },
  },
  data() {
    return {
      useColor: false,
      color: this.colors[0],
      textureFile: null,
    };
  },
  methods: {
    applyColor(color) {
      this.useColor = true;
      this.color = color;
      this.$emit("change", color, this.layer);
    },
    applyTexture() {
      this.useColor = false;
      this.$emit("change", this.texture, this.layer);
    },
    handleDrop(file) {
      this.useColor = false;
      this.textureFile = file;
      this.applyTexture();
    },
  },
};
</script>

<style lang="scss">
.layer {
 align-items: flex-start;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  margin: 0 var(--size-base) var(--size-base);
  overflow: hidden;

  &__title {
    background-color: var(--color-primary);
    border: 2px solid currentColor;
    border-bottom-width: 0;
    color: #111;
    cursor: default;
    display: inline-block;
    font-size: 1rem;
    font-weight: 500;
    margin: calc(5 * var(--size-base)) 0 0 0;
    padding: var(--size-base) calc(3 * var(--size-base));
    text-transform: uppercase;
  }

  &__options {
    align-items: center;
    background-color: #242426;
    border: 0;
    border-top: 2px solid #111;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    padding: var(--size-base);
  }
}
</style>