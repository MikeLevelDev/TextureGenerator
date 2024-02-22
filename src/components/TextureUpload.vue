<template>
  <div @drop.prevent="addFile" @dragover.prevent>
    <img v-if="src" :src="src" :width="size" :height="size" />
    <div v-else class="dropzone" :style="`--texture-size:${size}px`"></div>
    <div class="img__description">
      <mc-btn v-show="src" type="reset" @click.prevent="reset">Reset</mc-btn>

      <mc-btn v-if="texture && src" :title="filename" @click="download"
        >Download</mc-btn
      >
    </div>
  </div>
</template>

<script>
import McButton from "./McButton";
import {
  TEXTURE_SIZE_MIN,
  TEXTURE_SIZE_MAX,
  TEXTURE_SIZE_DEFAULT,
} from "../defaults";

export default {
  name: "TextureUpload",
  components: {
    "mc-btn": McButton,
  },
  props: {
    texture: {
      type: String,
      required: false,
      default: "",
    },
    layer: {
      type: String,
      required: true,
      default: "color",
    },
    size: {
      type: Number,
      required: false,
      default: TEXTURE_SIZE_DEFAULT,
      validator: (v) =>
        Number.isInteger(v) && v >= TEXTURE_SIZE_MIN && v <= TEXTURE_SIZE_MAX,
    },
  },
  data: () => ({
    /// File data uri
    src: null,
    /// Input file's extension
    ext: "png",
    /// Input file object
    file: null,
  }),
  methods: {
    reset() {
      this.src = null;
      this.ext = null;
      this.file = null;
    },
    addFile({ dataTransfer: { files } }) {
      const fileCount = files.length;
      if (fileCount < 1) {
        // this.$Message({
        //   duration: 3000,
        //   text: "No files submitted.",
        //   type: "danger",
        //   icon: "cancel",
        // });
        return;
      }

      this.$emit("dropped", files);

      this.file = files[fileCount - 1];
      this.preview(this.file);
    },
    download() {
      const el = document.createElement("a");
      el.href = this.src;
      el.download = this.filename;
      el.click();

      // this.$Message({
      //   duration: 3000,
      //   text: `${this.filename}`,
      //   type: "success",
      //   icon: "save_alt",
      // });
    },
    preview(file) {
      const mimeInfo = file.type.split("/", 2);
      if (!file || mimeInfo[0] !== "image") {
        // this.$Message({
        //   duration: 3000,
        //   text: "Invalid file type",
        //   type: "danger",
        //   icon: "cancel",
        // });
        return;
      }

      this.ext = mimeInfo[1] || "png";

      if (this.ext === "tga") {
        //// Return preview or error
      }

      const reader = new FileReader();

      reader.onload = ({ target }) => {
        this.src = target.result;

        // this.$Message({
        //   duration: 3000,
        //   text: !this.texture
        //     ? `Provide a texture name to download ${this.layer} layer texture`
        //     : `${this.filename} ready!`,
        //   type: "primary",
        //   icon: "info",
        // });
      };

      reader.onerror = () => {
        // this.$Message({
        //   duration: 3000,
        //   text: reader.error,
        //   type: "danger",
        //   icon: "cancel",
        // });

        this.reset();
      };

      reader.readAsDataURL(file);
    },
  },
  computed: {
    filename() {
      let label = "";

      if (this.layer !== "color") {
        label =
          this.layer === "metalness_emissive_roughness" ? "_mer" : "_normal";
      }

      return `${this.texture.toLowerCase()}${label}.${this.ext || "png"}`;
    },
  },
};
</script>

<style lang="scss">
.img {
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  flex: 1 0;
  height: 100%;
  justify-content: stretch;
  text-align: center;

  &__description {
    display: flex;
    justify-content: space-between;
    margin-top: auto;
  }
}

.dropzone {
  background-color: var(--color-dropzone-bg);
  border: 1px dashed currentColor;
  box-sizing: border-box;
  flex-grow: 1;
  height: var(--texture-size, 100%);
  transition-property: width, height;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.85, 0, 0.15, 1);
  width: var(--texture-size, 100%);
}
</style>