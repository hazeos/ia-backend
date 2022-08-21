export const getObjectPropertyByString = (
  source: object,
  path: string,
): any => {
  return path.split('.').reduce((a, b) => a[b], source);
};
