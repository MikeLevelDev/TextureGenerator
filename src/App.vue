<template>
  <div id="app">
    <header class="header">
      <h1>Resource Pack / Texture Set Generator</h1>
    </header>
    <nav class="nav">
      <mc-btn class="nav__item" @click="tab = 'manifest'"
        >Create Manifest</mc-btn
      >
      <mc-btn class="nav__item" @click="tab = 'textureSet'"
        >Create Texture Set</mc-btn
      >
    </nav>
    <main class="content">
      <div :class="['content__form', { content__open: tab === 'manifest' }]">
        <ManifestOutput />
      </div>
      <div :class="['content__form', { content__open: tab === 'textureSet' }]">
        <div class="input-group">
          <label>Texture Set File Format Version</label>
          <input
            v-model="version"
            class="input"
            type="text"
            pattern="^1\.16\.[0-1]{3}$"
            placeholder="1.16.###"
            disabled
          />
        </div>
        <div class="thumbnail-group">
          <img
            class="texture-thumbnail"
            :src="thumbnailUrl"
            :width="thumbnailSize"
            :height="thumbnailSize"
            :alt="texture"
          />

          <div class="input-group">
            <label>Minecraft Texture Name</label>
            <input
              v-model="texture"
              class="input"
              type="search"
              placeholder="leaves_oak_carried"
              pattern="^[a-z]+[a-z0-9_]+$"
              list="blocks-list"
            />
          </div>
        </div>

        <div v-if="sizes.length > 1" class="input-group">
          <label>Texture Size</label>
          <select v-model="textureSize" class="input">
            <option v-for="size in sizes" :key="size" :value="size">
              {{ size }}px
            </option>
          </select>
        </div>

        <div class="input-group">
          <label>Color Value Mode</label>
          <select class="input" @change="updateColorMode">
            <option value="rgba">RGBA</option>
            <option value="hex">Hex</option>
          </select>
        </div>

        <TextureSetLayer
          layer="color"
          :colors="[
            '#AA0000',
            '#FF5555',
            '#FFAA00',
            '#FFFF55',
            '#00AA00',
            '#55FF55',
            '#55FFFF',
            '#00AAAA',
            '#0000AA',
            '#5555FF',
            '#FF55FF',
            '#AA00AA',
            '#ffffff',
            '#aaaaaa',
            '#555555',
            '#000000',
          ]"
          :size="textureSize"
          :texture="texture"
          @change="changeColor"
        />

        <TextureSetLayer
          layer="metalness_emissive_roughness"
          :colors="[
            '#0000ff', /// Rough
            '#00ff00', /// Emissive
            '#ff0000', /// Metallic
            '#000000', /// None
            '#ffffff', /// All
          ]"
          :size="textureSize"
          :texture="texture"
          @change="changeColor"
        />

        <TextureSetLayer
          layer="normal"
          :colors="[
            '#7f7fff',
            '#48d6a0',
            '#acd6a4',
            '#3c9cbc',
            '#b09ab8',
            '#3c5cbc',
            '#4824a0',
            '#ac229c',
          ]"
          :size="textureSize"
          :texture="texture"
          @change="changeColor"
        />
      </div>

      <div v-if="texture" class="results">
        <TextureSetOutput
          :texture="`${texture}`.trim()"
          :version="version"
          :layers="layers"
        />
      </div>
    </main>

    <footer class="footer">
      <div class="footer__links">
        <h4 class="footer__heading">Resouces</h4>

        <div class="link">
          <a
            href="https://www.nvidia.com/en-us/geforce/guides/minecraft-rtx-texturing-guide/"
            target="_blank"
            rel="noopener"
            title="NVIDIA Minecraft with RTX PBR Texturing Guide"
            >RTX Texturing Guide</a
          >
        </div>

        <div class="link">
          <a
            href="https://help.minecraft.net/hc/en-us/articles/360051308931-Minecraft-RTX-Beta-Texture-Set-Documentation"
            target="_blank"
            rel="noopener"
            title="Minecraft RTX Beta Texture Set Documentation"
            >Texture Set Documentation</a
          >
        </div>

        <div class="link">
          <a href="https://github.com/jasonjgardner/jg-rtx/"
            >JG RTX resource pack on GitHub</a
          >
        </div>

        <div class="link">
          <a href="https://aka.ms/resourcepacktemplate"
            >Vanilla Resource Pack Template</a
          >
        </div>
      </div>

      <div class="footer__links">
        <h4 class="footer__heading">
          <a href="https://jasongardner.co">By Jason</a>
        </h4>
        <div class="link">
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            rel="license"
            >CC-BY-SA 4.0</a
          >
        </div>
        <div class="link">
          <a href="https://github.com/jasonjgardner/texture_set_json/"
            >View source on GitHub</a
          >
        </div>
      </div>
    </footer>

    <datalist id="blocks-list">
      <option v-for="block in blocks" :key="block" v-once>
        {{ block }}
      </option>
    </datalist>
  </div>
