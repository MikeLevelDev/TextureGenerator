<template>
  <div class="output">
    <h2 class="output__filename">{{ texture }}.texture_set.json</h2>

    <div class="output__body">
      <pre class="json">{{ textureSet }}</pre>
    </div>

    <div class="output__btn">
      <DownloadBtn :texture="texture" :data="textureSet" />
    </div>
  </div>
</template>

<script>
import DownloadBtn from "./DownloadBtn";

export default {
  name: "TextureSetOutput",
  props: {
    texture: {
      type: String,
      required: true,
      default: "",
      validator: (str) => str.trim().length > 0,
    },
    layers: {
      type: Array,
      required: false,
      default: () => ["color", "#ff6666"],
    },
    version: {
      type: String,
      required: false,
      default: "1.16.100",
    },
  },
  components: {
    DownloadBtn,
  },
  computed: {
    textureSet() {
      const layers = Object.fromEntries(this.layers);

      return {
        format_version: this.version,
        "minecraft:texture_set": layers,
      };
    },
  },
};
</script>

<style lang="scss">
.output {
  margin-top: 1rem;
  padding: 0;

  &__btn {
    margin: calc(2 * var(--size-base)) var(--size-base) auto 0;
  }

  &__filename {
    background: #d2d2d2;
    border-bottom: var(--size-base) solid #919191;
    box-shadow: inset 0 -1px 2px 1px #cbccd0, 0 1px 2px rgba(0, 0, 0, 0.8);
    display: block;
    font: normal 1rem/1.5 var(--font-family-monospace);
    margin: 0;
    padding: calc(2 * var(--size-base)) var(--size-base);
    text-align: center;
  }

  &__body {
    padding: 1rem 0.5rem 0;
  }
}
</style>