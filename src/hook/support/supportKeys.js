export const supportKeys = {
  all: ["support-cases"],

  /*
   * Buyer/Seller Support Cases
   */
  mine: () => [...supportKeys.all, "mine"],

  myLists: () => [...supportKeys.mine(), "list"],

  myList: () => [...supportKeys.myLists()],

  myDetails: () => [...supportKeys.mine(), "detail"],

  myDetail: (supportCaseId) => [
    ...supportKeys.myDetails(),
    String(supportCaseId),
  ],

  myMessages: (supportCaseId) => [
    ...supportKeys.myDetail(supportCaseId),
    "messages",
  ],

  /*
   * Admin Support Cases
   */
  admin: () => [...supportKeys.all, "admin"],

  adminLists: () => [...supportKeys.admin(), "list"],

  adminList: () => [...supportKeys.adminLists()],

  adminDetails: () => [...supportKeys.admin(), "detail"],

  adminDetail: (supportCaseId) => [
    ...supportKeys.adminDetails(),
    String(supportCaseId),
  ],

  adminMessages: (supportCaseId) => [
    ...supportKeys.adminDetail(supportCaseId),
    "messages",
  ],
};
