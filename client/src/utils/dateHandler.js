export const convertISODate = (ISODate) => {
  if (ISODate) return new Date(ISODate).toISOString().substring(0, 10);
};
