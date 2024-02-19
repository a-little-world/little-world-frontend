const two = n => (n < 10 ? `0${n}` : n);

export const formatTime = date => {
  return `${two(date.getHours())}:${two(date.getMinutes())}`;
};
