function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function fuzzyMatch(pattern: string, str: string) {
  pattern =
    ".*" +
    pattern
      .split("")
      .map((l) => `${escapeRegExp(l)}.*`)
      .join("");
  const re = new RegExp(pattern);
  return re.test(str);
}
