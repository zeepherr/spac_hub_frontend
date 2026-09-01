export const categoryKeys = {
  all: ["categories"],

  active: () => [...categoryKeys.all, "active"],

  includeInactive: () => [...categoryKeys.all, "including-inactive"],
};
