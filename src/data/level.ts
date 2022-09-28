export const level = {
  beginner: {
    name: "beginner",
    col: 9,
    row: 9,
    countOfMine: 10,
  },
  intermediate: {
    name: "intermediate",
    col: 16,
    row: 16,
    countOfMine: 40,
  },
  expert: {
    name: "expert",
    col: 16,
    row: 30,
    countOfMine: 99,
  },
  custom: {
    name: "custom",
  },
};

export const MINE = "⦿";

export const SEARCH_POSITION = [
  { y: -1, x: -1 },
  { y: -1, x: 0 },
  { y: -1, x: 1 },
  { y: 0, x: 1 },
  { y: 0, x: -1 },
  { y: 1, x: 1 },
  { y: 1, x: 0 },
  { y: 1, x: -1 },
];
