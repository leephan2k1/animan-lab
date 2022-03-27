export const isString = (value) => {
  return typeof value === "string" ? true : false;
};
export const isEmptyObject = (obj) => {
  for (let key in obj) {
    return false;
  }
  return true;
};
