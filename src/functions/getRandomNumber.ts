export const getRandomNumber = (max: number) => {
  const number = Math.random() * max;
  return Math.floor(number);
};
