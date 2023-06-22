// expose all data type in API to outside
// allow Views able to use them
export * from "./api/domains";
export * from "./api/daos";
export * from "./api/dtos";

export type IssueTopicDAO = {
  id: string;
  name: string;
  active: boolean;
  parentId?: string;
};
export type IssueTopicListDAO = IssueTopicDAO[];
