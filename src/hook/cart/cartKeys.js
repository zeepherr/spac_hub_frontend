export const cartKeys = {
  all: ["cart"],

  mine: () => [...cartKeys.all, "mine"],
};