</template>

<script>
//import tinycolor from "tinycolor2";
//import { sizeIsValid } from "./lib/validation";
import { selectColor } from "./lib/colors";
import TextureSetOutput from "./components/TextureSetOutput";
import ManifestOutput from "./components/ManifestOutput";
import TextureSetLayer from "./components/TextureSetLayer";
import McButton from "./components/McButton";
import {
  DEFAULT_VERSION,
  TEXTURE_SIZE_DEFAULT,
  IMAGES_URL,
  getDefaultSizes,
} from "./defaults";

export default {
  name: "App",
  props: {
    blocks: {
      type: Array,
      required: false,
      default: () => [],
    },
    sizes: {
      type: Array,
      required: false,
      default: () => getDefaultSizes(),
      //validator: (arr) => arr.length === arr.filter(sizeIsValid),
    },
  },
  components: {
    TextureSetOutput,
    ManifestOutput,
    TextureSetLayer,
    "mc-btn": McButton,
  },
  data: () => ({
    tab: "manifest",
    version: DEFAULT_VERSION,
    texture: "",
    textureSize: TEXTURE_SIZE_DEFAULT,
    colorMode: "rgba",
    color: null,
    metalness_emissive_roughness: [0, 0, 255],
    normal: [127, 127, 255],
  }),
  computed: {
    layers() {
      const set = {
        color: this.color || this.texture,
      };

      if (this.metalness_emissive_roughness) {
        set.metalness_emissive_roughness = this.metalness_emissive_roughness;
      }

      if (this.normal) {
        set.normal = this.normal;
      }

      return Object.entries(set);
    },
    thumbnailUrl() {
      return `${IMAGES_URL}${
        this.blocks.includes(this.texture)
          ? `blocks/${this.texture}`
          : "misc/missing_texture"
      }.png`;
    },
    thumbnailSize() {
      return Math.min(this.textureSize, 128);
    },
  },
  methods: {
    changeColor(value, layer) {
      let layerName = layer;

      if (layer === "metalness_emissive_roughness") {
        layerName = "mer";
      }

      if (layer === "color") {
        layerName = "";
      }

      this[layer] = selectColor(value, this.colorMode, layerName);
    },
    updateColorMode({ target: { value } }) {
      this.colorMode = value.toLowerCase();

      this.color = selectColor(this.color, this.colorMode);
      this.metalness_emissive_roughness = selectColor(
        this.metalness_emissive_roughness,
        this.colorMode,
        "mer"
      );
      this.normal = selectColor(this.normal, this.colorMode, "normal");
    },
    downloadAll() {},
  },
};
</script>

<style lang="scss">

:root {
  --color-primary: #88b3ff;
  --color-success: #078732;
  --color-highlight: #f4af32;
  --color-label: #b7b8ba;
  --color-border_hover: #5c7bad;
  --color-border: #d3dae6;
  --color-footer-bg: #f6f9ff;
  --color-layer-bg: #fafbfd;
  --color-layer-border: #d3dae6;
  --color-dropzone-bg: #eaf0f1;
  --color-input-bg: #fefefe;
  --color-btn-bg: #48494a;
  --color-on-btn: #fff;
  --size-base: 4px;
  --size-border: calc(0.5 * var(--size-base));
  --line-height-base: 1.5;
  --font-family-monospace: 'Overpass Mono', 
             Menlo,
             "Segoe UI Mono", 
             "Roboto Mono", 
             "Oxygen Mono", 
             "Ubuntu Monospace", 
             "Source Code Pro",
             "Fira Mono", 
             "Droid Sans Mono", 
             monospace;
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, 
             "Segoe UI", 
             "Roboto", 
             "Oxygen", 
             "Ubuntu", 
             "Cantarell", 
             "Fira Sans", 
             "Droid Sans", 
             "Helvetica Neue", 
             Arial, sans-serif;
  --font-size-base: 18px;
  --border-radius: 0;
}

html,
body {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  background-color: #222;
  font: var(--font-size-base)/var(--line-height-base) var(--font-family-sans-serif);
  height: calc(100vh - 1px);
}



.input {
  background-color: var(--color-input-bg, white);
  border: var(--size-border) solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: 0 2px 6px -4px rgba(0, 0, 0, 0.0333), 0 4px 6px -4px rgba(0, 0, 0, 0.075);
  padding: calc(2 * var(--size-base)) var(--size-base);
  text-align: left;

  &:hover,
  &:foucs {
    border-color: var(--color-border_hover);
  }
}



.input {
  text-indent: calc(2 * var(--size-base));
}

