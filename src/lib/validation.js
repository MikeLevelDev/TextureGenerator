import { TEXTURE_SIZE_MAX } from "../defaults";

export const sizeIsValid = (size) =>
  Number.isInteger(size) && parseInt(size, 10) <= TEXTURE_SIZE_MAX.length;
