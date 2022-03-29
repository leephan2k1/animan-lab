export const convertISODate = (ISODate) => {
  return new Date(ISODate).toISOString().substring(0, 10);
};
