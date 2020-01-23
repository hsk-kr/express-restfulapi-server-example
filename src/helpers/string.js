// eslint-disable-next-line import/prefer-default-export
export const removeSpaces = str => {
  return str && typeof str === 'string' ? str.trim() : str;
};
