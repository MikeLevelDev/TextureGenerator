<template>
  <form>
    <div class="input-group">
      <label><span>Pack Version</span></label>
      <input
        class="input"
        type="text"
        pattern="^[0-9]+\.[0-9]+"
        placeholder="1.0.0"
        @blur="parseVersion"
      />
    </div>

    <div class="input-group">
      <label>Pack Name</label>
      <input
        v-model="header['name']"
        class="input"
        type="text"
        placeholder="Sweet pack"
        required
        maxlength="50"
      />
    </div>

    <div class="input-group">
      <label>Pack Description</label>
      <input
        v-model="header['description']"
        class="input"
        type="text"
        placeholder="Some kick-ass textures"
        maxlength="100"
      />
    </div>

    <div class="input-group">
      <label>UUID</label>
      <input
        v-model="header['uuid']"
        class="input"
        type="text"
        placeholder="123e4567-e89b-12d3-a456-420666555000"
        maxlength="36"
        autocomplete="on"
      />
      <mc-btn v-show="!header['uuid']" @click="generateUuid"
        >Generate UUID</mc-btn
      >
      <mc-btn v-show="header['uuid']" @click="header['uuid'] = ''"
        >&times;</mc-btn
      >
    </div>
    <mc-btn v-show="!showOutput" @click="showOutput = true"
      >Show generated manifest</mc-btn
    >

    <div v-show="showOutput" class="output">
      <pre class="json">{{ manifest }}</pre>

      <div class="output__footer">
        <mc-btn @click="downloadManifest">Download Manifest</mc-btn>
        <mc-btn @click="showOutput = false">Hide Output</mc-btn>
      </div>
    </div>
  </form>
</template>

<script>
import { v1 as uuid } from "uuid";
import parseSemVer from "../lib/semver";
import McButton from "./McButton";

export default {
  name: "ManifestOutput",
  components: {
    "mc-btn": McButton,
  },
  data: () => ({
    showOutput: false,
    format_version: 1,
    header: {
      name: null,
      description: null,
      uuid: null,
      version: [0, 0, 1],
    },
    modules: [
      {
        type: "resources",
        uuid: null,
        version: [0, 0, 1],
      },
    ],
  }),
  methods: {
    parseVersion({ target: { value } }) {
      this.header.version = parseSemVer(value);
    },
    generateUuid() {
      console.log("!");
      this.header.uuid = uuid();
    },
    downloadManifest() {
      const el = document.createElement("a");
      const file = new Blob([JSON.stringify(this.manifest)], {
        type: "text/plain",
      });

      el.href = URL.createObjectURL(file);
      el.download = "manifest.json";
      el.click();
    },
  },
  computed: {
    manifest() {
      const mods = [];

      for (const mod of this.modules) {
        if (!mod.uuid) {
          mod.uuid = uuid();
        }

        mods.push(mod);
      }

      return {
        format_version: this.format_version || "1.0.0",
        header: {
          name: this.header.name || "Resource Pack",
          description:
            this.header.description || "Mysterious, unnamed resource pack.",
          uuid: this.header.uuid || uuid(),
          version: this.header.version,
        },
        modules: mods,
      };
    },
  },
};
</script>

<style lang="scss">
.output {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  color: #111;
  padding: calc(2 * var(--size-base));

  &__footer {
    align-items: center;
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    margin-top: calc(2 * var(--size-base));
    padding: calc(2 * var(--size-base)) calc(2 * var(--size-base)) 0;
  }
}
</style>