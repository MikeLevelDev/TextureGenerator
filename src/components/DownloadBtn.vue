<template>
  <mc-btn @click="download" :disabled="btnIsDisabled">Download JSON</mc-btn>
</template>

<script>
import McButton from "./McButton";

export default {
  name: "DownloadBtn",
  components: {
    "mc-btn": McButton,
  },
  props: {
    texture: {
      type: String,
      required: true,
      default: "",
    },
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data: () => ({
    disabled: false,
  }),
  methods: {
    download() {
      if (this.disabled) {
        return;
      }

      /// Throttle downloads
      this.disabled = true;

      const messageDuration = 3000;
      const el = document.createElement("a");
      const file = new Blob([JSON.stringify(this.data)], {
        type: "text/plain",
      });

      const fileName = `${this.texture.toLowerCase()}.texture_set.json`;

      el.href = URL.createObjectURL(file);
      el.download = fileName;
      el.click();

      // this.$Message({
      //   duration: messageDuration,
      //   text: `Created ${fileName}`,
      //   type: "success",
      //   icon: "save_alt",
      // });

      /// Stop throttling
      setTimeout(() => (this.disabled = false), messageDuration + 500);
    },
  },
  computed: {
    btnIsDisabled() {
      return this.disabled || this.texture.length < 1;
    },
  },
};
</script>