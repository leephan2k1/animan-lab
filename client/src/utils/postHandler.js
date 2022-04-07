export const tagColor = (arrayColors, currentIdx) => {
  return arrayColors[currentIdx % arrayColors.length];
};
