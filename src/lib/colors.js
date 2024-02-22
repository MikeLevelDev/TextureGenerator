import tinycolor from "tinycolor2";

export function selectColor(value, colorMode, layer) {
  if (!value) {
    return "";
  }

  if (Array.isArray(value)) {
    const rgba = {
      r: value[0],
      g: value[1],
      b: value[2],
      a: value[3] || 1
    };

    value = tinycolor(rgba);

    if (colorMode === "hex") {
      return value.toHexString();
    }

    return Object.values(value[colorMode]);
  }

  if (!value.hasOwnProperty(colorMode)) {
    return `${value}` + (layer ? `_${layer}` : "");
  }

  const color = value[colorMode];

  if (typeof color === "string") {
    return color;
  }

  return Object.values(color);
}
