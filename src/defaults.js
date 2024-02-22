export const DEFAULT_VERSION = "1.16.100";
export const TEXTURE_SIZE_MIN = 16;
export const TEXTURE_SIZE_MAX = 2048;
export const TEXTURE_SIZE_DEFAULT = 256;

export const IMAGES_URL = "https://projects.jasongardner.co/mergic/assets/img/";

export const getDefaultSizes = () => {
  const sizes = [];
  let itr = TEXTURE_SIZE_MIN;

  while (itr <= TEXTURE_SIZE_MAX) {
    sizes.push(itr);
    itr += itr;
  }

  return sizes;
};
