export default function parseSemVer(str) {
  const version = str.split(".", 3).map((v) => parseInt(v, 10));
  return version;
}
