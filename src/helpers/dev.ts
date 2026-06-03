// eslint-disable-next-line import/prefer-default-export
export const warnInDev = (message: string) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn(message);
  }
};