.input-group {
  display: flex;
  flex-flow: row wrap;

  label {
    color: var(--color-label);
    display: inline-block;
    flex: 1 0 100%;
    font-size: 0.925rem;
    font-weight: normal;
    margin-bottom: var(--size-base);
    padding: calc(2 * var(--size-base)) calc(2 * var(--size-base)) var(--size-base) 0;
    transition: color 0.425s ease-out, padding 0.425s cubic-bezier(0.17,0.84,0.44,1);;
  }

  &:focus-within label {
    color: var(--color-primary);
    
   // border-top: 2px solid currentColor;
    font-weight: bold;
   // padding-left: calc(2 * var(--size-base));

    span {
      background-color: var(--color-primary);
      border: 1px solid black;
      color: black;
      padding: var(--size-base);
    }
  }

  .input {
    background-color: #313234;
    border: 2px solid #242527;
    color: white;
    flex: 1 1;

    &::placeholder {
      color: #{darken(#b7b8ba, 25%)};
    }

    &:hover,
    &:focus {
      background-color: #48494b;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
      outline: 1px solid white;
      text-shadow: 2px 2px 0 #333;

      &::placeholder {
        text-shadow: none;
      }
    }

    &::selection {
      background-color: var(--color-primary);
      text-shadow: none;
    }
  }
}

.input-group + .input-group {
  margin-top: calc(5 * var(--size-base));
}

.thumbnail-group {
  align-items: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: stretch;

  .texture-thumbnail {
    margin-right: calc(4 * var(--size-base));
  }
}

#app,
.content {
  align-items: stretch;
  display: flex;
  flex-flow: column nowrap;
}

#app {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top left;
  background-image: var(--bg);
  image-rendering: pixelated;
  justify-content: space-between;
  min-height: 100%;
  width: 100%;
}

.header {
  align-items: center;
  background-color: #d2d2d2;
  border-bottom: var(--size-base) solid #919191;
  box-shadow: inset 0 -1px 2px 1px #cbccd0, 0 1px 2px rgba(0, 0, 0, 0.8);
  display: flex;
  font-size: 0.5rem;
  flex-flow: row nowrap;
  justify-content: stretch;
  text-align: center;
  width: 100%;
  z-index: 100;

  h1 {
    flex: 1;
    font-size: 2.75em;
    font-weight: 300;
    //text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);
  }
}

.nav {
  box-sizing: border-box;
  display: flex;
  padding: calc(4 * var(--size-base));
  width: 100%;

  &__item {
    flex: 1;
  }
}

.content {
  flex-grow: 1;
  max-width: 1024px;
  
  &__form {
    background-color: rgba(#48494b, 0.333);
    backdrop-filter: blur(20px) brightness(0.5) saturate(1.1);
    color: white;
    display: none;
    flex: 1 0 100%;
    flex-flow: column nowrap;
    padding: calc(2 * var(--size-base)) var(--size-base) calc(3 * var(--size-base));

    &:only-child {
      border-right-color: transparent;
      margin: 0 auto;
    }
  }

  &__open {
    box-shadow: 0 0 0 1px white;
    display: flex;
  }

 
}

.footer {
  background-color: var(--color-footer-bg);
  border-top: 1px solid var(--color-border);
  align-items: flex-start;
  box-sizing: border-box;
  display: flex;
  flex: 0 1;
  font-size: 0.825rem;
  justify-content: flex-start;
  padding: calc(2 * var(--size-base));

  &__heading,
  &__heading a {
    color: currentColor;
    font-weight: 600;
  }

  &__heading {
    border-bottom: calc(0.25 * var(--size-base)) solid currentColor;
    line-height: 1.5;
    margin-top: 0;
    padding-bottom: calc(0.5 * var(--size-base));
  }

  &__links {
    flex: 1 0 33%;
  }

  &__links + &__links {
   padding-left: calc(3 * var(--size-base));
  }

  &__links:last-of-type {
    text-align: right;
  }

  .link {
    line-height: 1.5;
  }
}

[rel="license"] {
  font-size: 1.125em;
  font-weight: bold;
}



.option {
  align-items: center;
  display: flex;
  flex: 1 0;
  flex-flow: column nowrap;
  justify-content: flex-start;
  margin: 0 auto;
  padding: 0 var(--size-base) var(--size-base);

 &__btn {
    margin: var(--size-base) auto;
    order: -1;
  }
}

.results {
  //background-color: var(--color-border);
  align-items: center;
  display: flex;
  flex: 1 0 50%;
  justify-content: center;
  /* max-height: 100vh;
  position: sticky;
  top: 0; */
}

@media screen and (min-width: 768px) {
  .content {
    flex-flow: row wrap;
  }
}

.texture-thumbnail {
  border: 3px solid var(--color-highlight);
  border-radius: 3px;
  box-shadow: 0 3px 0 #{darken(#f4af32, 20%)};
  image-rendering: pixelated;
  margin: var(--size-base);

  &:hover,
  &:focus,
  &:active {
    box-shadow: 0 1px 0 #{darken(#f4af32, 20%)};
    transform: translateY(2px);
  }
}
</style>