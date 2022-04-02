const escapeRegExpMatch = function (s) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
};
export const isExactMatch = (str, match) => {
  return new RegExp(`\\b${escapeRegExpMatch(match)}\\b`).test(str);
};

