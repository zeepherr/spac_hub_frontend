//เก็บ Query Key

export const userKeys = {
  all: ["user"],

  profile: () => [
    ...userKeys.all,
    "profile",
  ],
};