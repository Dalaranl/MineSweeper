export const createField = (col: number, row: number) => {
  const newField = Array.from(Array(col), () =>
    new Array(row).fill({
      value: "0",
      isOpen: false,
      isFlag: false,
    })
  );
  return newField;
};
